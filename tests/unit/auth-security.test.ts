import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../server/src/config/index.js';
import { hasCapability } from '../../src/domain/auth/capabilities.js';

describe('Auth & Cryptography Security', () => {
  it('should securely hash passwords and verify bcrypt hashes', () => {
    const rawPassword = 'SecureSecretPassword@2026';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);

    expect(hash).not.toEqual(rawPassword);
    expect(bcrypt.compareSync(rawPassword, hash)).toBe(true);
    expect(bcrypt.compareSync('WrongPassword', hash)).toBe(false);
  });

  it('should sign and verify valid JWT tokens and reject tampered tokens', () => {
    const payload = { id: 'usr-123', email: 'user@trustnest.in', role: 'SELLER' };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    expect(decoded.id).toBe('usr-123');
    expect(decoded.role).toBe('SELLER');

    expect(() => jwt.verify(token, 'wrong-secret-key')).toThrow();
  });

  it('should correctly evaluate RBAC capabilities', () => {
    expect(hasCapability('GUEST', 'listing:create')).toBe(false);
    expect(hasCapability('USER', 'listing:create')).toBe(true);
    expect(hasCapability('SELLER', 'listing:publish')).toBe(true);
    expect(hasCapability('USER', 'admin:view')).toBe(false);
    expect(hasCapability('ADMIN', 'admin:view')).toBe(true);
    expect(hasCapability('ADMIN', 'listing:moderate')).toBe(true);
  });
});
