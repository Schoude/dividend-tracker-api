import type { DB } from 'sqlite';

export function migrateDividends(db: DB) {
  console.log('### Migrating "dividends" table');

  db.execute('DROP TABLE IF EXISTS dividends;');

  db.execute(`
    CREATE TABLE IF NOT EXISTS dividends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ex_dividend_date TIMESTAMP,
      payout_date TIMESTAMP,
      cash_amount REAL,
      info TEXT,
      stock_id INTEGER,
      created_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      updated_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      FOREIGN KEY (stock_id) REFERENCES stocks (id)
    )
  `);
}
