import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { getDatabase } from '../db/connection.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  verified_status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  let token: string | undefined;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.trustnest_session) {
    token = req.cookies.trustnest_session;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required. No token provided.' }
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; role: string };
    const db = getDatabase();
    const userRow = db.prepare('SELECT id, email, name, role, phone, verified_status FROM users WHERE id = ?').get(decoded.id) as AuthenticatedUser | undefined;

    if (!userRow) {
      res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User account associated with this session no longer exists.' }
      });
      return;
    }

    req.user = userRow;
    next();
  } catch (err) {
    res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Session expired or token invalid.' }
    });
  }
}

export function optionalAuthenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    const db = getDatabase();
    const userRow = db.prepare('SELECT id, email, name, role, phone, verified_status FROM users WHERE id = ?').get(decoded.id) as AuthenticatedUser | undefined;
    if (userRow) {
      req.user = userRow;
    }
  } catch (e) {
    // Ignore invalid token in optional auth
  }
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}].` }
      });
      return;
    }

    next();
  };
}
