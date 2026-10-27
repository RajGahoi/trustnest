import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service.js';

export class LeadController {
  public static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { listingId, buyerName, buyerPhone, buyerEmail, message, channel } = req.body;
      const buyerId = req.user?.id;

      const lead = LeadService.createLead({
        listingId,
        buyerName,
        buyerPhone,
        buyerEmail,
        message,
        channel,
        buyerId
      });

      res.status(201).json({
        success: true,
        data: lead,
        message: 'Lead inquiry submitted successfully.'
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const sellerId = ['ADMIN', 'MODERATOR'].includes(user.role) ? undefined : user.id;
      const leads = LeadService.getLeads(sellerId);

      res.status(200).json({
        success: true,
        data: leads
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      LeadService.updateLeadStatus(id, status);

      res.status(200).json({
        success: true,
        message: `Lead status updated to ${status}.`
      });
    } catch (err) {
      next(err);
    }
  }
}
