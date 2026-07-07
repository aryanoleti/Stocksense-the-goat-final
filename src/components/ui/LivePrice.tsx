"use client";

import { useEffect, useRef, useState } from "react";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * A price that briefly flashes green/red when its value actually changes —
 * so a live-updating grid reads as alive during market hours, without ever
 * inventing movement (it only flashes on a real, different value).
 */
export function LivePrice({
  price,
  decimals = 2,
  className,
}: {
  price?: number;
  decimals?: number;
  className?: string;
}) {
  const prev = useRef<number | undefined>(undefined);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (price == null) return;
    if (prev.current != null && price !== prev.current) {
      setFlash(price > prev.current ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 650);
      prev.current = price;
      return () => clearTimeout(t);
    }
    prev.current = price;
  }, [price]);

  return (
    <span
      className={cn(
        "rounded px-1 transition-colors duration-500",
        flash === "up" && "bg-(--color-up-soft) text-(--color-up)",
        flash === "down" && "bg-(--color-down-soft) text-(--color-down)",
        className,
      )}
    >
      {price != null ? `₹${formatINR(price, { decimals })}` : "—"}
    </span>
  );
}
