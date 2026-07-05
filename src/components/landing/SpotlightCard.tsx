"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Card with a soft radial highlight that follows the cursor. Pure CSS-variable
 * trick — one mousemove handler, no re-renders, no animation library.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) transition-all",
        "hover:-translate-y-0.5 hover:border-(--color-brand-300) hover:shadow-[0_18px_40px_-22px_rgba(13,31,23,0.14)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-brand-400) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
