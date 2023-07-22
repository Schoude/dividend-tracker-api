// How to get the bought stock amount

// sections.find -> section.title === 'Historie'
// history.data.find -> entry.title === 'Ausgeführt'
// body: "Ausgeführt zu 5,648 €" -> get the amount as Number
// cashChangeAmount: -50 -> Math.abs() to get the positve amount

// Calculate the amount
// 50 / 5.648 = 8,852691 -> Number((50 / 5.648).toFixed(6)) nice JS...

export interface TimelineDetailSavingsPlan {
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
  action?: Action;
  attributes?: unknown[];
  month?: string;
  cashChangeAmount?: number;
}

export interface Action {
  type: string;
  payload: string;
}

export interface Detail {
  type: string;
  text?: string;
  currencyId?: string;
  value?: number | string;
  fractionDigits?: number;
}

export interface Document {
  title: string;
  detail: string;
  action: Action;
  id: string;
  postboxType: string;
}
