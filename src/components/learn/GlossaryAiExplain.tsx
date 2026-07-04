"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { generate, hasGeminiKey } from "@/lib/api/gemini";
import { useAuth } from "@/lib/auth/AuthContext";
import { EXPERIENCE_LABELS } from "@/lib/auth/types";

// Per-term AI explainer for the glossary — deepens the static definition with a
// concrete, Indian-context example, pitched at the signed-in user's experience
// level. Part of the app's AI-integrated learning.
export function GlossaryAiExplain({ term, definition }: { term: string; definition: string }) {
  const { user } = useAuth();
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!hasGeminiKey()) return null;

  const experience = user?.profile?.experience;
  const level = experience ? EXPERIENCE_LABELS[experience] : "a curious beginner";

  async function explain() {
    if (loading) return;
    setLoading(true);
    const prompt = `Explain the stock-market term "${term}" to ${level}. Keep it to 2-3 short sentences in plain English, then give one concrete example using an Indian company or the Indian market. Do not give buy/sell advice.

Existing short definition for reference: ${definition}`;
    const result = await generate([{ role: "user", parts: [{ text: prompt }] }], { temperature: 0.5 });
    setText(result ?? "Couldn't generate an explanation right now — try again in a moment.");
    setLoading(false);
  }

  return (
    <div className="mt-3 border-t border-(--color-border) pt-3">
      {text ? (
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--color-brand-700)" />
          <p className="text-[12.5px] leading-relaxed text-(--color-fg)">{text}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={explain}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-(--color-brand-700) hover:underline disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Asking Sense…
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" /> Explain with an example
            </>
          )}
        </button>
      )}
    </div>
  );
}
