import { Instrument } from '@/types';
import { useEffect, useRef, useState } from 'react';

type ExitTableProps = {
  equityStock: Instrument;
  futureStock: Instrument;
  enteredDiff: number;
  exitDiffTrigger: number;
};

export function ExitTable({
  equityStock,
  futureStock,
  enteredDiff,
  exitDiffTrigger,
}: ExitTableProps) {
  const isOrderPlaced = useRef(false);

  const [equityPrice, setEquityPrice] = useState(0);
  const [futurePrice, setFuturePrice] = useState(0);

  useEffect(() => {
    const API_KEY = localStorage.getItem('API_KEY');
    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

    const placeExitOrder = (eqPrice: number, futPrice: number) => {
      fetch('api/placeOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'EXIT',
          equityTradingSymbol: equityStock.tradingSymbol,
          equityPrice: eqPrice,
          futureTradingSymbol: futureStock.tradingSymbol,
          futurePrice: futPrice,
          quantity: futureStock.lotSize,
        }),
      }).then((_res) => alert('Exit order placed!'));
    };

    const ws = new WebSocket(
      `wss://ws.kite.trade?api_key=${API_KEY}&access_token=${ACCESS_TOKEN}`
    );

    ws.onopen = (_event) => {
      console.log('Connected to Zerodha Kite Socket!');
      const setModeMessage = {
        a: 'mode',
        v: ['full', equityStock.instrumentToken, futureStock.instrumentToken],
      };
      ws.send(JSON.stringify(setModeMessage));
    };

    ws.onerror = (error) => {
      console.log('Some error occurred', error);
    };

    ws.onmessage = async (message) => {
      if (message.data instanceof Blob && message.data.size > 2) {
        const arrayBuffer = await message.data.arrayBuffer();
        const dataView = new DataView(arrayBuffer);

        const numberOfPackets = dataView.getInt16(0);
        let index = 4;

        for (let i = 0; i < numberOfPackets; i++) {
          const size = dataView.getInt16(index - 2);
          const token = dataView.getInt32(index);
          if (token === equityStock.instrumentToken) {
            const newEquityPrice = dataView.getInt32(index + 68) / 100;
            const newDiff = Number((futurePrice - newEquityPrice).toFixed(2));
            if (!isOrderPlaced.current && newDiff >= exitDiffTrigger) {
              isOrderPlaced.current = true;
              ws.close();
              placeExitOrder(newEquityPrice, futurePrice);
              break;
            }
            setEquityPrice(newEquityPrice);
          } else if (token === futureStock.instrumentToken) {
            const newFuturePrice = dataView.getInt32(index + 128) / 100;
            const newDiff = Number((newFuturePrice - equityPrice).toFixed(2));
            if (!isOrderPlaced.current && newDiff >= exitDiffTrigger) {
              isOrderPlaced.current = true;
              ws.close();
              placeExitOrder(equityPrice, newFuturePrice);
              break;
            }
            setFuturePrice(newFuturePrice);
          }
          index = index + 2 + size;
        }
      }
    };

    ws.onclose = () => {
      setEquityPrice(0);
      setFuturePrice(0);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 overflow-y-auto ring-1 ring-zinc-200 dark:ring-zinc-700 rounded-lg">
      <table className="min-w-full divide-y divide-zinc-300 dark:divide-white/10">
        <thead className="bg-zinc-50 dark:bg-zinc-800 sticky top-0">
          <tr className="divide-x divide-zinc-200 dark:divide-white/10">
            <th scope="col">Cash (Equity)</th>
            <th scope="col">Future</th>
            <th scope="col">Current Diff</th>
            <th scope="col">Entered Diff</th>
          </tr>
        </thead>
        <tbody className="text-zinc-900 dark:text-zinc-100 divide-y divide-zinc-200 dark:divide-white/10 bg-white dark:bg-zinc-900 overflow-y-auto">
          <tr className="divide-x divide-zinc-200 dark:divide-white/10">
            <td className="bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500">
              <div className="flex justify-between px-4">
                <span>{equityStock.tradingSymbol}</span>
                <span>{equityPrice}</span>
              </div>
            </td>
            <td className="bg-red-50/60 text-red-800 dark:bg-red-900/5 dark:text-red-500">
              <div className="flex justify-between px-4">
                <span>{futureStock.tradingSymbol}</span>
                <span>{futurePrice}</span>
              </div>
            </td>
            <td className="bg-emerald-50/60 text-emerald-800 dark:bg-emerald-900/5 dark:text-emerald-500">
              {(futurePrice - equityPrice).toFixed(2)}
            </td>
            <td className="text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100">
              {enteredDiff}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
