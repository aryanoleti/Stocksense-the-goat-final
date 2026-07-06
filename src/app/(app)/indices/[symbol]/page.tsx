import { notFound } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { IndexHeader } from "@/components/market/IndexHeader";
import { IndexCard } from "@/components/market/IndexCard";
import { AiIndexInsight } from "@/components/market/AiIndexInsight";
import { PriceChart } from "@/components/stock/PriceChart";
import { MoversTable } from "@/components/market/MoversTable";
import { INDICES } from "@/lib/universe";

export async function generateStaticParams() {
  return INDICES.map((i) => ({ symbol: i.symbol }));
}

type Props = { params: Promise<{ symbol: string }> };

export default async function IndexDetailPage({ params }: Props) {
  const { symbol } = await params;
  const index = INDICES.find((i) => i.symbol === symbol.toUpperCase());
  if (!index) notFound();

  const others = INDICES.filter((i) => i.symbol !== index.symbol);

  return (
    <div className="space-y-6">
      <IndexHeader symbol={index.symbol} name={index.name} />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card padding="md">
          <div className="mb-4">
            <CardEyebrow>Index chart</CardEyebrow>
          </div>
          <PriceChart symbol={index.symbol} />
        </Card>

        <div className="space-y-5">
          <AiIndexInsight symbol={index.symbol} name={index.name} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <MoversTable title="Top gainers today" variant="gainers" count={6} />
        <MoversTable title="Top losers today" variant="losers" count={6} />
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold tracking-tight text-(--color-fg)">More indices</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.slice(0, 4).map((i) => (
            <IndexCard key={i.symbol} symbol={i.symbol} name={i.name} />
          ))}
        </div>
      </section>
    </div>
  );
}
