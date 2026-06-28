import './style.css'

import Head from 'next/head'
import { useEffect } from 'react'
import { GlobalProvider } from '../global-context'
import { NextIntlClientProvider } from 'next-intl'
import SmoothScroll from '../components/SmoothScroll'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize smooth-loader for lazy image loading
    // Any element with class="smooth-loader" and data-src="..." will fade in on scroll
    import('../smooth-loader-master/lib/js/index.js').then(mod => {
      const smoothLoader = mod.default || mod;
      smoothLoader(); // targets all .smooth-loader[data-src] elements automatically
    }).catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <NextIntlClientProvider
        locale={pageProps?.locale ?? 'en'}
        messages={pageProps?.messages ?? {}}
        timeZone="Asia/Kolkata"
      >
        <GlobalProvider>
          <SmoothScroll ease={0.085}>
            <Component {...pageProps} />
          </SmoothScroll>
        </GlobalProvider>
      </NextIntlClientProvider>
    </>
  )
}
