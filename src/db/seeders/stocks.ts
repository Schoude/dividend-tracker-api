import stocks from '../../../stocks.json' assert { type: 'json' };
import { Stock } from '../models/Stock.ts';

export function seedStocks() {
  for (const [_index, stock] of stocks.entries()) {
    console.log(
      `# Seed stock: ${stock.stock_full_name}`,
    );
    Stock.create(
      {
        stock_full_name: stock.stock_full_name,
        symbol: stock.symbol,
        price: stock.price,
        market_cap: stock.market_cap,
        next_earnings_date: Math.floor(
          new Date(stock.next_earnings_date).getTime() / 1000,
        ),
        last_updated: Math.floor(
          new Date(stock.last_updated).getTime() / 1000,
        ),
        frequency: stock.frequency,
        dividend_yield: stock.dividend_yield,
      },
    );
  }

  console.log('### Stocks seeded.\n');
}
