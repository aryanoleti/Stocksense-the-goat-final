"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getQuotes } from "@/lib/api/yahoo";

// A seamless marquee of real tickers. Server markup shows "—" placeholders
// (deterministic — no hydration mismatch, no reference prices); real quotes
// hydrate in after mount. Hovering pauses the strip; clicking opens the stock
// (which asks visitors to sign in first — that's the funnel).
const PICKS = [
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN", "BHARTIARTL",
  "ITC", "LT", "TATAMOTORS", "MARUTI", "SUNPHARMA", "ADANIENT", "TITAN",
  "DMART", "ZOMATO", "BAJFINANCE", "HINDUNILVR", "JIOFIN", "TATASTEEL",
  "GOLDBEES", "SILVERBEES",
];

type Item = { symbol: string; price: number | null; delta: number | null };

const INITIAL: Item[] = PICKS.map((sym) => ({ symbol: sym, price: null, delta: null }));

const REFRESH_MS = 30_000;

export function TickerStrip() {
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function pull() {
      const quotes = await getQuotes(PICKS);
      if (cancelled || Object.keys(quotes).length === 0) return;
      setItems((prev) =>
        prev.map((it) => {
          const q = quotes[it.symbol];
          return q ? { ...it, price: q.price, delta: q.changePct } : it;
        }),
      );
      setLive(true);
    }
    pull();
    const id = setInterval(pull, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const row = [...items, ...items]; // duplicated for a seamless -50% loop
  return (
    <div className="group relative overflow-hidden border-y border-(--color-border) bg-(--color-surface)/80 py-3 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-(--color-bg) to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-(--color-bg) to-transparent" />
      {live && (
        <span className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-1.5 rounded-full border border-(--color-up)/30 bg-(--color-up-soft) px-2 py-0.5 text-[10px] font-semibold text-(--color-up) sm:inline-flex">
          <span className="h-1 w-1 rounded-full bg-(--color-up) animate-pulse-dot" />
          Live
        </span>
      )}
      <div className="flex w-max animate-marquee items-center gap-2 whitespace-nowrap group-hover:[animation-play-state:paused]">
        {row.map((it, i) => {
          const up = (it.delta ?? 0) >= 0;
          return (
            <Link
              key={`${it.symbol}-${i}`}
              href={`/stocks/${it.symbol}`}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-[13px] transition-colors hover:bg-(--color-surface-2)"
              title={`Open ${it.symbol}`}
            >
              <span className="font-semibold tracking-tight text-(--color-fg)">{it.symbol}</span>
              <span className="tabular text-(--color-fg-muted)">
                {it.price != null ? `₹${it.price.toLocaleString("en-IN")}` : "—"}
              </span>
              {it.delta == null ? (
                <span className="tabular text-(--color-fg-subtle)">—</span>
              ) : (
                <span className={`tabular font-semibold ${up ? "text-(--color-up)" : "text-(--color-down)"}`}>
                  {up ? "▲" : "▼"} {Math.abs(it.delta).toFixed(2)}%
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
