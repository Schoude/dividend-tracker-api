import { DB } from 'sqlite';
import { migrateStocks } from './stocks.ts';
import { migrateDividends } from './dividends.ts';
import { migrateUsers } from './users.ts';
import { migratePortfolios } from './portfolios.ts';
import { migrateTrades } from './trades.ts';

const db = new DB('test.db');

try {
  console.log('### Run migrations');

  db.execute('PRAGMA foreign_keys = OFF;');

  migrateUsers(db);
  migratePortfolios(db);
  migrateTrades(db);

  migrateStocks(db);
  migrateDividends(db);
} catch (error) {
  console.log((error as Error).message);
  console.log((error as Error).cause);
} finally {
  db.execute('PRAGMA foreign_keys = ON;');

  db.close();

  console.log('### Migrations completed.');
}
