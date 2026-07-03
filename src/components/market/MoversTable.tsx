"use client";

import Link from "next/link";
import { useLivePrices } from "@/lib/use-live-prices";
import { useUniversePrices } from "@/lib/live-universe-store";
import { NIFTY_50 } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";
import { Delta } from "@/components/ui/Delta";

type Props = {
  title: string;
  variant: "gainers" | "losers";
  count?: number;
  symbols?: string[];
};

export function MoversTable({ title, variant, count = 8, symbols }: Props) {
  // Rank across the full universe so "top gainers/losers" is actually true,
  // not just a re-sort of an arbitrary fixed slice. Full-universe prices come
  // from one shared poller (useUniversePrices) rather than each MoversTable
  // instance fetching all 200+ symbols on its own.
  const boundedList = symbols ? NIFTY_50.filter((s) => symbols.includes(s.symbol)) : [];
  const boundedPrices = useLivePrices(boundedList.map((s) => ({ symbol: s.symbol, basePrice: s.basePrice })));
  const universePrices = useUniversePrices();

  const list = symbols ? boundedList : NIFTY_50;
  const prices = symbols ? boundedPrices : universePrices;

  // Re-rank by current change percent
  const ranked = [...list]
    .map((s) => ({ s, pct: prices[s.symbol]?.changePct ?? 0 }))
    .sort((a, b) => (variant === "gainers" ? b.pct - a.pct : a.pct - b.pct))
    .slice(0, count);

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border)">
        <h3 className="text-[13px] uppercase tracking-[0.12em] font-semibold text-(--color-fg)">
          {title}
        </h3>
        <Link href="/stocks" className="text-[12px] font-medium text-(--color-brand-700) hover:underline">
          View all →
        </Link>
      </div>
      <ul>
        {ranked.map(({ s }) => {
          const tick = prices[s.symbol];
          return (
            <li key={s.symbol}>
              <Link
                href={`/stocks/${s.symbol}`}
                className="flex items-center justify-between gap-3 border-b border-(--color-border) px-5 py-3 last:border-b-0 hover:bg-(--color-surface-2)"
              >
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold tracking-tight text-(--color-fg)">{s.symbol}</p>
                  <p className="truncate text-[11.5px] text-(--color-fg-subtle)">{s.name}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <p className="text-[13.5px] font-semibold tabular text-(--color-fg)">
                    ₹{formatINR(tick?.price ?? s.basePrice, { decimals: 2 })}
                  </p>
                  <span className="min-w-[64px]">
                    <Delta value={tick?.changePct ?? 0} size="sm" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
