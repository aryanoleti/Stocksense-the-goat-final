"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#stats", label: "Numbers" },
  { href: "/#testimonials", label: "Stories" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto max-w-7xl px-5 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 backdrop-blur-md">
          <Logo tone="dark" />
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/70 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button href="/dashboard" variant="ghost" size="sm" className="text-white hover:bg-white/10">
              Sign in
            </Button>
            <Button href="/dashboard" size="sm" className="bg-white text-(--color-brand-900) hover:bg-white/90 shadow-none">
              Get started
            </Button>
          </div>
          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-(--color-brand-900) p-4 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-white/80" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button href="/dashboard" variant="outline" size="sm" className="w-full bg-transparent text-white border-white/20">
                  Sign in
                </Button>
                <Button href="/dashboard" size="sm" className="w-full bg-white text-(--color-brand-900) shadow-none">
                  Get started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
