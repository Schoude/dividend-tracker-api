import { DATA_TYPE, Model } from './Model.ts';
import { Stock } from './Stock.ts';

export class Dividend extends Model {
  static table = 'dividends';
  static fields = {
    ex_dividend_date: DATA_TYPE.TIMESTAMP,
    payout_date: DATA_TYPE.TIMESTAMP,
    cash_amount: DATA_TYPE.REAL,
    info: DATA_TYPE.TEXT,
    stock_id: DATA_TYPE.INTEGER,
  };

  static stock() {
    return this.hasOne(Stock, 'stock_id');
  }
}
