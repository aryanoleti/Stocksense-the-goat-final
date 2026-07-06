"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Bot, ArrowRight } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { generateJson, hasGeminiKey } from "@/lib/api/gemini";
import { getQuote } from "@/lib/api/yahoo";
import { queuePrompt } from "@/lib/ai/sense-chat-store";

type IndexInsight = { summary: string; watching: string[] };

const cache = new Map<string, IndexInsight>();

/**
 * AI read of an index's day, grounded ONLY in the live quote fetched moments
 * before the call — the same honesty rule as everywhere else.
 */
export function AiIndexInsight({ symbol, name }: { symbol: string; name: string }) {
  const router = useRouter();
  const [insight, setInsight] = useState<IndexInsight | null>(cache.get(symbol) ?? null);
  const [loading, setLoading] = useState(!cache.has(symbol));
  const keyMissing = !hasGeminiKey();

  useEffect(() => {
    if (keyMissing || cache.has(symbol)) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      const q = await getQuote(symbol);
      if (cancelled) return;
      const live = q
        ? `Current level: ${q.price.toFixed(2)} (today: ${q.changePct >= 0 ? "+" : ""}${q.changePct.toFixed(2)}%)
${q.dayLow != null && q.dayHigh != null ? `Day range: ${q.dayLow.toFixed(0)}–${q.dayHigh.toFixed(0)}\n` : ""}${q.fiftyTwoWeekLow != null && q.fiftyTwoWeekHigh != null ? `52W range: ${q.fiftyTwoWeekLow.toFixed(0)}–${q.fiftyTwoWeekHigh.toFixed(0)}\n` : ""}`
        : "Live level unavailable right now — keep the summary qualitative, no invented figures.\n";

      const result = await generateJson<IndexInsight>(
        [
          {
            role: "user",
            parts: [
              {
                text: `You are an educational market assistant for Indian retail investors. Give a brief read of the ${name} (${symbol}) index right now. Educational, never buy/sell advice.

${live}
Respond with a single JSON object, no markdown:
{
  "summary": string,     // 2-3 plain-English sentences on what the index's move today means, grounded in the numbers above
  "watching": string[]   // up to 3 short things an investor tracking this index typically watches (sectors, events, macro)
}`,
              },
            ],
          },
        ],
        { temperature: 0.4 },
      );
      if (cancelled) return;
      if (result) {
        cache.set(symbol, result);
        setInsight(result);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [symbol, name, keyMissing]);

  function askAboutIndex() {
    queuePrompt(
      `Explain what the ${name} index is, what's been driving it recently, and what a retail investor should understand about tracking it. Keep it educational.`,
    );
    router.push("/ask-ai");
  }

  return (
    <Card padding="md" className="border-(--color-brand-100) bg-(--color-brand-50)/40">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(--color-brand-700) text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <CardEyebrow className="text-(--color-brand-700)">AI read · live data</CardEyebrow>
          {keyMissing ? (
            <p className="mt-2 text-[14px] leading-relaxed text-(--color-fg-muted)">
              Add a Gemini key to enable AI analysis for {name}.
            </p>
          ) : loading ? (
            <p className="mt-2 inline-flex items-center gap-2 text-[13.5px] text-(--color-fg-muted)">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading the live level…
            </p>
          ) : insight ? (
            <>
              <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg)">{insight.summary}</p>
              {insight.watching?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {insight.watching.map((w) => (
                    <li key={w} className="rounded-full border border-(--color-brand-200) bg-(--color-surface) px-2.5 py-1 text-[11.5px] text-(--color-fg-muted)">
                      {w}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="mt-2 text-[14px] text-(--color-fg-muted)">
              Couldn&apos;t generate a read right now — try again shortly.
            </p>
          )}
          <Button onClick={askAboutIndex} variant="subtle" size="sm" className="mt-4">
            <Bot className="h-3.5 w-3.5" /> Ask AI about {name}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
