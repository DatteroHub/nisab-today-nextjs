import { NextRequest, NextResponse } from "next/server";
import { getCurrency } from "@/lib/destinations";
import { fetchNisabApi, HistoryPage } from "@/lib/nisab-api";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { currency: string } },
) {
  const currency = getCurrency(params.currency);
  const cursor = request.nextUrl.searchParams.get("cursor");
  if (!currency || (cursor && cursor.length > 2048)) {
    return NextResponse.json(
      { error: "Invalid currency or cursor" },
      { status: 400 },
    );
  }
  try {
    const query = cursor ? `?${new URLSearchParams({ cursor })}` : "";
    const data = await fetchNisabApi<HistoryPage>(
      `/history/${currency}${query}`,
    );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
    });
  } catch {
    return NextResponse.json(
      { error: "History is temporarily unavailable" },
      { status: 503 },
    );
  }
}
