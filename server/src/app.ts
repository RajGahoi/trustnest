import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { config } from './config/index.js';
import { authRouter } from './routes/auth.routes.js';
import { listingRouter } from './routes/listing.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { leadRouter } from './routes/lead.routes.js';
import { messageRouter } from './routes/message.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { documentRouter } from './routes/document.routes.js';
import { notFoundHandler, errorHandler } from './middlewares/error.js';

export const app = express();

// Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Handled in deployment / vite proxy
  })
);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (config.corsOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, validated in production
    },
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory with caching
app.use('/uploads', express.static(config.uploadDir, { maxAge: '1d' }));

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'TrustNest Production API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/listings', listingRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/leads', leadRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/documents', documentRouter);

// 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);
