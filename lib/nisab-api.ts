import "server-only";
import { env as cloudflareEnv } from "cloudflare:workers";

export type NisabPrice = { gold: number; silver: number };
export type NisabSnapshot = {
  timestamp: number;
  nisab: Record<string, NisabPrice>;
};
export type CurrencySnapshot = {
  timestamp: number;
  currency: string;
  nisab: NisabPrice;
};
export type HistoryPoint = NisabPrice & { timestamp: number };
export type HistoryPage = {
  currency: string;
  points: HistoryPoint[];
  nextCursor: string | null;
  skippedRecords: number;
};

export async function fetchNisabApi<T>(path: string): Promise<T> {
  // Worker secrets are available through cloudflare:workers. Keep the
  // process.env fallback for local dotenv-based development and builds.
  const runtimeEnv = cloudflareEnv;
  const apiKey = runtimeEnv.NISAB_API_KEY ?? process.env.NISAB_API_KEY;
  if (!apiKey) throw new Error("Nisab API is not configured");
  const base =
    runtimeEnv.NISAB_API_URL ??
    process.env.NISAB_API_URL ??
    "https://api.nisabtoday.org";
  const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
    headers: { "x-api-key": apiKey },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Nisab API is unavailable");
  const json = (await response.json()) as { success?: boolean; data?: T };
  if (!json.success || !json.data)
    throw new Error("Nisab API returned no data");
  return json.data as T;
}

export async function getCurrencySnapshot(
  code: string,
): Promise<CurrencySnapshot> {
  const data = await fetchNisabApi<CurrencySnapshot>(`/get/${code}`);
  if (
    !Number.isFinite(data.timestamp) ||
    !Number.isFinite(data.nisab?.gold) ||
    !Number.isFinite(data.nisab?.silver)
  ) {
    throw new Error("Invalid Nisab snapshot");
  }
  return data;
}
