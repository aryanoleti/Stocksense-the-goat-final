"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateForecast, generatePriceHistory } from "@/lib/mock-data";

const RANGES = [
  { id: "1W", days: 7 },
  { id: "1M", days: 30 },
  { id: "3M", days: 90 },
  { id: "1Y", days: 365 },
];

export function PriceChart({ symbol, basePrice }: { symbol: string; basePrice: number }) {
  const [range, setRange] = useState("1M");
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(1);
  const days = RANGES.find((r) => r.id === range)!.days;
  const history = useMemo(() => generatePriceHistory(basePrice, days, seed), [basePrice, days, seed]);
  const forecast = useMemo(() => generateForecast(history[history.length - 1].price, 7, seed), [history, seed]);

  const data = useMemo(() => {
    const merged: Array<{ date: string; price?: number; forecast?: number }> = history.map((h) => ({
      date: h.date,
      price: h.price,
    }));
    // bridge last historical point into the forecast line
    const last = history[history.length - 1];
    merged.push({ date: last.date, price: last.price, forecast: last.price });
    forecast.forEach((f) => merged.push({ date: f.date, forecast: f.price }));
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
              onClick={() => setRange(r.id)}
              className={`rounded-md px-3 py-1 text-[12px] font-semibold ${
                range === r.id
                  ? "bg-(--color-surface) text-(--color-fg) shadow-xs"
                  : "text-(--color-fg-subtle) hover:text-(--color-fg-muted)"
              }`}
            >
              {r.id}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          <span className="inline-flex items-center gap-1.5 text-(--color-fg-muted)">
            <span className="h-2 w-4 rounded-full bg-(--color-brand-700)" />
            Historical price
          </span>
          <span className="inline-flex items-center gap-1.5 text-(--color-fg-muted)">
            <span className="inline-block h-2 w-4 rounded-full" style={{ background: "repeating-linear-gradient(90deg, #b27a00 0 4px, transparent 4px 8px)" }} />
            AI forecast (7 days)
          </span>
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

      <div className="flex items-start gap-2 rounded-xl bg-(--color-surface-2) p-3 text-[12.5px] text-(--color-fg-muted)">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-warn)_18%,white)] text-(--color-warn)">⚠</span>
        <p>
          <span className="font-semibold text-(--color-fg)">AI Forecast:</span> the orange dashed line is a simulated
          7-day price projection generated by an AI based on current momentum and historical patterns. This is for
          educational purposes only and is not financial advice.
        </p>
      </div>
    </div>
  );
}
