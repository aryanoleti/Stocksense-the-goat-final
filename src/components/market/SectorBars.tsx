"use client";

import { useMemo } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { UNIVERSE } from "@/lib/universe";
import { useUniversePrices } from "@/lib/live-universe-store";

const MIN_STOCKS_PER_SECTOR = 3;
const MAX_SECTORS = 12;

const sectorBySymbol = new Map(UNIVERSE.map((s) => [s.symbol, s.sector]));

/**
 * Sector performance computed live: the average change% of every stock with
 * a real quote, grouped by sector. No hardcoded numbers — the bars appear as
 * the universe sweep delivers data.
 */
export function SectorBars() {
  const prices = useUniversePrices();

  const data = useMemo(() => {
    const agg: Record<string, { sum: number; n: number }> = {};
    for (const [sym, tick] of Object.entries(prices)) {
      const sector = sectorBySymbol.get(sym);
      if (!sector || sector === "Other") continue;
      const a = (agg[sector] ??= { sum: 0, n: 0 });
      a.sum += tick.changePct;
      a.n += 1;
    }
    return Object.entries(agg)
      .filter(([, a]) => a.n >= MIN_STOCKS_PER_SECTOR)
      .map(([sector, a]) => ({ sector, change: Math.round((a.sum / a.n) * 100) / 100, n: a.n }))
      .sort((a, b) => b.n - a.n)
      .slice(0, MAX_SECTORS)
      .sort((a, b) => b.change - a.change);
  }, [prices]);

  if (data.length === 0) {
    return (
      <div className="grid h-72 w-full place-items-center text-[13px] text-(--color-fg-muted)">
        Waiting for live sector data…
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: 4, bottom: 0 }}>
          <XAxis dataKey="sector" stroke="#7c8a82" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis stroke="#7c8a82" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit="%" width={36} />
          <Tooltip
            cursor={{ fill: "rgba(17, 94, 60, 0.06)" }}
            contentStyle={{
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              boxShadow: "0 12px 30px -16px rgba(13,31,23,0.18)",
              fontSize: 12,
              padding: "8px 10px",
            }}
            formatter={(v, _n, item) => {
              const n = Number(v);
              const count = (item?.payload as { n?: number } | undefined)?.n;
              return [`${n >= 0 ? "+" : ""}${n.toFixed(2)}% (avg of ${count ?? "?"} stocks)`, "Change"];
            }}
            labelStyle={{ color: "var(--color-fg-subtle)", fontSize: 11 }}
          />
          <Bar dataKey="change" radius={[6, 6, 0, 0]}>
            {data.map((s) => (
              <Cell key={s.sector} fill={s.change >= 0 ? "#1f7a4f" : "#c4361c"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
