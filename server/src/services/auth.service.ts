import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../db/connection.js';
import { config } from '../config/index.js';
import { AppError } from '../middlewares/error.js';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  avatar_url: string | null;
  verified_status: string;
  created_at: string;
}

export class AuthService {
  public static async register(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: string;
  }): Promise<{ user: UserDTO; token: string }> {
    const db = getDatabase();

    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      throw new AppError('An account with this email address already exists.', 409, 'EMAIL_EXISTS');
    }

    if (!data.password || data.password.length < 8) {
      throw new AppError('Password must be at least 8 characters long.', 400, 'WEAK_PASSWORD');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);
    const id = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const role = data.role && ['USER', 'SELLER', 'VENDOR_AGENT', 'VENDOR_ADMIN'].includes(data.role)
      ? data.role
      : 'USER';

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, name, phone, role, avatar_url, verified_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      id,
      normalizedEmail,
      passwordHash,
      data.name.trim(),
      data.phone.trim(),
      role,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      'VERIFIED_PHONE',
      now,
      now
    );

    const user: UserDTO = {
      id,
      email: normalizedEmail,
      name: data.name.trim(),
      phone: data.phone.trim(),
      role,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified_status: 'VERIFIED_PHONE',
      created_at: now
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    // Record session
    db.prepare(`
      INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      `sess-${Date.now()}`,
      user.id,
      token.slice(-16),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      now
    );

    return { user, token };
  }

  public static async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: UserDTO; token: string }> {
    const db = getDatabase();
    const normalizedEmail = credentials.email.trim().toLowerCase();

    const userRow = db.prepare(`
      SELECT id, email, password_hash, name, phone, role, avatar_url, verified_status, created_at
      FROM users WHERE email = ?
    `).get(normalizedEmail) as any;

    if (!userRow) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const passwordMatch = bcrypt.compareSync(credentials.password, userRow.password_hash);
    if (!passwordMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const user: UserDTO = {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      phone: userRow.phone,
      role: userRow.role,
      avatar_url: userRow.avatar_url,
      verified_status: userRow.verified_status,
      created_at: userRow.created_at
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      `sess-${Date.now()}`,
      user.id,
      token.slice(-16),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      now
    );

    return { user, token };
  }

  public static getUserById(id: string): UserDTO {
    const db = getDatabase();
    const userRow = db.prepare(`
      SELECT id, email, name, phone, role, avatar_url, verified_status, created_at
      FROM users WHERE id = ?
    `).get(id) as UserDTO | undefined;

    if (!userRow) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }

    return userRow;
  }

  public static getActiveSessions(userId: string) {
    const db = getDatabase();
    return db.prepare(`
      SELECT id, expires_at, created_at, user_agent, ip_address, revoked_at
      FROM sessions
      WHERE user_id = ? AND (revoked_at IS NULL)
      ORDER BY created_at DESC
      LIMIT 10
    `).all(userId);
  }

  public static revokeSession(sessionId: string, userId: string): boolean {
    const db = getDatabase();
    const result = db.prepare(`
      UPDATE sessions SET revoked_at = ?
      WHERE id = ? AND user_id = ?
    `).run(new Date().toISOString(), sessionId, userId);
    return result.changes > 0;
  }
}
