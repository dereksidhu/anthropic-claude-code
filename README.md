# BMNR Analytics (MVP)

This is a minimal Next.js + TypeScript + Tailwind scaffold for a BMNR treasury analytics site. It uses Finnhub for live quotes but falls back to mock data when FINNHUB_API_KEY is not provided.

## Quickstart

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set `FINNHUB_API_KEY` if available.
3. Start dev server: `npm run dev`

## API

- GET /api/quote?symbol=BMNR — returns current quote (mock by default)

## Notes

- This is an MVP scaffold. Next steps: add historical price requests, caching, more metrics (market cap, shares outstanding, treasury positions), and CI/deployment.
- Do not commit real API keys. Configure FINNHUB_API_KEY as a server-side environment variable (e.g., in Vercel project settings).