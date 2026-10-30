import type { MetadataRoute } from "next";
import {
  countries,
  countryPath,
  currencyCodes,
  currencyPath,
  SITE_URL,
} from "@/lib/destinations";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/countries`, changeFrequency: "monthly", priority: 0.8 },
    ...currencyCodes.map((code) => ({
      url: `${SITE_URL}${currencyPath(code)}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...countries.map((country) => ({
      url: `${SITE_URL}${countryPath(country.slug)}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
