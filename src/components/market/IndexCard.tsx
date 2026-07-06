"use client";

import { useEffect, useState } from "react";
import { useLivePrice } from "@/lib/use-live-prices";
import { getChart } from "@/lib/api/yahoo";
import { DeltaValue } from "@/components/ui/Delta";
import { formatINR } from "@/lib/format";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

type Props = {
  symbol: string;
  name: string;
  highlight?: boolean;
};

const SPARK_REFRESH_MS = 60_000;

/** Real intraday candles for the day's sparkline — no synthetic data. */
function useIntradaySpark(symbol: string) {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const r = await getChart(symbol, "1d", "5m");
      if (cancelled || !r || r.candles.length === 0) return;
      setData(r.candles.map((c, i) => ({ x: i, y: c.price })));
    }
    load();
    const id = setInterval(load, SPARK_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  return data;
}

export function IndexCard({ symbol, name, highlight }: Props) {
  const tick = useLivePrice(symbol);
  const data = useIntradaySpark(symbol);
  const up = (tick?.changePct ?? 0) >= 0;
  const color = up ? "#088a52" : "#c4361c";
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-(--color-surface) p-5 transition-all ${
        highlight ? "border-(--color-brand-300) shadow-[0_18px_38px_-22px_rgba(13,31,23,0.18)]" : "border-(--color-border)"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-(--color-fg-subtle)">
            {symbol}
          </p>
          <p className="mt-0.5 text-[12.5px] text-(--color-fg-muted)">{name}</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold tracking-tight"
          style={
            tick
              ? { background: up ? "var(--color-up-soft)" : "var(--color-down-soft)", color }
              : { background: "var(--color-surface-2)", color: "var(--color-fg-subtle)" }
          }
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ background: tick ? color : "var(--color-fg-subtle)" }} />
          {tick ? "Live" : "Loading"}
        </span>
      </div>
      <p className="mt-3 text-[26px] font-semibold tabular tracking-tight text-(--color-fg)">
        {tick ? formatINR(tick.price, { decimals: 2 }) : "—"}
      </p>
      <div className="mt-1 h-5">
        {tick && <DeltaValue value={tick.change} pct={tick.changePct} />}
      </div>
      <div className="-mx-2 mt-2 h-14">
        {data.length > 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={`ic-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
              <Area
                type="monotone"
                dataKey="y"
                stroke={color}
                strokeWidth={1.75}
                fill={`url(#ic-${symbol})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
