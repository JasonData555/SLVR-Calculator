import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import "../styles/print.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Security Leader Vacancy Risk Calculator | Hitch Partners",
  description:
    "Quantify the financial risk of vacant cybersecurity leadership positions. Monte Carlo simulation powered by IBM & Cyentia data.",
  openGraph: {
    title: "Security Leader Vacancy Risk Calculator | Hitch Partners",
    description:
      "Quantify the financial risk of a vacant CISO or security leader position. Monte Carlo simulation powered by IBM & Cyentia data.",
    type: "website",
    siteName: "Hitch Partners",
  },
  twitter: {
    card: "summary",
    title: "Security Leader Vacancy Risk Calculator | Hitch Partners",
    description:
      "Quantify the financial risk of a vacant CISO or security leader position. Monte Carlo simulation powered by IBM & Cyentia data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} ${libreBaskerville.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
