# hackpilot

The user-facing HackPilot product: marketing site, auth, and a dashboard covering Profile, Teams, the Idea & Research Engines, Checklist, Win Framework, Pitch Builder (Pro), and Billing. Next.js 16 (App Router), React 19, Tailwind CSS v4.

**This repo also hosts the project's real documentation** — a living docs site at `/docs`, not this README. Run the dev server and start there for architecture, the full API reference, and how every feature actually works: `npm run dev` then visit `http://localhost:3000/docs`.

## Setup

```bash
npm install
npm run dev   # http://localhost:3000
```

Requires `hackpilot-backend` running (default `http://localhost:8080`) for anything beyond the landing page — every dashboard feature proxies through this app's `/api/*` routes to the Go backend, which in turn needs `hackpilot-agent` for the Idea/Research Engines and Pitch Builder, and Razorpay test-mode keys to exercise the billing flow. See `/docs/getting-started` for the full local setup across all repos.

## Commands

```bash
npm run build
npm run lint
```

## Structure

App Router route groups: `(auth)` (sign-in wired; sign-up/forgot/reset-password are still UI-only), `(dashboard)` (every feature, protected by `proxy.ts`), and `docs` (this repo's own documentation site). Design tokens live in `app/globals.css` under `@theme` — see `design.md` at the repo root before writing any UI, and `CLAUDE.md` for the rest of this repo's conventions.
