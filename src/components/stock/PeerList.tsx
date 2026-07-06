"use client";

import Link from "next/link";
import { getStock } from "@/lib/universe";
import { useLivePrices } from "@/lib/use-live-prices";
import { formatINR } from "@/lib/format";
import { Delta } from "@/components/ui/Delta";

/** Peer cards with live prices only — "—" until the real quote lands. */
export function PeerList({ symbols }: { symbols: string[] }) {
  const prices = useLivePrices(symbols);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {symbols.map((sym) => {
        const p = getStock(sym);
        if (!p) return null;
        const tick = prices[sym];
        return (
          <Link
            key={sym}
            href={`/stocks/${sym}`}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 transition-all hover:-translate-y-0.5 hover:border-(--color-brand-300) hover:shadow-[0_18px_38px_-22px_rgba(13,31,23,0.14)]"
          >
            <p className="text-[13.5px] font-semibold tracking-tight">{p.symbol}</p>
            <p className="mt-0.5 truncate text-[11.5px] text-(--color-fg-subtle)">{p.name}</p>
            <p className="mt-3 text-[16px] font-semibold tabular">
              {tick ? `₹${formatINR(tick.price, { decimals: 2 })}` : "—"}
            </p>
            <div className="mt-1 h-4">{tick && <Delta value={tick.changePct} size="xs" />}</div>
          </Link>
        );
      })}
    </div>
  );
}
