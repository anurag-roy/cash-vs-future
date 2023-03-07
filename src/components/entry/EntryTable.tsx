import { useStore } from '@/store';
import { Instrument, InstrumentRow } from '@/types';
import { cx } from '@/utils/ui';
import { memo, useEffect, useRef, useState } from 'react';

const updateRowBasis = (i: InstrumentRow) => {
  if (i.futureBid === 0 || i.equityAsk === 0) {
    i.basis = 0;
    i.basisPercent = 0;
    return;
  }

  i.basis = Number(((i.futureBid - i.equityAsk) * i.lotSize).toFixed(2));
  i.basisPercent = Number(
    (
      (100 * (i.futureBid - i.equityAsk)) /
      (i.equityAsk + i.futureBid / 2)
    ).toFixed(4)
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
          'font-bold',
          isTopFive
            ? 'bg-green-50/60 text-emerald-800 dark:bg-emerald-900/5 dark:text-emerald-500'
            : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
        )}
      >
        {i.basisPercent}%
      </td>
      <td className="bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500">
        <div className="flex justify-between px-4">
          <span>{i.equityTradingSymbol}</span>
          <span>{i.equityAsk}</span>
        </div>
      </td>
      <td className="bg-red-50/60 text-red-800 dark:bg-red-900/5 dark:text-red-500">
        <div className="flex justify-between px-4">
          <span>{i.futureTradingSymbol}</span>
          <span>{i.futureBid}</span>
        </div>
      </td>
      <td className="bg-emerald-50/60 text-emerald-800 dark:bg-emerald-900/5 dark:text-emerald-500">
        {i.basis}
      </td>
    </tr>
  );
};

type EntryTableProps = {
  instruments: Instrument[];
  entryBasis: number;
};

export const EntryTable = memo(
  ({ instruments, entryBasis }: EntryTableProps) => {
    const [
      updateIsStarted,
      updateSelectedTab,
      updateEnteredStock,
      updateEnteredDiff,
    ] = useStore((state) => [
      state.updateIsStarted,
      state.updateSelectedTab,
      state.updateEnteredStock,
      state.updateEnteredDiff,
    ]);
    const [rows, setRows] = useState<InstrumentRow[]>([]);
    const tokenMap = useRef(
      new Map<number, { name: string; type: 'EQ' | 'FUT' }>()
    );
    const originalRows = useRef<InstrumentRow[]>([]);

    const isOrderPlaced = useRef(false);

    useEffect(() => {
      const tokensToSubscribe: number[] = [];
      for (const i of instruments) {
        const name = i.instrumentType === 'EQ' ? i.tradingSymbol : i.name;
        tokenMap.current.set(i.instrumentToken, {
          name: name,
          type: i.instrumentType,
        });
        tokensToSubscribe.push(i.instrumentToken);

        const foundInstrument = originalRows.current.find(
          (r) => r.name === name
        );
        if (foundInstrument) {
          if (i.instrumentType === 'EQ') {
            foundInstrument.equityTradingSymbol = name;
          } else {
            foundInstrument.lotSize = i.lotSize;
            foundInstrument.futureTradingSymbol = i.tradingSymbol;
          }
        } else {
          originalRows.current.push({
            name: name,
            lotSize: i.instrumentType === 'EQ' ? 0 : i.lotSize,
            equityTradingSymbol: i.instrumentType === 'EQ' ? name : '',
            equityAsk: 0,
            futureTradingSymbol:
              i.instrumentType === 'FUT' ? i.tradingSymbol : '',
            futureBid: 0,
            basis: 0,
            basisPercent: 0,
          });
        }
      }
      setRows(originalRows.current);

      const API_KEY = localStorage.getItem('API_KEY');
      const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

      const placeEntryOrder = (row: InstrumentRow) => {
        fetch('api/placeOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'ENTRY',
            equityTradingSymbol: row.equityTradingSymbol,
            equityPrice: row.equityAsk,
            futureTradingSymbol: row.futureTradingSymbol,
            futurePrice: row.futureBid,
            quantity: row.lotSize,
          }),
        }).then((_res) => {
          alert('Entry order placed!');
          updateSelectedTab(1);
          updateEnteredStock(row.equityTradingSymbol);
          updateEnteredDiff(row.futureBid - row.equityAsk);
          setTimeout(() => {
            updateIsStarted(true);
          }, 1000);
        });
      };

      const ws = new WebSocket(
        `wss://ws.kite.trade?api_key=${API_KEY}&access_token=${ACCESS_TOKEN}`
      );

      ws.onopen = (_event) => {
        console.log('Connected to Zerodha Kite Socket!');
        const setModeMessage = { a: 'mode', v: ['full', tokensToSubscribe] };
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
            const nameAndType = tokenMap.current.get(token);
            if (nameAndType) {
              const { name, type } = nameAndType;
              const row = originalRows.current.find((r) => r.name === name);
              if (row) {
                if (type === 'EQ') {
                  // 1st Seller
                  const newAsk = dataView.getInt32(index + 128) / 100;
                  if (row.equityAsk !== newAsk) {
                    row.equityAsk = newAsk;
                    updateRowBasis(row);
                    if (
                      !isOrderPlaced.current &&
                      row.basisPercent >= entryBasis
                    ) {
                      isOrderPlaced.current = true;
                      ws.close();
                      placeEntryOrder(row);
                      updateIsStarted(false);
                      break;
                    }
                  }
                } else if (type === 'FUT') {
                  // 1st Buyer
                  const newBid = dataView.getInt32(index + 68) / 100;
                  if (row.futureBid !== newBid) {
                    row.futureBid = newBid;
                    updateRowBasis(row);
                    if (
                      !isOrderPlaced.current &&
                      row.basisPercent >= entryBasis
                    ) {
                      isOrderPlaced.current = true;
                      ws.close();
                      placeEntryOrder(row);
                      updateIsStarted(false);
                      break;
                    }
                  }
                }
              }
            }
            index = index + 2 + size;
          }
          setRows([
            ...originalRows.current.sort(
              (a, b) => b.basisPercent - a.basisPercent
            ),
          ]);
        }
      };

      ws.onclose = () => {
        setRows([]);
      };

      return () => ws.close();
    }, []);

    return (
      <div className="resize-y max-h-[100vh] max-w-5xl mx-auto bg-white dark:bg-zinc-900 overflow-y-auto ring-1 ring-zinc-200 dark:ring-zinc-700 rounded-lg">
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
);
