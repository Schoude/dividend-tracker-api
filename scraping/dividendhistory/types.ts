import { dividendRowColumnNames } from './scrape.ts';

export type GetArrayElementType<T extends readonly unknown[]> = T extends
  readonly (infer U)[] ? U : never;

export type MyConstArrayItem = GetArrayElementType<
  typeof dividendRowColumnNames
>;

export interface Stock {
  stock_full_name: string;
  symbol: string;
  price: number;
  market_cap: string;
  next_earnings_date: string;
  last_updated: string;
  frequency: string;
  dividend_yield: number;
  dividends: Dividend[];
}

export type Dividend = {
  [K in MyConstArrayItem]?: string | number;
};
