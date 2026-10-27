import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service.js';

export class MessageController {
  public static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const conversations = MessageService.getConversations(userId);

      res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (err) {
      next(err);
    }
  }

  public static async startConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { listingId, text } = req.body;
      const buyer = {
        id: req.user!.id,
        name: req.user!.name,
        avatar: (req.user as any).avatar_url
      };

      const result = MessageService.startConversation(listingId, buyer, text);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = req.params.id as string;
      const userId = req.user!.id;
      const messages = MessageService.getMessages(conversationId, userId);

      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (err) {
      next(err);
    }
  }

  public static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = req.params.id as string;
      const { text } = req.body;
      const sender = {
        id: req.user!.id,
        name: req.user!.name,
        avatar: (req.user as any).avatar_url
      };

      const message = MessageService.sendMessage(conversationId, sender, text);
      res.status(201).json({
        success: true,
        data: message
      });
    } catch (err) {
      next(err);
    }
  }
}
