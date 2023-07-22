export interface Timeline {
  data: Datum[];
  cursors: Cursors;
}

interface Cursors {
  before: string;
  after: string;
}

interface Datum {
  type: DatumType;
  data: Data;
}

interface Data {
  id: string;
  timestamp: number;
  icon: string;
  title: string;
  body: string;
  cashChangeAmount?: number;
  action?: Action;
  attributes: Attribute[];
  month: Month;
}

interface Action {
  type: ActionType;
  payload: string;
}

enum ActionType {
  TimelineDetail = 'timelineDetail',
}

interface Attribute {
  location: number;
  length: number;
  type: string;
}

enum Month {
  The202304 = '2023-04',
}

enum DatumType {
  TimelineEvent = 'timelineEvent',
}
