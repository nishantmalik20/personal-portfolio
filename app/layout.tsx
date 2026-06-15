import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
