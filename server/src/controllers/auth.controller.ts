import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, phone, role } = req.body;
      const result = await AuthService.register({ email, password, name, phone, role });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
        return;
      }
      const user = AuthService.getUserById(req.user.id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
        return;
      }
      const sessions = AuthService.getActiveSessions(req.user.id);
      res.status(200).json({
        success: true,
        data: sessions
      });
    } catch (err) {
      next(err);
    }
  }

  public static async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
        return;
      }
      const sessionId = req.params.id as string;
      const success = AuthService.revokeSession(sessionId, req.user.id);
      res.status(200).json({
        success,
        message: 'Session successfully revoked.'
      });
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  }
}
