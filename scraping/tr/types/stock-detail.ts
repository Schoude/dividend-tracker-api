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
  yearFounded: number;
  tickerSymbol: string;
  peRatioSnapshot: null;
  pbRatioSnapshot: number;
  dividendYieldSnapshot: number;
  earningsCall: null;
  marketCapSnapshot: number;
  dailyCloseYearSD: null;
  beta: number;
  countryCode: string;
  ceoName: null;
  cfoName: string;
  cooName: null;
  employeeCount: number;
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

export enum Title {
  Dividende = 'Dividende',
  EarningsCall = 'Earnings Call',
  FinancialsRelease = 'Financials Release',
  Hauptversammlung = 'Hauptversammlung',
}

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

export enum Type {
  Country = 'country',
  Sector = 'sector',
}
