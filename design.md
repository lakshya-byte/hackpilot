# HackPilot Design System

Single source of truth for visual consistency across pages. All tokens live in `app/globals.css` under `@theme`; this doc explains how to use them. When building a new page, read this first instead of inventing new values.

## Fonts

- `font-display` → Plus Jakarta Sans (600/700/800). Use for headlines, buttons, labels, badges — anything short and punchy.
- `font-body` → Inter (400/500/600). Use for paragraphs, descriptions, form helper text.

Both are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS vars — never add a second font.

## Color tokens

Defined in `app/globals.css`. Use the Tailwind utility form (`bg-primary`, `text-on-surface-variant`, etc.), never raw hex.

| Role | Token | Hex | Usage |
|---|---|---|---|
| Brand primary | `primary` / `on-primary` | `#3525cd` / `#fff` | Primary CTAs, active nav state, key numbers |
| Brand primary (soft) | `primary-container` / `on-primary-container` | `#4f46e5` / `#dad7ff` | Accent text (e.g. "sorted." in the hero), header CTA background |
| Brand secondary | `secondary` / `on-secondary` | `#006c49` / `#fff` | Success states, "confirm"-style CTAs (email capture button) |
| Secondary (soft) | `secondary-container` / `on-secondary-container` | `#6cf8bb` / `#00714d` | Status pills ("LIVE VALIDATION") |
| Tertiary | `tertiary` / `tertiary-container` | `#005338` / `#006e4c` | Rarely used accent, reserve for tertiary emphasis only |
| Error | `error` / `error-container` | `#ba1a1a` / `#ffdad6` | Validation errors, destructive actions |
| Surface (page bg) | `surface-bright` / `surface` | `#faf8ff` | Page background |
| Surface (cards) | `surface-container-lowest` | `#ffffff` | Card/panel backgrounds (headers, mockup cards, form cards) |
| Surface (nested) | `surface-container-low/DEFAULT/high/highest` | `#f2f3ff` → `#dae2fd` | Nested panels inside cards, subtle dividers, input fill |
| Text (primary) | `on-surface` | `#131b2e` | Headlines, body copy |
| Text (muted) | `on-surface-variant` | `#464555` | Subheads, helper text, secondary labels |
| Outline | `outline` / `outline-variant` | `#777587` / `#c7c4d8` | Borders, placeholder text |

Fixed variants (`primary-fixed`, `secondary-fixed`, etc.) are for decorative glows/blurs behind hero-style content (see `hero.tsx`'s blurred background blobs).

## Type scale

Use the paired class exactly as named — each token bundles size + line-height + letter-spacing + weight, so you never set those individually.

| Class | Size | Use for |
|---|---|---|
| `text-display-hero` (mobile: `text-display-hero-mobile`) | 48px / 32px | Page hero headline only (one per page) |
| `text-headline-lg` (mobile: `-mobile`) | 32px / 24px | Section titles |
| `text-headline-md` | 24px | Card titles, sub-section titles |
| `text-headline-sm` | 18px | Small card headers, nav wordmark |
| `text-body-lg` | 16px | Lead paragraphs |
| `text-body-md` | 14px | Standard body copy |
| `text-body-sm` | 12px | Fine print, captions |
| `text-label-lg` | 14px, semibold | Button text, form labels |
| `text-label-md` | 12px, semibold | Badge/pill text, trust lines |
| `text-label-caps` | 11px, bold, uppercase | All-caps eyebrow tags (pair with `uppercase tracking-wider`) |

Always pair with `font-display` (headlines/labels/buttons) or `font-body` (paragraphs) — the type-scale token controls metrics, the font token controls typeface.

## Spacing & radius

- Layout gutters: `px-margin` (page horizontal padding), `gap-gutter` (grid/flex gaps between major blocks).
- Internal spacing: `space-xs` (0.25rem) → `space-xl` (2.5rem) for padding/margin/gap inside components, e.g. `p-space-lg`, `mb-space-md`, `gap-space-sm`.
- Radius: `rounded-xl` (0.75rem) for buttons/inputs/small chips, `rounded-2xl` (1rem) for nested panels, `rounded-3xl` (1.5rem) for top-level cards. Fully round pills use plain `rounded-full`.

## Component patterns

**Primary button (action, e.g. submit/CTA):**
```
rounded-full bg-secondary text-on-secondary font-display text-label-lg
px-gutter py-3 shadow-[0_2px_8px_rgba(0,108,73,0.25)]
hover:bg-secondary-fixed-variant hover:scale-[1.02] transition-all
```

**Secondary button / header CTA:**
```
rounded-xl bg-primary-container text-on-primary font-display text-label-lg
px-gutter py-space-sm shadow-[0_2px_6px_rgba(79,70,229,0.2)]
hover:bg-primary transition-colors
```

**Text input (pill form, e.g. email capture):**
```
w-full bg-transparent font-body text-body-md text-on-surface
placeholder:text-outline focus:outline-none py-2.5
```
wrapped in a container: `bg-surface-container-lowest rounded-2xl sm:rounded-full p-1.5 pl-5 shadow-[0_4px_24px_rgba(79,70,229,0.08)] focus-within:shadow-[0_4px_28px_rgba(79,70,229,0.16)] transition-all`

**Standalone labeled input (forms with stacked fields):**
```
w-full rounded-xl border border-outline-variant bg-surface-container-lowest
px-space-md py-3 font-body text-body-md text-on-surface
placeholder:text-outline focus:outline-none focus:border-primary
focus:ring-2 focus:ring-primary/20 transition-all
```

**Card / panel:**
```
bg-surface-container-lowest rounded-3xl p-space-lg
shadow-[0_16px_48px_rgba(19,27,46,0.08)]
```

**Badge / eyebrow chip:**
```
inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full
bg-surface-variant text-on-primary-fixed-variant shadow-sm
font-display text-label-caps uppercase tracking-wider font-bold
```

**Success message (inline, after client-side form submit):**
```
text-secondary font-display text-label-md flex items-center gap-1
```
with a leading `<span class="material-symbols-outlined text-[16px]">check_circle</span>`.

**Error message (inline, validation):**
```
text-error font-display text-label-md flex items-center gap-1
```
with a leading `<span class="material-symbols-outlined text-[16px]">error</span>`.

**Icons:** Google Material Symbols Outlined only (`<span className="material-symbols-outlined">name</span>`), loaded once via `<link>` in `app/layout.tsx`. Use `style={{ fontVariationSettings: "'FILL' 1" }}` for filled variants where the mockup calls for it.

## Motion conventions

- **Lenis** drives all scrolling (`components/landing/smooth-scroll.tsx`), synced to GSAP's ticker — never add a second scroll library or raw `scroll-behavior: smooth`.
- **Entrance animations** on a section's own mount: a `gsap.timeline()` inside `gsap.context(() => {...}, rootRef.current)`, targeting `data-*` attribute selectors (see `hero.tsx`), cleaned up via `ctx.revert()`.
- **Scroll-triggered reveals** (content below the fold): use the shared `useScrollReveal<T>(itemSelector)` hook (`components/landing/use-scroll-reveal.ts`) — it uses `IntersectionObserver`, not GSAP `ScrollTrigger`, because ScrollTrigger's scroll-position cache can desync from Lenis's virtual scroll and leave elements stuck invisible. Do not reintroduce `ScrollTrigger` for this purpose.
- Interactive hover/tilt effects (e.g. hero mockup card) use `gsap.quickTo` for perf, not `gsap.to` per event.

## Forms — client-side-only convention

This project has no backend yet. Every form (landing hero email capture, and the auth pages) follows the same pattern: local `useState` for field values + a submitted/error flag, `event.preventDefault()`, no network call, and an inline success/error message swapped in via conditional render. Don't add fake `setTimeout` delays or loading spinners unless a page explicitly needs to feel more "real" — keep it instant and simple.

## Auth / claymorphic pastel-card pages

The `app/(auth)/*` routes (sign-in, sign-up, forgot-password, reset-password) were rebuilt from dedicated Stitch exports (project `15003984592549858539`, screens "Sign In/Sign Up/Forgot Password — Variant 1 (3D Pastel Card)"), ported verbatim rather than using a shared abstraction — each page has a genuinely different layout, so don't force them into one shared shell:

- **`app/(auth)/layout.tsx`** — thin shell: `components/auth/auth-header.tsx` (fixed nav, active-link highlighting via `usePathname`, links to `/sign-in` `/sign-up` `/forgot-password`) + `<main className="pt-16">{children}</main>` + `components/auth/auth-footer.tsx`. No shared card/form component — each page owns its full layout.
- **Visual family across all three:** a `bg-surface-container-lowest` card (`rounded-3xl`/`rounded-[2.25rem]`/`rounded-[28px]` depending on page) floating on a gradient/orb-blurred backdrop (`bg-primary-fixed`/`bg-secondary-container` blurred circles at low opacity), one side holding a claymorphic 3D illustration (`public/auth-signin.jpg`, `auth-signup.jpg`, `auth-forgot-password.jpg` — downloaded from the Stitch screens, referenced via `next/image` with `fill`), the other holding the form. Inputs use the leading/trailing Material Symbol pattern (`alternate_email`, `lock`, `badge`) with a focus glow (`focus:shadow-[0_0_0_2px] focus:shadow-primary` or `focus:ring-2 focus:ring-primary/20`).
- **Interactions ported from the original vanilla-JS demo, reimplemented as React state** (per the client-side-only convention below): password show/hide toggles, sign-up's password-strength meter (4 pastel dots + label, driven by password length), forgot-password's radio-card channel picker (magic link vs OTP) and its auto-dismissing bottom toast, and submit-button loading→success state swaps.
- **`reset-password`** has no Stitch source (only 3 screens were designed) — it was built by hand to match the same card/gradient/icon-input visual family, reusing the forgot-password illustration.
- `--color-surface-tint: #4d44e3` was added to `app/globals.css` for the sign-in submit button's hover state — pulled from the Stitch project's own `designMd`.

## Checklist for a new page

1. Reuse existing tokens above — don't add new colors/sizes/radii to `globals.css` without a real design reason.
2. Reuse `font-display` for headings/labels/buttons, `font-body` for paragraphs.
3. Reuse the component patterns above (button/input/card/badge) rather than inventing new class combinations.
4. If the page needs scroll-reveal, use `useScrollReveal`, not raw `ScrollTrigger`.
5. Keep forms client-side only per the convention above.
6. Run `npm run lint` and `npm run build` before considering the page done.
