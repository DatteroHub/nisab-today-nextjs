import { notFound } from "next/navigation";
import { getCountry } from "@/lib/destinations";
import NisabDetail, { detailMetadata } from "@/components/NisabDetail";

type Props = { params: { country: string } };
function resolveCountry(slug: string) {
  const country = getCountry(slug);
  if (!country) notFound();
  return country;
}
export function generateMetadata({ params }: Props) {
  const country = resolveCountry(params.country);
  return detailMetadata({ currency: country.currency, country });
}
export default function CountryPage({ params }: Props) {
  const country = resolveCountry(params.country);
  return <NisabDetail currency={country.currency} country={country} />;
}
