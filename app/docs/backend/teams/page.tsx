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

export default function TeamsPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Teams"
        description="Every hacker belongs to at most one team per the current model. A team has exactly one lead, a roster of denormalized member snapshots, and an invite/accept/decline lifecycle — implemented in internal/service/team_service.go."
      />

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "Member data",
              "denormalized snapshot on the team document (name, username, photo_url, primary_skill, role, status)",
              "the roster is read far more often than a member's profile changes — avoids an N+1 join on every GET /teams/me",
            ],
            [
              "\"Do I have a team\" lookup",
              "one query: {$or: [{lead_id: userID}, {members.user_id: userID}]}",
              "covers lead, active member, and pending-invite cases in a single round trip",
            ],
            [
              "Removing the lead",
              "explicitly rejected (ErrCannotRemoveLead)",
              "a team must always have exactly one lead — use Transfer Lead or Delete Team instead",
            ],
            [
              "Declining an invite",
              "$pull the member entry entirely, not a \"declined\" status left forever",
              "a declined invite carries no future meaning — deleting it keeps the roster clean",
            ],
            [
              "Member-array mutations",
              "load the whole array, mutate in Go, $set it back (not $ positional / arrayFilters)",
              "simpler and safer than positional-update syntax for the transfer-lead case, which touches two elements (old + new lead) in one write",
            ],
          ]}
        />
      </Section>

      <Section title="Lifecycle" id="lifecycle">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[860px]">
            <FlowBox title="POST /teams" subtitle="creator becomes lead, status=active" tone="primary" />
            <Arrow />
            <FlowBox title="POST /teams/invite" subtitle="lead invites by username" />
            <Arrow />
            <FlowBox title="member: status=invited" />
          </div>
          <div className="mt-space-md flex items-center min-w-[860px]">
            <FlowBox title="PUT /teams/invite/:id" subtitle="invitee accepts or declines" tone="primary" />
            <Arrow label="accept" />
            <FlowBox title="status=active" />
          </div>
          <div className="mt-space-md flex items-center min-w-[860px]">
            <FlowBox title="PUT /teams/:id/lead" subtitle="lead transfers to an active member" tone="primary" />
            <Arrow />
            <FlowBox title="both members' roles flip in one $set" />
          </div>
        </div>
        <P>
          <InlineCode>requireLead()</InlineCode> is checked in every
          lead-only mutation (invite, remove, update, transfer, delete) — it
          loads the team and compares <InlineCode>team.lead_id</InlineCode>{" "}
          against the caller, returning <InlineCode>ErrNotTeamLead</InlineCode>{" "}
          otherwise.
        </P>
      </Section>

      <Section title="Reused by the Idea & Research Engines">
        <P>
          <InlineCode>internal/service/team_access.go</InlineCode> extracts
          two pieces of this logic as free functions so{" "}
          <InlineCode>IdeaService</InlineCode> and{" "}
          <InlineCode>ResearchService</InlineCode> can depend on them without
          duplicating the rules:
        </P>
        <CodeBlock
          filename="internal/service/team_access.go"
          language="go"
          code={`// resolveActiveTeam: caller must be the lead OR an active member —
// invited/declined entries don't count as real participants.
func resolveActiveTeam(ctx context.Context, teamRepo *repository.TeamRepository, userID primitive.ObjectID) (*models.Team, error)

// teamSkills: deduped, non-empty PrimarySkill of every active member —
// this is the "team_skills" sent to the AI agent.
func teamSkills(team *models.Team) []string`}
        />
        <Callout type="info" title="Why this lives here, not on TeamService">
          <P>
            <InlineCode>TeamService.GetMyTeam</InlineCode> returns the
            already-shaped <InlineCode>dto.TeamResponse</InlineCode>. The
            Idea/Research engines need the raw{" "}
            <InlineCode>*models.Team</InlineCode> to read{" "}
            <InlineCode>Members[].PrimarySkill</InlineCode> directly, so both
            free functions operate on <InlineCode>*repository.TeamRepository</InlineCode>{" "}
            instead.
          </P>
        </Callout>
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/api-reference#teams" className="text-primary underline underline-offset-2">
            API Reference → Teams
          </a>{" "}
          for the full endpoint list, and{" "}
          <a href="/docs/frontend#teams" className="text-primary underline underline-offset-2">
            App Structure → Teams
          </a>{" "}
          for the frontend.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Auth System", href: "/docs/backend/auth" }}
        next={{ title: "Idea Engine", href: "/docs/backend/idea-engine" }}
      />
    </article>
  );
}
