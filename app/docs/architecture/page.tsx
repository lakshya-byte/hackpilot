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
  FlowBox,
  Arrow,
} from "@/components/docs/doc-ui";

export default function ArchitecturePage() {
  return (
    <article>
      <DocHeader
        eyebrow="System Design"
        title="Architecture"
        description="How a request moves from the browser, through the Next.js app, to the Go backend, and into MongoDB — and why the backend is a monolith organized in layers rather than microservices."
      />

      <Section title="High-level topology">
        <P>
          Three independently deployable processes talk over plain HTTP/JSON.
          There is no API gateway, message queue, or service mesh — at this
          stage that would be over-engineering.
        </P>
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center gap-0 min-w-[720px]">
            <FlowBox title="Browser" subtitle="React 19 client" />
            <Arrow label="HTTPS" />
            <FlowBox
              title="hackpilot (Next.js)"
              subtitle="App Router · Vercel-style SSR/CSR"
            />
            <Arrow label="JSON / REST (server-to-server)" />
            <FlowBox
              title="hackpilot-backend (Go)"
              subtitle="Gin monolith · :8080"
              tone="primary"
            />
            <Arrow label="Mongo wire protocol" />
            <FlowBox title="MongoDB" subtitle="14 collections — users, teams, payments, ..." />
          </div>
          <div className="mt-space-md flex items-center gap-0 min-w-[720px]">
            <FlowBox title="Browser" subtitle="admin staff" />
            <Arrow label="HTTPS" />
            <FlowBox
              title="hackpilot-admin (Next.js)"
              subtitle="App Router · separate cookie/JWT domain"
            />
            <Arrow label="JSON / REST (server-to-server)" />
            <FlowBox title="same hackpilot-backend" tone="primary" />
          </div>
          <div className="mt-space-md flex justify-end min-w-[720px]">
            <div className="flex items-center">
              <Arrow label="HTTP (server-to-server, both engines)" />
              <FlowBox
                title="hackpilot-agent (Python)"
                subtitle="FastAPI + LangGraph · :8000"
                tone="primary"
              />
              <Arrow label="HTTPS" />
              <FlowBox title="OpenAI + Tavily" subtitle="GPT-4o & web search" tone="outline" />
            </div>
          </div>
          <div className="mt-space-md flex justify-end min-w-[720px]">
            <div className="flex items-center">
              <Arrow label="HTTPS (OTP emails, avatars, payments)" />
              <FlowBox title="Resend + Cloudinary + Razorpay" subtitle="email, image & payment APIs" tone="outline" />
            </div>
          </div>
        </div>
        <Callout type="info" title="The browser never talks to the Go API or the agent directly">
          <P>
            Every dashboard feature in both frontends goes through
            same-origin <InlineCode>/api/*</InlineCode> route handlers (a BFF
            layer), which hold JWT access/refresh tokens in httpOnly cookies
            and forward requests to the Go backend server-to-server.{" "}
            <InlineCode>hackpilot-admin</InlineCode> follows this exact same
            pattern, entirely independently — its own cookies, its own JWT
            secret (<InlineCode>JWT_ADMIN_SECRET</InlineCode>), never sharing
            a session with <InlineCode>hackpilot</InlineCode>. The Go backend
            is, in turn, the only thing that ever calls{" "}
            <InlineCode>hackpilot-agent</InlineCode> or Razorpay — neither
            frontend has a direct network path to them, and the agent itself
            never touches MongoDB (the Go layer saves its responses). See{" "}
            <a href="/docs/frontend" className="text-primary underline underline-offset-2">
              App Structure
            </a>{" "}
            and{" "}
            <a href="/docs/admin" className="text-primary underline underline-offset-2">
              Admin Dashboard
            </a>{" "}
            for each frontend&apos;s session flow, and{" "}
            <a href="/docs/api-reference" className="text-primary underline underline-offset-2">
              API Reference
            </a>{" "}
            for the Go endpoints themselves. Sign-up, forgot-password, and
            reset-password on <InlineCode>hackpilot</InlineCode> still
            aren&apos;t wired.
          </P>
        </Callout>
      </Section>

      <Section title="Why a monolith">
        <P>
          The backend is one Go binary/process (a &quot;modular monolith&quot;),
          not a collection of services. For a single team building one
          product, this is the right default:
        </P>
        <Table
          head={["Property", "Monolith (chosen)", "Microservices (rejected, for now)"]}
          rows={[
            ["Deploy unit", "one binary", "N independently deployed services"],
            ["Transactions", "single MongoDB connection, easy consistency", "distributed transactions / sagas"],
            ["Operational cost", "one process to run, log, and scale", "service discovery, inter-service auth, tracing"],
            ["When it breaks down", "when one team can no longer own the whole codebase, or parts need independent scaling", "—"],
          ]}
        />
        <P>
          The internal package layout (below) is deliberately layered so
          that if a slice of functionality ever needs to be pulled out into
          its own service, the boundaries already exist as Go packages.
        </P>
      </Section>

      <Section title="Backend: layered architecture">
        <P>
          <InlineCode>hackpilot-backend</InlineCode> follows a standard
          Go &quot;clean-ish&quot; layering. Each layer only talks to the layer
          directly below it, and depends on interfaces where it matters
          (e.g. the mailer):
        </P>
        <CodeBlock
          filename="hackpilot-backend/internal"
          code={`router      →  HTTP routes, groups /api/v1/{auth,users,teams,ideas,research,
               checklist,framework,pitch,billing,admin,analytics,webhooks},
               wires middleware onto protected groups (RequireAuth,
               RequirePro, RequireAdminAuth)

handler     →  Gin handlers: bind + validate JSON, call a service method,
               map domain errors → HTTP status codes (shared handleServiceError)

service     →  business logic: AuthService, ProfileService, TeamService,
               IdeaService, ResearchService, ChecklistService,
               WinFrameworkService, PitchService, BillingService,
               AdminAuthService, AdminTeamService, AnalyticsService —
               orchestrate repositories + mailer/uploader/agentclient +
               utils, own all errors.
               team_access.go holds resolveActiveTeam()/teamSkills(), shared
               by IdeaService, ResearchService, ChecklistService,
               WinFrameworkService, and PitchService (all need "the caller's
               active team" the same way)

repository  →  one struct per MongoDB collection (users, otps, refresh_tokens,
               teams, generated_ideas, research_results, checklists,
               win_frameworks, pitch_results, admin_users,
               admin_refresh_tokens, hackathon_logs, payments, events),
               only CRUD + index setup, no business rules

agentclient →  the first raw net/http client in this codebase (existing
               integrations wrap SDKs) — one HTTPAgentClient, four methods
               (GenerateIdeas, ResearchIdea, GeneratePitch, ParseRubric)
               against hackpilot-agent

models      →  MongoDB document structs (bson tags)
dto         →  HTTP request/response structs (json + validator tags)

middleware  →  RequireAuth (user JWT), RequirePro (fresh Mongo plan check),
               RequireAdminAuth (separate admin JWT), CORS
utils       →  bcrypt hashing, OTP generation/HMAC hashing, JWT sign/parse,
               username slugify
mailer      →  Mailer interface + ResendMailer implementation
uploader    →  Uploader interface + CloudinaryUploader implementation
config      →  env var loading, typed Config struct
db          →  Mongo client connect/ping helper`}
        />
        <P>
          One runtime concern lives outside this request-handling stack
          entirely: <InlineCode>main.go</InlineCode> also starts a goroutine
          that hourly downgrades expired Pro users, sharing the server&apos;s
          own shutdown signal — see{" "}
          <a href="/docs/backend/billing" className="text-primary underline underline-offset-2">
            Billing &amp; Plans
          </a>
          .
        </P>
        <SubSection title="Request lifecycle example">
          <P>A call to <InlineCode>POST /api/v1/auth/login</InlineCode> flows as:</P>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
            <div className="flex items-center min-w-[760px]">
              <FlowBox title="router.Setup" subtitle="matches route" />
              <Arrow />
              <FlowBox title="CORS + Gin recovery" subtitle="middleware chain" />
              <Arrow />
              <FlowBox title="AuthHandler.Login" subtitle="ShouldBindJSON + validate" />
              <Arrow />
              <FlowBox title="AuthService.Login" subtitle="business rules" tone="primary" />
              <Arrow />
              <FlowBox title="UserRepository" subtitle="FindByEmail" />
            </div>
          </div>
          <P>
            <InlineCode>AuthService.Login</InlineCode> then checks the bcrypt
            hash, checks <InlineCode>is_verified</InlineCode>, and — on
            success — calls the shared <InlineCode>issueTokenPair</InlineCode>{" "}
            helper (signs a JWT, generates + stores a hashed refresh token)
            before the handler serializes the response. Errors returned by
            the service are sentinel values (<InlineCode>service.ErrInvalidCredentials</InlineCode>,{" "}
            <InlineCode>service.ErrNotVerified</InlineCode>, ...) that{" "}
            <InlineCode>handleServiceError</InlineCode> in the handler layer
            maps to the correct HTTP status — the service layer never knows
            about HTTP.
          </P>
        </SubSection>
      </Section>

      <Section title="Frontend: route structure">
        <P>
          <InlineCode>hackpilot</InlineCode> uses the Next.js App Router.
          Route groups separate the marketing site, the auth flow, and the
          dashboard so each can have its own layout/chrome:
        </P>
        <CodeBlock
          filename="hackpilot/app"
          code={`app/
  layout.tsx           root layout: fonts, metadata
  page.tsx              "/"  → <LandingPage />

  (auth)/                route group — no URL segment
    layout.tsx            shared AuthHeader / AuthFooter chrome
    sign-in/page.tsx       "/sign-in"          — wired to the API
    sign-up/page.tsx       "/sign-up"          — UI only
    forgot-password/page.tsx  "/forgot-password"  — UI only
    reset-password/page.tsx   "/reset-password"   — UI only

  (dashboard)/            route group — no URL segment
    layout.tsx             DashboardShell + PlanProvider + ToastProvider
    profile/page.tsx        "/profile"   — protected, wired to the API
    teams/page.tsx           "/teams"     — protected, wired
    ideas/page.tsx           "/ideas"     — protected, wired (Idea Engine, free-tier metered)
    research/page.tsx        "/research"  — protected, wired (Research Engine)
    checklist/page.tsx       "/checklist" — protected, wired
    framework/page.tsx        "/framework" — protected, wired (Win Framework)
    pitch/page.tsx             "/pitch"     — protected, wired, wrapped in <ProGate>
    pricing/page.tsx            "/pricing"   — protected, upgrade flow
    billing/page.tsx             "/billing"   — protected, plan + payment history

  api/                    Route Handlers — the BFF/proxy layer, see
    auth/{login,logout,refresh}/route.ts    App Structure
    profile/route.ts
    profile/avatar/route.ts
    teams/**                  7 routes mirroring /api/v1/teams/*
    ideas/**                  3 routes mirroring /api/v1/ideas/*
    research/**                2 routes mirroring /api/v1/research/*
    checklist/**                3 routes mirroring /api/v1/checklist/*
    framework/**                 2 routes mirroring /api/v1/framework/*
    pitch/**                      4 routes mirroring /api/v1/pitch/*
    billing/**                     4 routes mirroring /api/v1/billing/*

  docs/                   this documentation section
    layout.tsx             sidebar + topbar shell
    page.tsx, .../page.tsx  one route per doc page

proxy.ts                 Next 16's renamed middleware.ts — protects the
                          entire (dashboard) route group, silently rotates
                          expired tokens`}
        />
        <P>
          See{" "}
          <a href="/docs/frontend" className="text-primary underline underline-offset-2">
            App Structure
          </a>{" "}
          for the component breakdown and design system.{" "}
          <InlineCode>hackpilot-admin</InlineCode> is a separately-deployed
          4th app with its own route tree, cookies, and JWT domain — see{" "}
          <a href="/docs/admin" className="text-primary underline underline-offset-2">
            Admin Dashboard
          </a>{" "}
          rather than duplicating it here.
        </P>
      </Section>

      <Section title="Data model">
        <P>14 MongoDB collections, all in one database:</P>
        <Table
          head={["Collection", "Purpose", "Key indexes"]}
          rows={[
            ["users", "one document per account — auth, profile, and plan_details (billing) fields", "unique index on email; unique index on username"],
            ["otps", "current OTP per (email, purpose)", "TTL index on expires_at; compound index on (email, purpose)"],
            ["refresh_tokens", "hashed, revocable refresh tokens", "TTL index on expires_at; index on token_hash"],
            ["teams", "one document per team — lead_id, denormalized member snapshots (name/username/photo/primary_skill/role/status)", "index on lead_id; index on members.user_id"],
            ["generated_ideas", "one document per Idea Engine generation — 5 scored ideas + a shortlisted flag per idea, plus requested_by for free-tier metering", "compound index on (team_id, created_at desc)"],
            ["research_results", "one document per Research Engine run — the full research brief", "compound index on (team_id, created_at desc)"],
            ["checklists", "one document per (team, hackathon) — phases of items, seeded from a fixed template", "unique compound index on (team_id, hackathon_id)"],
            ["win_frameworks", "one document per team — hackathon start time, duration, and phase percentages", "unique index on team_id"],
            ["pitch_results", "one document per Pitch Builder generation — slide outline, rubric coverage", "compound index on (team_id, created_at desc)"],
            ["admin_users", "admin accounts — separate from users entirely", "unique index on email"],
            ["admin_refresh_tokens", "hashed, revocable admin refresh tokens", "TTL index on expires_at; index on token_hash"],
            ["hackathon_logs", "self-reported per-team hackathon results, feeding the admin Analytics stats", "compound index on (team_id, date desc)"],
            ["payments", "one row per Razorpay order — created/captured/failed audit trail", "unique index on razorpay_order_id; index on user_id"],
            ["events", "insert-only platform events (plan_upgrade, plan_expired, payment_failed) — no reader yet", "index on created_at"],
          ]}
        />
        <Callout type="info" title="TTL indexes = self-cleaning">
          <P>
            Expired OTPs and refresh tokens are deleted automatically by
            MongoDB&apos;s background TTL monitor — the app never has to run a
            cleanup job.
          </P>
        </Callout>
      </Section>

      <DocFooterNav
        prev={{ title: "Getting Started", href: "/docs/getting-started" }}
        next={{ title: "Auth System", href: "/docs/backend/auth" }}
      />
    </article>
  );
}
