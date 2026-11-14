import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

let pgPool: pg.Pool | null = null;

export function getPostgresPool(): pg.Pool {
  if (!pgPool) {
    if (!config.databaseUrl) {
      throw new Error('[Database] DATABASE_URL must be specified to use PostgreSQL.');
    }

    const isProduction = config.nodeEnv === 'production';
    const isLocalhost = config.databaseUrl.includes('localhost') || config.databaseUrl.includes('127.0.0.1');

    pgPool = new Pool({
      connectionString: config.databaseUrl,
      ssl: isProduction && !isLocalhost ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pgPool.on('error', (err) => {
      console.error('[PostgreSQL] Unexpected error on idle client', err);
    });
  }

  return pgPool;
}

export async function checkPostgresHealth(): Promise<{ healthy: boolean; latencyMs?: number; error?: string }> {
  try {
    const pool = getPostgresPool();
    const start = Date.now();
    await pool.query('SELECT 1');
    return { healthy: true, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { healthy: false, error: err.message };
  }
}

export async function closePostgresPool(): Promise<void> {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
}
