import { LiveDot } from "@/components/ui/Badge";
import { StockGrid } from "@/components/market/StockGrid";

export default function StocksPage() {
  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-(--color-fg-subtle)">
            Stocks
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight">Every NSE-listed stock</h1>
          <p className="mt-1 text-[13.5px] text-(--color-fg-muted)">
            2,300+ Indian stocks and ETFs with live prices — search the whole exchange, filter by sector,
            sort by today&apos;s movers.
          </p>
        </div>
        <LiveDot />
      </header>
      <StockGrid />
    </div>
  );
}
