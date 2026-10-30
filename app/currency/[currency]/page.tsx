import { notFound, permanentRedirect } from "next/navigation";
import { getCurrency, currencyPath } from "@/lib/destinations";
import NisabDetail, { detailMetadata } from "@/components/NisabDetail";

export const runtime = "edge";
type Props = { params: { currency: string } };
function resolveCurrency(slug: string) {
  const currency = getCurrency(slug.toLowerCase());
  if (!currency) notFound();
  if (slug !== slug.toLowerCase()) permanentRedirect(currencyPath(currency));
  return currency;
}
export function generateMetadata({ params }: Props) {
  return detailMetadata({ currency: resolveCurrency(params.currency) });
}
export default function CurrencyPage({ params }: Props) {
  return <NisabDetail currency={resolveCurrency(params.currency)} />;
}
