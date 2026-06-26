"use client";

import { useEffect, useRef, useState } from "react";

export type Tick = { price: number; change: number; changePct: number };

/**
 * Simulates a live ticker. Each second, nudges the price by a small random delta
 * around a stable base price so values don't drift permanently.
 */
export function useLivePrice(basePrice: number, volatility = 0.0025) {
  const [tick, setTick] = useState<Tick>({ price: basePrice, change: 0, changePct: 0 });
  const baseRef = useRef(basePrice);

  useEffect(() => {
    baseRef.current = basePrice;
    setTick({ price: basePrice, change: 0, changePct: 0 });
  }, [basePrice]);

  useEffect(() => {
    let cancelled = false;
    const id = setInterval(() => {
      if (cancelled) return;
      const base = baseRef.current;
      const drift = (Math.random() - 0.5) * 2 * volatility * base;
      const newPrice = Math.max(base * 0.85, Math.min(base * 1.15, base + drift));
      const change = newPrice - base;
      const changePct = (change / base) * 100;
      setTick({
        price: Math.round(newPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePct: Math.round(changePct * 100) / 100,
      });
    }, 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [volatility]);

  return tick;
}

export function useLivePrices(stocks: Array<{ symbol: string; basePrice: number }>) {
  const [prices, setPrices] = useState<Record<string, Tick>>(() => {
    const init: Record<string, Tick> = {};
    for (const s of stocks) init[s.symbol] = { price: s.basePrice, change: 0, changePct: 0 };
    return init;
  });

  const stocksRef = useRef(stocks);
  useEffect(() => {
    stocksRef.current = stocks;
  }, [stocks]);

  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) => {
        const next: Record<string, Tick> = { ...prev };
        for (const s of stocksRef.current) {
          const base = s.basePrice;
          const drift = (Math.random() - 0.5) * 2 * 0.0025 * base;
          const newPrice = Math.max(base * 0.85, Math.min(base * 1.15, base + drift));
          const change = newPrice - base;
          const changePct = (change / base) * 100;
          next[s.symbol] = {
            price: Math.round(newPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePct: Math.round(changePct * 100) / 100,
          };
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return prices;
}
