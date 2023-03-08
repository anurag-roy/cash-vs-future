import { useStore } from '@/store';
import { Instrument } from '@/types';
import { getExpiryOptions } from '@/utils/ui';
import { FormEvent, useEffect, useState } from 'react';
import { ComboBoxInput } from '../ComboBoxInputs';
import { ExitTable } from './ExitTable';

const expiryOptions = getExpiryOptions();

export function ExitForm() {
  const [isStarted, updateIsStarted] = useStore((state) => [
    state.isStarted,
    state.updateIsStarted,
  ]);
  const [stocks, setStocks] = useState([]);
  const [exitStocks, setExitStocks] = useState<{
    equity: Instrument;
    future: Instrument;
  }>();

  const [enteredStock, updateEnteredStock] = useStore((state) => [
    state.enteredStock,
    state.updateEnteredStock,
  ]);
  const [expiry, updateExpiry] = useStore((state) => [
    state.expiry,
    state.updateExpiry,
  ]);
  const [enteredDiff, updateEnteredDiff] = useStore((state) => [
    state.enteredDiff,
    state.updateEnteredDiff,
  ]);
  const [exitDiffPercent, updateExitDiffPercent] = useStore((state) => [
    state.exitDiffPercent,
    state.updateExitDiffPercent,
  ]);

  useEffect(() => {
    fetch('/api/getStocks')
      .then((res) => res.json())
      .then((response) => setStocks(response));
  }, []);

  useEffect(() => {
    if (enteredStock && expiry) {
      fetch(
        `/api/getExitInstruments?stock=${encodeURIComponent(
          enteredStock
        )}&expiry=${expiry}`
      )
        .then((res) => res.json())
        .then((stocks) => {
          setExitStocks(stocks);
        });
    }
  }, [enteredStock, expiry]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isStarted) {
      updateIsStarted(false);
      // updateEnteredDiff(0);
      // updateExitDiffPercent(0);
    } else {
      fetch(
        `/api/getExitInstruments?stock=${encodeURIComponent(
          enteredStock
        )}&expiry=${expiry}`
      )
        .then((res) => res.json())
        .then((stocks) => {
          setExitStocks(stocks);
          setTimeout(() => {
            updateIsStarted(true);
          }, 1000);
        });
    }
  };

  return (
    <>
      <form
        className="mb-12 rounded-lg rounded-t-none py-6 bg-zinc-50 dark:bg-zinc-800 dark:bg-white/5 border border-t-0 border-zinc-200 dark:border-white/10 flex justify-between items-end px-8"
        onSubmit={handleFormSubmit}
      >
        <ComboBoxInput
          items={stocks}
          name="stock"
          selectedItem={enteredStock}
          setSelectedItem={updateEnteredStock}
        />
        <div>
          <label
            htmlFor="expiry"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Expiry
          </label>
          <select
            id="expiry"
            name="expiry"
            className="mt-1 pl-3 pr-10 py-2 dark:bg-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded-md"
            value={expiry}
            onChange={(e) => updateExpiry(e.target.value)}
          >
            {expiryOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="exitDiff"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Entered Diff
          </label>
          <div className="mt-1">
            <input
              type="number"
              value={enteredDiff}
              step={0.0001}
              name="enteredDiff"
              id="enteredDiff"
              className="dark:bg-zinc-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm border-zinc-300 dark:border-zinc-700 rounded-md"
              onChange={(e) =>
                updateEnteredDiff(e.target.value ? Number(e.target.value) : '')
              }
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="exitDiffPercent"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Exit Diff %
          </label>
          <div className="mt-1">
            <input
              type="number"
              value={exitDiffPercent}
              step={0.0001}
              min={0}
              max={100}
              name="exitDiffPercent"
              id="exitDiffPercent"
              onChange={(e) =>
                updateExitDiffPercent(
                  e.target.value ? Number(e.target.value) : ''
                )
              }
              className="dark:bg-zinc-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm border-zinc-300 dark:border-zinc-700 rounded-md "
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2 text-base font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isStarted ? 'Stop Exit' : 'Start Exit'}
        </button>
      </form>
      {isStarted && (
        <ExitTable
          equityStock={exitStocks?.equity!}
          futureStock={exitStocks?.future!}
          exitDiffTrigger={Number(
            (
              ((100 - (exitDiffPercent || 0)) * (enteredDiff || 0)) /
              100
            ).toFixed(2)
          )}
        />
      )}
    </>
  );
}
