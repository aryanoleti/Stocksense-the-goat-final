"use client";

import { useSyncExternalStore } from "react";
import { generateJson, hasGeminiKey, type GeminiContent, type GeminiPart } from "@/lib/api/gemini";
import { getQuote } from "@/lib/api/yahoo";
import { NIFTY_50 } from "@/lib/mock-data";

export type SenseRich = {
  confidence?: number;
  stock?: { symbol: string; name: string; price: number; changePct: number };
  bullets?: string[];
  opportunities?: string[];
  risks?: string[];
  related?: string[];
};

export type SenseImage = { mimeType: string; data: string };

export type SenseMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  image?: SenseImage;
  rich?: SenseRich;
};

type GeminiAnswer = {
  text: string;
  confidence?: number;
  symbol?: string;
  bullets?: string[];
  opportunities?: string[];
  risks?: string[];
  related?: string[];
};

const SEED_MESSAGE: SenseMessage = {
  id: "seed-1",
  role: "ai",
  text:
    "Hi, I'm Sense — your AI markets companion. I can help you research stocks, compare peers, and understand earnings. Paste or attach a screenshot of a chart or portfolio and I'll take a look, too. What would you like to know?",
};

const SYSTEM_PROMPT = `You are Sense, an AI markets assistant for Indian retail investors using a stock-research app called StockSense.
Reply briefly and clearly in plain English. Educational tone, never give explicit buy/sell advice.

The user may attach a screenshot (of a stock chart, portfolio, news article, or anything market-related). If an image is present, describe and analyse what's relevant in it as part of your answer.

You MUST respond with a single JSON object matching this TypeScript type — no markdown, no prose outside the JSON:
{
  "text": string,                              // 2-3 sentence natural-language answer
  "confidence": number,                        // 0-100, how confident you are
  "symbol"?: string,                           // NSE ticker (e.g. "RELIANCE", "INFY") if the answer focuses on one stock. Use the ticker only, no ".NS" suffix.
  "bullets"?: string[],                        // 3-5 short summary bullets
  "opportunities"?: string[],                  // up to 3 short upside points (only if relevant)
  "risks"?: string[],                          // up to 3 short downside points (only if relevant)
  "related"?: string[]                         // up to 4 related NSE tickers
}

Always use Indian-context examples and INR. If the user asks about a US stock, return its US ticker in "symbol" only if asked specifically.`;

// User context from onboarding, used to pitch answers at the right level.
type SenseUserContext = { experience?: string; name?: string };
let userContext: SenseUserContext | null = null;

export function setSenseUserContext(ctx: SenseUserContext | null) {
  userContext = ctx;
}

const EXPERIENCE_GUIDANCE: Record<string, string> = {
  new: "The user is brand new to stocks — explain simply, define any jargon you use, and don't assume prior knowledge.",
  learning: "The user is still learning the basics — briefly define key terms as you go.",
  confident: "The user is fairly confident with investing — you can use standard market terminology.",
  pro: "The user is an experienced investor — be concise and precise; skip beginner definitions.",
};

function buildSystemPrompt(): string {
  const parts = [SYSTEM_PROMPT];
  if (userContext?.experience && EXPERIENCE_GUIDANCE[userContext.experience]) {
    parts.push(`\nAbout who you're talking to: ${EXPERIENCE_GUIDANCE[userContext.experience]}`);
  }
  return parts.join("");
}

function findKnownSymbol(text: string): string | undefined {
  const upper = text.toUpperCase();
  return NIFTY_50.find((s) => upper.includes(s.symbol))?.symbol;
}

async function hydrateStockCard(answer: GeminiAnswer): Promise<SenseRich["stock"] | undefined> {
  const sym = answer.symbol?.toUpperCase();
  if (!sym) return undefined;
  const known = NIFTY_50.find((s) => s.symbol === sym);
  const name = known?.name ?? sym;
  const quote = await getQuote(sym);
  if (quote) {
    return { symbol: sym, name, price: quote.price, changePct: quote.changePct };
  }
  if (known) {
    return { symbol: sym, name: known.name, price: known.basePrice, changePct: 0 };
  }
  return undefined;
}

function fallbackResponse(prompt: string): SenseMessage {
  return {
    id: `a-${Date.now()}`,
    role: "ai",
    text: hasGeminiKey()
      ? "I couldn't reach Gemini just now — please try again in a moment."
      : "Add a NEXT_PUBLIC_GEMINI_KEY to enable real AI responses. In the meantime, " +
        "for a question like \"" + prompt + "\" I'd start with last earnings, peer multiples, and recent news.",
    rich: {
      confidence: 30,
      bullets: [
        "Check the latest quarterly results and management commentary",
        "Compare valuation multiples (P/E, P/B) to sector peers",
        "Look at recent news, analyst revisions and insider activity",
      ],
    },
  };
}

type SenseChatState = {
  messages: SenseMessage[];
  thinking: boolean;
};

// A minimal external store (no extra dependency) so the topbar quick-chat
// and the full Ask AI page share one live conversation via useSyncExternalStore.
let state: SenseChatState = { messages: [SEED_MESSAGE], thinking: false };
const listeners = new Set<() => void>();

function setState(partial: Partial<SenseChatState>) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

async function send(prompt: string, image?: SenseImage) {
  const trimmed = prompt.trim();
  if (!trimmed && !image) return;

  const userMsg: SenseMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed, image };
  const next = [...state.messages, userMsg];
  setState({ messages: next, thinking: true });

  const history: GeminiContent[] = next
    .filter((m) => m.id !== SEED_MESSAGE.id)
    .map((m) => {
      const parts: GeminiPart[] = [];
      if (m.image) parts.push({ inlineData: { mimeType: m.image.mimeType, data: m.image.data } });
      parts.push({ text: m.text || (m.image ? "What do you see in this image?" : "") });
      return { role: m.role === "user" ? ("user" as const) : ("model" as const), parts };
    });

  let aiMsg: SenseMessage;
  const answer = await generateJson<GeminiAnswer>(history, { system: buildSystemPrompt(), temperature: 0.55 });
  if (!answer) {
    aiMsg = fallbackResponse(trimmed);
  } else {
    const stock = await hydrateStockCard({
      ...answer,
      symbol: answer.symbol ?? findKnownSymbol(trimmed),
    });
    aiMsg = {
      id: `a-${Date.now()}`,
      role: "ai",
      text: answer.text,
      rich: {
        confidence: answer.confidence,
        stock,
        bullets: answer.bullets,
        opportunities: answer.opportunities,
        risks: answer.risks,
        related: answer.related,
      },
    };
  }
  setState({ messages: [...state.messages, aiMsg], thinking: false });
}

function reset() {
  setState({ messages: [SEED_MESSAGE], thinking: false });
}

// A one-shot prompt handoff: pages elsewhere in the app (e.g. a stock detail
// page's "Ask AI about X" button) queue a prompt, then navigate to /ask-ai,
// where it's consumed and auto-sent exactly once.
let queuedPrompt: string | null = null;

export function queuePrompt(text: string) {
  queuedPrompt = text.trim() || null;
}

export function consumeQueuedPrompt(): string | null {
  const q = queuedPrompt;
  queuedPrompt = null;
  return q;
}

export function useSenseChat() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { messages: snapshot.messages, thinking: snapshot.thinking, send, reset };
}
