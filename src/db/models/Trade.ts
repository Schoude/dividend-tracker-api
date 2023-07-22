import { DATA_TYPE, Model } from './Model.ts';
import { Portfolio } from './Portfolio.ts';
import { Stock } from './Stock.ts';

export class Trade extends Model {
  static table = 'trades';
  static fields = {
    portfolio_id: DATA_TYPE.INTEGER,
    stock_id: DATA_TYPE.INTEGER,
    stock_amount: DATA_TYPE.REAL,
    stock_price: DATA_TYPE.REAL,
    executed_at: DATA_TYPE.TIMESTAMP,
  };

  static portfolio() {
    return this.hasOne(Portfolio, 'portfolio_id');
  }

  static stock() {
    return this.hasOne(Stock, 'stock_id');
  }
}
