import { kc } from '@/globals/kc';
import { Instrument } from '@/types';
import type { Instrument as OriginalInstrument } from 'kiteconnect-ts';
import { writeFileSync } from 'node:fs';

const mapInstrument = (i: OriginalInstrument): Instrument => {
  return {
    instrumentToken: Number(i.instrument_token),
    tradingSymbol: i.tradingsymbol,
    name: i.name,
    expiry: i.expiry.toISOString(),
    lotSize: i.lot_size,
    instrumentType: i.instrument_type as 'EQ' | 'FUT',
  };
};

export const updateStoredInstruments = async () => {
  const nfoInstruments = await kc.getInstruments(['NFO']);
  const filteredNfoInstruments = nfoInstruments.filter(
    (i) => i.instrument_type === 'FUT'
  );

  const uniqueNames = new Set(...filteredNfoInstruments.map((i) => i.name));

  const nseInstruments = await kc.getInstruments(['NSE']);
  const filteredNseInstruments = nseInstruments.filter((i) =>
    uniqueNames.has(i.tradingsymbol)
  );

  writeFileSync(
    'src/data/nfo.json',
    JSON.stringify(filteredNfoInstruments.map(mapInstrument)),
    'utf-8'
  );
  writeFileSync(
    'src/data/nse.json',
    JSON.stringify(filteredNseInstruments.map(mapInstrument)),
    'utf-8'
  );
};
