"use client";

import Link from "next/link";
import { useLivePrices } from "@/lib/use-live-prices";
import { useUniversePrices } from "@/lib/live-universe-store";
import { getStock, UNIVERSE } from "@/lib/universe";
import { Delta } from "@/components/ui/Delta";
import { LivePrice } from "@/components/ui/LivePrice";

type Props = {
  title: string;
  variant: "gainers" | "losers";
  count?: number;
  symbols?: string[];
};

export function MoversTable({ title, variant, count = 8, symbols }: Props) {
  // Rank across the full universe so "top gainers/losers" is actually true.
  // Only stocks with a real live quote are ranked — nothing is invented for
  // symbols the rolling sweep hasn't reached yet.
  const boundedPrices = useLivePrices(symbols ?? []);
  const universePrices = useUniversePrices();
  const prices = symbols ? boundedPrices : universePrices;
  const list = symbols
    ? (symbols.map((sym) => getStock(sym)).filter(Boolean) as typeof UNIVERSE)
    : UNIVERSE;

  const ranked = list
    .map((s) => ({ s, tick: prices[s.symbol] }))
    .filter((x) => x.tick)
    .sort((a, b) => (variant === "gainers" ? b.tick!.changePct - a.tick!.changePct : a.tick!.changePct - b.tick!.changePct))
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
      {ranked.length === 0 ? (
        <div className="px-5 py-10 text-center text-[12.5px] text-(--color-fg-muted)">
          Waiting for live quotes…
        </div>
      ) : (
        <ul>
          {ranked.map(({ s, tick }) => (
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
                    <LivePrice price={tick!.price} />
                  </p>
                  <span className="min-w-[64px]">
                    <Delta value={tick!.changePct} size="sm" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
