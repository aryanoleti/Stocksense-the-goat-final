// The tracked universe: every NSE-listed equity (EQ + BE series, from NSE's
// official EQUITY_L list) plus curated NSE-traded ETFs. No prices live here —
// all market data is fetched live from Yahoo Finance; this file only carries
// identity facts (symbol, name, sector, ISIN, listing date, face value).

import { UNIVERSE_ROWS } from "./universe-data";
import { CURATED_INFO } from "./curated-info";

export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  isin?: string;
  listedOn?: string; // e.g. "06-OCT-2008" (NSE listing date)
  faceValue?: number;
  about?: string; // curated factual description, where we have one
};

export const UNIVERSE: Stock[] = UNIVERSE_ROWS.map(([symbol, name, sector, isin, listedOn, faceValue]) => {
  const curated = CURATED_INFO[symbol];
  return {
    symbol,
    name: curated?.name ?? name,
    sector,
    isin: isin || undefined,
    listedOn: listedOn || undefined,
    faceValue: faceValue || undefined,
    about: curated?.about,
  };
});

export const UNIVERSE_COUNT = UNIVERSE.length;
/** Rounded-down marketing-safe count for copy ("2,300+ NSE stocks"). */
export const UNIVERSE_COUNT_LABEL = `${(Math.floor(UNIVERSE_COUNT / 100) * 100).toLocaleString("en-IN")}+`;

const byName = new Map(UNIVERSE.map((s) => [s.symbol.toLowerCase(), s]));

export function getStock(symbol: string): Stock | undefined {
  return byName.get(symbol.toLowerCase());
}

// Sectors that actually appear in the data. "Other" (stocks outside the
// Nifty 500 with no curated label) is kept last.
export const SECTORS: string[] = (() => {
  const set = new Set(UNIVERSE.map((s) => s.sector));
  const hasOther = set.delete("Other");
  const list = [...set].sort();
  if (hasOther) list.push("Other");
  return list;
})();

/**
 * Polling priority: sector-classified stocks first (Nifty 500 + curated —
 * the liquid names that dominate movers/breadth), then the long tail, both
 * alphabetical. The universe store sweeps in this order so the useful 80%
 * of live coverage arrives in the first seconds of a sweep.
 */
export const POLL_ORDER: string[] = [...UNIVERSE]
  .sort((a, b) => {
    const ao = a.sector === "Other" ? 1 : 0;
    const bo = b.sector === "Other" ? 1 : 0;
    if (ao !== bo) return ao - bo;
    return a.symbol.localeCompare(b.symbol);
  })
  .map((s) => s.symbol);

// Major Indian indices — names only; levels are always fetched live.
export const INDICES = [
  { symbol: "NIFTY50", name: "Nifty 50" },
  { symbol: "SENSEX", name: "Sensex" },
  { symbol: "BANKNIFTY", name: "Nifty Bank" },
  { symbol: "NIFTYIT", name: "Nifty IT" },
  { symbol: "NIFTYAUTO", name: "Nifty Auto" },
  { symbol: "NIFTYPHARMA", name: "Nifty Pharma" },
] as const;
