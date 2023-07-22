export interface ETFDetail {
  isin: string;
  wkn: string;
  name: string;
  inceptionDate: string;
  domicile: string;
  replicationMethod: string;
  rebalancingInterval: string;
  totalExpenseRatio: number;
  underlyingIndex: string;
  distributionFrequency: string;
  distributionPolicy: string;
  type: string;
  issuer: string;
  composition?: CompositionEntity[] | null;
  totalCompositionCount: number;
  focus?: string[] | null;
  exposure: Exposure;
  metrics: Metrics;
  distributions?: DistributionsEntity[] | null;
  totalDistributionCount: number;
  aggregatedDistributions?: AggregatedDistributionsEntity[] | null;
}
interface CompositionEntity {
  isin: string;
  name: string;
  marketValue: number;
  holdingPercent: number;
  tags?: TagsEntity[] | null;
  tradable: boolean;
}
interface TagsEntity {
  type: string;
  id: string;
  name: string;
  icon: string;
}
interface Exposure {
  sectorExposure?: SectorExposureEntityOrCountryExposureEntity[] | null;
  countryExposure?: SectorExposureEntityOrCountryExposureEntity[] | null;
  currencyExposure: CurrencyExposure;
}
interface SectorExposureEntityOrCountryExposureEntity {
  type: string;
  weightage: number;
  id: string;
  name: string;
  icon: string;
}
interface CurrencyExposure {
  USD: number;
}
interface Metrics {
  peRatio: number;
  pbRatio: number;
  yield: number;
  assetsUnderManagement: number;
  beta?: null;
  deviation?: null;
}
interface DistributionsEntity {
  paymentDate: string;
  recordDate: string;
  exDate: string;
  amount: number;
}
interface AggregatedDistributionsEntity {
  periodStartDate: string;
  projected: boolean;
  yieldValue: number;
  amount: number;
  count: number;
  projectedCount?: number | null;
  price: number;
}
