import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { detailedCurrencies } from "@/lib/currencies";
import {
  countries,
  countryPath,
  currencyPath,
  SITE_URL,
} from "@/lib/destinations";
import { getCurrencySnapshot } from "@/lib/nisab-api";
import HistoryChart from "./HistoryChart";
import Footer from "./Footer";

type DetailProps = {
  currency: string;
  country?: { name: string; slug: string };
};

export function detailMetadata({ currency, country }: DetailProps): Metadata {
  const name = detailedCurrencies[currency].currency_name;
  const title = country
    ? `Nisab in ${country.name} today (${currency})`
    : `Nisab in ${name} (${currency}) today`;
  const description = country
    ? `Find the latest gold and silver nisab in ${country.name}, expressed in ${name} (${currency}). Explore daily historical values and how the thresholds are calculated.`
    : `Find the latest nisab in ${name} (${currency}), based on 85 grams of gold and 595 grams of silver. Explore daily values and the historical chart.`;
  const path = country ? countryPath(country.slug) : currencyPath(currency);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: "en_GB",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function NisabDetail({ currency, country }: DetailProps) {
  const details = detailedCurrencies[currency];
  const title = country
    ? `Nisab in ${country.name}`
    : `Nisab in ${details.currency_name}`;
  const path = country ? countryPath(country.slug) : currencyPath(currency);
  const related = countries.filter(
    (item) => item.currency === currency && item.slug !== country?.slug,
  );
  const snapshot = await getCurrencySnapshot(currency).catch(() => null);
  const stale =
    snapshot && Date.now() / 1000 - snapshot.timestamp > 48 * 60 * 60;
  const updated = snapshot
    ? new Date(snapshot.timestamp * 1000).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "UTC",
      })
    : null;
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nisab Today", item: SITE_URL },
      ...(country
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: "Countries",
              item: `${SITE_URL}/countries`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: country ? 3 : 2,
        name: title,
        item: `${SITE_URL}${path}`,
      },
    ],
  };
  return (
    <>
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-8 lg:py-12">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <Image src="/logo.svg" alt="" width={40} height={40} />
            Nisab Today
          </Link>
          <Link
            href="/countries"
            className="text-sm text-muted-foreground hover:underline"
          >
            Browse countries
          </Link>
        </header>
        <nav
          aria-label="Breadcrumb"
          className="mt-9 flex flex-wrap gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          {country && (
            <>
              <Link href="/countries" className="hover:underline">
                Countries
              </Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page">{country?.name || currency}</span>
        </nav>
        <div className="my-8 sm:my-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-700">
            Daily nisab · {currency}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            {country
              ? `Explore the gold and silver nisab thresholds for ${country.name}, expressed in ${details.currency_name} (${currency}).`
              : `Follow the gold and silver nisab thresholds in ${details.currency_name} (${currency}) and see how they have changed over time.`}
          </p>
        </div>
        {snapshot ? (
          <>
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              {(["gold", "silver"] as const).map((metal) => (
                <section
                  key={metal}
                  className={`rounded-3xl border p-6 sm:p-8 ${metal === "gold" ? "border-amber-200 bg-amber-50/70" : "border-slate-200 bg-slate-100/70"}`}
                >
                  <h2 className="text-sm font-medium capitalize">
                    {metal} nisab
                  </h2>
                  <p className="mt-3 break-words text-3xl font-semibold tabular-nums sm:text-4xl">
                    {snapshot.nisab[metal].toLocaleString("en-GB")}{" "}
                    <span className="text-lg font-normal">{currency}</span>
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Based on{" "}
                    {metal === "gold"
                      ? "85 grams of gold"
                      : "595 grams of silver"}
                  </p>
                </section>
              ))}
            </div>
            <p
              className={`mb-8 text-sm ${stale ? "text-amber-700" : "text-muted-foreground"}`}
            >
              {stale ? "Latest available observation" : "Last updated"}:{" "}
              <time
                dateTime={new Date(snapshot.timestamp * 1000).toISOString()}
              >
                {updated} UTC
              </time>
              {stale && ". The daily update is delayed."}
            </p>
          </>
        ) : (
          <p
            role="status"
            className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5"
          >
            Current prices are temporarily unavailable. Please try again later.
            Historical data may still be available below.
          </p>
        )}
        <HistoryChart currency={currency} />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="text-xl font-semibold">
              {country
                ? `How is nisab in ${country.name} calculated?`
                : `How is nisab in ${currency} calculated?`}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Nisab Today converts the value of 85 grams of gold and 595 grams
              of silver into {details.currency_name} using metal and currency
              rates from MetalpriceAPI. Values are updated daily and truncated
              to whole currency units, matching the stored historical
              observations.
            </p>
            {country && (
              <p className="mt-3 leading-relaxed text-muted-foreground">
                This page uses {currency} for {country.name}. Countries using
                the same currency share the same displayed nisab values. The
                chart shows the history of that currency, rather than a separate
                national price series.
              </p>
            )}
          </section>
          <section>
            <h2 className="text-xl font-semibold">
              About the historical chart
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Choose gold or silver and a date range to explore the recorded
              nisab. Each point is the last available observation for that UTC
              day. Missing days are not filled in, and the archive only includes
              dates and currencies that were recorded.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              These are the thresholds published by Nisab Today. For guidance on
              which standard applies to your zakat calculation, consult a
              qualified scholar.
            </p>
          </section>
        </div>
        {country && (
          <section className="mt-10 rounded-2xl border bg-white p-6">
            <h2 className="font-semibold">Nisab in {details.currency_name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore the currency page and other countries using {currency}.
            </p>
            <Link
              href={currencyPath(currency)}
              className="mt-3 inline-block text-amber-800 underline underline-offset-4"
            >
              View nisab in {details.currency_name} ({currency}) →
            </Link>
          </section>
        )}
        {!!related.length && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">
              {country
                ? `Other countries using ${currency}`
                : `Nisab by country in ${currency}`}
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={countryPath(item.slug)}
                  className="rounded-full border bg-white px-4 py-2 text-sm hover:border-amber-500"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </section>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
