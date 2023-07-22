export const TR_API_URL = 'https://api.traderepublic.com/api';
export const TR_WS_URL = 'wss://api.traderepublic.com/';

export const WS_CONNECTION_TYPE = {
  COMPACT_PORTFOLIO: 'compactPortfolio',
  INSTRUMENT: 'instrument',
  STOCK_DETAILS: 'stockDetails',
  ETF_DETAILS: 'etfDetails',
  TICKER: 'ticker',
  WATCHLIST: 'namedWatchlist',
  TIMELINE: 'timeline',
  TIMELINE_DETAIL: 'timelineDetail',
  NEON_SEARCH: 'neonSearch',
} as const;

export const TR_OUTPUT_FOLDER_PATH = 'scraping/tr/output';

export const TR_SESSION_KEY = 'TR_SESSION';
