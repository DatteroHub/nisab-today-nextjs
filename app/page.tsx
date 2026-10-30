import NisabList from "@/components/NisabList";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Link from "next/link";
import { currencyCodes, currencyPath } from "@/lib/destinations";
import { detailedCurrencies } from "@/lib/currencies";

export const metadata = { alternates: { canonical: "/" } };

export const runtime = "edge";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-4 lg:p-20">
        <Hero />
        <div className="mb-6 flex w-full flex-wrap gap-4 text-sm">
          <Link href="/countries" className="underline underline-offset-4">
            Browse nisab by country →
          </Link>
          <Link href="/country/italy" className="underline underline-offset-4">
            Nisab in Italy
          </Link>
          <Link href="/currency/eur" className="underline underline-offset-4">
            Nisab in Euro
          </Link>
        </div>
        <NisabList />
        <section className="mt-12 w-full">
          <h2 className="text-xl font-semibold">Nisab by currency</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore dedicated currency pages and daily historical charts.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            {currencyCodes.map((code) => (
              <Link
                key={code}
                href={currencyPath(code)}
                className="text-sm text-muted-foreground hover:underline"
              >
                {detailedCurrencies[code].currency_name} ({code})
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
