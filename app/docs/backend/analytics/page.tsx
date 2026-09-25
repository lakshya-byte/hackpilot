import {
  DocHeader,
  Section,
  SubSection,
  P,
  Callout,
  Table,
  InlineCode,
  DocFooterNav,
} from "@/components/docs/doc-ui";

export default function AnalyticsPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Analytics & Hackathon Logs"
        description="Per-team, self-reported win/loss logging and the derived stats the admin dashboard's Teams & Analytics view reads — implemented in internal/service/analytics_service.go."
      />

      <Callout type="warn" title="Routed under /api/v1/analytics/*, not /api/v1/admin/analytics/*">
        <P>
          Despite living outside the <InlineCode>/admin</InlineCode> route
          group in <InlineCode>router.go</InlineCode>, every analytics
          endpoint still requires{" "}
          <InlineCode>middleware.RequireAdminAuth</InlineCode> — this is a
          real trap if you&apos;re skimming the router expecting auth to follow
          the URL prefix. There is no user-facing analytics endpoint; this
          data is admin-only.
        </P>
      </Callout>

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "What's logged",
              "one HackathonLog per hackathon a team entered — result, round reached, category, whether Pitch Builder / Checklist were used",
              "self-reported outcomes, not derived from the platform's own generation history — a team can log a hackathon they didn't even use HackPilot's other tools for",
            ],
            [
              "Enum validation",
              "result/round/idea_category are validated server-side against fixed sets on both create and update",
              "keeps the stats aggregation (below) from having to handle arbitrary strings",
            ],
            [
              "Rate fields never NaN",
              "every percentage goes through safeRate(count, total), returning 0 instead of dividing by zero",
              "a team's first-ever visit to their stats page (zero logs) shouldn't 500",
            ],
          ]}
        />
      </Section>

      <Section title="Enums">
        <Table
          head={["Field", "Allowed values"]}
          rows={[
            ["result", "won, finalist, top10, eliminated, withdrawn"],
            ["round", "internal, regional, national, international"],
            ["idea_category", "healthtech, fintech, agritech, edtech, climate, devtools, open"],
          ]}
        />
      </Section>

      <Section title="Computed stats" id="analytics">
        <P>
          <InlineCode>GET /api/v1/analytics/stats/:teamId</InlineCode> computes
          everything below fresh on every call — nothing is pre-aggregated or
          cached:
        </P>
        <Table
          head={["Field", "How it's derived"]}
          rows={[
            ["best_result", "highest-ranked result across all logs by fixed precedence (won > finalist > top10 > eliminated > withdrawn) — the best outcome ever achieved, not the most frequent one"],
            ["strongest_category / weakest_category", "highest / lowest win rate by category, ties broken by entry count then alphabetically"],
            ["average_round_reached", "average of a 1–4 numeric scale (internal=1 … international=4) across all logs, rounded and clamped, then mapped back to a round name"],
            ["pitch_win_rate / checklist_win_rate", "win rate among logs where pitch_used / checklist_used is true"],
            ["results_breakdown / category_breakdown / monthly_activity", "plain counts and rates grouped by result / category / calendar month"],
            ["insights", "exactly 3 entries, always in order: positive → warning → tool_correlation (see below)"],
          ]}
        />
        <P>With zero logs, every string field falls back to <InlineCode>&quot;none&quot;</InlineCode>, the breakdown arrays are empty (not null), and all 3 insights read a generic &quot;log more hackathons&quot; message.</P>
      </Section>

      <SubSection title="The three insights, exactly">
        <ul className="list-disc pl-space-lg space-y-space-xs">
          <li>
            <strong>Positive</strong> — the category with the best win rate,
            requiring at least 2 entries in it; otherwise a
            not-enough-data message.
          </li>
          <li>
            <strong>Warning</strong> — whichever round has the most entries{" "}
            <em>and zero wins</em>, phrased as &quot;you&apos;ve struggled to
            advance past the {"{round}"} round&quot;.
          </li>
          <li>
            <strong>Tool correlation</strong> — compares the win-rate
            multiplier of pitch-used-vs-not against checklist-used-vs-not
            (each side needs ≥2 entries and a strictly higher used-rate);
            whichever multiplier is larger wins, ties favor Pitch Builder.
            Text: &quot;Teams that used the Pitch Builder won{" "}
            <InlineCode>N×</InlineCode> more often than those who didn&apos;t.&quot;
          </li>
        </ul>
      </SubSection>

      <SubSection title="See also">
        <P>
          <a href="/docs/api-reference#analytics" className="text-primary underline underline-offset-2">
            API Reference → Analytics
          </a>{" "}
          for exact request/response bodies, and{" "}
          <a href="/docs/admin#teams-analytics" className="text-primary underline underline-offset-2">
            Admin Dashboard → Teams &amp; Analytics
          </a>{" "}
          for how this data is browsed.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Billing & Plans", href: "/docs/backend/billing" }}
        next={{ title: "API Reference", href: "/docs/api-reference" }}
      />
    </article>
  );
}
