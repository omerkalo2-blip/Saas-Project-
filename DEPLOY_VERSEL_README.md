
# Deploying BlockTax to Vercel (Vite + Serverless APIs)

## Quick Start
1. Push this folder to GitHub (new repo).
2. Go to https://vercel.com → **New Project** → Import the repo.
3. Vercel will auto-detect Vite. Use:
   - Build Command: `npm run build`
   - Output Dir: `dist`
4. Deploy → get a live URL.

## Client → Serverless
- Frontend calls:
  - `/api/feargreed` → Fear & Greed Index (cached 5m)
  - `/api/prices?per_page=100` → Coin prices in ILS (cached 60s)
  - `/api/derivatives` → Deribit options (grouped by expiry)

## Routing
`vercel.json` ensures SPA routing (all routes → index.html) while keeping `/api/*` on serverless functions.

## Notes
- Never call 3rd-party APIs directly from the browser with secrets; use `/api/*` instead.
- Add more functions in `/api` as needed (e.g., `/api/exchange-netflow`).
