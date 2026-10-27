import { app } from './app.js';
import { config } from './config/index.js';
import { runMigrations } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';
import { getDatabase } from './db/connection.js';

async function bootstrap() {
  try {
    // 1. Run migrations
    runMigrations();

    // 2. Check if categories exist, if not seed database
    const db = getDatabase();
    const catCount = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as any).count;
    if (catCount === 0) {
      console.log('[Bootstrap] Empty database detected, running seeds...');
      seedDatabase();
    }

    // 3. Start server
    app.listen(config.port, () => {
      console.log(`[TrustNest Server] Production API running on http://localhost:${config.port}`);
      console.log(`[TrustNest Server] Health check: http://localhost:${config.port}/api/v1/health`);
    });
  } catch (err) {
    console.error('[Bootstrap Error] Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
