import type { DB } from 'sqlite';

export function migrateUsers(db: DB) {
  console.log('### Migrating "users" table');

  db.execute('DROP TABLE IF EXISTS users;');

  db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      firstname TEXT,
      lastname TEXT,
      password TEXT,
      created_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      updated_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime'))
    );
  `);
}
