import { cx } from '@/utils/ui';
import { Tab } from '@headlessui/react';
import { useState } from 'react';
import { EntryForm } from './entry/EntryForm';
import { ExitForm } from './exit/ExitForm';

export function Main() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <main className="mt-6 max-w-5xl w-full mx-auto">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex gap-6 rounded-xl rounded-b-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-2">
          {['Entry', 'Exit'].map((t) => (
            <Tab
              key={t}
              className={({ selected }) =>
                cx(
                  'rounded-lg py-2.5 px-12 text-sm leading-5',
                  selected
                    ? 'font-semibold bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-white/10 shadow-sm text-blue-700 dark:text-blue-400'
                    : 'font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/40 dark:hover:bg-zinc-700/40'
                )
              }
            >
              {t}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <EntryForm />
          </Tab.Panel>
          <Tab.Panel>
            <ExitForm />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}
