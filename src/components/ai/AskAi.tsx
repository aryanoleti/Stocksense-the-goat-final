"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  rich?: {
    confidence?: number;
    stock?: { symbol: string; name: string; price: number; changePct: number };
    metrics?: { label: string; value: string }[];
    bullets?: string[];
    risks?: string[];
    opportunities?: string[];
    related?: string[];
  };
};

const SUGGESTED = [
  "Should I invest in Apple?",
  "Explain TCS Q3 earnings",
  "Compare HDFC Bank and ICICI Bank",
  "Why is Reliance falling today?",
  "Is Adani Enterprises overvalued?",
  "What is a P/E ratio?",
];

const INITIAL: Message[] = [
  {
    id: "seed-1",
    role: "ai",
    text:
      "Hi, I'm Sense — your AI markets companion. I can help you research stocks, compare peers, and understand earnings. What would you like to look at?",
  },
];

export function AskAi() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  function send(prompt: string) {
    if (!prompt.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: prompt.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      setMessages((m) => [...m, buildResponse(prompt)]);
      setThinking(false);
    }, 900 + Math.random() * 700);
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
                onClick={() => send(q)}
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
              <p className="text-[11.5px] text-(--color-fg-subtle)">Powered by Sense · responses are simulated</p>
            </div>
          </div>
          <Badge tone="brand">Beta</Badge>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {messages.map((m) => (m.role === "user" ? <UserBubble key={m.id} text={m.text} /> : <AiBubble key={m.id} msg={m} />))}
          {thinking && <Thinking />}
        </div>

        <div className="border-t border-(--color-border) bg-(--color-bg) p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 focus-within:border-(--color-brand-300) focus-within:shadow-[0_18px_38px_-22px_rgba(13,31,23,0.18)]"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything — e.g. 'How is Infosys doing this quarter?'"
              rows={1}
              className="flex-1 resize-none bg-transparent px-2 py-2 text-[14.5px] text-(--color-fg) placeholder:text-(--color-fg-subtle) focus:outline-none"
            />
            <button
              type="submit"
              className="grid h-10 w-10 place-items-center rounded-xl bg-(--color-brand-700) text-white hover:bg-(--color-brand-800) disabled:opacity-50"
              disabled={!input.trim() || thinking}
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

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-tr-md bg-(--color-brand-700) px-4 py-3 text-[14.5px] text-white shadow-[0_8px_24px_-16px_rgba(11,90,60,0.45)]">
        {text}
      </div>
    </div>
  );
}

function AiBubble({ msg }: { msg: Message }) {
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
            {r.metrics && (
              <div className="grid grid-cols-4 gap-2 px-4 py-3">
                {r.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-(--color-fg-subtle)">{m.label}</p>
                    <p className="mt-0.5 text-[12.5px] font-semibold tabular">{m.value}</p>
                  </div>
                ))}
              </div>
            )}
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
        {r?.bullets && (
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
        {(r?.opportunities || r?.risks) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {r?.opportunities && (
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
            {r?.risks && (
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
        {r?.related && (
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

function buildResponse(prompt: string): Message {
  const p = prompt.toLowerCase();
  if (/(infy|infosys|tcs|hdfc|icici|sbi|reliance|adani|tata|kotak|axis|bharti|hcl|wipro)/i.test(p)) {
    const sym = (p.match(/infy|infosys|tcs|hdfc|icici|sbi|reliance|adani|tata|kotak|axis|bharti|hcl|wipro/i) ?? ["infy"])[0].toUpperCase();
    const map: Record<string, { symbol: string; name: string; price: number; changePct: number }> = {
      INFY: { symbol: "INFY", name: "Infosys", price: 1814.55, changePct: 0.62 },
      INFOSYS: { symbol: "INFY", name: "Infosys", price: 1814.55, changePct: 0.62 },
      TCS: { symbol: "TCS", name: "Tata Consultancy Services", price: 3942.10, changePct: -0.18 },
      HDFC: { symbol: "HDFCBANK", name: "HDFC Bank", price: 1698.20, changePct: 0.42 },
      ICICI: { symbol: "ICICIBANK", name: "ICICI Bank", price: 1241.85, changePct: 0.95 },
      SBI: { symbol: "SBIN", name: "State Bank of India", price: 814.30, changePct: -0.34 },
      RELIANCE: { symbol: "RELIANCE", name: "Reliance Industries", price: 2856.45, changePct: -1.20 },
      ADANI: { symbol: "ADANIENT", name: "Adani Enterprises", price: 2186.20, changePct: -1.28 },
      TATA: { symbol: "TATAMOTORS", name: "Tata Motors", price: 712.80, changePct: 1.85 },
      KOTAK: { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1748.55, changePct: 0.86 },
      AXIS: { symbol: "AXISBANK", name: "Axis Bank", price: 1098.40, changePct: -4.58 },
      BHARTI: { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1632.40, changePct: 0.88 },
      HCL: { symbol: "HCLTECH", name: "HCL Technologies", price: 1290.40, changePct: -10.51 },
      WIPRO: { symbol: "WIPRO", name: "Wipro", price: 543.80, changePct: 0.21 },
    };
    const stock = map[sym] ?? map.INFY;
    return {
      id: `a-${Date.now()}`,
      role: "ai",
      text: `Here's a quick read on ${stock.name}. The stock is ${stock.changePct >= 0 ? "up" : "down"} ${Math.abs(stock.changePct).toFixed(2)}% today. The broader picture is a mix of ${stock.changePct >= 0 ? "supportive momentum" : "near-term pressure"} and fundamentals worth understanding.`,
      rich: {
        stock,
        confidence: 78,
        metrics: [
          { label: "P/E", value: "26.5" },
          { label: "Mkt Cap", value: "₹7.5L Cr" },
          { label: "Beta", value: "0.85" },
          { label: "Div yld", value: "2.1%" },
        ],
        bullets: [
          "Earnings stable with margin tailwinds expected in H2",
          "Order book at multi-quarter highs supports topline visibility",
          "Trades at a slight discount to its 5-year average valuation",
        ],
        opportunities: [
          "Sector tailwinds from enterprise digital spend",
          "Improving free cash flow per share",
        ],
        risks: [
          "USD softness can compress reported revenues",
          "Wage inflation in skilled talent pools",
        ],
        related: ["TCS", "HCLTECH", "WIPRO"],
      },
    };
  }
  if (/p\/e|valuation|valued/i.test(p)) {
    return {
      id: `a-${Date.now()}`,
      role: "ai",
      text:
        "The P/E ratio shows how much you pay for every rupee of a company's earnings. A high P/E can signal high growth expectations — or overvaluation. Compare to peers and to the company's own historical average for context.",
      rich: {
        confidence: 92,
        bullets: [
          "P/E = Price ÷ EPS (earnings per share)",
          "Useful only when compared to peers in the same sector",
          "Always check earnings quality alongside the multiple",
        ],
      },
    };
  }
  return {
    id: `a-${Date.now()}`,
    role: "ai",
    text:
      "Good question. Here's how I'd think about that — start with what's changed in the last 90 days (earnings, news, macro), check the fundamentals you can verify (margins, debt, growth), then compare against 2-3 peers. Ask me about a specific company to go deeper.",
    rich: {
      confidence: 60,
      bullets: [
        "Look at last earnings call commentary",
        "Compare valuation to sector median",
        "Check insider activity and analyst revisions",
      ],
    },
  };
}
