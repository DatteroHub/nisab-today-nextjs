import Link from "next/link";
import type { Metadata } from "next";
import { countries, countryPath } from "@/lib/destinations";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nisab by country",
  description:
    "Find gold and silver nisab values by country, in local currency, with daily historical charts.",
  alternates: { canonical: "/countries" },
};
export default function CountriesPage() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Nisab Today
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">Nisab by country</h1>
        <p className="mt-4 text-muted-foreground">
          Choose a country to see gold and silver nisab in its currency, with
          recorded daily history.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={countryPath(country.slug)}
              className="flex items-center justify-between gap-3 rounded-2xl border bg-white p-4 hover:border-amber-500"
            >
              <span>{country.name}</span>
              <span className="text-xs text-muted-foreground">
                {country.currency}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
