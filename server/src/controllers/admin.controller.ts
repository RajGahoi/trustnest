import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  public static async getModerationQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const queue = AdminService.getModerationQueue();
      res.status(200).json({
        success: true,
        data: queue
      });
    } catch (err) {
      next(err);
    }
  }

  public static async decideListing(req: Request, res: Response, next: NextFunction) {
    try {
      const { listingId, decision, reason } = req.body;
      const reviewer = {
        id: req.user!.id,
        name: req.user!.name,
        role: req.user!.role
      };

      const result = AdminService.decideListing(listingId, decision, reason, reviewer);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 100;
      const logs = AdminService.getAuditLogs(limit);
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = AdminService.getPlatformStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }
}
