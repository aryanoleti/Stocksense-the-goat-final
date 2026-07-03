"use client";

import { useMemo } from "react";
import { FearGreed } from "@/components/market/FearGreed";
import { useUniversePrices } from "@/lib/live-universe-store";

/**
 * A real breadth-based sentiment score: the share of the tracked universe
 * that's up right now, mapped to 0-100. Not a substitute for a "real" Fear &
 * Greed index (which also weighs volatility, momentum, etc.) but it's an
 * honest, live-computed number rather than a hardcoded one. Reads from the
 * shared universe price store rather than polling independently.
 */
export function MarketFearGreed() {
  const prices = useUniversePrices();

  const { score, up, total } = useMemo(() => {
    const ticks = Object.values(prices);
    const total = ticks.length;
    const up = ticks.filter((t) => t.changePct > 0).length;
    const score = total > 0 ? Math.round((up / total) * 100) : 50;
    return { score, up, total };
  }, [prices]);

  return (
    <>
      <FearGreed value={score} />
      <p className="mt-4 border-t border-(--color-border) pt-3 text-center text-[12px] text-(--color-fg-muted)">
        {total > 0 ? (
          <>
            <span className="font-semibold tabular text-(--color-fg)">{up}</span> of{" "}
            <span className="font-semibold tabular text-(--color-fg)">{total}</span> tracked stocks up right now
          </>
        ) : (
          "Loading live breadth…"
        )}
      </p>
    </>
  );
}
