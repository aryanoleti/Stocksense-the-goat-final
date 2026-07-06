"use client";

import { useSyncExternalStore } from "react";
import { getQuotes } from "@/lib/api/yahoo";
import { POLL_ORDER, UNIVERSE_COUNT } from "@/lib/universe";

export type Tick = { price: number; change: number; changePct: number };

// The whole-universe sweep is paced for free CORS proxies: 100 symbols per
// slice (5 spark requests of 20), a breather between slices, and a longer
// pause between full sweeps. Priority symbols (Nifty 500 + curated) are at
// the front of POLL_ORDER, so movers/breadth/heatmap fill within seconds
// while the long tail streams in behind them.
const SLICE_SIZE = 100;
const SLICE_GAP_MS = 2_500;
const SWEEP_PAUSE_MS = 90_000;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

let prices: Record<string, Tick> = {};
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * One shared poller for the entire tracked universe, regardless of how many
 * components on a page want "all stocks" data (movers, breadth, the stock
 * grid) — so the free CORS proxies see one rolling sweep, not one per
 * consumer. Every value in the store came from a real market response;
 * symbols Yahoo hasn't answered for yet are simply absent.
 */
function ensureStarted() {
  if (started || typeof window === "undefined") return;
  started = true;

  async function sweepForever() {
    for (;;) {
      for (let i = 0; i < POLL_ORDER.length; i += SLICE_SIZE) {
        const slice = POLL_ORDER.slice(i, i + SLICE_SIZE);
        try {
          // Each 20-symbol chunk lands in the store as soon as it arrives.
          await getQuotes(slice, (partial) => {
            const next = { ...prices };
            for (const [sym, q] of Object.entries(partial)) {
              next[sym] = { price: round2(q.price), change: round2(q.change), changePct: round2(q.changePct) };
            }
            prices = next;
            notify();
          });
        } catch {
          /* proxy hiccup — the next slice/sweep retries */
        }
        if (i + SLICE_SIZE < POLL_ORDER.length) await sleep(SLICE_GAP_MS);
      }
      await sleep(SWEEP_PAUSE_MS);
    }
  }

  sweepForever();
}

/** Live ticks for the whole tracked universe — shared across every consumer. */
export function useUniversePrices() {
  ensureStarted();
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** How much of the universe has live data right now (for honest UI labels). */
export function coverageOf(p: Record<string, Tick>): { live: number; total: number } {
  return { live: Object.keys(p).length, total: UNIVERSE_COUNT };
}
