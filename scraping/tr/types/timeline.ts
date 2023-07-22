export interface Timeline {
  data: TimelineDatum[];
  cursors: Cursors;
}

interface Cursors {
  before: string;
  after: string;
}

export interface TimelineDatum {
  type: DatumType;
  data: Data;
}

interface Data {
  id: string;
  timestamp: number;
  icon: string;
  title: string;
  body?: string;
  cashChangeAmount?: number;
  action?: Action;
  attributes: Attribute[];
  month: string;
}

interface Action {
  type: ActionType;
  payload: string;
}

type ActionType = 'timelineDetail';

interface Attribute {
  location: number;
  length: number;
  type: string;
}

type DatumType = 'timelineEvent';
