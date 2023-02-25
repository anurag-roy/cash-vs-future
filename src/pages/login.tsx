import { NseLogo } from '@/components/Header';
import env from '@/env.json';
import { kc } from '@/globals/kc';
import { updateStoredInstruments } from '@/utils/api';
import { writeFileSync } from 'fs';
import { GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const requestToken = context.query.request_token as string | undefined;

  if (!requestToken) {
    return {
      props: {
        status: 'error' as const,
        message: 'No request token found. Login not successful.',
      },
    };
  }

  try {
    const { access_token } = await kc.generateSession(
      requestToken,
      env.API_SECRET
    );
    writeFileSync('src/data/accessToken.txt', access_token, 'utf-8');

    await updateStoredInstruments();

    return {
      props: {
        status: 'success' as const,
        message: 'Login successful!',
        data: {
          accessToken: access_token,
          apiKey: env.API_KEY,
        },
      },
    };
  } catch (error) {
    console.log('Error while generating session', error);
    return {
      props: {
        status: 'error' as const,
        message: 'Authorization failure. Login not successful.',
      },
    };
  }
}

type LoginProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];

export default function Login({ status, message, data }: LoginProps) {
  useEffect(() => {
    if (status === 'success') {
      localStorage.setItem('API_KEY', data.apiKey);
      localStorage.setItem('ACCESS_TOKEN', data.accessToken);
    }
  }, []);

  return (
    <div className="min-h-full pt-16 pb-12 flex flex-col bg-white dark:bg-zinc-900">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <a href="/" className="inline-flex">
            <span className="sr-only">Home</span>
            <NseLogo />
          </a>
        </div>
        <div className="py-12">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              {status}
            </p>
            <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-200">
              {message}
            </h1>
            {status === 'success' && (
              <p className="mt-2 text-base text-zinc-500 dark:text-zinc-300">
                Please restart the server to use the newly generated token.
              </p>
            )}
            <div className="mt-6">
              <a
                href="/"
                className="text-base font-medium text-blue-600 hover:text-blue-500"
              >
                Go back home<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
