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
const SLICE_GAP_MS = 2_000;
const SWEEP_PAUSE_MS = 45_000;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

let prices: Record<string, Tick> = {};
// When each symbol last got fresh data — lets on-demand requests skip
// anything the sweep already covered moments ago.
const lastAt: Record<string, number> = {};
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
            const now = Date.now();
            for (const [sym, q] of Object.entries(partial)) {
              next[sym] = { price: round2(q.price), change: round2(q.change), changePct: round2(q.changePct) };
              lastAt[sym] = now;
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

// ---- On-demand priority lane ------------------------------------------------
// The rolling sweep takes minutes to reach the long tail; components that
// KNOW which symbols the user is looking at (the stock grid as it scrolls)
// push them through here for immediate fetching. Deduped against fresh data
// and against symbols already queued.

const ON_DEMAND_TTL_MS = 15_000;
let demandQueue: string[] = [];
const queued = new Set<string>();
let demandRunning = false;

/** Fetch these symbols now (viewport priority), skipping anything fresh. */
export function requestQuotes(symbols: string[]) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const want = symbols.filter((s) => now - (lastAt[s] ?? 0) > ON_DEMAND_TTL_MS && !queued.has(s));
  if (want.length === 0) return;
  for (const s of want) queued.add(s);
  demandQueue.push(...want);
  void pumpDemand();
}

async function pumpDemand() {
  if (demandRunning) return;
  demandRunning = true;
  try {
    while (demandQueue.length > 0) {
      const batch = demandQueue.splice(0, 100);
      const now = Date.now();
      // Mark up front so a scroll flurry doesn't re-queue in-flight symbols.
      for (const s of batch) lastAt[s] = now;
      try {
        await getQuotes(batch, (partial) => {
          const next = { ...prices };
          const at = Date.now();
          for (const [sym, q] of Object.entries(partial)) {
            next[sym] = { price: round2(q.price), change: round2(q.change), changePct: round2(q.changePct) };
            lastAt[sym] = at;
          }
          prices = next;
          notify();
        });
      } catch {
        /* proxies hiccuped — symbols retry via TTL expiry */
      } finally {
        for (const s of batch) queued.delete(s);
      }
    }
  } finally {
    demandRunning = false;
  }
}

/** How much of the universe has live data right now (for honest UI labels). */
export function coverageOf(p: Record<string, Tick>): { live: number; total: number } {
  return { live: Object.keys(p).length, total: UNIVERSE_COUNT };
}
