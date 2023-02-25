import { Instrument, InstrumentRow } from '@/types';
import { cx } from '@/utils';
import { useEffect, useState } from 'react';

const updateRowBasis = (i: InstrumentRow) => {
  i.basis = Number((i.futureBid - i.equityAsk).toFixed(2));
  i.basisPercent = Number(
    (
      (100 * (i.futureBid - i.equityAsk)) /
      (i.equityAsk + i.futureBid / 2)
    ).toFixed(2)
  );
};

type TableRowProps = {
  i: InstrumentRow;
  isTopFive: boolean;
};

const TableRow = ({ i, isTopFive }: TableRowProps) => {
  return (
    <tr className="divide-x divide-zinc-200 dark:divide-white/10">
      <td
        className={cx(
          'font-bold text-lg',
          isTopFive
            ? 'bg-green-50/60 text-green-800 dark:bg-green-900/5 dark:text-green-500'
            : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
        )}
      >
        {i.basisPercent}%
      </td>
      <td className="bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500">
        {i.equityTradingSymbol} {i.equityAsk}
      </td>
      <td className="bg-red-50/60 text-red-800 dark:bg-red-900/5 dark:text-red-500">
        {i.futureTradingSymbol} {i.futureBid}
      </td>
      <td className="bg-emerald-50/60 text-emerald-800 dark:bg-emerald-900/5 dark:text-emerald-500">
        {i.basis}
      </td>
    </tr>
  );
};

type TableProps = {
  instruments: Instrument[];
  entryBasis: number;
};

export function Table({ instruments, entryBasis }: TableProps) {
  const [rows, setRows] = useState<InstrumentRow[]>([]);

  useEffect(() => {
    const API_KEY = localStorage.getItem('API_KEY');
    const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

    const tokenToNameMap = new Map<
      number,
      { name: string; type: 'EQ' | 'FUT' }
    >();
    const tokensToSubscribe: number[] = [];
    for (const i of instruments) {
      tokenToNameMap.set(i.instrumentToken, {
        name: i.instrumentType === 'EQ' ? i.tradingSymbol : i.name,
        type: i.instrumentType,
      });
      tokensToSubscribe.push(i.instrumentToken);
    }

    const ws = new WebSocket(
      `wss://ws.kite.trade?api_key=${API_KEY}&access_token=${ACCESS_TOKEN}`
    );

    ws.onopen = (_event) => {
      console.log('Connected to Zerodha Kite Socket!');

      const setModeMessage = { a: 'mode', v: ['full', [61512711]] };
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
          const nameAndType = tokenToNameMap.get(token);
          if (nameAndType) {
            const { name, type } = nameAndType;
            const row = rows.find((r) => r.name === name)!;
            if (type === 'EQ') {
              // 1st Seller
              const newAsk =
                (dataView.getInt32(index + 128) * row.lotSize) / 100;
              if (row.equityAsk !== newAsk) {
                row.equityAsk = newAsk;
                updateRowBasis(row);
              }
            } else if (type === 'FUT') {
              // 1st Buyer
              const newBid =
                (dataView.getInt32(index + 68) * row.lotSize) / 100;
              if (row.futureBid !== newBid) {
                row.futureBid = newBid;
                updateRowBasis(row);
              }
            }
          }
          index = index + 4 + size;
        }

        setRows(rows.sort((a, b) => b.basisPercent - a.basisPercent));
      }
    };
    //clean up function
    return () => ws.close();
  }, []);

  return (
    <div className="resize-y max-h-[50vh] bg-white dark:bg-zinc-900 overflow-y-auto ring-1 ring-zinc-200 dark:ring-zinc-700 rounded-lg">
      <table className="min-w-full divide-y divide-zinc-300 dark:divide-white/10">
        <thead className="bg-zinc-50 dark:bg-zinc-800 sticky top-0">
          <tr className="divide-x divide-zinc-200 dark:divide-white/10">
            <th scope="col">Basis %</th>
            <th scope="col">Cash (Equity)</th>
            <th scope="col">Future</th>
            <th scope="col">Basis</th>
          </tr>
        </thead>
        <tbody className="text-zinc-900 dark:text-zinc-100 divide-y divide-zinc-200 dark:divide-white/10 bg-white dark:bg-zinc-900 overflow-y-auto">
          {rows?.length === 0 ? (
            <tr>
              <td colSpan={4}>No data to display.</td>
            </tr>
          ) : (
            rows.map((i, index) => (
              <TableRow key={i.name} i={i} isTopFive={index < 5} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
