export type Instrument = {
  instrumentToken: number;
  tradingSymbol: string;
  name: string;
  expiry: string;
  lotSize: number;
  instrumentType: 'EQ' | 'FUT';
};

export type InstrumentRow = {
  name: string;
  lotSize: number;
  equityTradingSymbol: string;
  equityAsk: number;
  futureTradingSymbol: string;
  futureBid: number;
  basis: number;
  basisPercent: number;
};
