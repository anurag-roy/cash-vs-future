import { kc } from '@/globals/kc';
import { PlaceOrderParams } from 'kiteconnect-ts';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const {
    equityTradingSymbol,
    equityPrice,
    futureTradingSymbol,
    futurePrice,
    quantity,
  } = req.body;

  const equityOrderBody: PlaceOrderParams = {
    exchange: 'NSE',
    order_type: 'LIMIT',
    price: equityPrice,
    product: 'CNC',
    quantity: quantity,
    tradingsymbol: equityTradingSymbol,
    transaction_type: 'BUY',
  };

  const futureOrderBody: PlaceOrderParams = {
    exchange: 'NFO',
    order_type: 'LIMIT',
    price: futurePrice,
    product: 'NRML',
    quantity: quantity,
    tradingsymbol: futureTradingSymbol,
    transaction_type: 'SELL',
  };

  console.log(
    `[${new Date().toLocaleTimeString()}] Placing orders:`,
    equityOrderBody,
    futureOrderBody
  );

  const orderResults = await Promise.all([
    kc.placeOrder('regular', equityOrderBody),
    kc.placeOrder('regular', futureOrderBody),
  ]);

  console.log('Orders placed successfully!', orderResults);

  return res.json(orderResults);
};

export default handler;
