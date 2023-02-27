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
      className="flex p-2 items-center justify-center rounded-md transition bg-zinc-50 dark:bg-zinc-800 dark:bg-white/5 ring-1 ring-zinc-200 dark:ring-1 dark:ring-white/10"
      aria-label="Refresh Data"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        className={cx(
          'h-5 w-5 stroke-zinc-900 dark:stroke-white',
          isActive ? 'animate-spin' : ''
        )}
      >
        <path
          fill="currentColor"
          d="M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z"
        ></path>
      </svg>
    </button>
  );
}
