import { Instrument } from '@/types';
import { NextApiHandler } from 'next';
import { readFileSync } from 'node:fs';

const handler: NextApiHandler = async (req, res) => {
  const { expiry } = req.query;

  if (!expiry || typeof expiry !== 'string') {
    return res.status(400);
  }

  const nfo = JSON.parse(
    readFileSync('src/data/nfo.json', 'utf-8')
  ) as Instrument[];
  const nse = JSON.parse(
    readFileSync('src/data/nse.json', 'utf-8')
  ) as Instrument[];

  return res.json([...nfo.filter((i) => i.expiry.startsWith(expiry)), ...nse]);
};

export default handler;
