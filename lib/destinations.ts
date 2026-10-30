import { detailedCurrencies, orderedCurrencies } from "./currencies";

export const SITE_URL = "https://nisabtoday.org";
export const currencyCodes = orderedCurrencies.filter(
  (code) => detailedCurrencies[code],
);
export const currencyPath = (code: string) => `/currency/${code.toLowerCase()}`;
export const countrySlug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Do not generate country destinations from retired currencies, units of
// account or crypto. Keep those currency archives available separately.
const excludedCountryCurrencies = new Set([
  "BGN",
  "HRK",
  "MRO",
  "SLL",
  "SVC",
  "ANG",
  "CLF",
  "XRP",
]);
const preferredCurrency: Record<string, string> = {
  Bhutan: "BTN",
  Macau: "MOP",
  Chile: "CLP",
  "El Salvador": "USD",
};
const byCountry = new Map<
  string,
  { name: string; slug: string; currency: string }
>();
for (const code of currencyCodes) {
  if (excludedCountryCurrencies.has(code)) continue;
  for (const name of detailedCurrencies[code].countries) {
    if (preferredCurrency[name] && preferredCurrency[name] !== code) continue;
    const slug = countrySlug(name);
    byCountry.set(slug, { name, slug, currency: code });
  }
}
export const countries = Array.from(byCountry.values()).sort((a, b) =>
  a.name.localeCompare(b.name, "en"),
);
export const countryPath = (slug: string) => `/country/${slug}`;
export const getCountry = (slug: string) => byCountry.get(slug);
export const getCurrency = (slug: string) =>
  currencyCodes.find((code) => code.toLowerCase() === slug);
