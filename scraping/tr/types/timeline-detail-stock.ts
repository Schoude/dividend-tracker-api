// How to get to bought amount
// titleText includes 'Kauf'
// secions.find -> title === 'Übersicht'
// section.data.find -> tile === 'Anzahl'
// amount.detail -> {fractionDigits: 0, type: "decimal", value: 68}; consider for formatting

// How to get the price at purchase
// secions.find -> title === 'Übersicht'
// section.data.find -> tile === 'Preis'
// price.detail -> {"type": "currency","currencyId": "EUR","value": 9.382,"fractionDigits": 3}; consider for formatting

export interface TimelineDetailStock {
  id: string;
  titleText: string;
  subtitleText: string;
  sections: Section[];
}

export interface Section {
  type: string;
  title: string;
  data?: Datum[];
  documents?: Document[];
  text?: string;
  style?: string;
}

export interface Datum {
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

export interface Action {
  type: string;
  payload: string;
}

export interface Detail {
  type: string;
  text?: string;
  value?: number;
  fractionDigits?: number;
  currencyId?: string;
}

export interface Document {
  title: string;
  detail: string;
  action: Action;
  id: string;
  postboxType: string;
}
