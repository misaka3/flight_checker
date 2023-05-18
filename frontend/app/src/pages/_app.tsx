import type { AppProps } from 'next/app'
import MainLayout from 'layouts/MainLayout';
import RootLayout from 'layouts/RootLayout';
import { useRouter } from 'next/router';
import '~/styles/pages/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    router.pathname === '/' ? (
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
     ) : (
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    )
  );
}

export default MyApp;