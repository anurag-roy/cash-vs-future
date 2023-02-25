import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ThemeToggle } from './ThemeToggle';

type HeaderProps = {
  status: 'authorized' | 'unauthorized';
  data: string;
};

function NseLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 204 204"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M102.1 146.6L57.3 101.9L102.1 57.2L146.9 101.9L102.1 146.6Z"
        fill="#FEFEFE"
      />
      <path
        d="M174.4 29.8L102.4 0.600006L30.1 30.1L102.1 57.2L174.4 29.8Z"
        fill="#E65C1B"
      />
      <path
        d="M146.9 101.9L174.4 29.8L102.1 57.2L146.9 101.9Z"
        fill="#362D7E"
      />
      <path
        d="M102.1 146.6L174.4 173.7L146.9 101.9L102.1 146.6Z"
        fill="#ECAE0E"
      />
      <path d="M102.1 57.2L30.1 30.1L57.3 101.9L102.1 57.2Z" fill="#ECAE0E" />
      <path
        d="M30.1 30.1C29.7 29.7 0.5 101.9 0.5 101.9L30.1 173.7L57.3 101.9L30.1 30.1Z"
        fill="#E31D25"
      />
      <path d="M57.3 101.9L30.1 173.7L102.1 146.6L57.3 101.9Z" fill="#ECAE0E" />
      <path
        d="M30.1 173.7L102.1 203.2L174.4 173.7L102.1 146.6L30.1 173.7Z"
        fill="#E31D25"
      />
      <path
        d="M174.4 29.8L146.9 101.9L174.4 173.7L204 101.9L174.4 29.8Z"
        fill="#E65C1B"
      />
    </svg>
  );
}

export function Header({ status, data }: HeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center gap-2">
      <NseLogo />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mr-auto">
        Cash vs Future
      </h1>
      <ThemeToggle />
      {status === 'authorized' ? (
        <span className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-emerald-800 bg-emerald-50/50 ring-1 ring-inset ring-emerald-700/20 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200">
          <CheckCircleIcon
            className="-ml-1 mr-2 h-5 w-5 fill-emerald-600 dark:fill-emerald-200/50"
            aria-hidden="true"
          />
          Logged in ({data})
        </span>
      ) : (
        <a
          className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-800 bg-red-50/50 ring-1 ring-inset ring-red-700/20 hover:ring-red-700/50 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-200"
          href={data}
        >
          <XCircleIcon
            className="-ml-1 mr-2 h-5 w-5 fill-red-600 dark:fill-red-200/50"
            aria-hidden="true"
          />
          Session expired. Click here to login
        </a>
      )}
    </header>
  );
}
