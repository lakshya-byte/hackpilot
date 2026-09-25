import {
  DocHeader,
  Section,
  SubSection,
  P,
  Callout,
  Table,
  InlineCode,
  FlowBox,
  Arrow,
  DocFooterNav,
} from "@/components/docs/doc-ui";

export default function IdeaEnginePage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Idea Engine"
        description="POST /api/v1/ideas/generate auto-attaches the caller's team skills, calls hackpilot-agent, saves the 5 returned ideas, and returns them — implemented in internal/service/idea_service.go."
      />

      <Section title="Request flow">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[1040px]">
            <FlowBox title="IdeaHandler.GenerateIdeas" subtitle="bind dto.GenerateIdeasRequest" />
            <Arrow />
            <FlowBox title="BillingService.CheckIdeaGenerationAllowed" subtitle="free: max 3/month" tone="primary" />
            <Arrow />
            <FlowBox title="resolveActiveTeam" subtitle="lead or active member only" tone="primary" />
            <Arrow />
            <FlowBox title="teamSkills(team)" subtitle="deduped active members' primary_skill" />
            <Arrow />
            <FlowBox title="AgentClient.GenerateIdeas" subtitle="POST hackpilot-agent /generate-ideas" tone="primary" />
            <Arrow />
            <FlowBox title="GeneratedIdeaRepository.Create" subtitle="save + stamp requested_by, before returning" />
          </div>
        </div>
        <P>
          The generation is saved to Mongo <strong>before</strong> the
          response is returned, so the response body carries the real,
          persisted <InlineCode>id</InlineCode> — the frontend&apos;s
          Shortlist button needs that id immediately, with no separate
          &quot;unsaved preview&quot; state. Every saved generation is stamped
          with <InlineCode>requested_by</InlineCode> (the calling user, not
          just the team) — that&apos;s what the free-tier gate counts against.
          A Pro user skips the gate entirely; a free user at the monthly cap
          gets a <InlineCode>403</InlineCode> before the agent is ever
          called. See{" "}
          <a href="/docs/backend/billing" className="text-primary underline underline-offset-2">
            Billing &amp; Plans
          </a>
          .
        </P>
      </Section>

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "team_skills source",
              "shared teamSkills(team) helper (team_access.go)",
              "identical rule to what Research Engine uses — see Teams",
            ],
            [
              "Team requirement",
              "caller must be lead or an active member (ErrNoTeam otherwise, mapped to 404)",
              "an invited-but-not-accepted member shouldn't be able to spend the team's AI-engine calls",
            ],
            [
              "Shortlist storage",
              "a Shortlisted bool field added to IdeaResult (not in the original spec)",
              "simplest way to support a per-idea Shortlist toggle without a new collection or a separate shortlist array to keep in sync",
            ],
            [
              "Shortlist request shape",
              "PUT .../shortlist/:ideaIndex with {\"shortlisted\": *bool}",
              "a pointer bool (not a plain bool) — Gin's binding:\"required\" on a plain bool rejects the literal false, which would make un-shortlisting impossible",
            ],
            [
              "Agent HTTP client",
              "one raw net/http client (agentclient.HTTPAgentClient), not an SDK wrapper",
              "the first case in this codebase of calling an internally-owned service rather than a third-party API with its own SDK",
            ],
            [
              "Agent failure handling",
              "classified into ErrAgentTimeout / ErrAgentBadResponse / ErrAgentUnavailable",
              "lets the client show \"try again\" vs \"the AI engine is down\" instead of one generic 500",
            ],
          ]}
        />
      </Section>

      <Section title="History & shortlist scoping">
        <P>
          <InlineCode>GET /ideas/history</InlineCode> returns every past
          generation for the caller&apos;s team, sorted newest-first, as an{" "}
          <strong>empty array</strong> (not a 404) when there are none —
          unlike <InlineCode>GET /teams/me</InlineCode>, &quot;zero
          generations&quot; is a normal list state here, not a missing
          resource.
        </P>
        <P>
          <InlineCode>PUT /ideas/:generationId/shortlist/:ideaIndex</InlineCode>{" "}
          scopes its update by <InlineCode>{`{_id, team_id}`}</InlineCode>{" "}
          together, so one team can never flip a shortlist flag on another
          team&apos;s generation — a mismatch on either field returns the same{" "}
          <InlineCode>404 idea generation not found</InlineCode>, deliberately
          not a <InlineCode>403</InlineCode>, so the response doesn&apos;t leak
          whether the id belongs to someone else&apos;s team.
        </P>
        <Callout type="info" title="Out-of-range index handling">
          <P>
            Mongo&apos;s positional array update (
            <InlineCode>{`ideas.<i>.shortlisted`}</InlineCode>) silently pads
            the array with nulls if <InlineCode>i</InlineCode> is out of
            range instead of erroring. The repository guards against this by
            requiring <InlineCode>{`{"ideas.<i>": {"$exists": true}}`}</InlineCode>{" "}
            in the same filter, and returns{" "}
            <InlineCode>ErrInvalidIdeaIndex</InlineCode> (→{" "}
            <InlineCode>400</InlineCode>) when that check fails.
          </P>
        </Callout>
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/agent" className="text-primary underline underline-offset-2">
            Idea &amp; Research Agent
          </a>{" "}
          for the LangGraph pipeline this endpoint calls, and{" "}
          <a href="/docs/api-reference#ideas" className="text-primary underline underline-offset-2">
            API Reference → Idea Engine
          </a>{" "}
          for exact request/response shapes.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Teams", href: "/docs/backend/teams" }}
        next={{ title: "Research Engine", href: "/docs/backend/research-engine" }}
      />
    </article>
  );
}
