interface WatchlistInstrument {
  created_at: string;
  holding_percent: null | unknown;
  instrument_id: string;
}

export interface Watchlist {
  size: number;
  instruments: WatchlistInstrument[];
}
