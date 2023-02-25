import { Instrument } from '@/types';
import { FormEvent, useState } from 'react';
import { Table } from './Table';

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
        className="max-w-5xl mx-auto mt-6 rounded-lg py-6 bg-zinc-50 dark:bg-zinc-800 dark:bg-white/5 ring-1 ring-zinc-200 dark:ring-1 dark:ring-white/10 flex items-end px-4 sm:px-6 lg:px-8 [&>*:first-child]:grow"
        onSubmit={handleFormSubmit}
      ></form>
      {isStarted && <Table instruments={instruments} entryBasis={entryBasis} />}
    </main>
  );
}
