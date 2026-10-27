import { Router } from 'express';
import { MessageController } from '../controllers/message.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

export const messageRouter = Router();

messageRouter.use(authenticateToken);

messageRouter.get('/conversations', MessageController.getConversations);
messageRouter.post('/conversations', MessageController.startConversation);
messageRouter.get('/conversations/:id/messages', MessageController.getMessages);
messageRouter.post('/conversations/:id/messages', MessageController.sendMessage);
