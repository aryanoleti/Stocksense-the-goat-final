"use client";

import { useEffect, useMemo, useState } from "react";
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
import { generateForecast, generatePriceHistory, generateIntraday } from "@/lib/mock-data";

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

export function PriceChart({ symbol, basePrice }: { symbol: string; basePrice: number }) {
  const [range, setRange] = useState<Range>(RANGES[3]); // default to 1M
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(1);

  const mockHistory = useMemo<HistoryPoint[]>(() => {
    if (range.intraday) {
      // Just a brief loading placeholder shape — real data supersedes this almost immediately.
      return generateIntraday(basePrice, 78, seed).map((p, i) => ({
        date: p.time,
        time: Date.now() - (78 - i) * 5 * 60 * 1000,
        price: p.price,
      }));
    }
    return generatePriceHistory(basePrice, range.days, seed).map((p, i, arr) => ({
      date: p.date,
      time: Date.now() - (arr.length - i) * 24 * 60 * 60 * 1000,
      price: p.price,
    }));
  }, [basePrice, range, seed]);
  const [history, setHistory] = useState<HistoryPoint[]>(mockHistory);

  useEffect(() => {
    setHistory(mockHistory);
    let cancelled = false;

    async function load() {
      const r = await getChart(symbol, range.range, range.interval);
      if (cancelled || !r || r.candles.length === 0) return;
      const candles = range.id === "3D" ? trimToRecentTradingDays(r.candles, 3) : r.candles;
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
  }, [symbol, range, mockHistory]);

  const forecast = useMemo(() => {
    if (range.intraday) return []; // forecast is a daily-horizon concept, not meaningful on 1D/3D
    const last = history[history.length - 1];
    if (!last) return [];
    return generateForecast(last.price, 7, seed).map((f, i) => ({
      date: f.date,
      time: last.time + (i + 1) * 24 * 60 * 60 * 1000,
      price: f.price,
    }));
  }, [history, seed, range.intraday]);

  const data = useMemo(() => {
    if (history.length === 0) return [];
    const merged: Array<{ date: string; time: number; price?: number; forecast?: number }> = history.map((h) => ({
      date: h.date,
      time: h.time,
      price: h.price,
    }));
    const last = history[history.length - 1];
    if (forecast.length > 0) {
      merged.push({ date: last.date, time: last.time, price: last.price, forecast: last.price });
      forecast.forEach((f) => merged.push({ date: f.date, time: f.time, forecast: f.price }));
    }
    return merged;
  }, [history, forecast]);

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
            Historical price
          </span>
          {forecast.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-(--color-fg-muted)">
              <span className="inline-block h-2 w-4 rounded-full" style={{ background: "repeating-linear-gradient(90deg, #b27a00 0 4px, transparent 4px 8px)" }} />
              AI forecast (7 days)
            </span>
          )}
        </div>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 20, left: 4, bottom: 0 }}>
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
              formatter={(v, n) => [`₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, n === "price" ? "Historical" : "AI forecast"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#115e3c"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#b27a00"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2, fill: "#b27a00" }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {forecast.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl bg-(--color-surface-2) p-3 text-[12.5px] text-(--color-fg-muted)">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-warn)_18%,white)] text-(--color-warn)">⚠</span>
          <p>
            <span className="font-semibold text-(--color-fg)">AI Forecast:</span> the orange dashed line is a simulated
            7-day price projection generated by an AI based on current momentum and historical patterns. This is for
            educational purposes only and is not financial advice.
          </p>
        </div>
      )}
    </div>
  );
}
