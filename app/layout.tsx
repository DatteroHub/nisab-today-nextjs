import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import Provider from "./_provider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nisab Today",
    default: "Nisab Today",
  },
  description:
    "Find islamic nisab value, for every currency, every country, updated everyday.",
  keywords: [
    "nissab",
    "nisab",
    "fitr zakat",
    "eid al fitr zakat",
    "zakat al mal",
    "zakat nisab",
    "nisab of zakat",
    "donation zakat",
    "giving zakat",
    "zakat in quran",
    "nisab of zakat in islam",
    "zakat and nisab",
    "zakat al fitr",
    "zakat ul fitr",
    "zakat fund",
    "zakat in islam",
    "muslim zakat",
    "eid zakat",
    "calculating zakat",
    "zakah islam",
    "fitra and zakat",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
