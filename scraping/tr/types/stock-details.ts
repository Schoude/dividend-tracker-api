export interface StockDetails {
  isin: string;
  company: Company;
  similarStocks: SimilarStock[];
  expectedDividend: ExpectedDividend;
  dividends: Dividend[];
  totalDivendendCount: number;
  events: Event[];
  pastEvents: PastEvent[];
  analystRating: AnalystRating;
  hasKpis: boolean;
  aggregatedDividends: AggregatedDividend[];
}

interface Company {
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
  ceoName: string;
  cfoName: string;
  cooName: null;
  employeeCount: number;
  eps: number;
}

interface SimilarStock {
  isin: string;
  name: string;
  tags: Tag[];
}

interface Tag {
  type: string;
  id: string;
  name: string;
  icon: string;
}

interface ExpectedDividend {
  id: string;
  paymentDate: string;
  recordDate: string;
  exDate: string;
  amount: number;
  yield: null;
  type: string;
}

interface Dividend {
  id: string;
  paymentDate: string;
  recordDate: string;
  exDate: string;
  amount: number;
  yield: null;
  type: string;
}

interface Event {
  id: string;
  title: string;
  timestamp: number;
  description: string;
  webcastUrl: null;
}

interface PastEvent {
  id: string;
  title: string;
  timestamp: number;
  description: string;
  webcastUrl: null;
}

interface AnalystRating {
  targetPrice: TargetPrice;
  recommendations: Recommendations;
}

interface TargetPrice {
  average: number;
  high: number;
  low: number;
}

interface Recommendations {
  buy: number;
  outperform: number;
  hold: number;
  underperform: number;
  sell: number;
}

interface AggregatedDividend {
  periodStartDate: string;
  projected: boolean;
  yieldValue: number;
  amount: number;
  count: number;
  projectedCount?: number;
  price: number;
}
