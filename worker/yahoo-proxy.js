// StockSense Yahoo Finance proxy — Cloudflare Worker.
//
// Why: the app is a static site, and Yahoo's endpoints don't send CORS
// headers, so the browser can't call them directly. The free public proxies
// (allorigins, corsproxy) work but are shared, flaky, and rate-limited. This
// Worker is your own dedicated proxy: faster, reliable, and it adds a short
// edge cache so bursts of page views don't hammer Yahoo.
//
// It ONLY proxies Yahoo Finance hosts — it is not an open relay.
//
// Deploy, then set the GitHub Actions secret YAHOO_PROXY to this Worker's URL
// (e.g. https://ss-yahoo.<you>.workers.dev). See worker/README.md.

const ALLOWED_HOSTS = new Set(["query1.finance.yahoo.com", "query2.finance.yahoo.com"]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    const target = new URL(request.url).searchParams.get("url");
    if (!target) {
      return new Response("Missing ?url= parameter", { status: 400, headers: CORS });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response("Invalid target url", { status: 400, headers: CORS });
    }
    // Never become an open proxy — Yahoo Finance hosts only.
    if (!ALLOWED_HOSTS.has(targetUrl.hostname)) {
      return new Response("Host not allowed", { status: 403, headers: CORS });
    }

    const cache = caches.default;
    const cacheKey = new Request(targetUrl.toString());
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    let upstream;
    try {
      upstream = await fetch(targetUrl.toString(), {
        headers: { "User-Agent": UA, Accept: "application/json" },
        cf: { cacheTtl: 3, cacheEverything: true },
      });
    } catch (e) {
      return new Response(`Upstream fetch failed: ${e}`, { status: 502, headers: CORS });
    }

    const resp = new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json",
        // Short cache: intraday data only changes every minute or so anyway.
        "Cache-Control": "public, max-age=3",
        ...CORS,
      },
    });

    if (upstream.ok) ctx.waitUntil(cache.put(cacheKey, resp.clone()));
    return resp;
  },
};
