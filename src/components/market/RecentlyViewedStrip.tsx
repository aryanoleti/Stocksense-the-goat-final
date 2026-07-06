"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { useLivePrices } from "@/lib/use-live-prices";
import { getStock, type Stock } from "@/lib/universe";
import { formatINR } from "@/lib/format";

export function RecentlyViewedStrip() {
  const { hydrated, symbols } = useRecentlyViewed(6);
  const list = symbols.map((sym) => getStock(sym)).filter(Boolean) as Stock[];
  const prices = useLivePrices(list.map((s) => s.symbol));

  if (!hydrated) return null;

  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-(--color-fg)">Recently viewed</h2>
          <p className="mt-1 text-[13.5px] text-(--color-fg-muted)">Stocks you opened recently</p>
        </div>
        {list.length > 0 && (
          <Link href="/recently-viewed" className="text-[12px] font-medium text-(--color-brand-700) hover:underline">
            See all →
          </Link>
        )}
      </div>
      {list.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-8 text-center">
          <History className="mx-auto h-6 w-6 text-(--color-fg-subtle)" />
          <p className="mt-2 text-[13.5px] text-(--color-fg-muted)">
            Open a stock's detail page and it'll show up here.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => {
            const tick = prices[s.symbol];
            return (
              <Link
                key={s.symbol}
                href={`/stocks/${s.symbol}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 transition-all hover:-translate-y-0.5 hover:border-(--color-brand-300) hover:shadow-[0_18px_38px_-22px_rgba(13,31,23,0.14)]"
              >
                <div>
                  <p className="text-[13.5px] font-semibold tracking-tight">{s.symbol}</p>
                  <p className="text-[11.5px] text-(--color-fg-subtle)">{s.name}</p>
                  <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-(--color-fg-subtle)">{s.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold tabular">
                    {tick ? `₹${formatINR(tick.price, { decimals: 2 })}` : "—"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
