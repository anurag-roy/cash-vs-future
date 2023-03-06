import { Instrument } from '@/types';
import { NextApiHandler } from 'next';
import { readFileSync } from 'node:fs';

const handler: NextApiHandler = async (req, res) => {
  const nse = JSON.parse(
    readFileSync('src/data/nse.json', 'utf-8')
  ) as Instrument[];

  return res.json(nse.map((i) => i.tradingSymbol));
};

export default handler;
