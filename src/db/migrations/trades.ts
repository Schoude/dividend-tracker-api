import { DB } from 'sqlite';

export function migrateTrades(db: DB) {
  console.log('### Migrating "trades" table');

  db.execute('DROP TABLE IF EXISTS trades;');

  db.execute(`
    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER,
      stock_id INTEGER,
      stock_amount REAL,
      stock_price REAL,
      executed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      updated_at TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id),
      FOREIGN KEY (stock_id) REFERENCES stocks (id)
    );
  `);
}
