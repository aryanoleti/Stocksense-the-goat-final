"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellOff } from "lucide-react";

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-fg-muted) hover:bg-(--color-surface-2)"
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px]" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-40 w-64 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-center shadow-[0_24px_60px_-24px_rgba(13,31,23,0.22)] animate-fade-up"
        >
          <BellOff className="mx-auto h-5 w-5 text-(--color-fg-subtle)" />
          <p className="mt-2 text-[13px] font-medium text-(--color-fg)">No notifications yet</p>
          <p className="mt-1 text-[11.5px] text-(--color-fg-subtle)">
            We&apos;ll let you know when there&apos;s something worth seeing.
          </p>
        </div>
      )}
    </div>
  );
}
