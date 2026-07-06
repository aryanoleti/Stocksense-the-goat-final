"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, Sparkles, ArrowUpRight, Loader2 } from "lucide-react";
import { UNIVERSE } from "@/lib/universe";
import { useSenseChat } from "@/lib/ai/sense-chat-store";

const AI_PREFIX = /^\/ai\s*/i;

export function TopbarSearch() {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, thinking, send } = useSenseChat();

  const isAiMode = AI_PREFIX.test(q);
  const aiPrompt = q.replace(AI_PREFIX, "");

  const results = useMemo(() => {
    if (isAiMode || !q.trim()) return [];
    const lower = q.toLowerCase();
    return UNIVERSE.filter(
      (s) =>
        s.symbol.toLowerCase().includes(lower) ||
        s.name.toLowerCase().includes(lower) ||
        s.sector.toLowerCase().includes(lower),
    ).slice(0, 6);
  }, [q, isAiMode]);

  // Cmd/Ctrl+K focuses the search bar from anywhere in the app.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (isAiMode) {
      if (!aiPrompt.trim() || thinking) return;
      send(aiPrompt);
      setQ("/ai ");
      return;
    }
    const top = results[0];
    if (top) {
      router.push(`/stocks/${top.symbol}`);
      setQ("");
      inputRef.current?.blur();
    }
  }

  const lastAi = [...messages].reverse().find((m) => m.role === "ai");
  const showDropdown = focus && (isAiMode || q.trim().length > 0);

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-fg-subtle)" />
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Search stocks, sectors, or type /ai to ask…"
        className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-surface) pl-10 pr-3 text-sm placeholder:text-(--color-fg-subtle) focus:border-(--color-brand-300) focus:ring-4 focus:ring-(--color-brand-50) focus:outline-none"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] font-semibold text-(--color-fg-subtle) bg-(--color-surface-2) border border-(--color-border) rounded px-1.5 py-0.5">
        ⌘K
      </span>

      {showDropdown && isAiMode && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_24px_60px_-24px_rgba(13,31,23,0.22)]">
          <div className="flex items-center gap-2 border-b border-(--color-border) px-4 py-3">
            <Sparkles className="h-4 w-4 text-(--color-brand-700)" />
            <p className="text-[12.5px] font-semibold text-(--color-fg)">Ask Sense</p>
          </div>
          <div className="max-h-64 overflow-y-auto px-4 py-3">
            {thinking ? (
              <p className="inline-flex items-center gap-2 text-[13px] text-(--color-fg-muted)">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
              </p>
            ) : lastAi ? (
              <p className="text-[13.5px] leading-relaxed text-(--color-fg)">{lastAi.text}</p>
            ) : (
              <p className="text-[13px] text-(--color-fg-subtle)">Type a question and press Enter.</p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-(--color-border) px-4 py-2.5">
            <Link href="/ask-ai" className="inline-flex items-center gap-1 text-[12px] font-semibold text-(--color-brand-700) hover:underline">
              Open full conversation <ArrowUpRight className="h-3 w-3" />
            </Link>
            <span className="inline-flex items-center gap-1 text-[11px] text-(--color-fg-subtle)">
              <CornerDownLeft className="h-3 w-3" /> Enter to ask
            </span>
          </div>
        </div>
      )}

      {showDropdown && !isAiMode && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_24px_60px_-24px_rgba(13,31,23,0.22)]">
          {results.length > 0 && (
            <ul className="max-h-72 overflow-y-auto py-1.5">
              {results.map((r) => (
                <li key={r.symbol}>
                  <Link
                    href={`/stocks/${r.symbol}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-(--color-surface-2)"
                    onClick={() => setQ("")}
                  >
                    <div>
                      <p className="text-[13px] font-semibold tracking-tight text-(--color-fg)">{r.symbol}</p>
                      <p className="text-[11px] text-(--color-fg-subtle)">{r.name} • {r.sector}</p>
                    </div>
                    <span className="rounded-full bg-(--color-surface-2) px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-(--color-fg-muted)">NSE</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {results.length === 0 && (
            <p className="px-4 py-3 text-[12.5px] text-(--color-fg-subtle)">No stocks matched &ldquo;{q}&rdquo;.</p>
          )}
          <button
            type="button"
            onClick={() => setQ(`/ai ${q}`)}
            className="flex w-full items-center justify-between gap-3 border-t border-(--color-border) px-4 py-2.5 text-left text-(--color-brand-700) hover:bg-(--color-brand-50)"
          >
            <span className="inline-flex items-center gap-2 text-[12.5px] font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Ask Sense: &ldquo;{q}&rdquo;
            </span>
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
