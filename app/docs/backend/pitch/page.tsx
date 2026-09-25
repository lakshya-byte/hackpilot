import {
  DocHeader,
  Section,
  SubSection,
  P,
  CodeBlock,
  Callout,
  Table,
  InlineCode,
  FlowBox,
  Arrow,
  DocFooterNav,
} from "@/components/docs/doc-ui";

export default function PitchBuilderPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Pitch Builder"
        description="Rubric-aligned pitch deck generation — parses an uploaded rubric PDF into weighted criteria, then generates a slide-by-slide outline scored against them. Implemented in internal/service/pitch_service.go."
      />

      <Callout type="warn" title="Every route in this group requires an active Pro plan">
        <P>
          Unlike every other feature on this page, Pitch Builder&apos;s whole
          route group is behind <InlineCode>middleware.RequirePro</InlineCode>{" "}
          in addition to <InlineCode>RequireAuth</InlineCode> — a free-plan
          user gets <InlineCode>403 pro_required</InlineCode> on every one of
          these endpoints, not a partial/limited response. See{" "}
          <a href="/docs/backend/billing" className="text-primary underline underline-offset-2">
            Billing &amp; Plans
          </a>{" "}
          for how plan status is determined.
        </P>
      </Callout>

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "Rubric input",
              "upload a PDF, parsed by hackpilot-agent, then fully editable before generating",
              "judges' rubrics arrive as PDFs; parsing removes manual re-typing but the editor lets a hacker fix OCR mistakes or add criteria the parser missed",
            ],
            [
              "File limits",
              "must be application/pdf, capped at 10MB — checked at both the handler and service layers",
              "defense in depth: the handler rejects obviously-wrong uploads before ever touching the agent client",
            ],
            [
              "History/update scoping",
              "GET /pitch/:teamId and PUT /pitch/:id both require :teamId (or the pitch's owning team) to match the caller's own team",
              "same ownership-check pattern as Win Framework — not a general-purpose lookup",
            ],
          ]}
        />
      </Section>

      <Section title="Rubric upload flow">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[820px]">
            <FlowBox title="Client" subtitle={`multipart form, field "rubric"`} />
            <Arrow label="POST /pitch/parse-rubric" />
            <FlowBox title="check Content-Type == application/pdf, size ≤ 10MB" tone="primary" />
            <Arrow />
            <FlowBox title="hackpilot-agent" subtitle="POST /parse-rubric" tone="outline" />
            <Arrow />
            <FlowBox title="rubric_criteria[]" subtitle="criterion, weight, description" />
          </div>
        </div>
        <P>
          An unparseable PDF surfaces the agent&apos;s{" "}
          <InlineCode>422 Unprocessable</InlineCode> as{" "}
          <InlineCode>ErrRubricUnparseable</InlineCode> → <InlineCode>400</InlineCode> here — the
          frontend&apos;s rubric editor is pre-seeded with a default criteria
          set either way, so a failed parse doesn&apos;t block generation.
        </P>
      </Section>

      <Section title="Generating a pitch" id="pitch">
        <P>
          <InlineCode>POST /api/v1/pitch/generate</InlineCode> takes the idea,
          the (possibly hand-edited) rubric criteria, and optional context
          carried over from a Research Engine run (<InlineCode>market_gap</InlineCode>,{" "}
          <InlineCode>differentiation_one_liner</InlineCode>), adds the
          caller&apos;s team skills server-side, and calls{" "}
          <InlineCode>hackpilot-agent</InlineCode>&apos;s{" "}
          <InlineCode>/generate-pitch</InlineCode>. The result — slide
          outline, opening hook, closing line, demo flow, and per-criterion
          rubric coverage — is persisted as a <InlineCode>PitchResult</InlineCode>{" "}
          and returned. <InlineCode>PUT /api/v1/pitch/:id</InlineCode> allows
          editing the outline/hook/closing-line/demo-flow afterward without
          regenerating.
        </P>
        <CodeBlock
          filename="internal/models/pitch_result.go"
          language="go"
          code={`type SlideOutline struct {
    SlideNumber             int
    Title, Content          string
    TalkingPoints           []string
    DemoMoment              string \`bson:",omitempty"\`
    RubricCriteriaAddressed []string
    TimeAllocationSeconds   int
}

type RubricCoverage struct {
    Criterion         string
    Weight            float64
    AddressedInSlides []int
    CoverageStrength  string
}`}
        />
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/api-reference#pitch" className="text-primary underline underline-offset-2">
            API Reference → Pitch Builder
          </a>{" "}
          for exact request/response bodies, and{" "}
          <a href="/docs/frontend#pitch-builder" className="text-primary underline underline-offset-2">
            App Structure → Pitch Builder
          </a>{" "}
          for the slide navigator and coverage panel UI.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Win Framework", href: "/docs/backend/framework" }}
        next={{ title: "Billing & Plans", href: "/docs/backend/billing" }}
      />
    </article>
  );
}
