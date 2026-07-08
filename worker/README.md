# StockSense Yahoo proxy (Cloudflare Worker)

Your own dedicated CORS proxy for Yahoo Finance, replacing the flaky free
public proxies. It's free (Cloudflare Workers free plan), faster, more
reliable, and edge-caches responses for a few seconds so page views don't
hammer Yahoo. It only proxies Yahoo Finance hosts — it is not an open relay.

The app automatically prefers this proxy **if** the build has
`NEXT_PUBLIC_YAHOO_PROXY` set, and falls back to the free public proxies
otherwise. So deploying it is purely an upgrade — nothing breaks if you skip it.

## Deploy — dashboard (easiest, ~3 min)

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** →
   **Create Worker**. Name it e.g. `ss-yahoo`, click **Deploy**.
2. Click **Edit code**, delete the sample, paste the contents of
   [`yahoo-proxy.js`](./yahoo-proxy.js), then **Deploy**.
3. Copy the Worker URL shown (looks like
   `https://ss-yahoo.<your-subdomain>.workers.dev`).

## Deploy — CLI (if you use wrangler)

```bash
cd worker
npx wrangler deploy      # prints the *.workers.dev URL on success
```

## Wire it into the site

1. In the repo on GitHub: **Settings → Secrets and variables → Actions →
   New repository secret**.
   - Name: `YAHOO_PROXY`
   - Value: the Worker URL from above (no trailing slash), e.g.
     `https://ss-yahoo.aryanoleti.workers.dev`
2. Re-run the latest **Deploy Next.js site to Pages** workflow (Actions tab →
   latest run → **Re-run all jobs**), or push any commit. The build injects it
   as `NEXT_PUBLIC_YAHOO_PROXY` and the app starts using your Worker first.

## Verify

Open the site, load the Stocks page, and in DevTools → Network you should see
requests going to `ss-yahoo.*.workers.dev` instead of `allorigins.win` /
`corsproxy.io`. Prices should fill in faster and stop dropping to "—".

## Notes

- The Worker URL is not a secret (it's visible in the bundle either way), but
  storing it as a GitHub secret keeps the workflow consistent with the others.
- Free plan allowance is 100,000 requests/day — far more than this app needs.
- This removes the shared-proxy bottleneck, so refresh is more reliable and can
  be tightened further later. It does **not** add BSE data (Yahoo still doesn't
  price BSE); that needs a paid feed.
