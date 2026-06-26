import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, AlertTriangle, Activity, Bookmark, Bot } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StockHeader } from "@/components/stock/StockHeader";
import { PriceChart } from "@/components/stock/PriceChart";
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
              <Badge tone="brand">Live</Badge>
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
          <Card padding="md" className="border-(--color-brand-100) bg-(--color-brand-50)/40">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-(--color-brand-700) text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardEyebrow className="text-(--color-brand-700)">AI summary</CardEyebrow>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--color-brand-700)">
                    <Activity className="h-3 w-3" /> 82% confidence
                  </span>
                </div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg)">
                  {stock.name} is showing {stock.beta > 1.1 ? "above-average" : "moderate"} volatility relative to the broader Nifty.
                  Earnings momentum remains stable and the {stock.sector} sector outlook is constructive over the next 2–3 quarters.
                </p>
                <Button href="/ask-ai" variant="subtle" size="sm" className="mt-4">
                  <Bot className="h-3.5 w-3.5" /> Ask AI about {stock.symbol}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <CardEyebrow>Opportunities</CardEyebrow>
            <ul className="mt-3 space-y-3">
              {[
                "Stable earnings growth with low debt-to-equity",
                "Sector tailwinds expected through FY26",
                "Trading at a 12% discount to its 5-year mean P/E",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2 text-[14px] text-(--color-fg)">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-(--color-up)" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="md">
            <CardEyebrow>Risks</CardEyebrow>
            <ul className="mt-3 space-y-3">
              {[
                "Higher beta — expect amplified moves vs the index",
                "Margin pressure from input-cost inflation",
                "Macro headwinds in export-oriented segments",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2 text-[14px] text-(--color-fg)">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-(--color-down)" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="md">
            <CardEyebrow>Analyst ratings</CardEyebrow>
            <div className="mt-3 space-y-2.5">
              <Bar label="Buy" value={72} tone="up" />
              <Bar label="Hold" value={20} tone="warn" />
              <Bar label="Sell" value={8} tone="down" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-(--color-border) pt-3 text-[12.5px]">
              <span className="text-(--color-fg-muted)">Avg target</span>
              <span className="font-semibold tabular text-(--color-fg)">
                ₹{formatINR(stock.basePrice * 1.12, { decimals: 0 })}
              </span>
            </div>
          </Card>
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

function Bar({ label, value, tone }: { label: string; value: number; tone: "up" | "warn" | "down" }) {
  const color =
    tone === "up" ? "var(--color-up)" : tone === "warn" ? "var(--color-warn)" : "var(--color-down)";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[12px]">
        <span className="text-(--color-fg-muted)">{label}</span>
        <span className="font-semibold tabular" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-(--color-surface-2)">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
