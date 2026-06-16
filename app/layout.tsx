import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-WDL593W8";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inishant.com"),
  title: "Nishant · Web Designer & Developer",
  description:
    "A 3D storybook portfolio. Nishant designs, builds and manages bright, story-driven websites, end to end, from Winnipeg, Canada.",
  openGraph: {
    title: "Nishant · Web Designer & Developer",
    description:
      "Bright, story-driven websites designed, built and cared for end to end, told as a scrollable 3D storybook.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#6FC9FF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
