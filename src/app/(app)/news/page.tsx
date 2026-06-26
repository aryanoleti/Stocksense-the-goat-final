"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, Newspaper, Filter } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

type Sentiment = "Positive" | "Neutral" | "Negative";

const NEWS: {
  title: string;
  source: string;
  time: string;
  sentiment: Sentiment;
  topic: string;
  summary: string;
  aiTake: string;
  tickers: string[];
}[] = [
  {
    title: "RBI holds repo rate at 6.5% — markets cheer stability",
    source: "Economic Times",
    time: "16 Apr 2026 · 10:24",
    sentiment: "Positive",
    topic: "Policy",
    summary:
      "The Reserve Bank of India kept the benchmark repo rate unchanged, signalling a pause in the rate hike cycle. Markets rallied on the news.",
    aiTake:
      "The RBI's policy committee voted 5-1 for the hold, citing easing inflation and stable growth. The governor noted that food inflation remains a concern but core inflation has moderated. Bond yields fell 6 basis points following the announcement.",
    tickers: ["HDFCBANK", "ICICIBANK", "SBIN"],
  },
  {
    title: "Infosys raises FY26 revenue guidance to 4.5–5%",
    source: "Mint",
    time: "16 Apr 2026 · 09:42",
    sentiment: "Positive",
    topic: "Earnings",
    summary:
      "India's second-largest IT company raised its annual revenue growth forecast, citing strong deal wins in North America and Europe.",
    aiTake:
      "Guidance upgrade reflects improving discretionary spend among enterprise clients. Operating margins likely to expand 50-70bps in H2. Positive read-through for TCS and HCLTECH.",
    tickers: ["INFY", "TCS", "HCLTECH", "WIPRO"],
  },
  {
    title: "Adani Group stocks fall 3-5% on short-seller report",
    source: "Bloomberg",
    time: "16 Apr 2026 · 09:18",
    sentiment: "Negative",
    topic: "Corporate",
    summary:
      "A new report by a US-based short-seller raised concerns about Adani Group's debt levels and corporate governance.",
    aiTake:
      "Market reaction is sharper than the underlying claims suggest. Most pledged shares are within standard ranges. Volatility likely to persist for 1-2 weeks until conference call clarifications.",
    tickers: ["ADANIENT", "ADANIPORTS"],
  },
  {
    title: "Tata Motors JLR sales hit record high in Q3",
    source: "NDTV Profit",
    time: "15 Apr 2026 · 18:55",
    sentiment: "Positive",
    topic: "Sales",
    summary:
      "Jaguar Land Rover reported record quarterly sales, driven by strong demand for Range Rover and Defender models globally.",
    aiTake:
      "Q3 wholesales up 23% YoY. Order book remains at 200K+ units — multi-quarter visibility. EBITDA margin guidance raised to 9%+ for FY26.",
    tickers: ["TATAMOTORS"],
  },
  {
    title: "SEBI proposes new rules for F&O trading",
    source: "Financial Express",
    time: "15 Apr 2026 · 16:12",
    sentiment: "Neutral",
    topic: "Regulation",
    summary:
      "SEBI is considering stricter eligibility criteria for retail investors in futures and options trading to reduce speculation.",
    aiTake:
      "Proposed measures include higher net worth thresholds and weekly expiry rationalisation. Expect 15-20% reduction in retail F&O volumes over next two quarters.",
    tickers: ["BSE", "NSE"],
  },
  {
    title: "Reliance Jio to launch 5G in 100 more cities",
    source: "Hindustan Times",
    time: "15 Apr 2026 · 14:06",
    sentiment: "Positive",
    topic: "Telecom",
    summary:
      "Reliance Jio announced expansion of its 5G network to 100 additional cities, targeting 300 million users by 2025.",
    aiTake:
      "Strong tailwind for Reliance Industries' digital services revenue. Aggressive pricing likely to continue subscriber capture from Airtel and Vi.",
    tickers: ["RELIANCE", "BHARTIARTL"],
  },
  {
    title: "IT sector faces headwinds from US slowdown fears",
    source: "Reuters",
    time: "15 Apr 2026 · 11:38",
    sentiment: "Negative",
    topic: "Sector",
    summary:
      "Indian IT companies are bracing for a slowdown in US discretionary spending, with key clients reviewing technology budgets.",
    aiTake:
      "Watch deal TCV trends in next earnings cycle. Largecaps better positioned vs midcaps due to BFSI client mix. Margin pressure likely in H1FY26.",
    tickers: ["INFY", "TCS", "WIPRO", "HCLTECH"],
  },
];

const SENTIMENTS: Sentiment[] = ["Positive", "Neutral", "Negative"];

export default function NewsPage() {
  const [filter, setFilter] = useState<Sentiment | "All">("All");
  const filtered = filter === "All" ? NEWS : NEWS.filter((n) => n.sentiment === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-(--color-fg-subtle)">
            News
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight">Market headlines</h1>
          <p className="mt-1 text-[13.5px] text-(--color-fg-muted)">
            Curated stories from across Indian markets, with AI-generated summaries and sentiment.
          </p>
        </div>
        <Badge tone="brand">
          <Sparkles className="h-3 w-3" /> AI summarised
        </Badge>
      </header>

      <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface) px-3 py-2">
        <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.1em] font-semibold text-(--color-fg-subtle)">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </span>
        {(["All", ...SENTIMENTS] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-semibold",
              filter === s
                ? "bg-(--color-brand-700) text-white"
                : "text-(--color-fg-muted) hover:bg-(--color-surface-2)",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.map((n, i) => (
          <NewsItem key={n.title} item={n} defaultOpen={i === 0} />
        ))}
      </ul>
    </div>
  );
}

function NewsItem({
  item,
  defaultOpen,
}: {
  item: (typeof NEWS)[number];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const tone =
    item.sentiment === "Positive" ? "up" : item.sentiment === "Negative" ? "down" : "neutral";
  return (
    <Card padding="none" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(--color-brand-50) text-(--color-brand-700)">
            <Newspaper className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-(--color-fg)">{item.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11.5px] text-(--color-fg-subtle)">
              <span>{item.source}</span>
              <span>·</span>
              <span>{item.time}</span>
              <Badge tone={tone}>{item.sentiment}</Badge>
              <Badge tone="outline">{item.topic}</Badge>
            </div>
          </div>
        </div>
        <ChevronDown className={cn("mt-2 h-4 w-4 shrink-0 text-(--color-fg-subtle) transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="border-t border-(--color-border) bg-(--color-surface-2)/60 px-5 py-4">
          <p className="text-[14px] leading-relaxed text-(--color-fg)">{item.summary}</p>
          <div className="mt-4 rounded-xl border border-(--color-brand-100) bg-(--color-brand-50)/50 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-(--color-brand-700)" />
              <CardEyebrow className="text-(--color-brand-700)">Why it matters</CardEyebrow>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-(--color-fg)">{item.aiTake}</p>
          </div>
          {item.tickers.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11.5px] text-(--color-fg-subtle)">Impacted tickers:</span>
              {item.tickers.map((t) => (
                <a
                  key={t}
                  href={`/stocks/${t}`}
                  className="rounded-full border border-(--color-border) bg-(--color-surface) px-2.5 py-0.5 text-[11.5px] font-semibold text-(--color-fg-muted) hover:border-(--color-brand-300) hover:text-(--color-brand-700)"
                >
                  {t}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
