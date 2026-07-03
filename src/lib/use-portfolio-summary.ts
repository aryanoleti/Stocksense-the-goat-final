"use client";

import { useEffect, useMemo, useState } from "react";
import { NIFTY_50 } from "@/lib/mock-data";
import { useLivePrices } from "@/lib/use-live-prices";

const STORAGE_KEY = "stocksense.portfolio.v1";
const STARTING_CASH = 500000;

type Position = { symbol: string; shares: number; avgPrice: number };
type State = { cash: number; positions: Position[] };

function loadState(): State {
  if (typeof window === "undefined") return { cash: STARTING_CASH, positions: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cash: STARTING_CASH, positions: [] };
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      cash: typeof parsed.cash === "number" ? parsed.cash : STARTING_CASH,
      positions: Array.isArray(parsed.positions) ? parsed.positions : [],
    };
  } catch {
    return { cash: STARTING_CASH, positions: [] };
  }
}

/**
 * Read-only view of the virtual portfolio for surfaces (like the dashboard
 * widget) that just need the totals — not the full add/sell/reset machinery
 * that PortfolioApp owns. Reads the same `stocksense.portfolio.v1` state.
 */
export function usePortfolioSummary() {
  const [state, setState] = useState<State>({ cash: STARTING_CASH, positions: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const livePrices = useLivePrices(
    state.positions.map((p) => {
      const s = NIFTY_50.find((x) => x.symbol === p.symbol);
      return { symbol: p.symbol, basePrice: s?.basePrice ?? p.avgPrice };
    }),
  );

  return useMemo(() => {
    let value = 0;
    let todayChange = 0;
    for (const p of state.positions) {
      const tick = livePrices[p.symbol];
      const stock = NIFTY_50.find((x) => x.symbol === p.symbol);
      const current = tick?.price ?? stock?.basePrice ?? p.avgPrice;
      value += current * p.shares;
      todayChange += (tick?.change ?? 0) * p.shares;
    }
    const totalEquity = state.cash + value;
    const valueYesterday = value - todayChange;
    const todayChangePct = valueYesterday > 0 ? (todayChange / valueYesterday) * 100 : 0;
    return {
      hydrated,
      hasPositions: state.positions.length > 0,
      totalEquity,
      todayChange,
      todayChangePct,
    };
  }, [state, livePrices, hydrated]);
}
