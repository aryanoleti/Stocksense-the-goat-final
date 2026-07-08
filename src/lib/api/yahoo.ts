// Yahoo Finance client. No key. Yahoo's public endpoints don't send CORS
// headers, so browser calls are routed through a proxy.
//
// If NEXT_PUBLIC_YAHOO_PROXY is set (a self-hosted Cloudflare Worker — see
// worker/README.md), it's preferred: dedicated, faster, and not shared/
// rate-limited. The free public proxies stay as automatic fallback, so the
// app works with or without the Worker.
const OWN_PROXY = process.env.NEXT_PUBLIC_YAHOO_PROXY?.replace(/\/+$/, "");
const PROXIES = [
  ...(OWN_PROXY ? [(u: string) => `${OWN_PROXY}/?url=${encodeURIComponent(u)}`] : []),
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
];

export type Quote = {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePct: number;
  currency: string;
  dayHigh?: number;
  dayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  volume?: number;
};

export type Candle = { time: number; price: number };

export type ChartRange = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y";
export type ChartInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "1d" | "1wk";

const QUOTE_TTL_MS = 3_000;

// Intraday ranges tick within the trading day, so keep them fresh; daily and
// longer ranges only change once per session, so cache them far longer.
function chartTtl(range: ChartRange): number {
  return range === "1d" || range === "5d" ? 3_500 : 60_000;
}

type CacheEntry<T> = { at: number; value: T };
const quoteCache = new Map<string, CacheEntry<Quote>>();
const chartCache = new Map<string, CacheEntry<{ quote: Quote; candles: Candle[] }>>();
const inflight = new Map<string, Promise<unknown>>();

export function yahooSymbol(symbol: string): string {
  if (symbol.startsWith("^") || symbol.includes(".")) return symbol;
  const indexMap: Record<string, string> = {
    NIFTY50: "^NSEI",
    NIFTY: "^NSEI",
    SENSEX: "^BSESN",
    BANKNIFTY: "^NSEBANK",
    NIFTYBANK: "^NSEBANK",
    NIFTYIT: "^CNXIT",
    NIFTYAUTO: "^CNXAUTO",
    NIFTYPHARMA: "^CNXPHARMA",
    NIFTYFMCG: "^CNXFMCG",
    NIFTYMETAL: "^CNXMETAL",
  };
  if (indexMap[symbol]) return indexMap[symbol];
  // NSE stocks live under `.NS` on Yahoo.
  return `${symbol}.NS`;
}

const FETCH_TIMEOUT_MS = 8_000;
// If the preferred proxy hasn't answered within this window, race the backup
// too and take whichever responds first — cuts tail latency (a slow/hung
// proxy no longer blocks the whole request) without always doubling load.
const HEDGE_AFTER_MS = 1_200;

// Sticky proxy: once a proxy answers, try it first for subsequent requests.
let preferredProxy = 0;

async function fetchProxied(url: string): Promise<Response> {
  const a = preferredProxy;
  const b = (preferredProxy + 1) % PROXIES.length;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let settled = false;

  const attempt = (idx: number, delayMs: number) =>
    new Promise<Response>((resolve, reject) => {
      setTimeout(async () => {
        // Preferred already won during the hedge delay — skip the backup fetch.
        if (settled) return reject(new Error("skipped"));
        try {
          const r = await fetch(PROXIES[idx](url), { cache: "no-store", signal: controller.signal });
          if (!r.ok) return reject(new Error(`${r.status} ${r.statusText}`));
          settled = true;
          preferredProxy = idx;
          resolve(r);
        } catch (e) {
          reject(e);
        }
      }, delayMs);
    });

  try {
    return await Promise.any([attempt(a, 0), attempt(b, HEDGE_AFTER_MS)]);
  } catch (agg) {
    const err = (agg as AggregateError).errors?.find((e) => (e as Error)?.message !== "skipped");
    throw err ?? new Error("All CORS proxies failed");
  } finally {
    clearTimeout(timeout);
  }
}

function once<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

type YahooChartResult = {
  meta: {
    symbol: string;
    currency: string;
    regularMarketPrice: number;
    chartPreviousClose?: number;
    previousClose?: number;
    regularMarketDayHigh?: number;
    regularMarketDayLow?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    regularMarketVolume?: number;
  };
  timestamp?: number[];
  indicators: { quote: Array<{ close?: (number | null)[] }> };
};

function parseChart(symbol: string, result: YahooChartResult): { quote: Quote; candles: Candle[] } {
  const meta = result.meta;
  const prev = meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPrice;
  const price = meta.regularMarketPrice;
  const change = price - prev;
  const changePct = prev ? (change / prev) * 100 : 0;
  const quote: Quote = {
    symbol,
    price,
    previousClose: prev,
    change,
    changePct,
    currency: meta.currency,
    dayHigh: meta.regularMarketDayHigh,
    dayLow: meta.regularMarketDayLow,
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
    volume: meta.regularMarketVolume,
  };
  const ts = result.timestamp ?? [];
  const closes = result.indicators.quote[0]?.close ?? [];
  const candles: Candle[] = [];
  for (let i = 0; i < ts.length; i++) {
    const c = closes[i];
    if (c == null) continue;
    candles.push({ time: ts[i] * 1000, price: c });
  }
  return { quote, candles };
}

export async function getChart(
  symbol: string,
  range: ChartRange = "1d",
  interval: ChartInterval = "1m",
): Promise<{ quote: Quote; candles: Candle[] } | null> {
  const ysym = yahooSymbol(symbol);
  const key = `${ysym}|${range}|${interval}`;
  const cached = chartCache.get(key);
  if (cached && Date.now() - cached.at < chartTtl(range)) return cached.value;

  return once(`chart:${key}`, async () => {
    try {
      // Raw symbol — fetchProxied encodes the whole URL once for the proxy;
      // pre-encoding here would double-encode symbols like M&M.NS or ^NSEI.
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ysym}?range=${range}&interval=${interval}&includePrePost=false`;
      const r = await fetchProxied(url);
      const json: { chart: { result?: YahooChartResult[]; error?: { description?: string } } } =
        await r.json();
      const result = json.chart.result?.[0];
      if (!result) return null;
      const parsed = parseChart(symbol, result);
      chartCache.set(key, { at: Date.now(), value: parsed });
      return parsed;
    } catch {
      return null;
    }
  });
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  const ysym = yahooSymbol(symbol);
  const cached = quoteCache.get(ysym);
  if (cached && Date.now() - cached.at < QUOTE_TTL_MS) return cached.value;

  return once(`quote:${ysym}`, async () => {
    const chart = await getChart(symbol, "1d", "1m");
    if (!chart) return null;
    quoteCache.set(ysym, { at: Date.now(), value: chart.quote });
    return chart.quote;
  });
}

// Yahoo hard-rejects spark requests with more than 20 symbols
// ("Number of symbols needs to be less than or equal to 20").
const SPARK_CHUNK_SIZE = 20;
const SPARK_CHUNK_DELAY_MS = 300;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Yahoo's spark endpoint returns data for MANY symbols in a single request —
// the only way batch quoting survives free public CORS proxies, which
// rate-limit per request. Live response shape (verified) is a flat map:
//   { "TCS.NS": { symbol, timestamp[], close[], previousClose, chartPreviousClose } }
// Older/enveloped deployments return { spark: { result: [{ symbol, response: [chartResult] }] } }.
type SparkFlat = {
  symbol?: string;
  timestamp?: number[];
  close?: (number | null)[];
  previousClose?: number;
  chartPreviousClose?: number;
};
type SparkEnvelope = {
  spark?: { result?: Array<{ symbol: string; response?: YahooChartResult[] }> };
} & Record<string, unknown>;

function sparkEntries(json: SparkEnvelope): Array<[string, unknown]> {
  if (json.spark?.result) {
    return json.spark.result
      .filter((r) => r.response?.[0])
      .map((r) => [r.symbol, r.response![0]] as [string, unknown]);
  }
  return Object.entries(json).filter(
    ([, v]) => typeof v === "object" && v !== null && ("close" in v || "meta" in v),
  );
}

function quoteFromSpark(app: string, entry: unknown): Quote | null {
  if (!entry || typeof entry !== "object") return null;
  const e = entry as Partial<YahooChartResult> & SparkFlat;
  if (e.meta && e.indicators) {
    try {
      return parseChart(app, e as YahooChartResult).quote;
    } catch {
      return null;
    }
  }
  const closes = (e.close ?? []).filter((c): c is number => c != null);
  const price = closes.length > 0 ? closes[closes.length - 1] : undefined;
  const prev = e.chartPreviousClose ?? e.previousClose ?? price;
  if (price == null || prev == null) return null;
  const change = price - prev;
  return {
    symbol: app,
    price,
    previousClose: prev,
    change,
    changePct: prev ? (change / prev) * 100 : 0,
    currency: "INR",
  };
}

/**
 * Batch quotes via /v8/finance/spark — one proxied request per 20 symbols
 * (Yahoo's hard cap) instead of one per symbol. Missing/failed symbols are
 * simply absent from the result; callers keep their previous values.
 * `onPartial` fires after each chunk so UIs can paint prices as they stream
 * in rather than waiting for the whole batch.
 */
export async function getQuotes(
  symbols: string[],
  onPartial?: (partial: Record<string, Quote>) => void,
): Promise<Record<string, Quote>> {
  const bySpark = new Map<string, string>(); // yahoo symbol -> app symbol
  for (const s of symbols) bySpark.set(yahooSymbol(s), s);
  const ysyms = [...bySpark.keys()];

  const out: Record<string, Quote> = {};
  for (let i = 0; i < ysyms.length; i += SPARK_CHUNK_SIZE) {
    const chunk = ysyms.slice(i, i + SPARK_CHUNK_SIZE);
    try {
      // Raw commas/symbols here — fetchProxied encodes the entire URL exactly
      // once for the proxy's ?url= param; pre-encoding would double-encode.
      const url = `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${chunk.join(
        ",",
      )}&range=1d&interval=15m&includePrePost=false`;
      const r = await fetchProxied(url);
      const json: SparkEnvelope = await r.json();
      const partial: Record<string, Quote> = {};
      for (const [ysym, entry] of sparkEntries(json)) {
        const app = bySpark.get(ysym);
        if (!app) continue;
        const quote = quoteFromSpark(app, entry);
        if (quote) {
          out[app] = quote;
          partial[app] = quote;
          quoteCache.set(ysym, { at: Date.now(), value: quote });
        }
      }
      if (onPartial && Object.keys(partial).length > 0) onPartial(partial);
    } catch {
      /* whole chunk failed — callers retry on their next interval */
    }
    if (i + SPARK_CHUNK_SIZE < ysyms.length) await sleep(SPARK_CHUNK_DELAY_MS);
  }
  return out;
}
