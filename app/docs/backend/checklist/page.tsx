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

export default function ChecklistPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Checklist"
        description="A phase-based pre-hackathon checklist, one document per (team, hackathon) pair, seeded from a fixed 4-phase template on first access — implemented in internal/service/checklist_service.go."
      />

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "\"hackathonId\"",
              "an arbitrary caller-supplied string, not validated against any hackathon registry",
              "there's no hackathon-entity collection in this codebase — it's just the partition key a team uses to keep multiple hackathons' checklists separate",
            ],
            [
              "Creating a checklist",
              "no explicit create endpoint — GetOrCreate seeds one from the default template on first read",
              "one fewer round trip for the common case (open the checklist page, see items immediately)",
            ],
            [
              "Progress calculation",
              "checked / total * 100, both overall (persisted on the document) and per-phase (computed fresh on every read, never persisted)",
              "overall progress is read often enough to be worth caching; per-phase is cheap to recompute and would otherwise drift from the items array",
            ],
            [
              "Scoping",
              "every read/write resolves the caller's active team first (resolveActiveTeam), then keys by (team_id, hackathon_id)",
              "same team-scoping rule used by Idea Engine and Research Engine — see Teams",
            ],
          ]}
        />
      </Section>

      <Section title="Document shape">
        <CodeBlock
          filename="internal/models/checklist.go"
          language="go"
          code={`type Checklist struct {
    ChecklistID primitive.ObjectID \`bson:"_id"\`
    TeamID      primitive.ObjectID \`bson:"team_id"\`
    HackathonID string             \`bson:"hackathon_id"\`
    Phases      []Phase            \`bson:"phases"\`
    Progress    float64            \`bson:"progress"\`
    CreatedAt, UpdatedAt time.Time
}

type Phase struct {
    PhaseID string
    Label   string
    Items   []ChecklistItem
}

type ChecklistItem struct {
    ItemID    string
    Text      string
    Checked   bool
    UpdatedAt time.Time
}`}
        />
        <P>
          A unique compound index on <InlineCode>{"{team_id, hackathon_id}"}</InlineCode>{" "}
          is what makes <InlineCode>GetOrCreate</InlineCode> safe to call
          repeatedly — it either finds the existing document or creates
          exactly one.
        </P>
      </Section>

      <Section title="The default template">
        <P>
          <InlineCode>DefaultPhases()</InlineCode> is hardcoded directly in{" "}
          <InlineCode>models/checklist.go</InlineCode> (no separate seed file
          or admin-editable config yet) — 4 phases, 23 items total, IDs
          following the pattern <InlineCode>phase-N-item-M</InlineCode>:
        </P>
        <Table
          head={["Phase", "Label", "Sample items"]}
          rows={[
            ["phase-1", "1 Week Before", "Read rules/rubric/prizes; research last 2 years' winners; assign roles; set up boilerplate repos; collect 3–5 raw problem ideas (5 items)"],
            ["phase-2", "Day Before", "Set up dev env + test API keys; prepare slide deck template; sleep 8 hours; brief team on comms protocol (4 items)"],
            ["phase-3", "First 2 Hours", "Timebox ideation to 45 min; impact×feasibility matrix; 10-min competitor scan; write a 1-sentence problem/solution; design the demo user flow before coding (5 items)"],
            ["phase-4", "Final 4 Hours", "Freeze features; record a backup demo video; complete pitch deck vs. rubric; 3 timed rehearsals; test the demo on a different network; submit 5 min before deadline (6 items)"],
          ]}
        />
      </Section>

      <Section title="Endpoints" id="checklist">
        <P>
          <InlineCode>GET /api/v1/checklist/:hackathonId</InlineCode> returns
          the full checklist (creating it from the template if this is the
          first visit for that hackathon). <InlineCode>PUT /api/v1/checklist/item</InlineCode>{" "}
          toggles one item and returns the whole updated document — the
          frontend applies the toggle optimistically and reconciles with
          this response (or rolls back on failure). <InlineCode>GET /api/v1/checklist/progress</InlineCode>{" "}
          is a lightweight <InlineCode>{`{"progress": number}`}</InlineCode>{" "}
          read for places that only need the overall percentage. Full
          request/response shapes are in{" "}
          <a href="/docs/api-reference#checklist" className="text-primary underline underline-offset-2">
            API Reference → Checklist
          </a>
          .
        </P>
        <Callout type="info" title="checked is a pointer in the request DTO">
          <P>
            <InlineCode>ToggleChecklistItemRequest.Checked</InlineCode> is{" "}
            <InlineCode>*bool</InlineCode>, not <InlineCode>bool</InlineCode> —
            the same pattern used by the Idea Engine&apos;s shortlist toggle —
            so an explicit <InlineCode>false</InlineCode> is distinguishable
            from an omitted field.
          </P>
        </Callout>
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/api-reference#checklist" className="text-primary underline underline-offset-2">
            API Reference → Checklist
          </a>{" "}
          for exact request/response bodies, and{" "}
          <a href="/docs/frontend#checklist-framework" className="text-primary underline underline-offset-2">
            App Structure → Checklist &amp; Win Framework
          </a>{" "}
          for how the toggle UI works.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Research Engine", href: "/docs/backend/research-engine" }}
        next={{ title: "Win Framework", href: "/docs/backend/framework" }}
      />
    </article>
  );
}
