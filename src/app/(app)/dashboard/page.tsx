import Link from "next/link";
import { Sparkles } from "lucide-react";
import { IndexCard } from "@/components/market/IndexCard";
import { MoversTable } from "@/components/market/MoversTable";
import { SearchHero } from "@/components/market/SearchHero";
import { Greeting } from "@/components/layout/Greeting";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PortfolioSummaryCard } from "@/components/portfolio/PortfolioSummaryCard";
import { RecentlyViewedStrip } from "@/components/market/RecentlyViewedStrip";
import { BlueChipsList } from "@/components/market/BlueChipsList";
import { INDICES, UNIVERSE_COUNT_LABEL } from "@/lib/universe";

const SHORTCUTS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "BHARTIARTL", "TATAMOTORS"];
const BLUE_CHIPS = ["RELIANCE", "HDFCBANK", "TCS", "ICICIBANK", "SBIN", "BHARTIARTL"];

export default function DashboardPage() {
  return (
    <div className="space-y-7">
      {/* Greeting / Search hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-brand p-8 sm:p-10">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-(--color-brand-400)/15 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-(--color-brand-300)/10 blur-3xl" />
        <div className="relative">
          <Badge tone="brand" className="bg-white/10 text-white border-white/15">
            <Sparkles className="h-3 w-3" />
            Smart stock discovery
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-[40px] sm:leading-[1.1]">
            <Greeting fallbackName="there" />
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-white/70">
            Track live prices across {UNIVERSE_COUNT_LABEL} Indian stocks and commodities, analyse trends, simulate your portfolio and get AI insights — all in one place.
          </p>

          <div className="mt-7 max-w-3xl">
            <SearchHero />
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {SHORTCUTS.map((s) => (
              <Link
                key={s}
                href={`/stocks/${s}`}
                className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium tracking-tight text-white/80 hover:bg-white/15 hover:text-white"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Indices */}
      <section>
        <SectionHeader title="Markets at a glance" subtitle="Major Indian indices, updating live" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDICES.slice(0, 4).map((i, idx) => (
            <IndexCard key={i.symbol} symbol={i.symbol} name={i.name} highlight={idx === 0} />
          ))}
        </div>
      </section>

      {/* Movers + Trending */}
      <section className="grid gap-5 lg:grid-cols-2">
        <MoversTable title="Top gainers today" variant="gainers" count={8} />
        <MoversTable title="Top losers today" variant="losers" count={8} />
      </section>

      {/* Trending + your portfolio */}
      <section className="grid gap-5 lg:grid-cols-2">
        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-4">
            <CardTitle>Blue chips, live</CardTitle>
            <Link href="/market" className="text-[12px] font-medium text-(--color-brand-700) hover:underline">
              Open market →
            </Link>
          </div>
          <BlueChipsList symbols={BLUE_CHIPS} />
        </Card>

        <PortfolioSummaryCard />
      </section>

      {/* Recently viewed */}
      <RecentlyViewedStrip />
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-[20px] font-semibold tracking-tight text-(--color-fg)">{title}</h2>
        {subtitle && <p className="mt-1 text-[13.5px] text-(--color-fg-muted)">{subtitle}</p>}
      </div>
    </div>
  );
}
