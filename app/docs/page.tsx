import {
  DocHeader,
  Section,
  P,
  CardGrid,
  Card,
  CodeBlock,
  Callout,
  InlineCode,
  DocFooterNav,
} from "@/components/docs/doc-ui";

export default function DocsOverviewPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Introduction"
        title="HackPilot documentation"
        description="HackPilot is split into four repositories: a Next.js product frontend, a Next.js admin dashboard, a Go monolithic backend, and a Python AI agent service. This is the living reference for how they're built and how they fit together."
      />

      <Section title="Repositories">
        <P>
          The project lives as four sibling folders under one workspace.
          There is no shared package manager or monorepo tool (no Turborepo/
          Nx) — each side is an independent, deployable app that talks to the
          others over HTTP.
        </P>
        <CodeBlock
          filename="workspace layout"
          code={`hackpilot/            # this app — Next.js 16 (App Router) product frontend
hackpilot-admin/      # Next.js 16 — internal admin dashboard, separate JWT domain
hackpilot-backend/    # Go 1.27 + Gin + MongoDB monolithic backend
hackpilot-agent/      # Python 3.11+ + FastAPI + LangGraph AI agent service`}
        />
      </Section>

      <Section title="What exists today">
        <CardGrid>
          <Card icon="verified_user" title="Auth system (backend)">
            Signup, email OTP verification via Resend, login, JWT access
            tokens, rotating refresh tokens, forgot/reset password. Fully
            implemented and tested end-to-end. See{" "}
            <a href="/docs/backend/auth" className="text-primary underline underline-offset-2">
              Auth System
            </a>
            .
          </Card>
          <Card icon="badge" title="Profile system (backend)">
            Editable identity data (bio, education, socials, competency/tech
            tags) persisted in MongoDB, plus backend-mediated avatar upload to
            Cloudinary. See{" "}
            <a href="/docs/api-reference" className="text-primary underline underline-offset-2">
              API Reference
            </a>
            .
          </Card>
          <Card icon="groups" title="Teams (backend + frontend)">
            One team per hacker, invite-by-username, accept/decline, lead
            transfer, member removal — wired end-to-end. See{" "}
            <a href="/docs/backend/teams" className="text-primary underline underline-offset-2">
              Teams
            </a>
            .
          </Card>
          <Card icon="lightbulb" title="Idea Engine (all 3 repos)">
            A 7-node LangGraph pipeline generates 5 scored, tech-stacked
            hackathon ideas from a team&apos;s skills and context, with a
            shortlist toggle and history. See{" "}
            <a href="/docs/backend/idea-engine" className="text-primary underline underline-offset-2">
              Idea Engine
            </a>
            .
          </Card>
          <Card icon="travel_explore" title="Research Engine (all 3 repos)">
            A 6-node LangGraph pipeline researches an idea against existing
            solutions and failed attempts, producing a market-gap brief with
            a viability score. See{" "}
            <a href="/docs/backend/research-engine" className="text-primary underline underline-offset-2">
              Research Engine
            </a>
            .
          </Card>
          <Card icon="checklist" title="Checklist (backend + frontend)">
            A 4-phase, 23-item pre-hackathon checklist, seeded per team +
            hackathon, with optimistic toggle-and-sync. See{" "}
            <a href="/docs/backend/checklist" className="text-primary underline underline-offset-2">
              Checklist
            </a>
            .
          </Card>
          <Card icon="flag" title="Win Framework (backend + frontend)">
            A time-boxed phase plan (Idea &amp; Validation / Build / Pitch
            Prep) computed from a hackathon&apos;s start time and duration,
            with a live client-side countdown. See{" "}
            <a href="/docs/backend/framework" className="text-primary underline underline-offset-2">
              Win Framework
            </a>
            .
          </Card>
          <Card icon="co_present" title="Pitch Builder (all 3 repos, Pro only)">
            Uploads and parses a judging rubric, then generates a
            slide-by-slide pitch deck scored against it. The first
            Pro-gated feature. See{" "}
            <a href="/docs/backend/pitch" className="text-primary underline underline-offset-2">
              Pitch Builder
            </a>
            .
          </Card>
          <Card icon="credit_card" title="Billing & Plans (backend + frontend + admin)">
            Free/Pro plans via a one-time Razorpay payment, feature gating,
            an hourly expiry cron, and an admin revenue dashboard. See{" "}
            <a href="/docs/backend/billing" className="text-primary underline underline-offset-2">
              Billing &amp; Plans
            </a>
            .
          </Card>
          <Card icon="web" title="Frontend app">
            Landing page, all four auth screens, and a dashboard covering
            Profile, Teams, Idea Engine, Research Engine, Checklist, Win
            Framework, Pitch Builder, and Billing — all wired to the real API
            over httpOnly-cookie sessions; sign-up/forgot/reset-password stay
            UI-only. See{" "}
            <a href="/docs/frontend" className="text-primary underline underline-offset-2">
              App Structure
            </a>
            .
          </Card>
          <Card icon="admin_panel_settings" title="Admin dashboard (hackpilot-admin)">
            A separate Next.js app for staff: per-team hackathon-log
            analytics and a Revenue view (KPIs, payments table, manual plan
            override). See{" "}
            <a href="/docs/admin" className="text-primary underline underline-offset-2">
              Admin Dashboard
            </a>
            .
          </Card>
        </CardGrid>
      </Section>

      <Section title="Tech stack">
        <CardGrid>
          <Card icon="dns" title="Backend">
            Go, Gin, MongoDB (official driver), JWT (golang-jwt/v5), bcrypt,
            Resend for transactional email, Cloudinary for avatar images,
            Razorpay for Pro-plan payments (hand-rolled net/http + HMAC, no SDK).
          </Card>
          <Card icon="palette" title="Frontend">
            Next.js 16 (App Router), React 19, Tailwind CSS v4 with a custom
            Material Design 3‑style token system, GSAP for scroll animation.{" "}
            <InlineCode>hackpilot-admin</InlineCode> shares the exact same
            design tokens with zero shared components.
          </Card>
          <Card icon="smart_toy" title="AI Agent Service">
            Python, FastAPI, LangGraph, langchain-openai (GPT-4o),
            tavily-python for web search. See{" "}
            <a href="/docs/agent" className="text-primary underline underline-offset-2">
              Idea &amp; Research Agent
            </a>
            .
          </Card>
        </CardGrid>
      </Section>

      <Callout type="info" title="This section will grow">
        <P>
          As more of the product is built (Jury Defense, hackathon
          submissions, etc.), add a new doc group in{" "}
          <code className="px-1.5 py-0.5 rounded-md bg-surface-container-high font-mono text-body-sm">
            components/docs/docs-nav.ts
          </code>{" "}
          and a matching route under{" "}
          <code className="px-1.5 py-0.5 rounded-md bg-surface-container-high font-mono text-body-sm">
            app/docs/*
          </code>
          . The sidebar picks up new entries automatically.
        </P>
      </Callout>

      <DocFooterNav
        next={{ title: "Getting Started", href: "/docs/getting-started" }}
      />
    </article>
  );
}
