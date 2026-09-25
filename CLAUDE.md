# hackpilot (user web app)

Next.js 16 (App Router, React 19) marketing site + authenticated dashboard for end users. This app has **no direct database access** — it is a thin BFF over `hackpilot-backend` (Go API on `:8080`). Every piece of dynamic data flows: browser → `app/api/*` route → `hackpilot-backend` → MongoDB.

> `AGENTS.md` in this repo is auto-generated/rewritten by `next dev` (Next.js's own agent-rules block) — don't hand-edit it or rely on it for project conventions; this file is the real source of truth.

## Run

```bash
npm run dev      # localhost:3000, requires hackpilot-backend running on :8080 (or set API_BASE_URL)
npm run build
npm run lint      # eslint — run before considering a change done
```

No test suite exists yet.

## Architecture — same-origin proxy, never call the Go backend from the browser

- `lib/api.ts` defines `API_BASE_URL` (server-only env var, defaults to `http://localhost:8080`) — **this must never be imported into a Client Component or exposed via `NEXT_PUBLIC_*`.** All browser code calls same-origin `/api/*` routes; those Route Handlers (`app/api/**/route.ts`) are the only code allowed to `fetch(API_BASE_URL + ...)`.
- Each `app/api/<resource>/**` folder mirrors a `hackpilot-backend` route group 1:1 (`auth`, `teams`, `ideas`, `research`, `checklist`, `framework`, `pitch`, `profile`) — when the backend adds an endpoint, add the matching proxy route here, don't bypass the proxy layer.
- Auth cookies (`lib/cookies.ts`) hold access + refresh JWTs. `proxy.ts` (Next's middleware) runs on every matched dashboard route (see its `config.matcher`): if the access token is expired/unreadable it silently rotates it via `/api/v1/auth/refresh` and re-sets both cookies before the request continues; if there's no valid refresh token either, it redirects to `/sign-in`. Server Components can't set cookies mid-render, which is exactly why this rotation logic lives in middleware and not a layout — don't try to move it.
- Route groups: `(auth)` = unauthenticated pages (sign-in/up, password reset), `(dashboard)` = authenticated app shell, `docs` = static documentation pages (architecture/API reference/getting-started) — keep new authenticated pages under `(dashboard)`, not top-level `app/`.

## Design system — read `design.md` before writing any UI

All visual tokens (color, type scale, spacing, radius, component patterns for buttons/inputs/cards) are defined in `app/globals.css` under `@theme` and documented in `design.md` at the repo root. Rules that matter:
- Use Tailwind utility tokens (`bg-primary`, `text-on-surface-variant`, `text-headline-lg`, `p-space-lg`, etc.) — never raw hex colors or ad hoc px values for anything `design.md` already has a token for.
- Two fonts only: `font-display` (Plus Jakarta Sans — headlines/buttons/labels) and `font-body` (Inter — paragraphs/body text). Never add a third.
- Copy an existing component pattern (button/input/card classes) from `design.md` or a neighboring component rather than inventing new Tailwind combinations for the same UI role.

## Conventions

- Feature folders under `components/` mirror dashboard sections (`ideas/`, `research/`, `pitch/`, `framework/`, `checklist/`, `teams/`, `profile/`) plus `landing/` (marketing page, uses GSAP + Lenis for scroll animation — see `components/landing/gsap.ts` / `use-scroll-reveal.ts`) and `shared/` (cross-feature primitives). Put a new component in the folder matching its feature, not in `shared/` unless it's genuinely reused across features.
- `lib/types.ts` holds shared TS types mirrored from backend DTOs — when a backend DTO shape changes, update this file to match; don't let a proxy route's response type drift from what the backend actually returns.
- `lib/hackathon-options.ts` / `lib/rubric-options.ts` are static option lists (dropdowns etc.) — extend these in place rather than hardcoding option arrays inline in a component.
- Server Components by default; add `"use client"` only where interactivity (state, effects, event handlers) is actually needed.

## Cross-repo

Data model, auth rules, and validation live in `hackpilot-backend` — this app trusts and passes through whatever the backend returns/rejects; don't duplicate business-rule validation here beyond basic form UX (required fields, format hints).
