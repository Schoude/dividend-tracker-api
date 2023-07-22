export interface TimelineOrderDetail {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  name: string;
  price: number;
}

export interface TimelineDetail {
  id: string;
  titleText: string;
  subtitleText: string;
  sections: Section[];
}

interface Section {
  type: string;
  title: string;
  data?: Datum[];
  documents?: Document[];
  text?: string;
  style?: string;
}

interface Datum {
  title: string;
  detail?: Detail;
  style?: string;
  id?: string;
  timestamp?: number;
  icon?: string;
  body?: string;
  cashChangeAmount?: number;
  action?: Action;
  attributes?: unknown[];
  month?: string;
}

interface Action {
  type: string;
  payload: string;
}

interface Detail {
  type: string;
  text?: string;
  value?: number;
  fractionDigits?: number;
  currencyId?: string;
}

interface Document {
  title: string;
  detail: string;
  action: Action;
  id: string;
  postboxType: string;
}
