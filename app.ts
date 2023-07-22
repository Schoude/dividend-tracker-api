import { Dividend } from './src/db/models/Dividend.ts';
import { Portfolio } from './src/db/models/Portfolio.ts';
import { Stock } from './src/db/models/Stock.ts';
import { Trade } from './src/db/models/Trade.ts';
import { User } from './src/db/models/User.ts';

// const stocks = Stock.all();
// console.log(stocks);

// const stock = Stock.findById(7).get();
// console.log(stock);

// const stockOfDividend = Dividend.findById(100).stock();
// console.log(stockOfDividend);

// const dividends = Stock.findById(7).dividends();
// console.log(dividends);

// const portfolios = User.findById(1).portfolios();
// console.log({ portfolios });

const portfolio = Portfolio.where('user_id', '=', 1).first();

const trades = Trade.where('portfolio_id', '=', portfolio.id, {
  column: 'executed_at',
  direction: 'DESC',
}).get();

const portfolioStocks = new Map();

const tradesWithStock = trades.map((trade) => {
  const baseStock = Stock.findById(trade.stock_id).get();

  const stock = structuredClone(baseStock);
  const dividends = Stock.findById(trade.stock_id).dividends();
  stock.dividends = dividends;

  portfolioStocks.set(stock.id, stock);

  return {
    id: trade.id,
    stock_amount: trade.stock_amount,
    stock_price: trade.stock_price,
    stock_id: trade.stock_id,
    executed_at: trade.executed_at,
    created_at: trade.created_at,
    updated_at: trade.updated_at,
    stock: baseStock,
  };
});

console.log({ portfolio });
console.log({ tradesWithStock });
console.log([...portfolioStocks.values()]);

// const stockAmount = tradesWithStock
//   .filter((trade) => trade.stock_id === 2)
//   .reduce((acc, current) => {
//     acc += current.stock_amount;
//     return acc;
//   }, 0);

// console.log({
//   stockAmount,
//   stockValue: Intl.NumberFormat('en', {
//     style: 'currency',
//     currency: 'USD',
//   }).format(stockAmount * portfolioStocks.get(2).price),
// });
