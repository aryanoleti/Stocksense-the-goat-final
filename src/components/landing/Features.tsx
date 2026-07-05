import {
  Bot,
  TrendingUp,
  Wallet,
  Search,
  ChartPie,
  Newspaper,
  Sparkles,
  Bookmark,
  ShieldCheck,
  LineChart,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

const FEATURES = [
  { icon: Bot, title: "AI Stock Assistant", body: "Conversational research. Ask why a stock moved, compare peers, or get a second opinion before you trade." },
  { icon: Wallet, title: "Trading Simulator", body: "Start with ₹5 lakh of virtual cash. Buy, sell, and learn — without risking a rupee." },
  { icon: TrendingUp, title: "Live Indian Markets", body: "Nifty 50, Sensex, sector indices and 500+ stocks, with prices that update continuously during market hours." },
  { icon: Search, title: "Smart Screener", body: "Filter by sector, search by name or symbol, and sort by gainers, market cap or P/E." },
  { icon: ChartPie, title: "Portfolio Analytics", body: "Allocation, P&L over time, sector exposure — see the shape of your investments at a glance." },
  { icon: Newspaper, title: "Curated News", body: "Headline noise filtered down to what matters, with AI-generated context on demand." },
  { icon: Sparkles, title: "AI Insights", body: "Earnings reads, valuation context, momentum signals — all in plain English." },
  { icon: Bookmark, title: "Watchlists", body: "Track the stocks you care about with daily change, volume, and quick AI takes." },
  { icon: ShieldCheck, title: "Risk Snapshot", body: "AI-generated opportunities and risks, grounded in each company's real fundamentals." },
  { icon: LineChart, title: "Performance Dashboard", body: "Track your virtual portfolio's value and today's P&L at a glance from the dashboard." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-(--color-brand-700)">
          Everything you need
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[42px] sm:leading-[1.08]">
          A premium fintech, designed for beginners.
        </h2>
        <p className="mt-4 text-(--color-fg-muted)">
          StockSense bundles research, simulation and AI guidance into one calm workspace —
          so you stop guessing and start understanding.
        </p>
      </Reveal>
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} as="li" delay={(i % 3) * 0.08}>
            <SpotlightCard className="h-full p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-(--color-brand-50) text-(--color-brand-700) transition-colors group-hover:bg-(--color-brand-700) group-hover:text-white">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>
              <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg-muted)">{f.body}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
