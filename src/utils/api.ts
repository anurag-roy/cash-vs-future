import { kc } from '@/globals/kc';
import { writeFileSync } from 'node:fs';

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
    JSON.stringify(filteredNfoInstruments),
    'utf-8'
  );
  writeFileSync(
    'src/data/nse.json',
    JSON.stringify(filteredNseInstruments),
    'utf-8'
  );
};
