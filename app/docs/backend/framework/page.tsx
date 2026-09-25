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

export default function WinFrameworkPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Win Framework"
        description="A time-boxed phase plan for a single hackathon — one per team, computed from a start time and a total duration, implemented in internal/service/win_framework_service.go."
      />

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "One per team",
              "enforced by a unique index — a second POST /framework returns 409 (ErrFrameworkAlreadyExists)",
              "a team plans one hackathon at a time; use PUT/DELETE to change or restart it",
            ],
            [
              "Allowed durations",
              "exactly {12, 24, 36, 48, 72} hours — anything else is rejected (400)",
              "matches the real durations HackPilot hackathons run; keeps the phase-percentage math meaningful",
            ],
            [
              "Phase timing",
              "start_time/end_time per phase are computed on every response, never stored",
              "the only stored inputs are the framework's start_time, duration_hours, and each phase's fixed percentage — recomputing avoids ever having stale phase boundaries after an update",
            ],
            [
              "teamId lookup",
              "GET /framework/:teamId only succeeds if :teamId resolves to the caller's own active team",
              "not a general-purpose team lookup — same ownership check pattern used by Pitch Builder history",
            ],
          ]}
        />
      </Section>

      <Section title="The default template">
        <P>
          <InlineCode>DefaultFrameworkPhases()</InlineCode> seeds every new
          framework with 3 fixed phases whose percentages sum to 100:
        </P>
        <Table
          head={["Phase", "Name", "%", "Description", "Sample tasks"]}
          rows={[
            ["phase-1", "Idea & Validation", "15%", "Lock in the problem and solution before writing any code.", "Read the PS; run Idea Engine; run Research Engine; pick the idea; write a 1-sentence problem + solution"],
            ["phase-2", "Build", "65%", "Ship the core feature, nothing else.", "Design the demo flow first; build the core feature only; use AI tools for speed; freeze features 4hrs early; keep UI clean"],
            ["phase-3", "Pitch Prep", "20%", "Turn the build into a winning demo.", "Record a backup demo video; complete the pitch deck; map slides to the rubric; 3 full timed rehearsals; test the live demo on a different network"],
          ]}
        />
      </Section>

      <Section title="How phase start/end times are computed">
        <P>
          <InlineCode>toWinFrameworkResponse</InlineCode> walks the phases in
          array order, accumulating percentage as it goes — phase boundaries
          depend purely on each phase&apos;s <InlineCode>Percentage</InlineCode> and
          its position in the array, not on any independently stored time:
        </P>
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[820px]">
            <FlowBox title="totalDuration = duration_hours × 1h" />
            <Arrow />
            <FlowBox title="end_time = start_time + totalDuration" />
          </div>
          <div className="mt-space-md flex items-center min-w-[820px]">
            <FlowBox title="cumulative = 0" tone="outline" />
            <Arrow label="per phase, in order" />
            <FlowBox title="phase.start = start_time + (cumulative/100 × totalDuration)" />
            <Arrow />
            <FlowBox title="cumulative += phase.Percentage" tone="primary" />
            <Arrow />
            <FlowBox title="phase.end = start_time + (cumulative/100 × totalDuration)" />
          </div>
        </div>
        <P>
          Because this runs fresh on every <InlineCode>GET</InlineCode>/
          <InlineCode>PUT</InlineCode> response, editing a framework&apos;s{" "}
          <InlineCode>start_time</InlineCode> or <InlineCode>duration_hours</InlineCode>{" "}
          instantly reflows every phase&apos;s window — there&apos;s nothing to
          migrate or recompute in the background.
        </P>
      </Section>

      <Section title="Endpoints" id="framework">
        <P>
          <InlineCode>POST /api/v1/framework</InlineCode> creates the one
          framework a team is allowed to have.{" "}
          <InlineCode>PUT /api/v1/framework/:id</InlineCode> accepts an
          optional <InlineCode>start_time</InlineCode> and/or{" "}
          <InlineCode>duration_hours</InlineCode> and re-validates the
          duration if provided. <InlineCode>DELETE /api/v1/framework/:id</InlineCode>{" "}
          removes it so the team can start over. Full shapes in{" "}
          <a href="/docs/api-reference#framework" className="text-primary underline underline-offset-2">
            API Reference → Win Framework
          </a>
          .
        </P>
        <Callout type="info" title="Frontend does its own live ticking">
          <P>
            The countdown timer and timeline bar on <InlineCode>/framework</InlineCode>{" "}
            don&apos;t poll this endpoint every second — the frontend fetches
            the framework once and re-renders locally against the client
            clock. See{" "}
            <a href="/docs/frontend#checklist-framework" className="text-primary underline underline-offset-2">
              App Structure → Checklist &amp; Win Framework
            </a>
            .
          </P>
        </Callout>
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/api-reference#framework" className="text-primary underline underline-offset-2">
            API Reference → Win Framework
          </a>{" "}
          for exact request/response bodies.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Checklist", href: "/docs/backend/checklist" }}
        next={{ title: "Pitch Builder", href: "/docs/backend/pitch" }}
      />
    </article>
  );
}
