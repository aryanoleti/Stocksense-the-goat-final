"use client";

import { useEffect, useState } from "react";
import { generateJson } from "@/lib/api/gemini";
import { getQuote } from "@/lib/api/yahoo";
import type { Stock } from "@/lib/universe";

export type StockInsight = {
  summary: string;
  confidence: number;
  opportunities: string[];
  risks: string[];
};

// Per-symbol cache so navigating away and back (or re-rendering) doesn't
// re-spend a Gemini call for the same stock in the same session.
const cache = new Map<string, StockInsight>();

// The prompt is grounded ONLY in live market data fetched moments before the
// call — never in stored figures that could have gone stale.
function buildPrompt(stock: Stock, live: string) {
  return `Give a brief AI-generated analysis of this NSE-listed Indian stock for a retail investor. Educational tone, never explicit buy/sell advice.

Company: ${stock.name} (${stock.symbol})
Sector: ${stock.sector}
${live}${stock.about ? `Background: ${stock.about}\n` : ""}
Respond with a single JSON object, no markdown, no prose outside the JSON, matching this TypeScript type:
{
  "summary": string,          // 2-3 sentence plain-English summary grounded in the data above and what you know of the company
  "confidence": number,       // 0-100, how confident you are in this read
  "opportunities": string[],  // up to 3 short upside points, specific to this company/sector
  "risks": string[]           // up to 3 short downside points, specific to this company/sector
}`;
}

export function useStockInsight(stock: Stock) {
  const [insight, setInsight] = useState<StockInsight | null>(cache.get(stock.symbol) ?? null);
  const [loading, setLoading] = useState(!cache.has(stock.symbol));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cached = cache.get(stock.symbol);
    if (cached) {
      setInsight(cached);
      setLoading(false);
      setFailed(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFailed(false);

    (async () => {
      // Ground the analysis in the real quote of the moment.
      const q = await getQuote(stock.symbol);
      if (cancelled) return;
      const live = q
        ? `Live price: ₹${q.price.toFixed(2)} (today: ${q.changePct >= 0 ? "+" : ""}${q.changePct.toFixed(2)}%)
${q.fiftyTwoWeekLow != null && q.fiftyTwoWeekHigh != null ? `52W range: ₹${q.fiftyTwoWeekLow}–₹${q.fiftyTwoWeekHigh}\n` : ""}${q.volume != null ? `Today's volume: ${q.volume.toLocaleString("en-IN")}\n` : ""}`
        : "Live quote unavailable right now — do not invent price figures; keep the summary qualitative.\n";

      const result = await generateJson<StockInsight>(
        [{ role: "user", parts: [{ text: buildPrompt(stock, live) }] }],
        { temperature: 0.5 },
      );
      if (cancelled) return;
      if (result) {
        cache.set(stock.symbol, result);
        setInsight(result);
      } else {
        setFailed(true);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // Re-run only when the symbol changes, not on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.symbol]);

  return { insight, loading, failed };
}
