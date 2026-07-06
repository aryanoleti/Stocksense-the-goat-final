import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StockHeader } from "@/components/stock/StockHeader";
import { StockStats } from "@/components/stock/StockStats";
import { PriceChart } from "@/components/stock/PriceChart";
import { RecordVisit } from "@/components/stock/RecordVisit";
import { StockAiInsight } from "@/components/stock/StockAiInsight";
import { PeerList } from "@/components/stock/PeerList";
import { getStock, UNIVERSE } from "@/lib/universe";

export async function generateStaticParams() {
  return UNIVERSE.map((s) => ({ symbol: s.symbol }));
}

type Props = { params: Promise<{ symbol: string }> };

// NSE dates arrive as "06-OCT-2008" — render as "6 Oct 2008".
function formatNseDate(nse: string): string {
  const [d, m, y] = nse.split("-");
  if (!d || !m || !y) return nse;
  return `${Number(d)} ${m.charAt(0)}${m.slice(1).toLowerCase()} ${y}`;
}

export default async function StockDetailPage({ params }: Props) {
  const { symbol } = await params;
  const stock = getStock(decodeURIComponent(symbol));
  if (!stock) notFound();

  const peers = UNIVERSE.filter(
    (s) => s.sector === stock.sector && s.sector !== "Other" && s.symbol !== stock.symbol,
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      <RecordVisit symbol={stock.symbol} />
      <StockHeader symbol={stock.symbol} name={stock.name} sector={stock.sector} />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Card padding="md">
            <div className="mb-4 flex items-center justify-between">
              <CardEyebrow>Price chart</CardEyebrow>
              <Button variant="outline" size="sm">
                <Bookmark className="h-3.5 w-3.5" /> Add to watchlist
              </Button>
            </div>
            <PriceChart symbol={stock.symbol} />
          </Card>

          <StockStats
            symbol={stock.symbol}
            isin={stock.isin}
            listedOn={stock.listedOn}
            faceValue={stock.faceValue}
          />

          <Card padding="md">
            <CardEyebrow>About the company</CardEyebrow>
            <p className="mt-3 text-[15px] leading-relaxed text-(--color-fg)">
              {stock.about ??
                `${stock.name} is listed on the National Stock Exchange of India as ${stock.symbol}${
                  stock.listedOn ? `, trading since ${formatNseDate(stock.listedOn)}` : ""
                }.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="outline">{stock.sector}</Badge>
              <Badge tone="outline">NSE</Badge>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <StockAiInsight stock={stock} />
        </div>
      </div>

      {peers.length > 0 && (
        <Card padding="md">
          <div className="mb-4 flex items-center justify-between">
            <CardEyebrow>Peers in {stock.sector}</CardEyebrow>
            <Link href="/stocks" className="text-[12px] font-semibold text-(--color-brand-700) hover:underline">
              See all →
            </Link>
          </div>
          <PeerList symbols={peers.map((p) => p.symbol)} />
        </Card>
      )}
    </div>
  );
}
