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

export default function BillingPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Billing & Plans"
        description="Free/Pro plan management via a one-time ₹199/30-day Razorpay payment, feature gating, and an hourly expiry cron — implemented in internal/service/billing_service.go."
      />

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "Plan storage",
              "PlanDetails nested on User (plan_details.{plan, plan_activated_at, plan_expires_at, razorpay_*})",
              "one field to check for gating, same pattern as the existing SocialLinks embedding on User",
            ],
            [
              "\"Is this user Pro\" check",
              "User.IsPro(): plan == \"pro\" AND now is before plan_expires_at — the single source of truth",
              "used identically by RequirePro middleware, IdeaService's free-tier gate, and the /billing/status endpoint — never duplicated",
            ],
            [
              "Invariant on plan_expires_at",
              "every code path that sets Plan to \"pro\" must also set a real, non-zero expiry (fresh activation always computes one; the admin override endpoint requires one in its request body)",
              "avoids a zero-time.Time footgun where \"no expiry\" would compare as already-expired instead of never-expiring",
            ],
            [
              "Activation path",
              "one idempotent activatePro(orderID, paymentID) helper, called by both the client-triggered verify-payment endpoint and the Razorpay webhook",
              "the webhook and the client's post-payment call race to confirm the same payment — whichever arrives first wins, the other is a safe no-op",
            ],
            [
              "Payment audit trail",
              "a PaymentHistory row is created with status \"created\" at order-creation time, before payment even happens",
              "an abandoned checkout is still visible in the admin Payments table, not silently lost",
            ],
            [
              "Renewal timing",
              "activating Pro while already Pro extends from the current expiry, not from now",
              "a \"Renew Pro\" click before expiry shouldn't waste the days still remaining",
            ],
            [
              "Optional config",
              "RAZORPAY_KEY_ID/KEY_SECRET unset → every billing endpoint returns 503, server still boots",
              "same degrade-gracefully pattern as CLOUDINARY_URL and AGENT_SERVICE_URL",
            ],
          ]}
        />
      </Section>

      <Section title="Order → verify → activate">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[860px]">
            <FlowBox title="POST /billing/create-order" subtitle="Razorpay Orders API, Basic Auth" />
            <Arrow />
            <FlowBox title="PaymentHistory{status: created}" tone="outline" />
            <Arrow />
            <FlowBox title="Razorpay Checkout" subtitle="frontend, checkout.js" tone="outline" />
          </div>
          <div className="mt-space-md flex items-center min-w-[860px]">
            <FlowBox title="POST /billing/verify-payment" subtitle="HMAC(order_id|payment_id)" tone="primary" />
            <Arrow label="both converge on" />
            <FlowBox title="activatePro(orderID, paymentID)" tone="primary" />
            <Arrow />
            <FlowBox title="UpdatePlan + mark captured + plan_upgrade event" />
          </div>
          <div className="mt-space-md flex items-center min-w-[860px]">
            <FlowBox title="POST /webhooks/razorpay" subtitle="HMAC(raw body), no user auth" tone="primary" />
            <Arrow label="payment.captured" />
            <FlowBox title="activatePro(orderID, paymentID)" tone="primary" />
          </div>
        </div>
        <Callout type="warn" title="Two different HMAC signatures, don't mix them up">
          <P>
            <InlineCode>verify-payment</InlineCode> checks{" "}
            <InlineCode>HMAC(key_secret, order_id + &quot;|&quot; + payment_id)</InlineCode>{" "}
            against <InlineCode>razorpay_signature</InlineCode> in the request
            body. The webhook checks{" "}
            <InlineCode>HMAC(webhook_secret, &lt;raw request body&gt;)</InlineCode>{" "}
            against the <InlineCode>X-Razorpay-Signature</InlineCode> header — a
            different secret and a different signed payload entirely. Both
            comparisons use <InlineCode>hmac.Equal</InlineCode> (constant-time),
            never <InlineCode>==</InlineCode>.
          </P>
        </Callout>
        <Callout type="info" title="Read the raw body before ShouldBindJSON">
          <P>
            The webhook handler calls <InlineCode>io.ReadAll(c.Request.Body)</InlineCode>{" "}
            first and verifies the signature against those raw bytes —{" "}
            <InlineCode>ShouldBindJSON</InlineCode> would otherwise consume the
            stream, leaving nothing left to hash.
          </P>
        </Callout>
      </Section>

      <Section title="Feature gating">
        <Table
          head={["Feature", "Free tier", "Pro"]}
          rows={[
            ["Idea Engine", "3 generations/month, counted via GeneratedIdea.RequestedBy", "unlimited"],
            ["Research Engine", "not gated", "not gated"],
            ["Pitch Builder", "hard-locked — 403 pro_required on every route", "unlocked"],
            ["Checklist / Win Framework / Teams", "not gated", "not gated"],
          ]}
        />
        <P>
          The free-tier idea cap is checked inside{" "}
          <InlineCode>IdeaService.GenerateIdeas</InlineCode> itself (
          <InlineCode>BillingService.CheckIdeaGenerationAllowed</InlineCode>,
          before the team is even resolved) — see{" "}
          <a href="/docs/backend/idea-engine" className="text-primary underline underline-offset-2">
            Idea Engine
          </a>
          . Pitch Builder&apos;s hard lock is a route-group middleware instead
          (<InlineCode>middleware.RequirePro</InlineCode>), since there&apos;s
          no partial/limited version of that feature to fall back to. Both
          re-check <InlineCode>User.IsPro()</InlineCode> fresh from Mongo on
          every request — plan expiry is time-based and can lapse mid-session,
          so it can&apos;t be cached in the JWT.
        </P>
      </Section>

      <Section title="The expiry cron">
        <P>
          A goroutine started alongside the HTTP server in{" "}
          <InlineCode>main.go</InlineCode> runs once immediately at startup
          (so a restart doesn&apos;t leave stale Pro users for up to an hour),
          then on a <InlineCode>time.NewTicker(1 * time.Hour)</InlineCode>{" "}
          until a shared <InlineCode>context.Context</InlineCode> is cancelled
          during graceful shutdown — the same signal-handling path the HTTP
          server itself uses. Each tick finds every user with{" "}
          <InlineCode>plan == &quot;pro&quot;</InlineCode> and{" "}
          <InlineCode>plan_expires_at &lt; now</InlineCode>, downgrades them
          to free, and writes a <InlineCode>plan_expired</InlineCode> event.
        </P>
      </Section>

      <Section title="The events collection">
        <P>
          <InlineCode>PlatformEvent</InlineCode> (collection{" "}
          <InlineCode>events</InlineCode>) is insert-only right now —{" "}
          <InlineCode>plan_upgrade</InlineCode>, <InlineCode>plan_expired</InlineCode>, and{" "}
          <InlineCode>payment_failed</InlineCode> are written to it, but
          nothing reads it back yet. It exists so a future admin activity
          feed has real data to stream from day one, without billing needing
          to change when that&apos;s built.
        </P>
      </Section>

      <SubSection title="See also">
        <P>
          <a href="/docs/api-reference#billing" className="text-primary underline underline-offset-2">
            API Reference → Billing
          </a>{" "}
          and{" "}
          <a href="/docs/api-reference#admin-billing" className="text-primary underline underline-offset-2">
            API Reference → Admin Billing
          </a>{" "}
          for exact request/response bodies,{" "}
          <a href="/docs/frontend#billing" className="text-primary underline underline-offset-2">
            App Structure → Billing &amp; plan gating
          </a>{" "}
          for the frontend upgrade flow, and{" "}
          <a href="/docs/admin#revenue" className="text-primary underline underline-offset-2">
            Admin Dashboard → Revenue
          </a>{" "}
          for the admin-side payments table and manual plan override.
        </P>
      </SubSection>

      <DocFooterNav
        prev={{ title: "Pitch Builder", href: "/docs/backend/pitch" }}
        next={{ title: "Analytics & Hackathon Logs", href: "/docs/backend/analytics" }}
      />
    </article>
  );
}
