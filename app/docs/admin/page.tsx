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

export default function AdminDashboardPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Admin Dashboard"
        title="Overview"
        description="hackpilot-admin is a separate Next.js app for HackPilot staff — team/hackathon-log analytics and billing/revenue operations. Same design tokens as hackpilot, zero shared components, and a completely separate auth domain."
      />

      <Section title="Why a separate app">
        <P>
          <InlineCode>hackpilot-admin</InlineCode> is its own deployable Next.js
          16 app, not a route inside <InlineCode>hackpilot</InlineCode> — this
          keeps staff-only tooling (and its separate JWT secret, see below)
          out of the bundle every end user downloads, and lets it be deployed
          behind its own access controls entirely independently.
        </P>
      </Section>

      <Section title="Auth" id="auth">
        <P>
          Structurally identical to <InlineCode>hackpilot</InlineCode>&apos;s
          session model — see{" "}
          <a href="/docs/frontend#session" className="text-primary underline underline-offset-2">
            App Structure → Session &amp; auth wiring
          </a>{" "}
          for the shared pattern (httpOnly cookies, a same-origin{" "}
          <InlineCode>/api/*</InlineCode> proxy layer, <InlineCode>proxy.ts</InlineCode>{" "}
          silently rotating an expiring access token) — but a{" "}
          <strong>completely separate JWT domain</strong>: tokens are signed
          with <InlineCode>JWT_ADMIN_SECRET</InlineCode>, never{" "}
          <InlineCode>JWT_ACCESS_SECRET</InlineCode>, so a leaked user token
          can never be replayed as an admin token and vice versa.
        </P>
        <Table
          head={["Difference from user auth", "Detail"]}
          rows={[
            ["Email verification", "none — admin login works immediately after signup, no OTP step"],
            ["Signup gating", "requires an X-Admin-Signup-Secret header matching ADMIN_SIGNUP_SECRET; unset entirely disables signup"],
            ["Signup UI", "none — there is no admin sign-up page. Creating the first admin is a curl call (see Getting Started)"],
            ["Collections", "admin_users / admin_refresh_tokens — fully separate from users / refresh_tokens"],
          ]}
        />
        <Callout type="info" title="Token lifetimes match the user app's defaults, independently">
          <P>
            <InlineCode>ADMIN_ACCESS_TOKEN_TTL</InlineCode> (default 15m) and{" "}
            <InlineCode>ADMIN_REFRESH_TOKEN_TTL</InlineCode> (default 720h /
            30 days) happen to default to the same values as the user app&apos;s{" "}
            <InlineCode>ACCESS_TOKEN_TTL</InlineCode>/<InlineCode>REFRESH_TOKEN_TTL</InlineCode>,
            but are configured independently.
          </P>
        </Callout>
      </Section>

      <Section title="Routes">
        <Table
          head={["Route", "Purpose"]}
          rows={[
            ["/sign-in", "Admin login form"],
            ["/dashboard/analytics", "Team picker — debounced search over all teams"],
            ["/dashboard/analytics/[teamId]", "One team's hackathon-log stats and charts"],
            ["/dashboard/revenue", "Billing KPIs, payments table, manual plan override"],
          ]}
        />
      </Section>

      <Section title="Teams & Analytics" id="teams-analytics">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[860px]">
            <FlowBox title="TeamPickerView" subtitle="debounced search, 250ms + AbortController" />
            <Arrow label="GET /api/teams?search=" />
            <FlowBox title="card grid of matching teams" />
            <Arrow label="click a team" />
            <FlowBox title="/dashboard/analytics/[teamId]" tone="primary" />
          </div>
          <div className="mt-space-md flex items-center min-w-[860px]">
            <FlowBox title="Server Component" subtitle="lib/session.ts" tone="outline" />
            <Arrow label="team + logs + stats, in parallel" />
            <FlowBox title="AnalyticsView" subtitle="StatCards + 3 charts + insights + LogTable" tone="primary" />
          </div>
        </div>
        <P>
          The per-team page fetches team, hackathon logs, and computed stats{" "}
          <em>server-side</em>, in parallel, before the client ever renders —
          adding, editing, or deleting a log afterward calls the corresponding{" "}
          <InlineCode>/api/analytics/*</InlineCode> proxy client-side and then
          re-fetches both logs and stats via a shared <InlineCode>refresh()</InlineCode>.
          See{" "}
          <a href="/docs/backend/analytics" className="text-primary underline underline-offset-2">
            Analytics &amp; Hackathon Logs
          </a>{" "}
          for exactly what <InlineCode>stats</InlineCode> contains.
        </P>
      </Section>

      <Section title="Revenue" id="revenue">
        <P>
          <InlineCode>/dashboard/revenue</InlineCode> is the admin surface for{" "}
          <a href="/docs/backend/billing" className="text-primary underline underline-offset-2">
            Billing &amp; Plans
          </a>
          :
        </P>
        <ul className="list-disc pl-space-lg space-y-space-xs">
          <li>
            A KPI row (Total Pro Users, MRR Estimate, Payments Today, Payments
            This Month) from <InlineCode>GET /api/billing/overview</InlineCode>.
          </li>
          <li>
            A payments table filterable server-side by status/plan (
            <InlineCode>GET /api/billing/payments?status=&amp;plan=</InlineCode>)
            and additionally searchable/sortable client-side by name, email,
            amount, date, and status.
          </li>
          <li>
            A manual plan-override panel: look a user up by email (
            <InlineCode>GET /api/billing/users/lookup?email=</InlineCode>),
            then set their plan and — if setting Pro — a required expiry date
            via <InlineCode>PUT /api/billing/users/:id/plan</InlineCode>. This
            is the only way to grant Pro without a real Razorpay payment
            (e.g. comping an account, or fixing a payment that captured but
            somehow didn&apos;t activate).
          </li>
        </ul>
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/api-reference#admin-auth" className="text-primary underline underline-offset-2">
            API Reference → Admin Auth
          </a>
          ,{" "}
          <a href="/docs/api-reference#admin-teams" className="text-primary underline underline-offset-2">
            Admin Teams
          </a>
          , and{" "}
          <a href="/docs/api-reference#admin-billing" className="text-primary underline underline-offset-2">
            Admin Billing
          </a>{" "}
          for exact request/response bodies.
        </P>
      </SubSection>

      <DocFooterNav prev={{ title: "App Structure", href: "/docs/frontend" }} />
    </article>
  );
}
