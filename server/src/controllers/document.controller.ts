import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { config } from '../config/index.js';
import { DocumentService } from '../services/document.service.js';
import { AppError } from '../middlewares/error.js';

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `doc-${Date.now()}-${Math.floor(Math.random() * 100000)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid document format. Only PDF, JPG, PNG and WEBP documents are permitted.', 400, 'INVALID_FILE_TYPE') as any);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSizeMB * 1024 * 1024 },
  fileFilter
});

export class DocumentController {
  public static async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file was uploaded.', 400, 'FILE_MISSING');
      }

      const { listingId, documentType } = req.body;
      if (!listingId) {
        throw new AppError('listingId is required for document verification upload.', 400, 'LISTING_ID_REQUIRED');
      }

      const doc = DocumentService.uploadDocument(
        listingId,
        req.user!.id,
        req.file,
        documentType || 'AADHAAR_PAN'
      );

      res.status(201).json({
        success: true,
        data: doc,
        message: 'Document uploaded and submitted to verification review pipeline.'
      });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status, reviewNotes } = req.body;
      const reviewer = {
        id: req.user!.id,
        name: req.user!.name,
        role: req.user!.role
      };

      const result = DocumentService.verifyDocument(id, status, reviewNotes, reviewer);
      res.status(200).json({
        success: true,
        data: result,
        message: `Document has been marked as ${status}.`
      });
    } catch (err) {
      next(err);
    }
  }
}
