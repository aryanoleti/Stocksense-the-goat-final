"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Bot, TrendingUp, AlertTriangle, Activity, Loader2 } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLivePrice } from "@/lib/use-live-prices";
import { useStockInsight } from "@/lib/ai/use-stock-insight";
import { queuePrompt } from "@/lib/ai/sense-chat-store";
import { hasGeminiKey } from "@/lib/api/gemini";
import type { Stock } from "@/lib/mock-data";

export function StockAiInsight({ stock }: { stock: Stock }) {
  const router = useRouter();
  const tick = useLivePrice(stock.symbol, stock.basePrice);
  const { insight, loading, failed } = useStockInsight(stock, tick.changePct);
  const keyMissing = !hasGeminiKey();

  function askAboutStock() {
    queuePrompt(
      `Give me an overview of ${stock.name} (${stock.symbol}), an NSE-listed ${stock.sector} stock: how it's been performing recently, its key strengths, and the main risks to watch. Keep it educational, not financial advice.`,
    );
    router.push("/ask-ai");
  }

  return (
    <>
      <Card padding="md" className="border-(--color-brand-100) bg-(--color-brand-50)/40">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(--color-brand-700) text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <CardEyebrow className="text-(--color-brand-700)">AI summary</CardEyebrow>
              {insight && (
                <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-(--color-brand-700)">
                  <Activity className="h-3 w-3" /> {insight.confidence}% confidence
                </span>
              )}
            </div>
            {keyMissing ? (
              <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg-muted)">
                Add a <code className="rounded bg-(--color-surface-2) px-1.5 py-0.5 text-[12.5px] font-mono">NEXT_PUBLIC_GEMINI_KEY</code> to enable real AI analysis for {stock.symbol}.
              </p>
            ) : loading ? (
              <p className="mt-2 inline-flex items-center gap-2 text-[13.5px] text-(--color-fg-muted)">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Asking Gemini…
              </p>
            ) : failed || !insight ? (
              <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg-muted)">
                Couldn't generate an AI summary for {stock.symbol} right now — try refreshing in a moment.
              </p>
            ) : (
              <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg)">{insight.summary}</p>
            )}
            <Button onClick={askAboutStock} variant="subtle" size="sm" className="mt-4">
              <Bot className="h-3.5 w-3.5" /> Ask AI about {stock.symbol}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {insight && insight.opportunities?.length > 0 && (
        <Card padding="md">
          <CardEyebrow>Opportunities</CardEyebrow>
          <ul className="mt-3 space-y-3">
            {insight.opportunities.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[14px] text-(--color-fg)">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-(--color-up)" />
                {p}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {insight && insight.risks?.length > 0 && (
        <Card padding="md">
          <CardEyebrow>Risks</CardEyebrow>
          <ul className="mt-3 space-y-3">
            {insight.risks.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[14px] text-(--color-fg)">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-(--color-down)" />
                {p}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="px-1 text-[11px] leading-relaxed text-(--color-fg-subtle)">
        AI-generated from public fundamentals — not financial advice. <Link href="/ask-ai" className="underline underline-offset-2 hover:text-(--color-fg-muted)">Ask a follow-up →</Link>
      </p>
    </>
  );
}
