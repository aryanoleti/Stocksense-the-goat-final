"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Radio } from "lucide-react";
import { useLivePrices } from "@/lib/use-live-prices";
import { getStock, POLL_ORDER } from "@/lib/universe";
import { Reveal } from "./Reveal";

const PulseGlobeCanvas = dynamic(() => import("./three/PulseGlobeCanvas"), {
  ssr: false,
  loading: () => null,
});

// A live sample of the 100 highest-priority NSE names (Nifty 500 first) —
// enough for honest breadth without sweeping the whole exchange from the
// landing page.
const SAMPLE = POLL_ORDER.slice(0, 100);

const EASE = [0.22, 1, 0.36, 1] as const;

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function MarketPulse() {
  const reduce = useReducedMotion();
  const [use3d, setUse3d] = useState(false);
  const prices = useLivePrices(SAMPLE);

  useEffect(() => {
    if (!reduce && webglAvailable()) setUse3d(true);
  }, [reduce]);

  const stats = useMemo(() => {
    const ticks = Object.entries(prices);
    if (ticks.length === 0) return null;
    let up = 0;
    let best: [string, number] | null = null;
    let worst: [string, number] | null = null;
    for (const [sym, t] of ticks) {
      if (t.changePct > 0) up++;
      if (!best || t.changePct > best[1]) best = [sym, t.changePct];
      if (!worst || t.changePct < worst[1]) worst = [sym, t.changePct];
    }
    return {
      live: ticks.length,
      up,
      down: ticks.length - up,
      upShare: up / ticks.length,
      best,
      worst,
    };
  }, [prices]);

  return (
    <section className="relative isolate overflow-hidden bg-(--color-brand-950)">
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-(--color-brand-500)/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:py-32">
        <div className="relative z-10">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-(--color-brand-300)">
              <Radio className="h-3.5 w-3.5" /> Market pulse
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl md:text-[56px] md:leading-[1.05]">
              Markets,
              <span className="block text-(--color-brand-200)">made legible.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-white/65">
              Every dot is market breadth you can touch — green for advancing stocks, red for
              declining, sampled live from {SAMPLE.length}{" "}
              of the NSE&apos;s most liquid names. Drag the globe. Watch it change as the market does.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-9 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <PulseStat
                label="Advancing"
                value={stats ? String(stats.up) : "—"}
                tone="up"
              />
              <PulseStat
                label="Declining"
                value={stats ? String(stats.down) : "—"}
                tone="down"
              />
              <PulseStat label="Live quotes" value={stats ? String(stats.live) : "—"} />
            </dl>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {stats?.best && (
                <MoverChip
                  symbol={stats.best[0]}
                  pct={stats.best[1]}
                  up
                />
              )}
              {stats?.worst && stats.worst[1] < 0 && (
                <MoverChip symbol={stats.worst[0]} pct={stats.worst[1]} up={false} />
              )}
              {!stats && (
                <span className="rounded-full border border-white/12 px-3 py-1 text-[12px] text-white/50">
                  Fetching live quotes…
                </span>
              )}
            </div>
          </Reveal>
        </div>

        <motion.div
          className="relative h-[380px] sm:h-[460px] md:h-[520px]"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {use3d ? (
            <PulseGlobeCanvas upShare={stats ? stats.upShare : null} />
          ) : (
            <StaticPulse upShare={stats ? stats.upShare : null} />
          )}
        </motion.div>
      </div>
    </section>
  );
}

function PulseStat({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  const color = tone === "up" ? "text-(--color-up)" : tone === "down" ? "text-[#f2795c]" : "text-white";
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</dt>
      <dd className={`mt-1 text-3xl font-semibold tracking-tight tabular ${color}`}>{value}</dd>
    </div>
  );
}

function MoverChip({ symbol, pct, up }: { symbol: string; pct: number; up: boolean }) {
  const name = getStock(symbol)?.name;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[12px] text-white/85"
      title={name}
    >
      {up ? (
        <ArrowUpRight className="h-3.5 w-3.5 text-(--color-up)" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5 text-[#f2795c]" />
      )}
      <span className="font-semibold">{symbol}</span>
      <span className={`tabular font-semibold ${up ? "text-(--color-up)" : "text-[#f2795c]"}`}>
        {pct >= 0 ? "+" : ""}
        {pct.toFixed(2)}%
      </span>
    </span>
  );
}

/** Reduced-motion / no-WebGL stand-in: a static dot lattice, same real tint ratio. */
function StaticPulse({ upShare }: { upShare: number | null }) {
  const dots = useMemo(() => {
    return Array.from({ length: 240 }).map((_, i) => {
      const h = ((i * 2654435761) >>> 0) / 4294967295;
      const angle = i * 2.39996; // golden angle spiral
      const r = Math.sqrt(i / 240) * 46;
      let color = "rgba(180,200,190,0.4)";
      if (upShare != null) {
        if (h < upShare * 0.92) color = "rgba(74,222,128,0.75)";
        else if (h > 1 - (1 - upShare) * 0.92) color = "rgba(242,121,92,0.7)";
      }
      // Fixed precision so server- and client-rendered attribute strings are
      // byte-identical (raw Math.sin output formats differently across engines).
      return {
        x: (50 + Math.cos(angle) * r * 0.9).toFixed(2),
        y: (50 + Math.sin(angle) * r * 0.82).toFixed(2),
        color,
        size: 2 + (i % 3),
      };
    });
  }, [upShare]);

  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-full max-h-[440px] w-full max-w-[440px]">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.size / 10} fill={d.color} />
        ))}
      </svg>
    </div>
  );
}
