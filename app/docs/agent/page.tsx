import {
  DocHeader,
  Section,
  SubSection,
  P,
  CodeBlock,
  Callout,
  Table,
  InlineCode,
  MethodBadge,
  FlowBox,
  Arrow,
  DocFooterNav,
} from "@/components/docs/doc-ui";

export default function AgentPage() {
  return (
    <article>
      <DocHeader
        eyebrow="AI Agent Service"
        title="Idea & Research Agent"
        description="hackpilot-agent is a standalone Python FastAPI service — the third repo in the workspace — running two LangGraph pipelines on top of OpenAI GPT-4o and Tavily web search. The Go backend is its only caller."
      />

      <Section title="Why a separate service, not a Go package">
        <P>
          LangGraph and the Python LLM/agent ecosystem (langchain-openai,
          tavily-python) don&apos;t have Go equivalents worth adopting. Rather
          than hand-rolling graph orchestration in Go, the agent logic lives
          in its own small Python service that the Go backend calls over
          plain HTTP — the same reasoning that keeps the Go backend itself a
          monolith: one clear boundary, no need for a shared runtime.
        </P>
      </Section>

      <Section title="Project layout">
        <CodeBlock
          filename="hackpilot-agent/app"
          code={`main.py                  FastAPI app: CORS, /health, /generate-ideas, /research-idea
config.py                env var loading (OPENAI_API_KEY, TAVILY_API_KEY required;
                          fails fast at import time if either is missing)
llm.py                    get_llm(temperature) → ChatOpenAI(model="gpt-4o", ...)
schemas.py                Pydantic request/response models for BOTH engines
                          (the FastAPI boundary contract — internal graph
                          state never crosses this boundary directly)

graph_state.py            GraphState TypedDict — Idea Engine
graph.py                  GRAPH = build_graph()  (compiled once, module-level)
nodes/
  parse_context.py        \\
  research.py               } Idea Engine's 7 nodes
  gap_analysis.py           }
  generate_ideas.py         }
  validate_ideas.py         }
  recommend_stacks.py       }
  format_output.py         /

research_graph_state.py  ResearchGraphState TypedDict — Research Engine
research_graph.py        RESEARCH_GRAPH = build_research_graph()
nodes/
  research_parse_input.py    \\
  research_scan_existing.py    } Research Engine's 6 nodes — separate
  research_find_failures.py    } names from the Idea Engine nodes above
  research_identify_gap.py     } so both graphs can coexist in one
  research_market_analysis.py  } nodes/ package without collisions
  research_format_output.py   /`}
        />
        <Callout type="info" title="TypedDict state, not Pydantic">
          <P>
            Both graphs use a <InlineCode>TypedDict</InlineCode> for their
            internal state (not a Pydantic model) — LangGraph merges each
            node&apos;s returned partial dict into the running state on every
            transition, and validating that on every hop would be pure
            overhead. Validation happens once, at the FastAPI boundary, via
            the Pydantic models in <InlineCode>schemas.py</InlineCode>.
          </P>
        </Callout>
      </Section>

      <Section title="Idea Engine pipeline">
        <P>
          <InlineCode>POST /generate-ideas</InlineCode> runs 7 nodes in a
          straight line — no branching, no cycles:
        </P>
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[1180px]">
            <FlowBox title="parse_context" subtitle="trim, default, no LLM" />
            <Arrow />
            <FlowBox title="research" subtitle="Tavily ×2 (this + prior year)" tone="outline" />
            <Arrow />
            <FlowBox title="gap_analysis" subtitle="1 LLM call" />
            <Arrow />
            <FlowBox title="generate_ideas" subtitle="1 LLM call, exactly 5" tone="primary" />
            <Arrow />
            <FlowBox title="validate_ideas" subtitle="1 LLM call, scores all 5" />
            <Arrow />
            <FlowBox title="recommend_stacks" subtitle="1 LLM call" />
            <Arrow />
            <FlowBox title="format_output" subtitle="pure Python, clamp + validate count" />
          </div>
        </div>
        <SubSection title="Node responsibilities">
          <Table
            head={["Node", "LLM call?", "What it does"]}
            rows={[
              ["parse_context", "no", "trims/validates the 5 input fields, defaults empty team_skills to [\"full-stack\"]"],
              ["research", "no (Tavily)", "2 searches (current + prior year), merged & deduped by URL, snippets truncated to 500 chars — degrades to an empty list on any Tavily failure, never fails the request"],
              ["gap_analysis", "yes, temp 0.4", "produces overdone_patterns / underserved_angles / judge_fatigue_notes from context + research"],
              ["generate_ideas", "yes, temp 0.9, structured", "exactly 5 diverse ideas (title, description, judging_angle), explicitly told to avoid overdone patterns and lean into underserved angles"],
              ["validate_ideas", "yes, temp 0, structured", "one call scores all 5 ideas together (not 5 separate calls) on feasibility/impact/novelty/skill_fit — cheaper and scores them relative to each other"],
              ["recommend_stacks", "yes, temp 0.3, structured", "3–6 technologies per idea, team_skills given as the primary constraint"],
              ["format_output", "no", "merges everything, clamps every score to [0, 10], drops the internal id field, raises if the final count isn't exactly 5"],
            ]}
          />
        </SubSection>
      </Section>

      <Section title="Research Engine pipeline">
        <P>
          <InlineCode>POST /research-idea</InlineCode> runs 6 nodes,
          structurally the same shape as Idea Engine but built as its own
          independent state/node set (see the collision note above):
        </P>
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[1180px]">
            <FlowBox title="research_parse_input" subtitle="trim, default, no LLM" />
            <Arrow />
            <FlowBox title="research_scan_existing" subtitle="Tavily + LLM classify" tone="outline" />
            <Arrow />
            <FlowBox title="research_find_failures" subtitle="Tavily + LLM classify" tone="outline" />
            <Arrow />
            <FlowBox title="research_identify_gap" subtitle="1 LLM call" />
            <Arrow />
            <FlowBox title="research_market_analysis" subtitle="1 LLM call" />
            <Arrow />
            <FlowBox title="research_format_output" subtitle="1 LLM call + assembly" tone="primary" />
          </div>
        </div>
        <SubSection title="Node responsibilities">
          <Table
            head={["Node", "LLM call?", "What it does"]}
            rows={[
              ["research_parse_input", "no", "trims/validates idea_title, idea_description, hackathon_type, target_audience; same team_skills default as Idea Engine"],
              ["research_scan_existing", "yes + Tavily", "searches for existing products/startups/repos solving a similar problem, then one structured call turns raw hits into {name, type, url, summary} entries — a failed search returns an empty list, never fails the request"],
              ["research_find_failures", "yes + Tavily", "same shape, searching for shutdowns/post-mortems instead, producing {name, reason} entries"],
              ["research_identify_gap", "yes, temp 0.4", "one paragraph on what none of the existing solutions or failed attempts actually solve"],
              ["research_market_analysis", "yes, structured", "target_segment / problem_scale / urgency, grounded in everything gathered so far"],
              ["research_format_output", "yes, structured + Python", "differentiation_one_liner, judge_positioning, and overall_viability_score (0–10) from one call, then assembles + clamps the final response shape"],
            ]}
          />
        </SubSection>
      </Section>

      <Section title="Endpoints">
        <div className="rounded-2xl border border-outline-variant overflow-hidden mt-space-lg">
          <div className="flex items-center gap-space-sm px-gutter py-space-md bg-surface-container-low">
            <MethodBadge method="GET" />
            <code className="font-mono text-body-md text-on-surface">/health</code>
          </div>
          <div className="px-gutter py-space-md">
            <P>Liveness check — returns <InlineCode>{`{"status": "ok"}`}</InlineCode>.</P>
          </div>
        </div>
        <div className="rounded-2xl border border-outline-variant overflow-hidden mt-space-lg">
          <div className="flex items-center gap-space-sm px-gutter py-space-md bg-surface-container-low">
            <MethodBadge method="POST" />
            <code className="font-mono text-body-md text-on-surface">/generate-ideas</code>
          </div>
          <div className="px-gutter py-space-md space-y-space-md">
            <CodeBlock
              language="json"
              filename="request"
              code={`{
  "hackathon_type": "AI & Machine Learning",
  "team_skills": ["backend", "ml", "frontend"],
  "duration": "24 hours",
  "target_audience": "Students",
  "problem_statement": "Reduce food waste on campus"
}`}
            />
            <CodeBlock
              language="json"
              filename="response"
              code={`{
  "ideas": [
    {
      "title": "...", "description": "...", "tech_stack": ["..."],
      "feasibility_score": 8.0, "impact_score": 7.5,
      "novelty_score": 6.0, "skill_fit_score": 9.0,
      "judging_angle": "..."
    }
    /* × 5 */
  ]
}`}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-outline-variant overflow-hidden mt-space-lg">
          <div className="flex items-center gap-space-sm px-gutter py-space-md bg-surface-container-low">
            <MethodBadge method="POST" />
            <code className="font-mono text-body-md text-on-surface">/research-idea</code>
          </div>
          <div className="px-gutter py-space-md space-y-space-md">
            <CodeBlock
              language="json"
              filename="request"
              code={`{
  "idea_title": "CampusPlate",
  "idea_description": "A dorm food-waste marketplace",
  "hackathon_type": "Climate & Sustainability",
  "target_audience": "Students",
  "team_skills": ["backend", "ml", "frontend"]
}`}
            />
            <CodeBlock
              language="json"
              filename="response"
              code={`{
  "existing_solutions": [{ "name": "...", "type": "...", "url": "...", "summary": "..." }],
  "failed_attempts": [{ "name": "...", "reason": "..." }],
  "market_gap": "...",
  "market_angle": { "target_segment": "...", "problem_scale": "...", "urgency": "..." },
  "differentiation_one_liner": "...",
  "judge_positioning": "...",
  "overall_viability_score": 7.5
}`}
            />
          </div>
        </div>
        <P>
          Both endpoints run <strong>synchronously</strong> (
          <InlineCode>def</InlineCode>, not <InlineCode>async def</InlineCode>{" "}
          handlers) so FastAPI dispatches the blocking, multi-second graph
          invocation to its threadpool — keeping{" "}
          <InlineCode>/health</InlineCode> responsive even while a generation
          is in flight. Every request goes through the full graph and blocks
          until it&apos;s done; there is no streaming or partial-progress API.
        </P>
      </Section>

      <Section title="Failure modes the Go layer relies on">
        <Table
          head={["Situation", "Agent behavior", "What Go sees"]}
          rows={[
            ["Tavily search fails or times out", "caught inside the node, returns an empty result list, pipeline continues", "a 200 with weaker-but-present results — never surfaced as an error"],
            ["An LLM call raises", "propagates out of GRAPH.invoke()", "500 from FastAPI → agentclient classifies as ErrUnavailable → 503"],
            ["A request times out on the Go side", "n/a (Go's http.Client enforces AGENT_SERVICE_TIMEOUT)", "agentclient.ErrTimeout → 504"],
            ["Malformed/empty JSON body back", "shouldn't happen if the graph completed, but decoded defensively", "agentclient.ErrBadResponse → 502"],
          ]}
        />
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/backend/idea-engine" className="text-primary underline underline-offset-2">
            Idea Engine
          </a>{" "}
          and{" "}
          <a href="/docs/backend/research-engine" className="text-primary underline underline-offset-2">
            Research Engine
          </a>{" "}
          for how the Go backend calls this service, and{" "}
          <a href="/docs/getting-started" className="text-primary underline underline-offset-2">
            Getting Started
          </a>{" "}
          to run it locally.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "API Reference", href: "/docs/api-reference" }}
        next={{ title: "App Structure", href: "/docs/frontend" }}
      />
    </article>
  );
}
