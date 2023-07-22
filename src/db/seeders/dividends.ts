import stocks from '../../../stocks.json' assert { type: 'json' };
import { Dividend } from '../models/Dividend.ts';

export function seedDividends() {
  for (const [index, stock] of stocks.entries()) {
    const stockId = index + 1;
    console.log(
      `# Seed dividends for stock: ${stock.stock_full_name} (ID: ${stockId}), Amount: ${stock.dividends.length}`,
    );

    for (const dividend of stock.dividends) {
      Dividend.create({
        ex_dividend_date: Math.floor(
          new Date(dividend.ex_dividend_date).getTime() / 1000,
        ),
        payout_date: Math.floor(
          new Date(dividend.payout_date).getTime() / 1000,
        ),
        cash_amount: dividend.cash_amount,
        info: dividend.info,
        stock_id: stockId,
      });
    }
  }
  console.log('### Dividends seeded.\n');
}
