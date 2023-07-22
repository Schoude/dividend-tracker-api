export type StockDetailSaveable = Pick<
  StockDetail,
  | 'isin'
  | 'company'
  | 'events'
  | 'analystRating'
>;

export interface StockDetail {
  isin: string;
  company: Company;
  similarStocks: SimilarStock[];
  expectedDividend: null;
  dividends: Dividend[];
  totalDivendendCount: number;
  events: Event[];
  pastEvents: Event[];
  analystRating: AnalystRating;
  hasKpis: boolean;
  aggregatedDividends: AggregatedDividend[];
}

export interface AggregatedDividend {
  periodStartDate: string;
  projected: boolean;
  yieldValue: number;
  amount: number;
  count: number;
  projectedCount: number | null;
  price: number;
}

export interface AnalystRating {
  targetPrice: TargetPrice;
  recommendations: Recommendations;
}

export interface Recommendations {
  buy: number;
  outperform: number;
  hold: number;
  underperform: number;
  sell: number;
}

export interface TargetPrice {
  average: number;
  high: number;
  low: number;
}

export interface Company {
  name: string;
  description: string;
  yearFounded: number | null;
  tickerSymbol: string;
  peRatioSnapshot: number | null;
  pbRatioSnapshot: number | null;
  dividendYieldSnapshot: number | null;
  earningsCall: null;
  marketCapSnapshot: number | null;
  dailyCloseYearSD: null;
  beta: number | null;
  countryCode: string;
  ceoName: string | null;
  cfoName: string | null;
  cooName: string | null;
  employeeCount: number | null;
  eps: number;
}

export interface Dividend {
  id: string;
  paymentDate: string;
  recordDate: string;
  exDate: string;
  amount: number;
  yield: null;
  type: string;
}

export interface Event {
  id: string;
  title: Title;
  timestamp: number;
  description: string;
  webcastUrl: null;
}

export type Title =
  | 'Dividende'
  | 'Earnings Call'
  | 'Financials Release'
  | 'Hauptversammlung'
  | 'Financials Release'
  | 'Analyst  Presentation';

export interface SimilarStock {
  isin: string;
  name: string;
  tags: Tag[];
}

export interface Tag {
  type: Type;
  id: string;
  name: string;
  icon: string;
}

export type Type =
  | 'country'
  | 'sector';
