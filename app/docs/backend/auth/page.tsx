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

export default function AuthSystemPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="Auth system"
        description="Signup with email verification, login, JWT access tokens, rotating refresh tokens, and OTP-based password reset — implemented in internal/service/auth_service.go."
      />

      <Section title="Design decisions">
        <Table
          head={["Decision", "Choice", "Reason"]}
          rows={[
            [
              "Access tokens",
              "short-lived JWT (HS256, 15m default)",
              "stateless verification on every request — no DB lookup needed for RequireAuth middleware",
            ],
            [
              "Refresh tokens",
              "opaque random 32-byte tokens, stored hashed",
              "unlike JWTs, opaque tokens are revocable — logout / logout-all actually work",
            ],
            [
              "Refresh rotation",
              "old token revoked, new one issued on every /refresh call",
              "limits the blast radius of a leaked refresh token to a single use",
            ],
            [
              "Password hashing",
              "bcrypt (default cost)",
              "industry standard, deliberately slow to resist offline brute force",
            ],
            [
              "OTP hashing",
              "HMAC-SHA256 keyed with OTP_HASH_SECRET",
              "a 6-digit code only has 1,000,000 possibilities — plain SHA-256 would let a DB leak be brute-forced client-side in well under a second; keying it means the secret (not just the DB) is required",
            ],
            [
              "Email delivery failure",
              "logged, not fatal to the request",
              "the OTP record is already persisted before the email is sent, so a transient Resend outage shouldn't block account creation — the user can call resend-otp",
            ],
            [
              "Forgot-password response",
              "always generic (\"if that email exists...\")",
              "prevents user enumeration via the password-reset endpoint",
            ],
          ]}
        />
      </Section>

      <Section title="1. Signup + email verification" id="signup">
        <P>
          <InlineCode>POST /api/v1/auth/signup</InlineCode> creates the user
          as <InlineCode>is_verified: false</InlineCode> and immediately
          issues an OTP. The user cannot log in until they verify it.
        </P>
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[820px]">
            <FlowBox title="Client" />
            <Arrow label="signup" />
            <FlowBox title="AuthService.Signup" tone="primary" />
            <Arrow />
            <FlowBox title="check email unique" subtitle="UserRepository" />
            <Arrow />
            <FlowBox title="bcrypt hash + insert user" />
            <Arrow />
            <FlowBox title="generate + store OTP" subtitle="HMAC hash, 10m TTL" />
            <Arrow />
            <FlowBox title="Resend" subtitle="email the code" tone="outline" />
          </div>
        </div>
        <SubSection title="Verifying the code">
          <P>
            <InlineCode>POST /api/v1/auth/verify-otp</InlineCode> looks up the
            OTP by <InlineCode>(email, purpose)</InlineCode>, and rejects if:
          </P>
          <ul className="list-disc pl-space-lg space-y-space-xs">
            <li>no OTP record exists → <InlineCode>otp not found</InlineCode></li>
            <li>it&apos;s past <InlineCode>expires_at</InlineCode> → <InlineCode>otp expired</InlineCode></li>
            <li>5 wrong attempts already made → <InlineCode>too many attempts</InlineCode></li>
            <li>the HMAC of the submitted code doesn&apos;t match → <InlineCode>invalid otp code</InlineCode> (and increments the attempt counter)</li>
          </ul>
          <P>
            On success the user is marked verified, the OTP document is
            deleted, and a token pair is issued immediately — no separate
            login step required after verifying.
          </P>
        </SubSection>
        <SubSection title="Resending a code">
          <P>
            <InlineCode>POST /api/v1/auth/resend-otp</InlineCode> re-uses the
            same generation path, gated by a 60s cooldown (checked against
            the existing OTP document&apos;s <InlineCode>created_at</InlineCode>) so
            a client can&apos;t hammer Resend.
          </P>
        </SubSection>
      </Section>

      <Section title="2. Login" id="login">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[760px]">
            <FlowBox title="Client" />
            <Arrow label="email + password" />
            <FlowBox title="AuthService.Login" tone="primary" />
            <Arrow />
            <FlowBox title="FindByEmail" />
            <Arrow />
            <FlowBox title="bcrypt.CompareHashAndPassword" />
            <Arrow />
            <FlowBox title="check is_verified" />
            <Arrow />
            <FlowBox title="issueTokenPair" />
          </div>
        </div>
        <P>
          A wrong email and a wrong password both return the same{" "}
          <InlineCode>401 invalid email or password</InlineCode> — the
          service never reveals which one was wrong. An unverified account
          gets <InlineCode>403 account not verified</InlineCode> instead.
        </P>
      </Section>

      <Section title="3. Tokens" id="tokens">
        <SubSection title="issueTokenPair">
          <P>
            Shared by signup-verify, login, and refresh. Every successful
            auth produces:
          </P>
          <Table
            head={["Token", "Format", "Lifetime", "Storage"]}
            rows={[
              [
                "access_token",
                "JWT, HS256, claims { uid, email, exp, iat }",
                "15 minutes (configurable)",
                "not stored server-side — verified by signature + exp on every request",
              ],
              [
                "refresh_token",
                "64 hex chars (32 random bytes)",
                "30 days (configurable)",
                "SHA-256 hash stored in refresh_tokens; the plaintext is only ever returned to the client, once",
              ],
            ]}
          />
        </SubSection>
        <SubSection title="Refreshing">
          <P>
            <InlineCode>POST /api/v1/auth/refresh</InlineCode> hashes the
            submitted token, looks it up, and rejects if revoked or expired.
            On success it <strong>revokes the old token</strong> and calls{" "}
            <InlineCode>issueTokenPair</InlineCode> again — so refresh tokens
            are single-use and rotate on every call.
          </P>
        </SubSection>
        <SubSection title="Logout & revocation">
          <P>
            <InlineCode>POST /api/v1/auth/logout</InlineCode> revokes one
            refresh token by hash. A successful password reset (
            <InlineCode>ResetPassword</InlineCode>) additionally revokes{" "}
            <em>every</em> refresh token belonging to that user, logging out
            all sessions.
          </P>
        </SubSection>
        <SubSection title="Protecting a route">
          <P>
            <InlineCode>middleware.RequireAuth</InlineCode> reads the{" "}
            <InlineCode>Authorization: Bearer &lt;token&gt;</InlineCode>{" "}
            header, verifies the JWT signature + expiry, and puts{" "}
            <InlineCode>user_id</InlineCode> / <InlineCode>email</InlineCode>{" "}
            into the Gin context for handlers to read. It never touches the
            database — that&apos;s the point of using a JWT for the access
            token.
          </P>
          <CodeBlock
            filename="internal/router/router.go"
            language="go"
            code={`users := v1.Group("/users")
users.Use(middleware.RequireAuth(cfg.JWTAccessSecret))
{
    users.GET("/me", h.User.Me)
}`}
          />
        </SubSection>
      </Section>

      <Section title="4. Forgot / reset password" id="reset">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-gutter overflow-x-auto">
          <div className="flex items-center min-w-[820px]">
            <FlowBox title="POST /forgot-password" />
            <Arrow />
            <FlowBox title="generic 200 response" subtitle="always, even if email unknown" tone="primary" />
            <Arrow />
            <FlowBox title="OTP emailed" subtitle="only if the account exists" tone="outline" />
          </div>
          <div className="mt-space-md flex items-center min-w-[820px]">
            <FlowBox title="POST /reset-password" subtitle="email + code + new_password" />
            <Arrow />
            <FlowBox title="verify OTP" />
            <Arrow />
            <FlowBox title="bcrypt hash + update" />
            <Arrow />
            <FlowBox title="revoke all refresh tokens" tone="primary" />
          </div>
        </div>
        <P>
          Reusing the same <InlineCode>otps</InlineCode> collection with{" "}
          <InlineCode>purpose: password_reset</InlineCode> (vs{" "}
          <InlineCode>signup_verification</InlineCode>) meant no new
          infrastructure was needed for this flow.
        </P>
      </Section>

      <Section title="Error handling">
        <P>
          The service layer returns sentinel errors (
          <InlineCode>internal/service/errors.go</InlineCode>), never HTTP
          status codes — that mapping happens once, in the handler layer:
        </P>
        <CodeBlock
          filename="internal/handler/auth_handler.go"
          language="go"
          code={`func handleServiceError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrEmailTaken):
		errJSON(c, http.StatusConflict, err.Error())
	case errors.Is(err, service.ErrInvalidCredentials):
		errJSON(c, http.StatusUnauthorized, err.Error())
	case errors.Is(err, service.ErrNotVerified):
		errJSON(c, http.StatusForbidden, err.Error())
	// ...
	default:
		errJSON(c, http.StatusInternalServerError, "internal server error")
	}
}`}
        />
      </Section>

      <Callout type="warn" title="Known gaps / next hardening steps">
        <P>
          No rate limiting on login/signup beyond the OTP resend cooldown; no
          IP-based throttling; refresh tokens aren&apos;t bound to a device
          fingerprint or user-agent. These are reasonable next additions once
          the frontend is wired up and the API is internet-facing.
        </P>
      </Callout>

      <DocFooterNav
        prev={{ title: "Architecture", href: "/docs/architecture" }}
        next={{ title: "Teams", href: "/docs/backend/teams" }}
      />
    </article>
  );
}
