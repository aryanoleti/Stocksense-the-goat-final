"use client";

import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePortfolioSummary } from "@/lib/use-portfolio-summary";
import { formatPct, rupee } from "@/lib/format";

export function PortfolioSummaryCard() {
  const { hydrated, hasPositions, totalEquity, todayChange, todayChangePct } = usePortfolioSummary();
  const tone = todayChange > 0 ? "text-(--color-up)" : todayChange < 0 ? "text-(--color-down)" : "text-(--color-fg-subtle)";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your virtual portfolio</CardTitle>
      </CardHeader>
      {!hydrated ? (
        <div className="h-[52px] animate-pulse rounded-lg skeleton" />
      ) : !hasPositions ? (
        <>
          <p className="text-[28px] font-semibold tabular tracking-tight">{rupee(totalEquity, { decimals: 0 })}</p>
          <p className="mt-1 text-[13px] text-(--color-fg-subtle)">No positions yet — all cash.</p>
        </>
      ) : (
        <>
          <p className="text-[28px] font-semibold tabular tracking-tight">{rupee(totalEquity, { decimals: 0 })}</p>
          <p className={`mt-1 text-[13px] tabular font-medium ${tone}`}>
            {todayChange >= 0 ? "+" : ""}
            {rupee(Math.abs(todayChange), { decimals: 0 })} ({formatPct(todayChangePct)}) today
          </p>
        </>
      )}
      <Button href="/portfolio" variant="outline" size="sm" className="mt-5 w-full">
        Open simulator <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </Card>
  );
}
