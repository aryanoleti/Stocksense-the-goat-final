"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/recently-viewed";

/** Invisible — records that this stock's detail page was actually opened. */
export function RecordVisit({ symbol }: { symbol: string }) {
  useEffect(() => {
    recordVisit(symbol);
  }, [symbol]);
  return null;
}
