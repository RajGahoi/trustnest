import { Router } from 'express';
import { DocumentController, upload } from '../controllers/document.controller.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

export const documentRouter = Router();

documentRouter.use(authenticateToken);

documentRouter.post('/upload', upload.single('document'), DocumentController.uploadDocument);
documentRouter.patch('/:id/verify', requireRole(['ADMIN', 'SUPER_ADMIN', 'MODERATOR']), DocumentController.verifyDocument);
