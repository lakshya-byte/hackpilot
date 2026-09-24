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
            <FlowBox title="MongoDB" subtitle="users · teams · generated_ideas · research_results · ..." />
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
              <Arrow label="HTTPS (OTP emails, avatars)" />
              <FlowBox title="Resend + Cloudinary" subtitle="email & image APIs" tone="outline" />
            </div>
          </div>
        </div>
        <Callout type="info" title="The browser never talks to the Go API or the agent directly">
          <P>
            Every dashboard feature (Profile, Teams, Idea Engine, Research
            Engine) goes through same-origin <InlineCode>/api/*</InlineCode>{" "}
            route handlers in the Next.js app (a BFF layer), which hold the
            JWT access/refresh tokens in httpOnly cookies and forward
            requests to the Go backend server-to-server. The Go backend is,
            in turn, the only thing that ever calls{" "}
            <InlineCode>hackpilot-agent</InlineCode> — the frontend has no
            direct network path to it, and the agent itself never touches
            MongoDB (the Go layer saves its responses). The{" "}
            <InlineCode>HTTPS</InlineCode> arrow at the top is browser ↔
            Next.js only. See{" "}
            <a href="/docs/frontend" className="text-primary underline underline-offset-2">
              App Structure
            </a>{" "}
            for the session flow, and{" "}
            <a href="/docs/api-reference" className="text-primary underline underline-offset-2">
              API Reference
            </a>{" "}
            for the Go endpoints themselves. Sign-up, forgot-password, and
            reset-password still aren&apos;t wired.
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
          code={`router      →  HTTP routes, groups /api/v1/{auth,users,teams,ideas,research},
               wires middleware onto protected groups

handler     →  Gin handlers: bind + validate JSON, call a service method,
               map domain errors → HTTP status codes (shared handleServiceError)

service     →  business logic: AuthService, ProfileService, TeamService,
               IdeaService, ResearchService — orchestrate repositories +
               mailer/uploader/agentclient + utils, own all errors.
               team_access.go holds resolveActiveTeam()/teamSkills(), shared
               by IdeaService and ResearchService (both need "the caller's
               active team" and "that team's skills" the same way)

repository  →  one struct per MongoDB collection (users, otps, refresh_tokens,
               teams, generated_ideas, research_results), only CRUD + index
               setup, no business rules

agentclient →  the first raw net/http client in this codebase (existing
               integrations wrap SDKs) — one HTTPAgentClient, two methods
               (GenerateIdeas, ResearchIdea) against hackpilot-agent

models      →  MongoDB document structs (bson tags)
dto         →  HTTP request/response structs (json + validator tags)

middleware  →  RequireAuth (JWT check), CORS
utils       →  bcrypt hashing, OTP generation/HMAC hashing, JWT sign/parse,
               username slugify
mailer      →  Mailer interface + ResendMailer implementation
uploader    →  Uploader interface + CloudinaryUploader implementation
config      →  env var loading, typed Config struct
db          →  Mongo client connect/ping helper`}
        />
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
    layout.tsx             DashboardShell: sidebar + topbar
    profile/page.tsx        "/profile"  — protected, wired to the API
    teams/page.tsx           "/teams"    — protected, wired
    ideas/page.tsx           "/ideas"    — protected, wired (Idea Engine)
    research/page.tsx        "/research" — protected, wired (Research Engine)

  api/                    Route Handlers — the BFF/proxy layer, see
    auth/{login,logout,refresh}/route.ts    App Structure
    profile/route.ts
    profile/avatar/route.ts
    teams/**                  7 routes mirroring /api/v1/teams/*
    ideas/**                  3 routes mirroring /api/v1/ideas/*
    research/**                2 routes mirroring /api/v1/research/*

  docs/                   this documentation section
    layout.tsx             sidebar + topbar shell
    page.tsx, .../page.tsx  one route per doc page

proxy.ts                 Next 16's renamed middleware.ts — protects
                          /profile/*, /teams/*, /ideas/*, /research/*,
                          silently rotates expired tokens`}
        />
        <P>
          See{" "}
          <a href="/docs/frontend" className="text-primary underline underline-offset-2">
            App Structure
          </a>{" "}
          for the component breakdown and design system.
        </P>
      </Section>

      <Section title="Data model">
        <P>Six MongoDB collections, all in one database:</P>
        <Table
          head={["Collection", "Purpose", "Key indexes"]}
          rows={[
            ["users", "one document per account — auth fields plus profile fields (bio, socials, avatar_url, tech_stack, ...)", "unique index on email; unique index on username"],
            ["otps", "current OTP per (email, purpose)", "TTL index on expires_at; compound index on (email, purpose)"],
            ["refresh_tokens", "hashed, revocable refresh tokens", "TTL index on expires_at; index on token_hash"],
            ["teams", "one document per team — lead_id, denormalized member snapshots (name/username/photo/primary_skill/role/status)", "index on lead_id; index on members.user_id"],
            ["generated_ideas", "one document per Idea Engine generation — 5 scored ideas + a shortlisted flag per idea", "compound index on (team_id, created_at desc)"],
            ["research_results", "one document per Research Engine run — the full research brief", "compound index on (team_id, created_at desc)"],
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
