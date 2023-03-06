import { Instrument } from '@/types';
import { getExpiryOptions } from '@/utils/ui';
import { FormEvent, useEffect, useState } from 'react';
import { ComboBoxInput } from '../ComboBoxInputs';
import { ExitTable } from './ExitTable';

const expiryOptions = getExpiryOptions();

export function ExitForm() {
  const [isStarted, setIsStarted] = useState(false);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [entryBasis, setEntryBasis] = useState(0);

  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch('/api/getStocks')
      .then((res) => res.json())
      .then((response) => setStocks(response));
  }, []);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isStarted) {
      setIsStarted(false);
      setInstruments([]);
      setEntryBasis(0);
    } else {
      const formData = new FormData(event.currentTarget);
      const inputEntryBasis = Number(formData.get('entryBasis')?.valueOf());
      const inputExpiry = formData.get('expiry')?.valueOf() as string;

      fetch(`/api/getInstruments?expiry=${inputExpiry}`)
        .then((res) => res.json())
        .then((instruments) => {
          setInstruments(instruments);
          setEntryBasis(inputEntryBasis);
          setIsStarted(true);
        });
    }
  };

  return (
    <>
      <form
        className="mb-12 rounded-lg rounded-t-none py-6 bg-zinc-50 dark:bg-zinc-800 dark:bg-white/5 border border-t-0 border-zinc-200 dark:border-white/10 flex justify-between items-end px-8"
        onSubmit={handleFormSubmit}
      >
        <ComboBoxInput items={stocks} name="stock" />
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
            Exit Diff
          </label>
          <div className="mt-1">
            <input
              type="number"
              defaultValue={0}
              step={0.0001}
              name="exitDiff"
              id="exitDiff"
              className="dark:bg-zinc-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm border-zinc-300 dark:border-zinc-700 rounded-md "
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="entryBasis"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Exit Diff %
          </label>
          <div className="mt-1">
            <input
              type="number"
              defaultValue={0}
              step={0.0001}
              min={0}
              max={100}
              name="exitDiffPercent"
              id="exitDiffPercent"
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
        <ExitTable instruments={instruments} entryBasis={entryBasis} />
      )}
    </>
  );
}
