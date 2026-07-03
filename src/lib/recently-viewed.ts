"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "stocksense.recent.v1";
const MAX_ENTRIES = 20;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type Entry = { symbol: string; at: number };

function read(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries: Entry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* noop */
  }
}

/** Record that a stock's detail page was actually opened. */
export function recordVisit(symbol: string) {
  if (typeof window === "undefined") return;
  const existing = read().filter((e) => e.symbol !== symbol);
  const next = [{ symbol, at: Date.now() }, ...existing].slice(0, MAX_ENTRIES);
  write(next);
  window.dispatchEvent(new Event("stocksense:recent-updated"));
}

/** Real, locally-tracked list of stocks the user has actually opened — most recent first. */
export function useRecentlyViewed(limit = MAX_ENTRIES) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function refresh() {
      const cutoff = Date.now() - MAX_AGE_MS;
      setEntries(read().filter((e) => e.at >= cutoff));
    }
    refresh();
    setHydrated(true);
    window.addEventListener("stocksense:recent-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("stocksense:recent-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { hydrated, symbols: entries.slice(0, limit).map((e) => e.symbol) };
}
