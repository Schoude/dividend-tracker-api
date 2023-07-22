import { Portfolio } from '../models/Portfolio.ts';

export function seedPortfolios() {
  console.log('# Seed portfolios');

  Portfolio.create({
    name: 'Dividends monthly, high yield',
    user_id: 1,
  });

  console.log('### portfolios seeded.\n');
}
