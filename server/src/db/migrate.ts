import { getDatabase } from './connection.js';
import { DDL_SCHEMA } from './schema.js';

export function runMigrations(): void {
  const db = getDatabase();
  console.log('[Database] Applying schema migrations...');
  db.exec(DDL_SCHEMA);
  console.log('[Database] Migrations applied successfully.');
}

if (process.argv[1]?.endsWith('migrate.ts') || process.argv[1]?.endsWith('migrate.js')) {
  runMigrations();
}
