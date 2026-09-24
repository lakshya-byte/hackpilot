import {
  DocHeader,
  Section,
  P,
  CardGrid,
  Card,
  CodeBlock,
  Callout,
  DocFooterNav,
} from "@/components/docs/doc-ui";

export default function DocsOverviewPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Introduction"
        title="HackPilot documentation"
        description="HackPilot is split into three repositories: a Next.js product frontend, a Go monolithic backend, and a Python AI agent service. This is the living reference for how they're built and how they fit together."
      />

      <Section title="Repositories">
        <P>
          The project lives as three sibling folders under one workspace.
          There is no shared package manager or monorepo tool (no Turborepo/
          Nx) — each side is an independent, deployable app that talks to the
          others over HTTP.
        </P>
        <CodeBlock
          filename="workspace layout"
          code={`hackpilot/            # this app — Next.js 16 (App Router) frontend
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
          <Card icon="web" title="Frontend app">
            Landing page, all four auth screens, and a dashboard covering
            Profile, Teams, Idea Engine, and Research Engine — all wired to
            the real API over httpOnly-cookie sessions; sign-up/forgot/
            reset-password stay UI-only. See{" "}
            <a href="/docs/frontend" className="text-primary underline underline-offset-2">
              App Structure
            </a>
            .
          </Card>
        </CardGrid>
      </Section>

      <Section title="Tech stack">
        <CardGrid>
          <Card icon="dns" title="Backend">
            Go, Gin, MongoDB (official driver), JWT (golang-jwt/v5), bcrypt,
            Resend for transactional email, Cloudinary for avatar images.
          </Card>
          <Card icon="palette" title="Frontend">
            Next.js 16 (App Router), React 19, Tailwind CSS v4 with a custom
            Material Design 3‑style token system, GSAP for scroll animation.
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
          submissions, billing, etc.), add a new doc group in{" "}
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
