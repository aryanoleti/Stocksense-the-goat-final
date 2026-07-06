"use client";

import { useEffect, useState } from "react";
import { getQuote, type Quote } from "@/lib/api/yahoo";
import { formatINR } from "@/lib/format";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const REFRESH_MS = 60_000;

/**
 * Key stats straight from the live Yahoo quote — day range, 52-week range,
 * volume, previous close — plus NSE listing facts passed from the universe
 * data. Every number shown is real; anything unavailable renders "—".
 */
export function StockStats({
  symbol,
  isin,
  listedOn,
  faceValue,
}: {
  symbol: string;
  isin?: string;
  listedOn?: string;
  faceValue?: number;
}) {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let cancelled = false;
    setQuote(null);
    async function pull() {
      const q = await getQuote(symbol);
      if (!cancelled && q) setQuote(q);
    }
    pull();
    const id = setInterval(pull, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  const inr = (v?: number, decimals = 2) => (v != null ? `₹${formatINR(v, { decimals })}` : "—");

  return (
    <Card padding="md">
      <div className="mb-4 flex items-center justify-between">
        <CardEyebrow>Key stats</CardEyebrow>
        <Badge tone="outline">{quote ? "Live" : "Loading…"}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Metric label="Prev close" value={inr(quote?.previousClose)} />
        <Metric label="Day high" value={inr(quote?.dayHigh)} />
        <Metric label="Day low" value={inr(quote?.dayLow)} />
        <Metric
          label="Volume"
          value={quote?.volume != null ? quote.volume.toLocaleString("en-IN") : "—"}
        />
        <Metric label="52W high" value={inr(quote?.fiftyTwoWeekHigh, 0)} />
        <Metric label="52W low" value={inr(quote?.fiftyTwoWeekLow, 0)} />
        <Metric label="Listed on NSE" value={listedOn ? formatListing(listedOn) : "—"} />
        <Metric label="Face value" value={faceValue ? `₹${faceValue}` : "—"} />
      </div>
      {isin && (
        <p className="mt-5 border-t border-(--color-border) pt-3 text-[11.5px] text-(--color-fg-subtle)">
          ISIN <span className="font-mono">{isin}</span> · listing facts from NSE&apos;s official equity list;
          market numbers are live from the exchange feed.
        </p>
      )}
    </Card>
  );
}

function formatListing(nse: string): string {
  // NSE format: "06-OCT-2008"
  const [d, m, y] = nse.split("-");
  if (!d || !m || !y) return nse;
  return `${d} ${m.charAt(0)}${m.slice(1).toLowerCase()} ${y}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-[0.12em] font-semibold text-(--color-fg-subtle)">{label}</p>
      <p className="mt-1.5 text-[17px] font-semibold tabular tracking-tight text-(--color-fg)">{value}</p>
    </div>
  );
}
