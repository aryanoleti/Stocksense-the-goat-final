import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StockHeader } from "@/components/stock/StockHeader";
import { PriceChart } from "@/components/stock/PriceChart";
import { RecordVisit } from "@/components/stock/RecordVisit";
import { StockAiInsight } from "@/components/stock/StockAiInsight";
import { getStock, NIFTY_50 } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";

export async function generateStaticParams() {
  return NIFTY_50.map((s) => ({ symbol: s.symbol }));
}

type Props = { params: Promise<{ symbol: string }> };

export default async function StockDetailPage({ params }: Props) {
  const { symbol } = await params;
  const stock = getStock(symbol);
  if (!stock) notFound();

  const peers = NIFTY_50.filter((s) => s.sector === stock.sector && s.symbol !== stock.symbol).slice(0, 4);

  return (
    <div className="space-y-6">
      <RecordVisit symbol={stock.symbol} />
      <StockHeader
        symbol={stock.symbol}
        name={stock.name}
        sector={stock.sector}
        basePrice={stock.basePrice}
      />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Card padding="md">
            <div className="mb-4 flex items-center justify-between">
              <CardEyebrow>Price chart</CardEyebrow>
              <Button variant="outline" size="sm">
                <Bookmark className="h-3.5 w-3.5" /> Add to watchlist
              </Button>
            </div>
            <PriceChart symbol={stock.symbol} basePrice={stock.basePrice} />
          </Card>

          <Card padding="md">
            <div className="mb-4 flex items-center justify-between">
              <CardEyebrow>Key metrics</CardEyebrow>
              <Badge tone="outline">Reference data</Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              <Metric label="Market cap" value={`₹${formatINR(stock.marketCap, { decimals: 0 })} Cr`} />
              <Metric label="P/E ratio" value={stock.peRatio.toFixed(2)} />
              <Metric label="EPS" value={`₹${stock.eps.toFixed(2)}`} />
              <Metric label="Dividend yield" value={`${stock.dividendYield.toFixed(2)}%`} />
              <Metric label="Beta" value={stock.beta.toFixed(2)} />
              <Metric label="Volume" value={formatINR(stock.volume, { decimals: 0 })} />
              <Metric label="52W High" value={`₹${formatINR(stock.week52High, { decimals: 0 })}`} />
              <Metric label="52W Low" value={`₹${formatINR(stock.week52Low, { decimals: 0 })}`} />
            </div>
          </Card>

          <Card padding="md">
            <CardEyebrow>About the company</CardEyebrow>
            <p className="mt-3 text-[15px] leading-relaxed text-(--color-fg)">{stock.about}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="outline">{stock.sector}</Badge>
              <Badge tone="outline">NSE · BSE</Badge>
              <Badge tone="outline">Large cap</Badge>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <StockAiInsight stock={stock} />
        </div>
      </div>

      <Card padding="md">
        <div className="mb-4 flex items-center justify-between">
          <CardEyebrow>Peers in {stock.sector}</CardEyebrow>
          <Link href="/stocks" className="text-[12px] font-semibold text-(--color-brand-700) hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {peers.map((p) => (
            <Link
              key={p.symbol}
              href={`/stocks/${p.symbol}`}
              className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 transition-all hover:-translate-y-0.5 hover:border-(--color-brand-300) hover:shadow-[0_18px_38px_-22px_rgba(13,31,23,0.14)]"
            >
              <p className="text-[13.5px] font-semibold tracking-tight">{p.symbol}</p>
              <p className="mt-0.5 text-[11.5px] text-(--color-fg-subtle)">{p.name}</p>
              <p className="mt-3 text-[16px] font-semibold tabular">₹{formatINR(p.basePrice, { decimals: 2 })}</p>
              <p className="mt-1 text-[11.5px] text-(--color-fg-muted)">P/E {p.peRatio.toFixed(1)} · MCap ₹{formatINR(p.marketCap, { decimals: 0 })} Cr</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-[0.12em] font-semibold text-(--color-fg-subtle)">{label}</p>
      <p className="mt-1.5 text-[17px] font-semibold tabular tracking-tight text-(--color-fg)">{value}</p>
    </div>
  );
}
