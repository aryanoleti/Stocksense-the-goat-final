"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getChart, type ChartInterval, type ChartRange } from "@/lib/api/yahoo";

type Range = { id: string; days: number; range: ChartRange; interval: ChartInterval; intraday?: boolean };

const RANGES: Range[] = [
  { id: "1D", days: 1, range: "1d", interval: "5m", intraday: true },
  { id: "3D", days: 3, range: "5d", interval: "15m", intraday: true },
  { id: "1W", days: 7, range: "5d", interval: "30m" },
  { id: "1M", days: 30, range: "1mo", interval: "1d" },
  { id: "3M", days: 90, range: "3mo", interval: "1d" },
  { id: "1Y", days: 365, range: "1y", interval: "1d" },
];

const INTRADAY_REFRESH_MS = 30_000;

type HistoryPoint = { date: string; time: number; price: number };

function formatLabel(time: number, interval: ChartInterval): string {
  const d = new Date(time);
  if (interval === "30m" || interval === "1h" || interval === "5m" || interval === "15m") {
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/** Keep only the most recent `days` distinct trading dates present in the candles. */
function trimToRecentTradingDays(candles: { time: number; price: number }[], days: number) {
  const dateKey = (t: number) => new Date(t).toDateString();
  const uniqueDates = Array.from(new Set(candles.map((c) => dateKey(c.time))));
  const keep = new Set(uniqueDates.slice(-days));
  return candles.filter((c) => keep.has(dateKey(c.time)));
}

/**
 * Real market candles only. While the API is loading there's a spinner, not a
 * placeholder curve — nothing on this chart is ever synthetic.
 */
export function PriceChart({ symbol }: { symbol: string }) {
  const [range, setRange] = useState<Range>(RANGES[3]); // default to 1M
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setHistory([]);
    setFailed(false);
    let cancelled = false;

    async function load() {
      const r = await getChart(symbol, range.range, range.interval);
      if (cancelled) return;
      if (!r || r.candles.length === 0) {
        setFailed(true);
        return;
      }
      const candles = range.id === "3D" ? trimToRecentTradingDays(r.candles, 3) : r.candles;
      setFailed(false);
      setHistory(
        candles.map((c) => ({
          date: formatLabel(c.time, range.interval),
          time: c.time,
          price: Math.round(c.price * 100) / 100,
        })),
      );
    }

    load();
    if (range.intraday) {
      const id = setInterval(load, INTRADAY_REFRESH_MS);
      return () => {
        cancelled = true;
        clearInterval(id);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface-2) p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1 text-[12px] font-semibold ${
                range.id === r.id
                  ? "bg-(--color-surface) text-(--color-fg) shadow-xs"
                  : "text-(--color-fg-subtle) hover:text-(--color-fg-muted)"
              }`}
            >
              {r.id}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          {range.intraday && (
            <span className="inline-flex items-center gap-1.5 text-(--color-fg-muted)">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-(--color-up) animate-pulse-dot" />
              </span>
              Live · updates every 30s
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-(--color-fg-muted)">
            <span className="h-2 w-4 rounded-full bg-(--color-brand-700)" />
            NSE price
          </span>
        </div>
      </div>

      <div className="h-[360px] w-full">
        {history.length === 0 ? (
          <div className="grid h-full w-full place-items-center rounded-xl border border-dashed border-(--color-border)">
            {failed ? (
              <p className="max-w-sm px-6 text-center text-[13px] text-(--color-fg-muted)">
                Couldn&apos;t load market data for this range right now — the free data proxies may be
                rate-limiting. It retries automatically.
              </p>
            ) : (
              <p className="inline-flex items-center gap-2 text-[13px] text-(--color-fg-muted)">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading live market data…
              </p>
            )}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={history} margin={{ top: 12, right: 20, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#eef1ee" vertical={false} />
              <XAxis dataKey="date" stroke="#7c8a82" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} minTickGap={24} />
              <YAxis
                stroke="#7c8a82"
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 10", "dataMax + 10"]}
                tick={{ fontSize: 11 }}
                width={64}
                tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  boxShadow: "0 12px 30px -16px rgba(13,31,23,0.18)",
                  fontSize: 12,
                  padding: "8px 10px",
                }}
                labelStyle={{ color: "var(--color-fg-subtle)", fontSize: 11 }}
                labelFormatter={(_label, payload) => {
                  const t = payload?.[0]?.payload?.time;
                  if (typeof t !== "number") return _label;
                  return new Date(t).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }}
                formatter={(v) => [`₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#115e3c"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
