import { cx } from '@/utils/ui';
import { useState } from 'react';

export function RefreshData() {
  const [isActive, setIsActive] = useState(false);

  const refreshData = () => {
    setIsActive(true);
    fetch('/api/refreshData')
      .then((res) => {
        setIsActive(false);
        if (!res.ok) throw new Error();
        alert('Data refreshed successfully!');
      })
      .catch((err) => {
        setIsActive(false);
        alert('Some error occurred! Please try again.');
      });
  };

  return (
    <button
      type="button"
      onClick={refreshData}
      className="flex p-1.5 items-center justify-center rounded-md transition bg-zinc-50 dark:bg-zinc-800 dark:bg-white/5 ring-1 ring-zinc-200 dark:ring-1 dark:ring-white/10"
      aria-label="Refresh Data"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 21 21"
        className={cx(
          'h-6 w-6 stroke-zinc-900 dark:stroke-white',
          isActive ? 'animate-spin' : ''
        )}
      >
        <g
          fill="none"
          fillRule="evenodd"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6.5 3.5c-2.412 1.378-4 4.024-4 7a8 8 0 0 0 8 8m4-1c2.287-1.408 4-4.118 4-7a8 8 0 0 0-8-8"></path>
          <path d="M6.5 7.5v-4h-4m12 10v4h4"></path>
        </g>
      </svg>
    </button>
  );
}
