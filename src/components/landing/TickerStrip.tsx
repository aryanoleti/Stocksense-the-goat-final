import { NIFTY_50 } from "@/lib/mock-data";

// A seamless marquee of real tickers. Deterministic pseudo-deltas keep SSR and
// client markup identical (no hydration mismatch); it's a marketing flourish,
// not live data.
const PICKS = [
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN", "BHARTIARTL",
  "ITC", "LT", "TATAMOTORS", "MARUTI", "SUNPHARMA", "ADANIENT", "TITAN",
  "DMART", "ZOMATO", "BAJFINANCE", "HINDUNILVR", "JIOFIN", "TATASTEEL",
  "GOLDBEES", "SILVERBEES",
];

function pseudoDelta(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) % 1000;
  return Math.round((h / 1000 - 0.5) * 640) / 100; // -3.20%..+3.20%
}

const ITEMS = PICKS.map((sym) => {
  const s = NIFTY_50.find((x) => x.symbol === sym);
  return s ? { symbol: s.symbol, price: s.basePrice, delta: pseudoDelta(sym) } : null;
}).filter(Boolean) as { symbol: string; price: number; delta: number }[];

export function TickerStrip() {
  const row = [...ITEMS, ...ITEMS]; // duplicated for a seamless -50% loop
  return (
    <div className="relative overflow-hidden border-y border-(--color-border) bg-(--color-surface)/80 py-3 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-(--color-bg) to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-(--color-bg) to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {row.map((it, i) => {
          const up = it.delta >= 0;
          return (
            <span key={`${it.symbol}-${i}`} className="inline-flex items-center gap-2 text-[13px]">
              <span className="font-semibold tracking-tight text-(--color-fg)">{it.symbol}</span>
              <span className="tabular text-(--color-fg-muted)">₹{it.price.toLocaleString("en-IN")}</span>
              <span className={`tabular font-semibold ${up ? "text-(--color-up)" : "text-(--color-down)"}`}>
                {up ? "▲" : "▼"} {Math.abs(it.delta).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
