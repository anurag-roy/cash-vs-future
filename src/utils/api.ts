import { Instrument } from '@/types';
import type { Instrument as OriginalInstrument } from 'kiteconnect-ts';

export const mapInstrument = (i: OriginalInstrument): Instrument => {
  return {
    instrumentToken: Number(i.instrument_token),
    tradingSymbol: i.tradingsymbol,
    name: i.name,
    expiry: i.expiry && i.expiry instanceof Date ? i.expiry?.toISOString() : '',
    lotSize: i.lot_size,
    instrumentType: i.instrument_type as 'EQ' | 'FUT',
  };
};
