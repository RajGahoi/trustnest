import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller.js';
import { authenticateToken, optionalAuthenticateToken, requireRole } from '../middlewares/auth.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';

export const leadRouter = Router();

// Limit lead submissions to 30 per 10 minutes per IP
const leadLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 30,
  message: 'Lead inquiry limit exceeded. Please wait a few minutes before submitting another inquiry.'
});

leadRouter.post('/', leadLimiter, optionalAuthenticateToken, LeadController.createLead);
leadRouter.get('/', authenticateToken, LeadController.getLeads);
leadRouter.patch('/:id/status', authenticateToken, requireRole(['ADMIN', 'MODERATOR', 'SELLER', 'VENDOR_AGENT', 'VENDOR_ADMIN']), LeadController.updateStatus);
