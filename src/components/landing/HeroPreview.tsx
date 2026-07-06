"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getChart } from "@/lib/api/yahoo";
import { formatINR } from "@/lib/format";

const DEMO_SYMBOLS = ["RELIANCE", "TCS", "HDFCBANK", "INFY"] as const;
const DEMO_NAMES: Record<string, string> = {
  RELIANCE: "Reliance Industries",
  TCS: "Tata Consultancy Services",
  HDFCBANK: "HDFC Bank",
  INFY: "Infosys",
};
const REFRESH_MS = 20_000;

type DemoStock = (typeof DEMO_SYMBOLS)[number];
type Point = { t: number; y: number };
type LiveState = {
  price: number;
  changePct: number;
  dayHigh?: number;
  dayLow?: number;
  week52High?: number;
  week52Low?: number;
  previousClose?: number;
  series: Point[];
  live: boolean; // true once real API data has arrived
};

// Nothing renders as data until real data exists — the card opens in a
// loading state, never on a synthetic curve or a canned price.
const EMPTY: LiveState = { price: 0, changePct: 0, series: [], live: false };

export function HeroPreview() {
  const [symbol, setSymbol] = useState<DemoStock>("RELIANCE");
  const [state, setState] = useState<LiveState>(EMPTY);
  const reduce = useReducedMotion();

  // Pull a real quote + 1D intraday series for the selected stock.
  useEffect(() => {
    let cancelled = false;
    setState(EMPTY);

    async function load() {
      const r = await getChart(symbol, "1d", "5m");
      if (cancelled || !r || r.candles.length < 2) return;
      setState({
        price: r.quote.price,
        changePct: r.quote.changePct,
        dayHigh: r.quote.dayHigh,
        dayLow: r.quote.dayLow,
        week52High: r.quote.fiftyTwoWeekHigh,
        week52Low: r.quote.fiftyTwoWeekLow,
        previousClose: r.quote.previousClose,
        series: r.candles.map((c) => ({ t: c.time, y: Math.round(c.price * 100) / 100 })),
        live: true,
      });
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  // Cursor-follow tilt. Springs keep it soft; disabled for reduced motion.
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 150, damping: 20 });

  function onMouseMove(e: React.MouseEvent) {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function onMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  const name = DEMO_NAMES[symbol];
  const up = state.changePct >= 0;
  const accent = up ? "#088a52" : "#c4361c";

  const yDomain = useMemo(() => {
    if (state.series.length === 0) return [0, 1] as [number, number];
    const ys = state.series.map((p) => p.y);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const pad = Math.max((max - min) * 0.15, max * 0.001);
    return [min - pad, max + pad] as [number, number];
  }, [state.series]);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div style={{ perspective: 1100 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="absolute -inset-6 -z-10 rounded-[36px] bg-white/5 blur-2xl" />
        <div className="rounded-[28px] border border-white/12 bg-white/[0.03] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
          <div className="rounded-[22px] bg-white p-5">
            {/* Stock switcher */}
            <div className="flex items-center gap-1 rounded-xl bg-[#f4f6f4] p-1">
              {DEMO_SYMBOLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSymbol(s)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[11.5px] font-semibold tracking-tight transition-colors ${
                    s === symbol ? "bg-white text-[#0c4a30] shadow-sm" : "text-[#7c8a82] hover:text-[#4a5a51]"
                  }`}
                  aria-pressed={s === symbol}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Header */}
            <div className="mt-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ecf6f0] text-[13px] font-semibold text-[#0c4a30]">
                  {initials}
                </span>
                <div>
                  <p className="text-[13px] font-semibold leading-tight text-[#0d1f17]">{name}</p>
                  <p className="text-[11.5px] leading-tight text-[#7c8a82]">{symbol} • NSE</p>
                </div>
              </div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: up ? "#e6f4ec" : "#fbece8", color: accent }}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ background: accent }} />
                {state.live ? "Live" : "Loading"}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <p className="text-[34px] font-semibold tabular tracking-tight text-[#0d1f17]">
                {state.live ? `₹${formatINR(state.price, { decimals: 2 })}` : "—"}
              </p>
              {state.live && (
                <span className="inline-flex items-center gap-0.5 text-[13px] font-semibold tabular" style={{ color: accent }}>
                  {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {up ? "+" : ""}
                  {state.changePct.toFixed(2)}%
                </span>
              )}
            </div>

            {/* Chart — hover for exact time + price. Shimmers until real candles land. */}
            <div className="mt-3 h-32">
              {!state.live ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-[#f4f6f4]" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={state.series} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hpFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accent} stopOpacity={0.26} />
                        <stop offset="100%" stopColor={accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={yDomain} hide />
                    <Tooltip
                      cursor={{ stroke: "#d2d9d3", strokeDasharray: "3 3" }}
                      contentStyle={{
                        border: "1px solid #e3e8e4",
                        borderRadius: 10,
                        fontSize: 11.5,
                        padding: "6px 9px",
                        background: "#ffffff",
                        color: "#0d1f17",
                      }}
                      labelFormatter={(t) =>
                        new Date(Number(t)).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                      }
                      formatter={(v) => [`₹${formatINR(Number(v), { decimals: 2 })}`, symbol]}
                    />
                    <Area
                      type="monotone"
                      dataKey="y"
                      stroke={accent}
                      strokeWidth={2}
                      fill="url(#hpFill)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Live quote facts — real numbers or nothing */}
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#e3e8e4] pt-3 text-center">
              <Mini label="Prev close" value={state.previousClose != null ? `₹${formatINR(state.previousClose, { decimals: 0 })}` : "—"} />
              <Mini label="52W low" value={state.week52Low != null ? `₹${formatINR(state.week52Low, { decimals: 0 })}` : "—"} />
              <Mini label="52W high" value={state.week52High != null ? `₹${formatINR(state.week52High, { decimals: 0 })}` : "—"} />
            </div>

            {/* Today, computed from the live quote — no canned analysis */}
            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#ecf6f0] p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#0c4a30]" />
              <div>
                <p className="text-[12px] font-semibold text-[#093a26]">Today</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-[#093a26]/85">
                  {state.live ? (
                    <>
                      {symbol} is {up ? "up" : "down"} {Math.abs(state.changePct).toFixed(2)}% today
                      {state.dayLow != null && state.dayHigh != null && (
                        <>
                          {" "}
                          · day range ₹{formatINR(state.dayLow, { decimals: 0 })}–₹
                          {formatINR(state.dayHigh, { decimals: 0 })}
                        </>
                      )}
                      . Sign in to ask the AI about it.
                    </>
                  ) : (
                    "Fetching the live quote — this card is the real product, not a mock-up."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#7c8a82]">{label}</p>
      <p className="mt-0.5 text-[12.5px] font-semibold tabular text-[#0d1f17]">{value}</p>
    </div>
  );
}
