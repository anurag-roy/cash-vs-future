import { Instrument } from '@/types';
import { NextApiHandler } from 'next';
import { readFileSync } from 'node:fs';

const handler: NextApiHandler = async (req, res) => {
  const { stock, expiry } = req.query;

  if (
    !stock ||
    typeof stock !== 'string' ||
    !expiry ||
    typeof expiry !== 'string'
  ) {
    return res.status(400);
  }

  const nfo = JSON.parse(
    readFileSync('src/data/nfo.json', 'utf-8')
  ) as Instrument[];
  const nse = JSON.parse(
    readFileSync('src/data/nse.json', 'utf-8')
  ) as Instrument[];

  const foundEquity = nse.find((i) => i.tradingSymbol === stock);
  const foundFuture = nfo.find(
    (i) => i.name === stock && i.expiry.startsWith(expiry)
  );

  if (!foundEquity || !foundFuture) {
    return res.status(404);
  }

  return res.json({
    equity: foundEquity,
    future: foundFuture,
  });
};

export default handler;
