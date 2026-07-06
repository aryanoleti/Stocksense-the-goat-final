"use client";

import { useEffect, useRef, useState } from "react";
import { getQuote, getQuotes, type Quote } from "@/lib/api/yahoo";

export type Tick = { price: number; change: number; changePct: number };

const SINGLE_REFRESH_MS = 10_000;
const BATCH_REFRESH_MS = 20_000;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function toTick(q: Quote): Tick {
  return { price: round2(q.price), change: round2(q.change), changePct: round2(q.changePct) };
}

/**
 * Live quote for a single symbol, or null until the first real quote arrives.
 * Only ever shows values that came from the market — no synthetic movement,
 * no placeholder prices. Keeps the last real quote if a refresh fails.
 */
export function useLivePrice(symbol: string): Tick | null {
  const [tick, setTick] = useState<Tick | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTick(null);
    async function pull() {
      const q = await getQuote(symbol);
      if (cancelled || !q) return;
      setTick(toTick(q));
    }
    pull();
    const id = setInterval(pull, SINGLE_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  return tick;
}

/**
 * Live quotes for a list of symbols. Symbols the API hasn't answered for yet
 * are simply absent from the map — callers render "—" until data arrives.
 */
export function useLivePrices(symbols: string[]): Record<string, Tick> {
  const [prices, setPrices] = useState<Record<string, Tick>>({});
  const symbolsRef = useRef(symbols);
  const key = symbols.join(",");

  useEffect(() => {
    symbolsRef.current = key ? key.split(",") : [];
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    async function pull() {
      const syms = symbolsRef.current;
      if (syms.length === 0) return;
      // Prices paint chunk-by-chunk as the API answers.
      await getQuotes(syms, (partial) => {
        if (cancelled) return;
        setPrices((prev) => {
          const next = { ...prev };
          for (const [sym, q] of Object.entries(partial)) next[sym] = toTick(q);
          return next;
        });
      });
    }
    pull();
    const id = setInterval(pull, BATCH_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [key]);

  return prices;
}
