import { Dividend } from './Dividend.ts';
import { DATA_TYPE, Model } from './Model.ts';

export class Stock extends Model {
  static table = 'stocks';
  static fields = {
    stock_full_name: DATA_TYPE.TEXT,
    symbol: DATA_TYPE.TEXT,
    price: DATA_TYPE.REAL,
    market_cap: DATA_TYPE.TEXT,
    next_earnings_date: DATA_TYPE.TIMESTAMP,
    last_updated: DATA_TYPE.TIMESTAMP,
    frequency: DATA_TYPE.TEXT,
    dividend_yield: DATA_TYPE.REAL,
  };

  /**
   * @param sortBy By which column to sort the dividends. Also by which direction. See default values.
   * @returns
   */
  static dividends(sortBy: {
    column: keyof typeof Dividend.fields;
    direction: 'ASC' | 'DESC';
  } = {
    column: 'payout_date',
    direction: 'DESC',
  }) {
    return this.hasMany(Dividend, 'stock_id', sortBy);
  }
}
