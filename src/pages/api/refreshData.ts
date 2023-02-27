import { kc } from '@/globals/kc';
import { mapInstrument } from '@/utils/api';
import { NextApiHandler } from 'next';
import { writeFileSync } from 'node:fs';

const handler: NextApiHandler = async (req, res) => {
  const nfoInstruments = await kc.getInstruments(['NFO']);
  const filteredNfoInstruments = nfoInstruments.filter(
    (i) => i.instrument_type === 'FUT'
  );

  const uniqueNames = new Set(filteredNfoInstruments.map((i) => i.name));

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

  return res.status(200);
};

export default handler;
