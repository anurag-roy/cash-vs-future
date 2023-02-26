import { Header } from '@/components/Header';
import { Main } from '@/components/Main';
import env from '@/env.json';
import { kc } from '@/globals/kc';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // getProfile call to check if logged in or not
  try {
    const profile = await kc.getProfile();

    return {
      props: {
        status: 'authorized' as const,
        data: {
          userId: profile.user_id || '',
          apiKey: env.API_KEY,
          //@ts-ignore Access private variable `access_token` in KiteConnect instance
          accessToken: kc.access_token as string,
        },
      },
    };
  } catch (error) {
    console.log('Access token expired or not set.');
    const loginUrl = kc.getLoginURL();
    return {
      props: {
        status: 'unauthorized' as const,
        data: loginUrl,
      },
    };
  }
}

type HomeProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];

export default function Home({ status, data }: HomeProps) {
  useEffect(() => {
    if (status === 'authorized') {
      localStorage.setItem('API_KEY', data.apiKey);
      localStorage.setItem('ACCESS_TOKEN', data.accessToken);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Cash vs Future</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        status={status}
        data={status === 'authorized' ? data.userId : data}
      />
      <Main />
    </>
  );
}
