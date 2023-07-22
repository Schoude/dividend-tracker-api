export interface PriceSnapshot {
  companyName: string;
  isin: string;
  price: number;
}

export interface TickData {
  bid: Tick;
  ask: Tick;
  last: Tick;
  pre: Tick;
  open: Tick;
  qualityId: string;
  leverage: null;
  delta: null;
}

export interface Tick {
  time: number;
  price: string;
  size: number;
}
