import { Instrument } from '@/types';
import { getExpiryOptions } from '@/utils/ui';
import { FormEvent, useState } from 'react';
import { Table } from './Table';

const expiryOptions = getExpiryOptions();

export function Main() {
  const [isStarted, setIsStarted] = useState(false);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [entryBasis, setEntryBasis] = useState(0);

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

      fetch(`/getInstruments?expiry=${inputExpiry}`)
        .then((res) => res.json())
        .then((instruments) => {
          setInstruments(instruments);
          setEntryBasis(inputEntryBasis);
          setIsStarted(true);
        });
    }
  };

  return (
    <main>
      <form
        className="max-w-5xl mx-auto mt-6 rounded-lg py-6 bg-zinc-50 dark:bg-zinc-800 dark:bg-white/5 ring-1 ring-zinc-200 dark:ring-1 dark:ring-white/10 flex justify-between items-end px-8"
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
          >
            {expiryOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-8 py-2 text-base font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isStarted ? 'Stop' : 'Start'}
        </button>
      </form>
      {isStarted && <Table instruments={instruments} entryBasis={entryBasis} />}
    </main>
  );
}
