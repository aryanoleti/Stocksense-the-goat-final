// Google Gemini client. Calls v1beta generateContent from the browser using
// an API key (NEXT_PUBLIC_*). For chat we ask the model to return JSON so
// the UI can render rich response cards.

const KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
// gemini-2.5-flash answers these short prompts in ~1-3s; a low ceiling means a
// hung connection fails fast and retries instead of blocking the UI for 20s.
const TIMEOUT_MS = 11_000;

export type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };
export type GeminiContent = { role: "user" | "model"; parts: GeminiPart[] };

type GenerateOptions = {
  system?: string;
  responseJson?: boolean;
  temperature?: number;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
};

export function hasGeminiKey() {
  return !!KEY;
}

// Rate limits (429) and transient 5xx are routine on the free Gemini tier —
// retrying with backoff turns most "couldn't reach Gemini" moments into a
// slightly slower answer instead of an error.
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [700, 2_000];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generate(
  contents: GeminiContent[],
  opts: GenerateOptions = {},
): Promise<string | null> {
  if (!KEY) return null;
  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.6,
      ...(opts.responseJson ? { responseMimeType: "application/json" } : {}),
    },
  };
  if (opts.system) {
    body.systemInstruction = { role: "system", parts: [{ text: opts.system }] };
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let retryable = false;
    try {
      const r = await fetch(`${ENDPOINT}?key=${encodeURIComponent(KEY)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: controller.signal,
      });
      if (!r.ok) {
        const errBody = await r.text().catch(() => "");
        console.error(`[gemini] ${r.status} ${r.statusText} (attempt ${attempt + 1})`, errBody.slice(0, 500));
        // 429 = rate limit, 5xx = server hiccup — both worth retrying.
        retryable = r.status === 429 || r.status >= 500;
        if (!retryable) return null;
      } else {
        const json: GeminiResponse = await r.json();
        if (json.promptFeedback?.blockReason) {
          console.error("[gemini] blocked:", json.promptFeedback.blockReason);
          return null;
        }
        const candidate = json.candidates?.[0];
        const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? null;
        if (text) return text;
        console.error("[gemini] empty response, finishReason:", candidate?.finishReason);
        retryable = true; // occasional empty candidates recover on retry
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        console.error(`[gemini] request timed out after ${TIMEOUT_MS}ms (attempt ${attempt + 1})`);
      } else {
        console.error(`[gemini] request failed (attempt ${attempt + 1}):`, err);
      }
      retryable = true; // network blips and timeouts are worth one more go
    } finally {
      clearTimeout(timeout);
    }
    if (!retryable || attempt === MAX_ATTEMPTS - 1) break;
    await sleep(BACKOFF_MS[attempt] ?? 3_000);
  }
  return null;
}

export async function generateJson<T>(
  contents: GeminiContent[],
  opts: Omit<GenerateOptions, "responseJson"> = {},
): Promise<T | null> {
  const text = await generate(contents, { ...opts, responseJson: true });
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    // Models occasionally wrap JSON in ```json fences; strip and retry.
    const stripped = text
      .replace(/^\s*```(?:json)?/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    try {
      return JSON.parse(stripped) as T;
    } catch {
      return null;
    }
  }
}
