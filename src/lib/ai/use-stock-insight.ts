"use client";

import { useEffect, useState } from "react";
import { generateJson } from "@/lib/api/gemini";
import type { Stock } from "@/lib/mock-data";

export type StockInsight = {
  summary: string;
  confidence: number;
  opportunities: string[];
  risks: string[];
};

// Per-symbol cache so navigating away and back (or re-rendering) doesn't
// re-spend a Gemini call for the same stock in the same session.
const cache = new Map<string, StockInsight>();

function buildPrompt(stock: Stock, changePct: number) {
  return `Give a brief AI-generated analysis of this NSE-listed Indian stock for a retail investor. Educational tone, never explicit buy/sell advice.

Company: ${stock.name} (${stock.symbol})
Sector: ${stock.sector}
Price: ₹${stock.basePrice} (today: ${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%)
P/E: ${stock.peRatio}, EPS: ₹${stock.eps}, Beta: ${stock.beta}, Dividend yield: ${stock.dividendYield}%
52W range: ₹${stock.week52Low}–₹${stock.week52High}

Respond with a single JSON object, no markdown, no prose outside the JSON, matching this TypeScript type:
{
  "summary": string,          // 2-3 sentence plain-English summary grounded in the numbers above
  "confidence": number,       // 0-100, how confident you are in this read
  "opportunities": string[],  // up to 3 short upside points, specific to this company/sector
  "risks": string[]           // up to 3 short downside points, specific to this company/sector
}`;
}

export function useStockInsight(stock: Stock, changePct: number) {
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

    generateJson<StockInsight>(
      [{ role: "user", parts: [{ text: buildPrompt(stock, changePct) }] }],
      { temperature: 0.5 },
    ).then((result) => {
      if (cancelled) return;
      if (result) {
        cache.set(stock.symbol, result);
        setInsight(result);
      } else {
        setFailed(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // Only re-run when the symbol changes — the day's changePct fluctuates
    // constantly and shouldn't re-trigger a fresh AI call on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.symbol]);

  return { insight, loading, failed };
}
