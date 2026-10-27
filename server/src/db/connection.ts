import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config/index.js';

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    const dbDir = path.dirname(config.databasePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    dbInstance = new DatabaseSync(config.databasePath);
    // Enable foreign key support and WAL mode for reliability and performance
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
