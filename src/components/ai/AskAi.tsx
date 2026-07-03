"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Bot, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSenseChat, consumeQueuedPrompt, type SenseMessage } from "@/lib/ai/sense-chat-store";
import { readImageFile, type ReadImageResult } from "@/lib/ai/read-image-file";

const SUGGESTED = [
  "Should I invest in Apple?",
  "Explain TCS Q3 earnings",
  "Compare HDFC Bank and ICICI Bank",
  "Why is Reliance falling today?",
  "Is Adani Enterprises overvalued?",
  "What is a P/E ratio?",
];

export function AskAi() {
  const { messages, thinking, send } = useSenseChat();
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<ReadImageResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  // If another page queued a prompt (e.g. "Ask AI about RELIANCE") before
  // navigating here, send it once on mount.
  useEffect(() => {
    const queued = consumeQueuedPrompt();
    if (queued) send(queued);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(prompt: string) {
    const image = pendingImage;
    setInput("");
    setPendingImage(null);
    await send(prompt, image ? { mimeType: image.mimeType, data: image.data } : undefined);
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const result = await readImageFile(file);
    if (result) setPendingImage(result);
  }

  return (
    <div className="grid h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:flex flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-(--color-brand-700) text-white">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[14px] font-semibold tracking-tight">Sense</p>
            <p className="text-[11.5px] text-(--color-fg-subtle)">AI markets assistant</p>
          </div>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.14em] font-semibold text-(--color-fg-subtle)">
          Try asking
        </p>
        <ul className="mt-3 space-y-1.5">
          {SUGGESTED.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => submit(q)}
                className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-left text-[13px] text-(--color-fg) hover:border-(--color-brand-300) hover:bg-(--color-brand-50)"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3 text-[11.5px] leading-relaxed text-(--color-fg-muted)">
          Sense is for educational use only. Not financial advice. Always cross-check critical info.
        </div>
      </aside>

      <Card padding="none" className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-(--color-brand-50) text-(--color-brand-700)">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[14px] font-semibold tracking-tight">Ask the AI</p>
              <p className="text-[11.5px] text-(--color-fg-subtle)">Powered by Gemini · live prices via Yahoo Finance</p>
            </div>
          </div>
          <Badge tone="brand">Beta</Badge>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {messages.map((m) => (m.role === "user" ? <UserBubble key={m.id} msg={m} /> : <AiBubble key={m.id} msg={m} />))}
          {thinking && <Thinking />}
        </div>

        <div className="border-t border-(--color-border) bg-(--color-bg) p-4">
          {pendingImage && (
            <div className="mb-2 flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingImage.dataUrl} alt="Attached screenshot" className="h-12 w-12 rounded-lg object-cover" />
              <p className="flex-1 text-[12.5px] text-(--color-fg-muted)">Screenshot attached</p>
              <button
                type="button"
                onClick={() => setPendingImage(null)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-(--color-fg-subtle) hover:bg-(--color-surface-2) hover:text-(--color-fg)"
                aria-label="Remove attached image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() || pendingImage) submit(input);
            }}
            className="flex items-end gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 focus-within:border-(--color-brand-300) focus-within:shadow-[0_18px_38px_-22px_rgba(13,31,23,0.18)]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-(--color-fg-subtle) hover:bg-(--color-surface-2) hover:text-(--color-fg)"
              aria-label="Attach a screenshot"
              title="Attach a screenshot"
            >
              <ImagePlus className="h-[18px] w-[18px]" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={async (e) => {
                const file = Array.from(e.clipboardData.items)
                  .find((item) => item.type.startsWith("image/"))
                  ?.getAsFile();
                if (!file) return;
                e.preventDefault();
                const result = await readImageFile(file);
                if (result) setPendingImage(result);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() || pendingImage) submit(input);
                }
              }}
              placeholder="Ask anything, or paste a screenshot — e.g. 'How is Infosys doing this quarter?'"
              rows={1}
              className="flex-1 resize-none bg-transparent px-2 py-2 text-[14.5px] text-(--color-fg) placeholder:text-(--color-fg-subtle) focus:outline-none"
            />
            <button
              type="submit"
              className="grid h-10 w-10 place-items-center rounded-xl bg-(--color-brand-700) text-white hover:bg-(--color-brand-800) disabled:opacity-50"
              disabled={(!input.trim() && !pendingImage) || thinking}
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-(--color-fg-subtle)">
            Sense can make mistakes. Verify important information before acting.
          </p>
        </div>
      </Card>
    </div>
  );
}

function UserBubble({ msg }: { msg: SenseMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] space-y-2">
        {msg.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:${msg.image.mimeType};base64,${msg.image.data}`}
            alt="Attached screenshot"
            className="ml-auto max-h-52 rounded-2xl border border-(--color-border) object-contain"
          />
        )}
        {msg.text && (
          <div className="rounded-2xl rounded-tr-md bg-(--color-brand-700) px-4 py-3 text-[14.5px] text-white shadow-[0_8px_24px_-16px_rgba(11,90,60,0.45)]">
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}

function AiBubble({ msg }: { msg: SenseMessage }) {
  const r = msg.rich;
  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--color-brand-50) text-(--color-brand-700)">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="max-w-[78%] space-y-3">
        <div className="rounded-2xl rounded-tl-md border border-(--color-border) bg-(--color-surface) px-4 py-3 text-[14.5px] leading-relaxed text-(--color-fg)">
          {msg.text}
        </div>
        {r?.stock && (
          <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
            <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-3">
              <div>
                <p className="text-[13.5px] font-semibold tracking-tight">{r.stock.symbol}</p>
                <p className="text-[11.5px] text-(--color-fg-subtle)">{r.stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-semibold tabular">₹{r.stock.price.toFixed(2)}</p>
                <p className={`text-[11.5px] font-semibold tabular ${r.stock.changePct >= 0 ? "text-(--color-up)" : "text-(--color-down)"}`}>
                  {r.stock.changePct >= 0 ? "+" : ""}
                  {r.stock.changePct.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="border-t border-(--color-border) bg-(--color-surface-2) px-4 py-2">
              <Link
                href={`/stocks/${r.stock.symbol}`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-(--color-brand-700) hover:underline"
              >
                Open full report <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
        {r?.bullets && r.bullets.length > 0 && (
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
            <CardEyebrow>Summary</CardEyebrow>
            <ul className="mt-2 space-y-1.5 text-[13.5px] text-(--color-fg)">
              {r.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-brand-600)" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {((r?.opportunities && r.opportunities.length > 0) || (r?.risks && r.risks.length > 0)) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {r?.opportunities && r.opportunities.length > 0 && (
              <div className="rounded-2xl border border-(--color-up)/20 bg-(--color-up-soft)/40 p-4">
                <CardEyebrow className="text-(--color-up)">Opportunities</CardEyebrow>
                <ul className="mt-2 space-y-1.5 text-[13px] text-(--color-fg)">
                  {r.opportunities.map((o, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--color-up)" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {r?.risks && r.risks.length > 0 && (
              <div className="rounded-2xl border border-(--color-down)/20 bg-(--color-down-soft)/40 p-4">
                <CardEyebrow className="text-(--color-down)">Risks</CardEyebrow>
                <ul className="mt-2 space-y-1.5 text-[13px] text-(--color-fg)">
                  {r.risks.map((o, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--color-down)" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {typeof r?.confidence === "number" && (
          <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-(--color-fg-subtle)">
              AI confidence
            </p>
            <div className="flex-1 overflow-hidden rounded-full bg-(--color-surface-2)">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${r.confidence}%`, background: "linear-gradient(90deg, #6fb98e, #115e3c)" }}
              />
            </div>
            <p className="text-[12px] font-semibold tabular">{r.confidence}%</p>
          </div>
        )}
        {r?.related && r.related.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11.5px] text-(--color-fg-subtle)">Related:</span>
            {r.related.map((sym) => (
              <Link
                key={sym}
                href={`/stocks/${sym}`}
                className="rounded-full border border-(--color-border) bg-(--color-surface) px-2.5 py-0.5 text-[11.5px] font-medium text-(--color-fg-muted) hover:border-(--color-brand-300) hover:text-(--color-brand-700)"
              >
                {sym}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--color-brand-50) text-(--color-brand-700)">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-(--color-border) bg-(--color-surface) px-4 py-3">
        <Dot />
        <Dot delay={120} />
        <Dot delay={240} />
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="block h-1.5 w-1.5 rounded-full bg-(--color-fg-subtle) animate-pulse-dot"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
