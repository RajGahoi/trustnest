import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'trustnest_super_secure_jwt_secret_key_2026_xyz!',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173').split(','),
  databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH || 'data/trustnest.db'),
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
};
