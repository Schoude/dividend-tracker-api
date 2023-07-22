import type { DB } from 'sqlite';

export function migrateStocks(db: DB) {
  console.log('### Migrating "stocks" table');

  db.execute('DROP TABLE IF EXISTS stocks;');

  db.execute(`
    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_full_name TEXT UNIQUE,
      symbol TEXT UNIQUE,
      price REAL,
      market_cap TEXT,
      next_earnings_date TIMESTAMP,
      last_updated TIMESTAMP,
      frequency TEXT,
      dividend_yield REAL,
      created_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      updated_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime'))
    );
  `);
}
