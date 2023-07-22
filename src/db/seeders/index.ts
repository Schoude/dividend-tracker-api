import { db } from '../index.ts';
import { seedDividends } from './dividends.ts';
import { seedPortfolios } from './portfolios.ts';
import { seedStocks } from './stocks.ts';
import { seedTrades } from './trades.ts';
import { seedUsers } from './users.ts';

try {
  seedUsers();
  seedPortfolios();

  seedStocks();
  seedDividends();

  seedTrades();
} catch (error) {
  console.log((error as Error).message);
  console.log((error as Error).cause);
} finally {
  db.close();
}
