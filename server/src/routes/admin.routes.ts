import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

export const adminRouter = Router();

// Only ADMIN and MODERATOR can access admin routes
adminRouter.use(authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN', 'MODERATOR']));

adminRouter.get('/moderation', AdminController.getModerationQueue);
adminRouter.post('/moderation/decide', AdminController.decideListing);
adminRouter.get('/audit-logs', AdminController.getAuditLogs);
adminRouter.get('/stats', AdminController.getStats);
