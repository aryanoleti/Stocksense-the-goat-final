import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Market", href: "/market" },
      { label: "Stocks", href: "/stocks" },
      { label: "Portfolio Simulator", href: "/portfolio" },
      { label: "Ask AI", href: "/ask-ai" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Glossary", href: "/glossary" },
      { label: "Market News", href: "/news" },
      { label: "Where to buy", href: "/buy-stocks" },
    ],
  },
];

/**
 * Full-bleed dark panel with an oversized watermark — the footer is a
 * destination, not an afterthought. Identical in light and dark themes by
 * design (it anchors the page in brand-900 either way).
 */
export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-(--color-brand-950) text-white">
      {/* Oversized wordmark watermark */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[22vw] font-semibold leading-none tracking-[-0.05em] text-white/[0.035] sm:-bottom-14"
      >
        StockSense
      </p>
      <div className="particle-dust pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-20 sm:pb-36">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              StockSense is an intelligent stock market companion. It is not a SEBI-registered
              advisor. Always do your own research.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-white/40">
                {c.title}
              </p>
              <ul className="mt-5 space-y-3.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1.5 text-[14.5px] text-white/65 transition-colors hover:text-white"
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-(--color-brand-300) transition-all duration-300 group-hover:w-full" />
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} StockSense Technologies. All rights reserved.
          </p>
          <p className="text-[11.5px] text-white/40">
            Investments in the securities market are subject to market risks. Read all related
            documents carefully before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}
