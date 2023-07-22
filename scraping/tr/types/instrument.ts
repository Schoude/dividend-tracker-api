export type InstrumentSaveable = Pick<
  Instrument,
  | 'company'
  | 'exchangeIds'
  | 'typeId'
  | 'isin'
  | 'intlSymbol'
  | 'tags'
  | 'imageId'
>;

export interface Instrument {
  active: boolean;
  exchangeIds: string[];
  exchanges: Exchange[];
  jurisdictions: Jurisdictions;
  dividends: unknown[];
  splits: unknown[];
  cfi: string;
  name: string;
  typeId: 'stock' | 'fund' | 'derivative' | 'crypto';
  wkn: string;
  legacyTypeChar: string;
  isin: string;
  priceFactor: number;
  shortName: string;
  nextGenName: string;
  alarmsName: string;
  homeSymbol: string;
  intlSymbol: string | null;
  homeNsin: string;
  tags: Tag[];
  derivativeProductCount: DerivativeProductCount;
  derivativeProductCategories: unknown[];
  company: Company;
  marketCap: MarketCap;
  lastDividend: null;
  shareType: string;
  custodyType: string;
  kidRequired: boolean;
  kidLink: null;
  tradable: boolean;
  fundInfo?: FundInfo;
  derivativeInfo: null;
  bondInfo: null;
  targetMarket: TargetMarket;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
  issuer: null;
  issuerDisplayName: null;
  issuerImageId: null;
  notionalCurrency: null;
  additionalBuyWarning: null;
  warningMessage: null;
  description: null;
  noTradeVolume: boolean;
  additionalBuyWarnings: null;
  warningMessages: null;
  descriptions: null;
  usesWeightsForExchanges: boolean;
  imageId: string;
}

interface Exchange {
  slug: string;
  active: boolean;
  nameAtExchange: string;
  symbolAtExchange: string;
  firstSeen: number;
  lastSeen: number;
  firstTradingDay: null;
  lastTradingDay: null;
  tradingTimes: null;
  fractionalTrading?: FractionalTrading;
  settlementRoute: string;
  weight: null;
}

interface FractionalTrading {
  minOrderSize: string;
  maxOrderSize: null;
  stepSize: string;
  minOrderAmount: string;
}

interface Jurisdictions {
  DE: De;
  AT: At;
  FR: Fr;
  SI: Si;
  NL: Nl;
  IE: Ie;
  LT: Lt;
  ES: Es;
  BE: Be;
  EE: Ee;
  LV: Lv;
  SK: Sk;
  PT: Pt;
  LU: Lu;
  FI: Fi;
  IT: It;
  GR: Gr;
}

interface De {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface At {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Fr {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Si {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Nl {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Ie {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Lt {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Es {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Be {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Ee {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Lv {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Sk {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Pt {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Lu {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Fi {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface It {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Gr {
  active: boolean;
  kidLink: null;
  kidRequired: boolean;
  savable: boolean;
  fractionalTradingAllowed: boolean;
  proprietaryTradable: boolean;
}

interface Tag {
  type: 'sector' | 'country' | 'region' | 'issuer' | 'index';
  id: string;
  name: string;
  icon: string;
}

type DerivativeProductCount = Record<string, unknown>;

interface Company {
  name: string;
  description: string | null;
  ipoDate: number | null;
  countryOfOrigin: string | null;
}

interface MarketCap {
  value: null;
  currencyId: null;
}

interface TargetMarket {
  investorExperience: string;
  investorType: string;
}

interface FundInfo {
  useOfProfits: 'distributing' | 'accumulating';
}
