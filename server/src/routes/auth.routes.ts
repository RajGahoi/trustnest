import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';

export const authRouter = Router();

// Rate limit login/register to 20 attempts per 15 minutes per IP
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Too many authentication attempts. Please try again in 15 minutes.'
});

authRouter.post('/register', authLimiter, AuthController.register);
authRouter.post('/login', authLimiter, AuthController.login);
authRouter.get('/me', authenticateToken, AuthController.getMe);
authRouter.get('/sessions', authenticateToken, AuthController.getSessions);
authRouter.post('/sessions/:id/revoke', authenticateToken, AuthController.revokeSession);
authRouter.post('/logout', authenticateToken, AuthController.logout);
