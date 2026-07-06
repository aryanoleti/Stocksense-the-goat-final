"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { generateJson, hasGeminiKey } from "@/lib/api/gemini";
import { getQuotes } from "@/lib/api/yahoo";
import { useUniversePrices } from "@/lib/live-universe-store";
import { getStock } from "@/lib/universe";

type Brief = { brief: string; tone: "up" | "down" | "mixed"; generatedAt: number };

const CACHE_KEY = "stocksense.ai-brief.v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
const MIN_BREADTH_SAMPLE = 60;

function loadCached(): Brief | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as Brief;
    return Date.now() - b.generatedAt < CACHE_TTL_MS ? b : null;
  } catch {
    return null;
  }
}

/**
 * A daily-driver AI card: Gemini writes a short market brief grounded
 * entirely in numbers fetched live moments before the call — index levels,
 * real breadth, and the actual top movers. Cached for 10 minutes.
 */
export function AiMarketBrief() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const prices = useUniversePrices();
  const startedRef = useRef(false);
  const keyMissing = !hasGeminiKey();

  const breadth = useMemo(() => {
    const ticks = Object.entries(prices);
    if (ticks.length < MIN_BREADTH_SAMPLE) return null;
    let up = 0;
    let best: [string, number] | null = null;
    let worst: [string, number] | null = null;
    for (const [sym, t] of ticks) {
      if (t.changePct > 0) up++;
      if (!best || t.changePct > best[1]) best = [sym, t.changePct];
      if (!worst || t.changePct < worst[1]) worst = [sym, t.changePct];
    }
    return { total: ticks.length, up, best, worst };
  }, [prices]);

  const generateBrief = useCallback(async () => {
    if (keyMissing || !breadth) return;
    setLoading(true);
    setFailed(false);

    const idx = await getQuotes(["NIFTY50", "SENSEX", "BANKNIFTY"]);
    const idxLine = Object.entries(idx)
      .map(([sym, q]) => `${sym}: ${q.price.toFixed(2)} (${q.changePct >= 0 ? "+" : ""}${q.changePct.toFixed(2)}%)`)
      .join(", ");
    const bestName = breadth.best ? getStock(breadth.best[0])?.name ?? breadth.best[0] : "";
    const worstName = breadth.worst ? getStock(breadth.worst[0])?.name ?? breadth.worst[0] : "";

    const result = await generateJson<{ brief: string; tone: "up" | "down" | "mixed" }>(
      [
        {
          role: "user",
          parts: [
            {
              text: `Write a short market brief for an Indian retail investor, grounded ONLY in this live data (no invented numbers, no advice):

Indices: ${idxLine || "unavailable"}
Breadth: ${breadth.up} of ${breadth.total} tracked NSE stocks advancing right now
Biggest gainer in sample: ${bestName} (${breadth.best?.[1].toFixed(2)}%)
Biggest decliner in sample: ${worstName} (${breadth.worst?.[1].toFixed(2)}%)

Respond with a single JSON object, no markdown:
{
  "brief": string,           // 3-4 plain-English sentences reading the day from the numbers above
  "tone": "up"|"down"|"mixed"
}`,
            },
          ],
        },
      ],
      { temperature: 0.4 },
    );

    if (result) {
      const b: Brief = { ...result, generatedAt: Date.now() };
      setBrief(b);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(b));
      } catch {
        /* noop */
      }
    } else {
      setFailed(true);
    }
    setLoading(false);
  }, [keyMissing, breadth]);

  // Generate once when enough live data exists (or restore the cached brief).
  useEffect(() => {
    if (startedRef.current || keyMissing) return;
    const cached = loadCached();
    if (cached) {
      setBrief(cached);
      startedRef.current = true;
      return;
    }
    if (breadth) {
      startedRef.current = true;
      void generateBrief();
    }
  }, [breadth, keyMissing, generateBrief]);

  if (keyMissing) return null;

  const toneColor =
    brief?.tone === "up" ? "text-(--color-up)" : brief?.tone === "down" ? "text-(--color-down)" : "text-(--color-fg-muted)";

  return (
    <Card padding="md" className="border-(--color-brand-100) bg-(--color-brand-50)/40">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(--color-brand-700) text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <CardEyebrow className="text-(--color-brand-700)">AI market brief · from live data</CardEyebrow>
            <button
              type="button"
              onClick={() => void generateBrief()}
              disabled={loading || !breadth}
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-(--color-brand-700) hover:underline disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
          {brief ? (
            <>
              <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg)">{brief.brief}</p>
              <p className={`mt-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] ${toneColor}`}>
                {brief.tone === "up" ? "Leaning positive" : brief.tone === "down" ? "Leaning negative" : "Mixed session"}
                <span className="ml-2 font-normal normal-case tracking-normal text-(--color-fg-subtle)">
                  generated {new Date(brief.generatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </p>
            </>
          ) : failed ? (
            <p className="mt-2 text-[14px] text-(--color-fg-muted)">
              Couldn&apos;t generate the brief right now — hit refresh in a moment.
            </p>
          ) : (
            <p className="mt-2 inline-flex items-center gap-2 text-[13.5px] text-(--color-fg-muted)">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {breadth ? "Reading the live market…" : "Gathering live market data…"}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
