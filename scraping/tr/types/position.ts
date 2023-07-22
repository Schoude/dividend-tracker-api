interface Position {
  instrumentId: string;
  netSize: string;
  averageBuyIn: string;
}

export interface PositionsData {
  positions: Position[];
}
