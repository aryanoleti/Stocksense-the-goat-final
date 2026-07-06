"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { SECTORS, UNIVERSE } from "@/lib/universe";
import { coverageOf, requestQuotes, useUniversePrices } from "@/lib/live-universe-store";
import { formatINR } from "@/lib/format";
import { Delta } from "@/components/ui/Delta";

const SORTS = [
  { id: "symbol", label: "A → Z" },
  { id: "gainers", label: "Top gainers" },
  { id: "losers", label: "Top losers" },
];

const PAGE_SIZE = 120;

export function StockGrid() {
  const [sector, setSector] = useState<string>("All");
  const [sort, setSort] = useState<string>("symbol");
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const prices = useUniversePrices();
  const coverage = coverageOf(prices);

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return UNIVERSE.filter((s) => {
      if (sector !== "All" && s.sector !== sector) return false;
      if (!lower) return true;
      return (
        s.symbol.toLowerCase().includes(lower) ||
        s.name.toLowerCase().includes(lower) ||
        s.sector.toLowerCase().includes(lower)
      );
    });
  }, [q, sector]);

  const ranked = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "gainers":
        // Momentum sorts only make sense for stocks with live data — rank
        // those first, keep the not-yet-quoted tail alphabetical behind them.
        return arr.sort((a, b) => {
          const ta = prices[a.symbol];
          const tb = prices[b.symbol];
          if (ta && tb) return tb.changePct - ta.changePct;
          if (ta) return -1;
          if (tb) return 1;
          return a.symbol.localeCompare(b.symbol);
        });
      case "losers":
        return arr.sort((a, b) => {
          const ta = prices[a.symbol];
          const tb = prices[b.symbol];
          if (ta && tb) return ta.changePct - tb.changePct;
          if (ta) return -1;
          if (tb) return 1;
          return a.symbol.localeCompare(b.symbol);
        });
      default:
        return arr.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }
  }, [filtered, sort, prices]);

  // Reset pagination when the query changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q, sector, sort]);

  const page = ranked.slice(0, visible);

  // Infinite scroll: a sentinel well below the fold keeps revealing more
  // rows before the user reaches the bottom — no button, one smooth scroll.
  // IntersectionObserver is the primary trigger; a passive scroll/resize
  // check is the belt-and-braces fallback for environments that throttle IO.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = ranked.length > visible;
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const LOOKAHEAD_PX = 1600; // start loading ~2 screens ahead

    let pending = false;
    function loadMore() {
      if (pending) return;
      pending = true;
      setVisible((v) => v + PAGE_SIZE);
    }
    function checkProximity() {
      const rect = el!.getBoundingClientRect();
      if (rect.top < window.innerHeight + LOOKAHEAD_PX) loadMore();
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: `${LOOKAHEAD_PX}px 0px` },
    );
    io.observe(el);
    window.addEventListener("scroll", checkProximity, { passive: true });
    window.addEventListener("resize", checkProximity);
    checkProximity(); // short first page on a tall screen shouldn't need a scroll
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", checkProximity);
      window.removeEventListener("resize", checkProximity);
    };
  }, [hasMore, visible]);

  // Whatever is (about to be) on screen jumps the polling queue, so prices
  // for the visible rows land in seconds instead of waiting for the
  // alphabetical sweep to reach them — and keep refreshing every ~15s while
  // the user stays on the page.
  const pageSymbolsKey = page.map((s) => s.symbol).join(",");
  useEffect(() => {
    if (!pageSymbolsKey) return;
    const syms = pageSymbolsKey.split(",");
    requestQuotes(syms);
    // The recurring hot-refresh covers a bounded window (the background sweep
    // keeps the rest current) so a fully-expanded grid doesn't hammer the
    // proxies with the whole exchange every cycle.
    const hot = syms.slice(0, 300);
    const id = setInterval(() => requestQuotes(hot), 16_000);
    return () => clearInterval(id);
  }, [pageSymbolsKey]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-fg-subtle)" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search symbol, name or sector…"
              className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-surface) pl-10 pr-3 text-sm placeholder:text-(--color-fg-subtle) focus:border-(--color-brand-300) focus:ring-4 focus:ring-(--color-brand-50) focus:outline-none"
            />
          </div>
          <Select value={sector} onChange={setSector} options={["All", ...SECTORS]} icon={<Filter className="h-4 w-4 text-(--color-fg-subtle)" />} />
          <Select value={sort} onChange={setSort} options={SORTS.map((s) => s.id)} labels={SORTS.reduce((acc, s) => ({ ...acc, [s.id]: s.label }), {} as Record<string, string>)} />
        </div>
        <p className="mt-3 text-[11.5px] text-(--color-fg-subtle)">
          {ranked.length.toLocaleString("en-IN")} stocks · live prices for{" "}
          <span className="tabular">{coverage.live.toLocaleString("en-IN")}</span> of{" "}
          <span className="tabular">{coverage.total.toLocaleString("en-IN")}</span> and counting — the rest stream in
          as the rolling sweep reaches them.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {page.map((s) => {
          const tick = prices[s.symbol];
          return (
            <Link
              key={s.symbol}
              href={`/stocks/${s.symbol}`}
              className="group rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 transition-all hover:-translate-y-0.5 hover:border-(--color-brand-300) hover:shadow-[0_18px_38px_-22px_rgba(13,31,23,0.14)]"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold tracking-tight text-(--color-fg)">{s.symbol}</p>
                  <p className="mt-0.5 truncate text-[11.5px] text-(--color-fg-subtle)">{s.name}</p>
                </div>
                <span className="ml-2 shrink-0 rounded-full bg-(--color-surface-2) px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-(--color-fg-muted)">
                  {s.sector}
                </span>
              </div>
              <p className="mt-3 text-[20px] font-semibold tabular tracking-tight text-(--color-fg)">
                {tick ? `₹${formatINR(tick.price, { decimals: 2 })}` : "—"}
              </p>
              <div className="mt-1 h-5">
                {tick && <Delta value={tick.changePct} />}
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-6 text-[12.5px] text-(--color-fg-subtle)">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading more of {ranked.length.toLocaleString("en-IN")} stocks…
        </div>
      )}

      {ranked.length === 0 && (
        <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-12 text-center">
          <p className="text-sm text-(--color-fg-muted)">No stocks match those filters.</p>
        </div>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  labels,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full appearance-none rounded-xl border border-(--color-border) bg-(--color-surface) ${
          icon ? "pl-10" : "pl-3.5"
        } pr-9 text-sm focus:border-(--color-brand-300) focus:ring-4 focus:ring-(--color-brand-50) focus:outline-none`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] ?? o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-fg-subtle)">▾</span>
    </div>
  );
}
