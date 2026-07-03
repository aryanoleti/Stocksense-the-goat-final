// Yahoo Finance client. No key. Routed through corsproxy.io because Yahoo's
// public endpoints don't set Access-Control-Allow-Origin for browsers.

const PROXIES = [
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
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
};

export type Candle = { time: number; price: number };

export type ChartRange = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y";
export type ChartInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "1d" | "1wk";

const QUOTE_TTL_MS = 4_000;
const HISTORY_TTL_MS = 60_000;

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

async function fetchProxied(url: string): Promise<Response> {
  let lastErr: unknown;
  for (const wrap of PROXIES) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const r = await fetch(wrap(url), { cache: "no-store", signal: controller.signal });
      if (r.ok) return r;
      lastErr = new Error(`${r.status} ${r.statusText}`);
    } catch (e) {
      lastErr = e;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastErr ?? new Error("All CORS proxies failed");
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
  if (cached && Date.now() - cached.at < HISTORY_TTL_MS) return cached.value;

  return once(`chart:${key}`, async () => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        ysym,
      )}?range=${range}&interval=${interval}&includePrePost=false`;
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

const QUOTES_CHUNK_SIZE = 12;
const QUOTES_CHUNK_DELAY_MS = 250;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches quotes for a large symbol list in small concurrent chunks rather
 * than firing hundreds of requests at once — the CORS proxies this relies on
 * are free/public and rate-limit aggressively under burst load.
 */
export async function getQuotes(symbols: string[]): Promise<Record<string, Quote>> {
  const out: Record<string, Quote> = {};
  for (let i = 0; i < symbols.length; i += QUOTES_CHUNK_SIZE) {
    const chunk = symbols.slice(i, i + QUOTES_CHUNK_SIZE);
    const results = await Promise.all(chunk.map((s) => getQuote(s).then((q) => [s, q] as const)));
    for (const [s, q] of results) if (q) out[s] = q;
    if (i + QUOTES_CHUNK_SIZE < symbols.length) await sleep(QUOTES_CHUNK_DELAY_MS);
  }
  return out;
}
