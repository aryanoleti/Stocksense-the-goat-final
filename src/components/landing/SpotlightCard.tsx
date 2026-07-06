"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Card with a cursor-following radial highlight plus a subtle 3D tilt.
 * Both effects are CSS-variable writes in one mousemove handler — no
 * re-renders, no animation library. Tilt is skipped for reduced motion.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    if (!reduce) {
      const rx = ((y / rect.height) - 0.5) * -4; // rotateX
      const ry = ((x / rect.width) - 0.5) * 5; // rotateY
      el.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
    }
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: "perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s, box-shadow 0.2s",
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)",
        "hover:border-(--color-brand-300) hover:shadow-[0_18px_40px_-22px_rgba(13,31,23,0.14)]",
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
