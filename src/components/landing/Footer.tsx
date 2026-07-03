import Link from "next/link";
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

export function Footer() {
  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-(--color-fg-muted)">
              StockSense is an intelligent stock market companion. It is not a SEBI-registered
              advisor. Always do your own research.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-(--color-fg-subtle)">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-(--color-fg-muted) hover:text-(--color-fg)"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-(--color-fg-subtle)">
            © {new Date().getFullYear()} StockSense Technologies. All rights reserved.
          </p>
          <p className="text-[11.5px] text-(--color-fg-subtle)">
            Investments in the securities market are subject to market risks. Read all related
            documents carefully before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}
