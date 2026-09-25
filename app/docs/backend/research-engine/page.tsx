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

export default function ResearchEnginePage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Research Engine"
        description="POST /api/v1/research/generate takes an idea title + description, calls hackpilot-agent's /research-idea endpoint, saves the resulting research brief, and returns it — implemented in internal/service/research_service.go."
      />

      <Section title="Request flow">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[900px]">
            <FlowBox title="ResearchHandler.GenerateResearch" subtitle="bind dto.ResearchIdeaRequest" />
            <Arrow />
            <FlowBox title="resolveActiveTeam + teamSkills" subtitle="shared with Idea Engine" tone="primary" />
            <Arrow />
            <FlowBox title="AgentClient.ResearchIdea" subtitle="POST hackpilot-agent /research-idea" tone="primary" />
            <Arrow />
            <FlowBox title="ResearchResultRepository.Create" subtitle="save before returning" />
          </div>
        </div>
        <P>
          Built as a near-identical sibling of the Idea Engine on purpose:
          same active-team requirement, same agent-error classification
          (timeout / bad response / unavailable), same
          save-before-returning-the-id pattern.
        </P>
      </Section>

      <Section title="What's deliberately different from Idea Engine">
        <Table
          head={["Aspect", "Idea Engine", "Research Engine"]}
          rows={[
            ["Input", "hackathon_type, duration, target_audience, optional problem_statement", "idea_title, idea_description, hackathon_type, target_audience — no duration"],
            ["Agent client", "shares the same HTTPAgentClient", "shares the same HTTPAgentClient (2nd method, ResearchIdea, same struct/base URL — one client, two agent endpoints)"],
            ["Post-generation action", "Shortlist toggle per idea (PUT .../shortlist/:ideaIndex)", "none — no shortlist-equivalent was requested"],
            ["History emptiness", "empty array, not 404 (same as Idea Engine)", "same"],
            ["Error wording", "shared, generic sentinels — see below", "same sentinels, same wording"],
          ]}
        />
      </Section>

      <Callout type="info" title="Shared, reworded error sentinels">
        <P>
          <InlineCode>ErrNoTeam</InlineCode>,{" "}
          <InlineCode>ErrAgentNotConfigured</InlineCode>,{" "}
          <InlineCode>ErrAgentUnavailable</InlineCode>,{" "}
          <InlineCode>ErrAgentTimeout</InlineCode>, and{" "}
          <InlineCode>ErrAgentBadResponse</InlineCode> were originally worded
          for Idea Engine only (e.g. &quot;idea engine is not configured on
          this server&quot;). Adding Research Engine meant generalizing the{" "}
          <em>text</em> of those sentinels (e.g. to &quot;the AI engine is not
          configured on this server&quot;) without renaming the Go
          identifiers — so{" "}
          <InlineCode>handleServiceError</InlineCode>&apos;s switch in{" "}
          <InlineCode>auth_handler.go</InlineCode> needed zero changes, and
          both engines now return messages that make sense regardless of
          which one the caller hit.
        </P>
      </Callout>

      <Section title="Response shape">
        <P>
          <InlineCode>ResearchResultResponse</InlineCode> mirrors the Python
          agent&apos;s output one-to-one:{" "}
          <InlineCode>existing_solutions</InlineCode> (name/type/url/summary),{" "}
          <InlineCode>failed_attempts</InlineCode> (name/reason),{" "}
          <InlineCode>market_gap</InlineCode> (a paragraph),{" "}
          <InlineCode>market_angle</InlineCode> (target_segment/
          problem_scale/urgency), <InlineCode>differentiation_one_liner</InlineCode>,{" "}
          <InlineCode>judge_positioning</InlineCode>, and{" "}
          <InlineCode>overall_viability_score</InlineCode> (0–10, clamped by
          the agent&apos;s own format node before it ever reaches Go).
        </P>
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/agent" className="text-primary underline underline-offset-2">
            Idea &amp; Research Agent
          </a>{" "}
          for the 6-node LangGraph pipeline behind this endpoint, and{" "}
          <a href="/docs/api-reference#research" className="text-primary underline underline-offset-2">
            API Reference → Research Engine
          </a>{" "}
          for exact request/response shapes.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Idea Engine", href: "/docs/backend/idea-engine" }}
        next={{ title: "Checklist", href: "/docs/backend/checklist" }}
      />
    </article>
  );
}
