"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Plus, X, Sparkles } from "lucide-react";
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
import { generateJson, hasGeminiKey } from "@/lib/api/gemini";
import { INDICES, UNIVERSE, getStock } from "@/lib/universe";

type Range = { id: string; days: number; range: ChartRange; interval: ChartInterval; intraday?: boolean };

// Every range at daily-or-finer resolution: intraday minutes for short
// ranges, hourly candles for 1M/3M, one candle per trading day for 1Y.
const RANGES: Range[] = [
  { id: "1D", days: 1, range: "1d", interval: "5m", intraday: true },
  { id: "3D", days: 3, range: "5d", interval: "15m", intraday: true },
  { id: "1W", days: 7, range: "5d", interval: "30m" },
  { id: "1M", days: 30, range: "1mo", interval: "1h" },
  { id: "3M", days: 90, range: "3mo", interval: "1h" },
  { id: "1Y", days: 365, range: "1y", interval: "1d" },
];

// As fast as the free data source + proxies sustain for a single active
// chart. Yahoo's intraday feed only produces new candles every minute or so,
// so polling faster than this returns identical data and risks a proxy ban.
const INTRADAY_REFRESH_MS = 5_000;
const INTRADAY_REFRESH_LABEL = `${Math.round(INTRADAY_REFRESH_MS / 1000)}s`;
const MAX_COMPARE = 3;
const COMPARE_COLORS = ["#b27a00", "#1d6fb8", "#7c3aed"];
const BASE_COLOR = "#115e3c";

type Series = { symbol: string; candles: { time: number; price: number }[] };
type Row = { time: number; date: string } & Record<string, number | string>;

function formatLabel(time: number, interval: ChartInterval): string {
  const d = new Date(time);
  if (interval !== "1d" && interval !== "1wk") {
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
 * Merge several symbols' candles into shared rows keyed by timestamp.
 * In compare mode every series is normalised to % change from its own first
 * candle in the range (the only honest way to overlay a ₹40 stock and a
 * ₹35,000 index); gaps are forward-filled from the last real value.
 */
function mergeSeries(series: Series[], interval: ChartInterval, normalise: boolean): Row[] {
  const times = [...new Set(series.flatMap((s) => s.candles.map((c) => c.time)))].sort((a, b) => a - b);
  const bases = series.map((s) => s.candles[0]?.price ?? 1);
  const cursors = series.map(() => 0);
  const lastVal: (number | null)[] = series.map(() => null);

  return times.map((t) => {
    const row: Row = { time: t, date: formatLabel(t, interval) };
    series.forEach((s, i) => {
      while (cursors[i] < s.candles.length && s.candles[cursors[i]].time <= t) {
        lastVal[i] = s.candles[cursors[i]].price;
        cursors[i]++;
      }
      if (lastVal[i] != null) {
        row[s.symbol] = normalise
          ? Math.round(((lastVal[i]! - bases[i]) / bases[i]) * 10000) / 100
          : Math.round(lastVal[i]! * 100) / 100;
      }
    });
    return row;
  });
}

function symbolName(sym: string): string {
  return getStock(sym)?.name ?? INDICES.find((i) => i.symbol === sym)?.name ?? sym;
}

/**
 * Real market candles only — spinner while loading, never a placeholder
 * curve. Add up to three other stocks or indices to compare performance
 * (normalised % from range start), with an optional AI read of the result.
 */
export function PriceChart({ symbol }: { symbol: string }) {
  const [range, setRange] = useState<Range>(RANGES[3]); // default to 1M
  const [series, setSeries] = useState<Series[]>([]);
  const [failed, setFailed] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [pickText, setPickText] = useState("");

  const allSymbols = useMemo(() => [symbol, ...compare], [symbol, compare]);
  const comparing = compare.length > 0;

  useEffect(() => {
    setSeries([]);
    setFailed(false);
    let cancelled = false;

    async function load() {
      const results = await Promise.all(
        allSymbols.map(async (sym) => {
          const r = await getChart(sym, range.range, range.interval);
          if (!r || r.candles.length === 0) return null;
          const candles = range.id === "3D" ? trimToRecentTradingDays(r.candles, 3) : r.candles;
          return { symbol: sym, candles };
        }),
      );
      if (cancelled) return;
      const ok = results.filter(Boolean) as Series[];
      if (ok.length === 0) {
        setFailed(true);
        return;
      }
      setFailed(false);
      setSeries(ok);
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
  }, [allSymbols, range]);

  const data = useMemo(
    () => (series.length > 0 ? mergeSeries(series, range.interval, comparing) : []),
    [series, range.interval, comparing],
  );

  // Real performance numbers for the AI read + the legend chips.
  const performance = useMemo(() => {
    return series.map((s) => {
      const first = s.candles[0]?.price;
      const last = s.candles[s.candles.length - 1]?.price;
      const pct = first && last ? ((last - first) / first) * 100 : 0;
      return { symbol: s.symbol, pct: Math.round(pct * 100) / 100 };
    });
  }, [series]);

  const suggestions = useMemo(() => {
    const q = pickText.trim().toLowerCase();
    if (!q) return [];
    const idx = INDICES.filter(
      (i) => !allSymbols.includes(i.symbol) && (i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)),
    ).map((i) => ({ symbol: i.symbol, name: i.name }));
    const stocks = UNIVERSE.filter(
      (s) => !allSymbols.includes(s.symbol) && (s.symbol.toLowerCase().startsWith(q) || s.name.toLowerCase().includes(q)),
    )
      .slice(0, 6)
      .map((s) => ({ symbol: s.symbol, name: s.name }));
    return [...idx, ...stocks].slice(0, 7);
  }, [pickText, allSymbols]);

  function addCompare(sym: string) {
    if (compare.length >= MAX_COMPARE || allSymbols.includes(sym)) return;
    setCompare((c) => [...c, sym]);
    setPickText("");
    setPicking(false);
  }

  const colorFor = (sym: string) =>
    sym === symbol ? BASE_COLOR : COMPARE_COLORS[compare.indexOf(sym) % COMPARE_COLORS.length];

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
              Live · updates every {INTRADAY_REFRESH_LABEL}
            </span>
          )}
          {!comparing && (
            <span className="inline-flex items-center gap-1.5 text-(--color-fg-muted)">
              <span className="h-2 w-4 rounded-full bg-(--color-brand-700)" />
              NSE price
            </span>
          )}
        </div>
      </div>

      {/* Compare bar */}
      <div className="flex flex-wrap items-center gap-2">
        {allSymbols.map((sym) => {
          const perf = performance.find((p) => p.symbol === sym);
          return (
            <span
              key={sym}
              className="inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface) px-2.5 py-1 text-[12px]"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: colorFor(sym) }} />
              <span className="font-semibold text-(--color-fg)">{sym}</span>
              {comparing && perf && (
                <span className={`tabular font-semibold ${perf.pct >= 0 ? "text-(--color-up)" : "text-(--color-down)"}`}>
                  {perf.pct >= 0 ? "+" : ""}
                  {perf.pct.toFixed(2)}%
                </span>
              )}
              {sym !== symbol && (
                <button
                  type="button"
                  onClick={() => setCompare((c) => c.filter((x) => x !== sym))}
                  className="text-(--color-fg-subtle) hover:text-(--color-down)"
                  aria-label={`Remove ${sym}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          );
        })}

        {compare.length < MAX_COMPARE &&
          (picking ? (
            <span className="relative">
              <input
                autoFocus
                value={pickText}
                onChange={(e) => setPickText(e.target.value)}
                onBlur={() => setTimeout(() => setPicking(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && suggestions[0]) addCompare(suggestions[0].symbol);
                  if (e.key === "Escape") setPicking(false);
                }}
                placeholder="Add stock or index…"
                className="h-7 w-48 rounded-full border border-(--color-brand-300) bg-(--color-surface) px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-(--color-brand-50)"
              />
              {suggestions.length > 0 && (
                <ul className="absolute left-0 top-9 z-30 w-64 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) py-1 shadow-[0_18px_40px_-18px_rgba(13,31,23,0.25)]">
                  {suggestions.map((s) => (
                    <li key={s.symbol}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addCompare(s.symbol);
                        }}
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[12.5px] hover:bg-(--color-surface-2)"
                      >
                        <span className="font-semibold">{s.symbol}</span>
                        <span className="ml-2 truncate text-(--color-fg-subtle)">{s.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-(--color-border) px-2.5 py-1 text-[12px] font-semibold text-(--color-fg-muted) hover:border-(--color-brand-300) hover:text-(--color-brand-700)"
            >
              <Plus className="h-3 w-3" /> Compare
            </button>
          ))}
        {comparing && (
          <span className="text-[11px] text-(--color-fg-subtle)">% change since range start</span>
        )}
      </div>

      <div className="h-[360px] w-full">
        {data.length === 0 ? (
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
            <ComposedChart data={data} margin={{ top: 12, right: 20, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#eef1ee" vertical={false} />
              <XAxis dataKey="date" stroke="#7c8a82" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} minTickGap={24} />
              <YAxis
                stroke="#7c8a82"
                tickLine={false}
                axisLine={false}
                domain={comparing ? ["auto", "auto"] : ["dataMin - 10", "dataMax + 10"]}
                tick={{ fontSize: 11 }}
                width={64}
                tickFormatter={(v) =>
                  comparing
                    ? `${Number(v) >= 0 ? "+" : ""}${Number(v).toFixed(1)}%`
                    : `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                }
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
                formatter={(v, name) => [
                  comparing
                    ? `${Number(v) >= 0 ? "+" : ""}${Number(v).toFixed(2)}%`
                    : `₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  String(name),
                ]}
              />
              {allSymbols.map((sym) => (
                <Line
                  key={sym}
                  type="monotone"
                  dataKey={sym}
                  stroke={colorFor(sym)}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {comparing && series.length > 1 && (
        <AiCompareNote rangeId={range.id} performance={performance} />
      )}
    </div>
  );
}

// ---- AI read of a comparison -----------------------------------------------

const compareCache = new Map<string, string>();

function AiCompareNote({
  rangeId,
  performance,
}: {
  rangeId: string;
  performance: { symbol: string; pct: number }[];
}) {
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const keyRef = useRef("");

  const cacheKey = `${rangeId}|${performance.map((p) => `${p.symbol}:${p.pct}`).join(",")}`;
  keyRef.current = cacheKey;

  useEffect(() => {
    setNote(compareCache.get(cacheKey) ?? null);
  }, [cacheKey]);

  if (!hasGeminiKey()) return null;

  async function explain() {
    setLoading(true);
    const lines = performance
      .map((p) => `${p.symbol} (${symbolName(p.symbol)}): ${p.pct >= 0 ? "+" : ""}${p.pct.toFixed(2)}%`)
      .join("\n");
    const result = await generateJson<{ note: string }>(
      [
        {
          role: "user",
          parts: [
            {
              text: `An investor is comparing these NSE instruments over the last ${rangeId}. Their REAL price performance over exactly this window:

${lines}

In 2-3 educational sentences, compare how they've moved relative to each other and what a beginner should take from it. No advice, no invented numbers beyond those given. Respond as JSON: { "note": string }`,
            },
          ],
        },
      ],
      { temperature: 0.4 },
    );
    if (result?.note && keyRef.current === cacheKey) {
      compareCache.set(cacheKey, result.note);
      setNote(result.note);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-(--color-brand-100) bg-(--color-brand-50)/40 p-3">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-(--color-brand-700)" />
      <div className="min-w-0 flex-1 text-[13px] leading-relaxed">
        {note ? (
          <p className="text-(--color-fg)">{note}</p>
        ) : (
          <button
            type="button"
            onClick={explain}
            disabled={loading}
            className="inline-flex items-center gap-2 font-semibold text-(--color-brand-700) hover:underline disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading the comparison…
              </>
            ) : (
              <>Explain this comparison with AI</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
