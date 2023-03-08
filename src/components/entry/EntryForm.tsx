import { useStore } from '@/store';
import { Instrument } from '@/types';
import { getExpiryOptions } from '@/utils/ui';
import { FormEvent, useState } from 'react';
import { EntryTable } from './EntryTable';

const expiryOptions = getExpiryOptions();

export function EntryForm() {
  const [isStarted, updateIsStarted] = useStore((state) => [
    state.isStarted,
    state.updateIsStarted,
  ]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [expiry, updateExpiry] = useStore((state) => [
    state.expiry,
    state.updateExpiry,
  ]);
  const [entryBasis, setEntryBasis] = useState(0);
  const [exitDiffPercent, updateExitDiffPercent] = useStore((state) => [
    state.exitDiffPercent,
    state.updateExitDiffPercent,
  ]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isStarted) {
      setInstruments([]);
      setEntryBasis(0);
      updateIsStarted(false);
    } else {
      const formData = new FormData(event.currentTarget);
      const inputEntryBasis = Number(formData.get('entryBasis')?.valueOf());

      fetch(`/api/getInstruments?expiry=${expiry}`)
        .then((res) => res.json())
        .then((instruments) => {
          setInstruments(instruments);
          setEntryBasis(inputEntryBasis);
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
        <div>
          <label
            htmlFor="entryBasis"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Entry Basis %
          </label>
          <div className="mt-1">
            <input
              type="number"
              defaultValue={0}
              step={0.0001}
              min={0}
              max={100}
              name="entryBasis"
              id="entryBasis"
              className="dark:bg-zinc-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm border-zinc-300 dark:border-zinc-700 rounded-md "
            />
          </div>
        </div>
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
          {isStarted ? 'Stop Entry' : 'Start Entry'}
        </button>
      </form>
      {isStarted && (
        <EntryTable instruments={instruments} entryBasis={entryBasis} />
      )}
    </>
  );
}
