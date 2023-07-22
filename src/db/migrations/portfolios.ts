import type { DB } from 'sqlite';

export function migratePortfolios(db: DB) {
  console.log('### Migrating "portfolios" table');

  db.execute('DROP TABLE IF EXISTS portfolios;');

  db.execute(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      user_id INTEGER,
      created_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      updated_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
}
