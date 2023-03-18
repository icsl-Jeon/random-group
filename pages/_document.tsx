import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Script
        id="Adsense-id"
        async
        strategy="beforeInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6825630715558369"
        onError={(e) => {
          console.error("Script failed to load", e);
        }}
      />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
