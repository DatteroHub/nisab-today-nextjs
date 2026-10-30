"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HistoryPage, HistoryPoint } from "@/lib/nisab-api";
import { Button } from "./ui/button";

const periods = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "All", days: 0 },
];
const dateLabel = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
const numberLabel = (value: number) =>
  value.toLocaleString("en-GB", { maximumFractionDigits: 0 });

async function loadHistory(currency: string, signal: AbortSignal) {
  const days = new Map<string, HistoryPoint>();
  const cursors = new Set<string>();
  let cursor: string | null = null;
  let skippedRecords = 0;
  do {
    const query: string = cursor ? `?${new URLSearchParams({ cursor })}` : "";
    const response = await fetch(
      `/api/history/${currency.toLowerCase()}${query}`,
      { signal },
    );
    if (!response.ok) throw new Error("Unable to load history");
    const page: HistoryPage = await response.json();
    for (const point of page.points) {
      const day = new Date(point.timestamp * 1000).toISOString().slice(0, 10);
      if (!days.has(day) || days.get(day)!.timestamp < point.timestamp)
        days.set(day, point);
    }
    skippedRecords += page.skippedRecords;
    cursor = page.nextCursor;
    if (cursor && cursors.has(cursor))
      throw new Error("History pagination did not advance");
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return {
    points: Array.from(days.values()).sort((a, b) => a.timestamp - b.timestamp),
    skippedRecords,
  };
}

export default function HistoryChart({ currency }: { currency: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [chartWidth, setChartWidth] = useState(900);
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [period, setPeriod] = useState(365);
  const [active, setActive] = useState<number | null>(null);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["nisab-history", currency],
    queryFn: ({ signal }) => loadHistory(currency, signal),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
  const cutoff =
    Math.floor(Date.now() / 86400000) * 86400 - (period - 1) * 86400;
  const points = (data?.points || []).filter(
    (point) => !period || point.timestamp >= cutoff,
  );
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) =>
      setChartWidth(Math.max(240, entry.contentRect.width)),
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [isPending, isError, points.length]);
  const chartLeft = 55;
  const chartRight = chartWidth - 16;
  const plotWidth = chartRight - chartLeft;
  const values = points.map((point) => point[metal]);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.15, maximum * 0.01, 1);
  const low = Math.max(0, minimum - padding);
  const high = maximum + padding;
  const first = points[0]?.timestamp || 0;
  const last = points[points.length - 1]?.timestamp || first;
  const x = (timestamp: number) =>
    points.length === 1
      ? (chartLeft + chartRight) / 2
      : chartLeft + ((timestamp - first) / (last - first || 1)) * plotWidth;
  const y = (value: number) => 250 - ((value - low) / (high - low || 1)) * 220;
  // Break the line over missing days instead of suggesting continuous coverage.
  const line = points
    .map(
      (point, index) =>
        `${index === 0 || Math.floor(point.timestamp / 86400) - Math.floor(points[index - 1].timestamp / 86400) > 1 ? "M" : "L"}${x(point.timestamp)},${y(point[metal])}`,
    )
    .join(" ");
  const selectedIndex = Math.min(
    active ?? points.length - 1,
    points.length - 1,
  );
  const selected = points[selectedIndex];
  const color = metal === "gold" ? "#d97706" : "#64748b";

  return (
    <section
      aria-labelledby="history-title"
      className="rounded-3xl border bg-white p-5 sm:p-8 shadow-sm"
    >
      <div className="flex flex-wrap justify-between gap-5">
        <div>
          <h2 id="history-title" className="text-xl font-semibold">
            Nisab history
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily {metal} nisab in {currency}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div
            className="flex gap-1 rounded-xl bg-slate-100 p-1"
            aria-label="Metal"
          >
            {(["gold", "silver"] as const).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={metal === item ? "default" : "ghost"}
                aria-pressed={metal === item}
                onClick={() => setMetal(item)}
                className="rounded-lg capitalize"
              >
                {item}
              </Button>
            ))}
          </div>
          <div
            className="flex gap-1 rounded-xl bg-slate-100 p-1"
            aria-label="Date range"
          >
            {periods.map((item) => (
              <Button
                key={item.label}
                size="sm"
                variant={period === item.days ? "default" : "ghost"}
                aria-pressed={period === item.days}
                onClick={() => {
                  setPeriod(item.days);
                  setActive(null);
                }}
                className="rounded-lg"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {isPending ? (
        <p
          role="status"
          className="flex h-72 items-center justify-center text-muted-foreground"
        >
          Loading historical prices…
        </p>
      ) : isError ? (
        <div role="alert" className="py-20 text-center">
          <p>History is temporarily unavailable.</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !points.length ? (
        <p className="py-20 text-center text-muted-foreground">
          No recorded prices in this period. Try a longer date range.
        </p>
      ) : (
        <>
          <div
            className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1"
            aria-live="polite"
          >
            <strong className="text-2xl sm:text-3xl tabular-nums">
              {numberLabel(selected[metal])}{" "}
              <span className="text-base font-normal text-muted-foreground">
                {currency}
              </span>
            </strong>
            <span className="text-sm text-muted-foreground">
              {dateLabel(selected.timestamp)}
            </span>
          </div>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${chartWidth} 300`}
            role="img"
            aria-labelledby="chart-title chart-description"
            className="mt-4 w-full"
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              const timestamp =
                first +
                Math.max(
                  0,
                  Math.min(
                    1,
                    (((event.clientX - bounds.left) / bounds.width) *
                      chartWidth -
                      chartLeft) /
                      plotWidth,
                  ),
                ) *
                  (last - first);
              let nearest = 0;
              points.forEach((point, index) => {
                if (
                  Math.abs(point.timestamp - timestamp) <
                  Math.abs(points[nearest].timestamp - timestamp)
                )
                  nearest = index;
              });
              setActive(nearest);
            }}
            onPointerLeave={() => setActive(null)}
          >
            <title id="chart-title">
              {metal} nisab history in {currency}
            </title>
            <desc id="chart-description">
              Dates on the horizontal axis; nisab value in {currency} on the
              vertical axis. The daily values are also available in the table
              below.
            </desc>
            {[0, 1, 2, 3, 4].map((tick) => {
              const value = low + ((high - low) * tick) / 4;
              return (
                <g key={tick}>
                  <line
                    x1={chartLeft}
                    x2={chartRight}
                    y1={y(value)}
                    y2={y(value)}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={chartLeft - 8}
                    y={y(value) + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#64748b"
                  >
                    {new Intl.NumberFormat("en-GB", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(value)}
                  </text>
                </g>
              );
            })}
            <line
              x1={chartLeft}
              x2={chartLeft}
              y1="30"
              y2="250"
              stroke="#94a3b8"
            />
            <line
              x1={chartLeft}
              x2={chartRight}
              y1="250"
              y2="250"
              stroke="#94a3b8"
            />
            <text x={chartLeft} y="16" fontSize="12" fill="#64748b">
              {currency}
            </text>
            <path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map((point) => (
              <circle
                key={point.timestamp}
                cx={x(point.timestamp)}
                cy={y(point[metal])}
                r={points.length === 1 ? 5 : 1.5}
                fill={color}
              />
            ))}
            {[
              first,
              ...(last !== first
                ? chartWidth < 420
                  ? [last]
                  : [first + (last - first) / 2, last]
                : []),
            ].map((timestamp, index) => (
              <text
                key={index}
                x={x(timestamp)}
                y="280"
                textAnchor={
                  index === 0 ? "start" : timestamp === last ? "end" : "middle"
                }
                fontSize="12"
                fill="#64748b"
              >
                {dateLabel(timestamp)}
              </text>
            ))}
            <line
              x1={x(selected.timestamp)}
              x2={x(selected.timestamp)}
              y1="30"
              y2="250"
              stroke={color}
              strokeOpacity="0.3"
            />
            <circle
              cx={x(selected.timestamp)}
              cy={y(selected[metal])}
              r="5"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          <label className="sr-only" htmlFor="history-date">
            Explore recorded dates
          </label>
          <input
            id="history-date"
            type="range"
            min="0"
            max={points.length - 1}
            value={selectedIndex}
            onChange={(event) => setActive(Number(event.target.value))}
            aria-valuetext={`${dateLabel(selected.timestamp)}: ${numberLabel(selected[metal])} ${currency}`}
            className="w-full accent-amber-600"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {points.length} recorded days · {dateLabel(first)} –{" "}
            {dateLabel(last)} · UTC. Gaps indicate missing observations; values
            are not estimated.
          </p>
          {!!data?.skippedRecords && (
            <p className="mt-2 text-xs text-amber-700">
              Some archived records could not be read and are excluded.
            </p>
          )}
          <details className="mt-5 text-sm">
            <summary className="cursor-pointer text-muted-foreground">
              View daily values
            </summary>
            <div className="mt-3 max-h-64 overflow-auto">
              <table className="w-full text-left tabular-nums">
                <caption className="sr-only">
                  Recorded daily {metal} nisab in {currency}
                </caption>
                <thead>
                  <tr>
                    <th className="p-2">Date (UTC)</th>
                    <th className="p-2 text-right">{currency}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...points].reverse().map((point) => (
                    <tr key={point.timestamp} className="border-t">
                      <td className="p-2">{dateLabel(point.timestamp)}</td>
                      <td className="p-2 text-right">
                        {numberLabel(point[metal])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}
