import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6825630715558369"
      />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
