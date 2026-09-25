import {
  DocHeader,
  Section,
  SubSection,
  P,
  CodeBlock,
  Callout,
  Table,
  InlineCode,
  DocFooterNav,
} from "@/components/docs/doc-ui";

export default function FrontendPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Frontend"
        title="App structure"
        description="Route layout, component organization, and the design system that the HackPilot site is built on."
      />

      <Callout type="success" title="Everything under (dashboard) is wired to the real API">
        <P>
          Signup, forgot-password, and reset-password are still self-contained
          UI (form state in <InlineCode>useState</InlineCode>, no network
          calls). Everything under <InlineCode>(dashboard)</InlineCode> —{" "}
          <strong>Profile</strong>, <strong>Teams</strong>,{" "}
          <strong>Idea Engine</strong>, <strong>Research Engine</strong>,{" "}
          <strong>Checklist</strong>, <strong>Win Framework</strong>,{" "}
          <strong>Pitch Builder</strong>, and <strong>Billing</strong> — is
          real: they call <InlineCode>hackpilot-backend</InlineCode> through
          a same-origin proxy layer — see{" "}
          <a href="#session" className="text-primary underline underline-offset-2">
            Session &amp; auth wiring
          </a>{" "}
          below.
        </P>
      </Callout>

      <Section title="Routes">
        <Table
          head={["Route", "File", "Purpose"]}
          rows={[
            ["/", "app/page.tsx → components/landing/landing-page.tsx", "Marketing landing page"],
            ["/sign-in", "app/(auth)/sign-in/page.tsx", "Login form — wired, POSTs to /api/auth/login"],
            ["/sign-up", "app/(auth)/sign-up/page.tsx", "Signup form with a client-side password-strength meter (UI only)"],
            ["/forgot-password", "app/(auth)/forgot-password/page.tsx", "Requests a reset code (UI only)"],
            ["/reset-password", "app/(auth)/reset-password/page.tsx", "Sets a new password (UI only)"],
            ["/profile", "app/(dashboard)/profile/page.tsx", "Real, editable profile — protected route, wired. Hackathon stats/submissions preview is still static placeholder data"],
            ["/teams", "app/(dashboard)/teams/page.tsx", "Create/join a team, invites, roster, leadership transfer — wired"],
            ["/ideas", "app/(dashboard)/ideas/page.tsx", "Idea Engine — generate + shortlist ideas, history sidebar, free-tier usage counter — wired"],
            ["/research", "app/(dashboard)/research/page.tsx", "Research Engine — research an idea, history sidebar — wired"],
            ["/checklist", "app/(dashboard)/checklist/page.tsx", "Pre-hackathon checklist, phase-by-phase — wired"],
            ["/framework", "app/(dashboard)/framework/page.tsx", "Win Framework — time-boxed phase plan with a live countdown — wired"],
            ["/pitch", "app/(dashboard)/pitch/page.tsx", "Pitch Builder — wired, wrapped in <ProGate> (Pro plan required)"],
            ["/pricing", "app/(dashboard)/pricing/page.tsx", "Pro plan card + Razorpay upgrade flow — wired"],
            ["/billing", "app/(dashboard)/billing/page.tsx", "Current plan, days remaining, payment history, renew/upgrade — wired"],
            ["/docs/*", "app/docs/**", "This documentation section"],
          ]}
        />
        <P>
          <InlineCode>(auth)</InlineCode> and <InlineCode>(dashboard)</InlineCode>{" "}
          are Next.js <em>route groups</em> — the parentheses mean they
          don&apos;t appear in the URL, they just let pages in each group
          share a layout (<InlineCode>AuthHeader</InlineCode>/
          <InlineCode>AuthFooter</InlineCode> for one,{" "}
          <InlineCode>DashboardShell</InlineCode>&apos;s sidebar for the other)
          without affecting the landing page.
        </P>
      </Section>

      <Section title="Session & auth wiring" id="session">
        <P>
          Tokens never touch client-side JavaScript. Sign-in and Profile talk
          to the Go API through a small backend-for-frontend layer of Next.js
          Route Handlers, which hold the JWT access/refresh tokens in httpOnly
          cookies:
        </P>
        <CodeBlock
          filename="hackpilot"
          code={`proxy.ts                        route-interception layer (Next 16's
                                 renamed middleware.ts): on /profile/*,
                                 checks the access-token cookie's exp,
                                 silently rotates it via the backend's
                                 /auth/refresh if expired, redirects to
                                 /sign-in if there's no valid refresh token

app/api/auth/login/route.ts     POST → backend /auth/login, sets
                                 hp_access_token / hp_refresh_token
                                 (httpOnly, sameSite=lax) cookies
app/api/auth/logout/route.ts    revokes the refresh token, clears cookies
app/api/auth/refresh/route.ts   client-callable silent refresh (for a
                                 token expiring mid-session, not just
                                 on navigation)

app/api/profile/route.ts        PATCH proxy → backend /users/me/profile,
                                 attaches Authorization: Bearer from the cookie
app/api/profile/avatar/route.ts POST proxy (multipart passthrough) →
                                 backend /users/me/avatar → Cloudinary

lib/session.ts                  Server Component helper: reads the
                                 cookie, calls the backend, redirects to
                                 /sign-in on failure (Server Components
                                 can't set cookies, so refresh happens in
                                 proxy.ts instead — see above)`}
        />
        <Callout type="info" title="Why cookies + a proxy layer, not fetch() from the browser">
          <P>
            The Go API has permissive CORS, so calling it directly from the
            browser with tokens in <InlineCode>localStorage</InlineCode> would
            also work — but it exposes the access/refresh tokens to any XSS on
            the page. Routing through same-origin{" "}
            <InlineCode>/api/*</InlineCode> handlers with httpOnly cookies
            means client-side JS never sees a token at all.
          </P>
        </Callout>
        <SubSection title="Profile page shape">
          <P>
            <InlineCode>app/(dashboard)/profile/page.tsx</InlineCode> is a
            Server Component that fetches the profile via{" "}
            <InlineCode>lib/session.ts</InlineCode> and hands it to{" "}
            <InlineCode>components/profile/profile-view.tsx</InlineCode>, a
            client component with a single edit-mode toggle: avatar upload (
            <InlineCode>avatar-uploader.tsx</InlineCode>, always active, 5MB/
            image-type checked client-side before it even hits the proxy),
            bio/education/socials fields, and chip inputs for domain
            capabilities / tech stack (<InlineCode>chip-input.tsx</InlineCode>
            ). The hackathon stats and submissions table (
            <InlineCode>stats-preview.tsx</InlineCode>) are static placeholder
            data — see{" "}
            <a href="/docs/backend/auth" className="text-primary underline underline-offset-2">
              Auth System
            </a>{" "}
            for why.
          </P>
        </SubSection>
      </Section>

      <Section title="Teams, Idea Engine & Research Engine" id="teams">
        <P>
          All three dashboard features follow the exact same three-layer
          shape: a Server Component page fetches initial data via{" "}
          <InlineCode>lib/session.ts</InlineCode>, a thin{" "}
          <InlineCode>app/api/*</InlineCode> BFF route proxies each backend
          call, and a client component owns all interactive state.
        </P>
        <SubSection title="Teams">
          <P>
            <InlineCode>app/(dashboard)/teams/page.tsx</InlineCode> passes the
            result of <InlineCode>getMyTeamOrRedirect()</InlineCode> (
            <InlineCode>null</InlineCode> is a normal &quot;no team yet&quot;
            state, not an error) to{" "}
            <InlineCode>components/teams/teams-view.tsx</InlineCode>, which
            branches between <InlineCode>no-team-state.tsx</InlineCode> +{" "}
            <InlineCode>create-team-modal.tsx</InlineCode> and{" "}
            <InlineCode>active-team-view.tsx</InlineCode> (roster, invite,
            pending-invite accept/decline banner, lead-only transfer/remove/
            delete). Proxy routes live under{" "}
            <InlineCode>app/api/teams/**</InlineCode>.
          </P>
        </SubSection>
        <SubSection title="Idea Engine & Research Engine">
          <P>
            Both engines share the same shell: a left{" "}
            <InlineCode>components/ideas/history-sidebar.tsx</InlineCode> (a
            generic component reused by both —{" "}
            <InlineCode>{`<HistorySidebar<T> generations={...} getLabel={(item) => ...} />`}</InlineCode>{" "}
            — Idea Engine labels by hackathon type, Research Engine by idea
            title) and a right pane that swaps between a form, a full-page{" "}
            <InlineCode>components/shared/rotating-loader.tsx</InlineCode>{" "}
            (rotating status messages, since the agent call is blocking with
            no streaming), and the result. Every &quot;generate&quot; call
            prepends the new result into local history state and selects it,
            rather than re-fetching — the backend response already includes
            the saved document&apos;s id.
          </P>
          <Table
            head={["Feature", "Client view", "Form", "Result"]}
            rows={[
              [
                "Idea Engine",
                "components/ideas/idea-engine-view.tsx",
                "idea-form.tsx (hackathon type, duration, target audience, optional problem statement)",
                "idea-card.tsx × 5 (score-bar.tsx × 4, Shortlist toggle)",
              ],
              [
                "Research Engine",
                "components/research/research-engine-view.tsx",
                "research-form.tsx (idea title, description, hackathon type, target audience)",
                "research-brief.tsx (existing-solution-card.tsx grid, failed-attempts list, market-gap callout, market-angle stat chips, viability-score-badge.tsx)",
              ],
            ]}
          />
          <P>
            The hackathon-type and target-audience dropdown option lists are
            shared between both forms from{" "}
            <InlineCode>lib/hackathon-options.ts</InlineCode> rather than
            duplicated. Both team-skill inputs are entirely backend-derived —
            neither form collects skills, since the Go service reads them
            from the caller&apos;s active team roster (see{" "}
            <a href="/docs/backend/idea-engine" className="text-primary underline underline-offset-2">
              Idea Engine
            </a>
            ).
          </P>
        </SubSection>
      </Section>

      <Section title="Checklist & Win Framework" id="checklist-framework">
        <SubSection title="Checklist">
          <P>
            <InlineCode>app/(dashboard)/checklist/page.tsx</InlineCode> is a
            Server Component that only resolves session/team (
            <InlineCode>hasTeam</InlineCode>, <InlineCode>hackathonId</InlineCode> =
            the team&apos;s <InlineCode>hackathon</InlineCode> field) — the
            checklist itself is fetched client-side.{" "}
            <InlineCode>components/checklist/checklist-view.tsx</InlineCode>{" "}
            loads it once on mount, then applies every checkbox toggle{" "}
            <strong>optimistically</strong> (local state flips immediately),
            fires <InlineCode>PUT /api/checklist/item</InlineCode>, and either
            replaces local state with the server&apos;s response or rolls the
            toggle back on failure. No polling — one GET per visit, one PUT
            per toggle.
          </P>
        </SubSection>
        <SubSection title="Win Framework">
          <P>
            <InlineCode>components/framework/framework-view.tsx</InlineCode>{" "}
            fetches the team&apos;s framework once (treating{" "}
            <InlineCode>404</InlineCode> as &quot;no framework yet&quot;, showing{" "}
            <InlineCode>SetupForm</InlineCode> instead), then does all further
            updates <strong>locally</strong> — a{" "}
            <InlineCode>setInterval</InlineCode> ticks a{" "}
            <InlineCode>now</InlineCode> state value every second, and{" "}
            <InlineCode>CountdownTimer</InlineCode>/<InlineCode>TimelineBar</InlineCode>/
            <InlineCode>PhaseCard</InlineCode> status all derive from comparing{" "}
            <InlineCode>now</InlineCode> against the phase start/end times the
            backend already computed. There&apos;s no server polling for the
            live countdown — it&apos;s a client clock against a snapshot.
          </P>
        </SubSection>
        <P>
          See{" "}
          <a href="/docs/backend/checklist" className="text-primary underline underline-offset-2">
            Checklist
          </a>{" "}
          and{" "}
          <a href="/docs/backend/framework" className="text-primary underline underline-offset-2">
            Win Framework
          </a>{" "}
          for the backend seed templates and phase-timing math.
        </P>
      </Section>

      <Section title="Pitch Builder" id="pitch-builder">
        <P>
          <InlineCode>components/pitch/pitch-view.tsx</InlineCode> auto-prefills
          the generate form by chaining two lookups: the first{" "}
          <em>shortlisted</em> idea across the team&apos;s Idea Engine history,
          then a Research Engine result matching that idea&apos;s title (for{" "}
          <InlineCode>market_gap</InlineCode>/<InlineCode>differentiation_one_liner</InlineCode>{" "}
          context) — a hacker who ran all three tools in order gets a
          pre-filled pitch form for free.
        </P>
        <P>
          <InlineCode>RubricUpload</InlineCode> client-validates a PDF (type +
          10MB cap) before <InlineCode>POST /api/pitch/parse-rubric</InlineCode>;
          the returned criteria populate{" "}
          <InlineCode>RubricCriteriaEditor</InlineCode>, which is fully
          editable and pre-seeded with a default criteria set (
          <InlineCode>lib/rubric-options.ts</InlineCode>) if no PDF is parsed
          at all. The generated result renders as a{" "}
          <InlineCode>SlideNavigator</InlineCode> (click a slide number) +{" "}
          <InlineCode>SlideDetail</InlineCode> pane, alongside a{" "}
          <InlineCode>RubricCoveragePanel</InlineCode> (per-criterion weight
          bar + which slides address it + a Strong/Moderate/Weak{" "}
          <InlineCode>CoverageStrengthPill</InlineCode>) and a{" "}
          <InlineCode>PitchStatsPanel</InlineCode> (total duration, opening
          hook, closing line, demo flow).
        </P>
        <P>
          The whole page is wrapped in{" "}
          <a href="#billing" className="text-primary underline underline-offset-2">
            <InlineCode>&lt;ProGate&gt;</InlineCode>
          </a>{" "}
          — see{" "}
          <a href="/docs/backend/pitch" className="text-primary underline underline-offset-2">
            Pitch Builder
          </a>{" "}
          on the backend side for the rubric-upload contract.
        </P>
      </Section>

      <Section title="Billing & plan gating" id="billing">
        <P>
          <InlineCode>components/billing/plan-provider.tsx</InlineCode> is a
          client Context mounted once around the whole dashboard shell (in{" "}
          <InlineCode>app/(dashboard)/layout.tsx</InlineCode>, alongside a
          small hand-rolled <InlineCode>ToastProvider</InlineCode> — this app
          has no toast/animation library), fetching{" "}
          <InlineCode>/api/billing/status</InlineCode> once and exposing it
          via <InlineCode>usePlan()</InlineCode> to every page below it —
          `ProGate`, the pricing/billing pages, and the Idea Engine&apos;s
          usage counter all read the same cached status instead of each
          fetching independently.
        </P>
        <Table
          head={["Piece", "File", "What it does"]}
          rows={[
            ["ProGate", "components/billing/pro-gate.tsx", "Renders children untouched if Pro; otherwise a blurred preview + \"Upgrade to Pro\" overlay. Wraps the Pitch Builder page — the only Pro-gated feature (Research Engine is free)"],
            ["useUpgradeFlow", "components/billing/use-upgrade-flow.ts", "Loads checkout.js on demand (not eagerly, only when the upgrade button is clicked), drives create-order → Razorpay Checkout → verify-payment, then confetti + toast + redirect to /billing"],
            ["ConfettiBurst", "components/shared/confetti-burst.tsx", "Dependency-free canvas confetti, colors read from the design system's CSS variables at mount, not hardcoded"],
            ["Idea Engine counter", "components/ideas/idea-engine-view.tsx", "Shows \"X of 3 free generations used this month\" for free users; a 403 from /api/ideas/generate renders the specific upsell instead of a generic error"],
          ]}
        />
        <Callout type="info" title="The real gate is always the backend">
          <P>
            <InlineCode>ProGate</InlineCode> and the usage counter are UX
            only — the backend&apos;s <InlineCode>RequirePro</InlineCode>{" "}
            middleware and free-tier count check are what actually enforce
            anything. See{" "}
            <a href="/docs/backend/billing" className="text-primary underline underline-offset-2">
              Billing &amp; Plans
            </a>
            .
          </P>
        </Callout>
      </Section>

      <Section title="Landing page composition">
        <P>
          <InlineCode>components/landing/landing-page.tsx</InlineCode> composes
          the homepage from single-purpose section components, each scroll-
          animated with GSAP via the shared{" "}
          <InlineCode>use-scroll-reveal.ts</InlineCode> hook:
        </P>
        <CodeBlock
          filename="components/landing"
          code={`header.tsx                → sticky nav bar
hero.tsx                  → above-the-fold headline + CTA
social-proof.tsx          → logos / stats
how-it-works.tsx          → step-by-step framework explainer
feature-grid.tsx          → feature cards
founder-credibility.tsx   → founder bios / credibility signals
pricing.tsx                → pricing tiers
final-cta.tsx              → bottom conversion section
footer.tsx                  → site footer
smooth-scroll.tsx / gsap.ts → Lenis smooth-scroll + GSAP setup, shared`}
        />
      </Section>

      <Section title="Design system">
        <P>
          Styling is Tailwind CSS v4, configured entirely through CSS custom
          properties in <InlineCode>app/globals.css</InlineCode> using the{" "}
          <InlineCode>@theme</InlineCode> directive — this is a Material
          Design 3‑style token set (surface/primary/secondary/tertiary roles),
          not raw Tailwind defaults.
        </P>
        <SubSection title="Color roles">
          <Table
            head={["Token", "Example class", "Used for"]}
            rows={[
              ["--color-primary / primary-container", "bg-primary, text-on-primary", "brand actions, active nav state"],
              ["--color-surface-container-*", "bg-surface-container-low", "card/section backgrounds, layered depth"],
              ["--color-on-surface / on-surface-variant", "text-on-surface", "body text vs. muted text"],
              ["--color-error / error-container", "bg-error-container", "form validation errors"],
            ]}
          />
        </SubSection>
        <SubSection title="Typography">
          <P>
            Two font families loaded in <InlineCode>app/layout.tsx</InlineCode>:{" "}
            <InlineCode>Plus Jakarta Sans</InlineCode> (
            <InlineCode>font-display</InlineCode>, headings/labels) and{" "}
            <InlineCode>Inter</InlineCode> (<InlineCode>font-body</InlineCode>,
            paragraph text). A full type scale is defined as tokens —{" "}
            <InlineCode>text-headline-lg</InlineCode>,{" "}
            <InlineCode>text-body-md</InlineCode>,{" "}
            <InlineCode>text-label-caps</InlineCode>, etc. — with matching{" "}
            <InlineCode>-mobile</InlineCode> variants for the hero/headline
            sizes.
          </P>
        </SubSection>
        <SubSection title="Spacing & radii">
          <P>
            Spacing also goes through tokens rather than raw Tailwind
            numbers: <InlineCode>p-space-md</InlineCode>,{" "}
            <InlineCode>gap-gutter</InlineCode>,{" "}
            <InlineCode>px-margin</InlineCode>. Corner radii use{" "}
            <InlineCode>rounded-xl</InlineCode> (0.75rem),{" "}
            <InlineCode>rounded-2xl</InlineCode> (1rem), and{" "}
            <InlineCode>rounded-3xl</InlineCode> (1.5rem) — this documentation
            section follows the same tokens for consistency.
          </P>
        </SubSection>
        <SubSection title="Icons">
          <P>
            Google&apos;s Material Symbols Outlined font, loaded in{" "}
            <InlineCode>app/layout.tsx</InlineCode>, used via{" "}
            <InlineCode>{`<span className="material-symbols-outlined">icon_name</span>`}</InlineCode>
            .
          </P>
        </SubSection>
      </Section>

      <Section title="Next step: wiring signup">
        <P>
          Sign-up, forgot-password, and reset-password can follow the same
          pattern <InlineCode>sign-in</InlineCode> already uses:
        </P>
        <ul className="list-disc pl-space-lg space-y-space-xs">
          <li>
            Add <InlineCode>app/api/auth/signup/route.ts</InlineCode>,{" "}
            <InlineCode>forgot-password/route.ts</InlineCode>, and{" "}
            <InlineCode>reset-password/route.ts</InlineCode> proxies (thin —
            no cookies to set until verify-otp/reset succeed).
          </li>
          <li>
            On sign-up success, redirect to a &quot;check your email&quot; state
            (the sign-up page already models a <InlineCode>succeeded</InlineCode>{" "}
            local state that can be repurposed) and route to a{" "}
            <InlineCode>/verify-otp</InlineCode> screen that doesn&apos;t exist
            yet — <InlineCode>POST /api/v1/auth/verify-otp</InlineCode> already
            returns a full token pair, so that screen can log the user
            straight in on success, same as{" "}
            <InlineCode>app/api/auth/login/route.ts</InlineCode> does.
          </li>
        </ul>
      </Section>

      <DocFooterNav
        prev={{ title: "Idea & Research Agent", href: "/docs/agent" }}
        next={{ title: "Admin Dashboard", href: "/docs/admin" }}
      />
    </article>
  );
}
