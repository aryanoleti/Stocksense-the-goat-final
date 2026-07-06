"use client";

import Link from "next/link";
import { getStock } from "@/lib/universe";
import { useLivePrices } from "@/lib/use-live-prices";
import { formatINR } from "@/lib/format";
import { Delta } from "@/components/ui/Delta";

/** A fixed set of large, liquid names with live prices — labeled as exactly that. */
export function BlueChipsList({ symbols }: { symbols: string[] }) {
  const prices = useLivePrices(symbols);

  return (
    <ul>
      {symbols.map((sym, i) => {
        const stock = getStock(sym);
        if (!stock) return null;
        const tick = prices[sym];
        return (
          <li key={sym}>
            <Link
              href={`/stocks/${sym}`}
              className="flex items-center justify-between gap-3 border-b border-(--color-border) px-5 py-3 last:border-b-0 hover:bg-(--color-surface-2)"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-(--color-surface-2) text-[11px] font-semibold text-(--color-fg-muted)">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold tracking-tight text-(--color-fg)">{sym}</p>
                  <p className="text-[11.5px] text-(--color-fg-subtle)">{stock.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-[12.5px] tabular text-(--color-fg-muted)">
                  {tick ? `₹${formatINR(tick.price, { decimals: 2 })}` : "—"}
                </span>
                {tick && <Delta value={tick.changePct} size="xs" />}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
