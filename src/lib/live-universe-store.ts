"use client";

import { useSyncExternalStore } from "react";
import { getQuotes } from "@/lib/api/yahoo";
import { NIFTY_50 } from "@/lib/mock-data";

export type Tick = { price: number; change: number; changePct: number };

const BATCH_REFRESH_MS = 45_000;
const JITTER_MS = 1_500;
const VOLATILITY = 0.0025;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function jitter(price: number, prevClose: number): Tick {
  const drift = (Math.random() - 0.5) * 2 * VOLATILITY * price;
  const next = Math.max(price * 0.998, Math.min(price * 1.002, price + drift));
  const change = next - prevClose;
  const changePct = prevClose ? (change / prevClose) * 100 : 0;
  return { price: round2(next), change: round2(change), changePct: round2(changePct) };
}

let prices: Record<string, Tick> = Object.fromEntries(
  NIFTY_50.map((s) => [s.symbol, { price: s.basePrice, change: 0, changePct: 0 }]),
);
const anchors: Record<string, { price: number; prevClose: number }> = Object.fromEntries(
  NIFTY_50.map((s) => [s.symbol, { price: s.basePrice, prevClose: s.basePrice }]),
);

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function getSnapshot() {
  return prices;
}

let started = false;

/**
 * One shared poller for the entire tracked universe, regardless of how many
 * components on a page want "all stocks" data (movers, breadth, the stock
 * grid) — so the free CORS proxies see one batch cycle, not one per consumer.
 */
function ensureStarted() {
  if (started || typeof window === "undefined") return;
  started = true;

  async function pull() {
    const quotes = await getQuotes(NIFTY_50.map((s) => s.symbol));
    const next = { ...prices };
    for (const s of NIFTY_50) {
      const q = quotes[s.symbol];
      if (q) {
        anchors[s.symbol] = { price: q.price, prevClose: q.previousClose };
        next[s.symbol] = { price: round2(q.price), change: round2(q.change), changePct: round2(q.changePct) };
      }
    }
    prices = next;
    notify();
  }

  pull();
  setInterval(pull, BATCH_REFRESH_MS);

  setInterval(() => {
    const next = { ...prices };
    for (const s of NIFTY_50) {
      const a = anchors[s.symbol];
      next[s.symbol] = jitter(a.price, a.prevClose);
    }
    prices = next;
    notify();
  }, JITTER_MS);
}

/** Live ticks for the whole tracked universe — shared across every consumer. */
export function useUniversePrices() {
  ensureStarted();
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
