import {
  DocHeader,
  Section,
  P,
  CodeBlock,
  Callout,
  Table,
  InlineCode,
  MethodBadge,
  DocFooterNav,
} from "@/components/docs/doc-ui";

function Endpoint({
  method,
  path,
  auth,
  description,
  request,
  response,
  errors,
}: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  auth?: boolean;
  description: string;
  request?: string;
  response: string;
  errors: [string, string][];
}) {
  return (
    <div className="rounded-2xl border border-outline-variant overflow-hidden mt-space-lg">
      <div className="flex items-center gap-space-sm px-gutter py-space-md bg-surface-container-low">
        <MethodBadge method={method} />
        <code className="font-mono text-body-md text-on-surface">{path}</code>
        {auth && (
          <span className="ml-auto flex items-center gap-space-xs font-display text-label-caps text-on-surface-variant uppercase">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            requires access token
          </span>
        )}
      </div>
      <div className="px-gutter py-space-md space-y-space-md">
        <p className="font-body text-body-lg text-on-surface-variant">
          {description}
        </p>
        {request && (
          <div>
            <p className="font-display text-label-md text-outline uppercase mb-space-xs">
              Request body
            </p>
            <CodeBlock language="json" code={request} />
          </div>
        )}
        <div>
          <p className="font-display text-label-md text-outline uppercase mb-space-xs">
            Success response
          </p>
          <CodeBlock language="json" code={response} />
        </div>
        <div>
          <p className="font-display text-label-md text-outline uppercase mb-space-xs">
            Error responses
          </p>
          <Table
            head={["Status", "Body"]}
            rows={errors.map(([status, body]) => [
              status,
              <code key={body} className="font-mono text-body-sm">
                {body}
              </code>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}

export default function ApiReferencePage() {
  return (
    <article>
      <DocHeader
        eyebrow="Backend"
        title="API reference"
        description="Every route exposed by hackpilot-backend. Base URL is your PORT, e.g. http://localhost:8080. All bodies are JSON; all routes are under /api/v1 except /health."
      />

      <Section title="Conventions">
        <ul className="list-disc pl-space-lg space-y-space-xs">
          <li>Errors are always <InlineCode>{`{"error": "message"}`}</InlineCode>.</li>
          <li>Protected routes require <InlineCode>Authorization: Bearer &lt;access_token&gt;</InlineCode>.</li>
          <li>Validation failures (missing/malformed fields) return <InlineCode>400</InlineCode> with the validator&apos;s message.</li>
        </ul>
      </Section>

      <Section title="Health">
        <Endpoint
          method="GET"
          path="/health"
          description="Liveness check."
          response={`{ "status": "ok" }`}
          errors={[]}
        />
      </Section>

      <Section title="Auth">
        <Endpoint
          method="POST"
          path="/api/v1/auth/signup"
          description="Create an account. The account starts unverified; an OTP is emailed for /verify-otp."
          request={`{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123"
}`}
          response={`{ "message": "signup successful, please verify your email with the otp we sent you" }`}
          errors={[
            ["400", "validation error (e.g. password < 8 chars)"],
            ["409", `{ "error": "email already registered" }`],
          ]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/auth/verify-otp"
          description="Verify the signup OTP. Returns tokens immediately on success — no separate login call needed."
          request={`{ "email": "ada@example.com", "code": "482913" }`}
          response={`{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "9f1c2a...(64 hex chars)",
  "user": {
    "id": "665f1...",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "is_verified": true
  }
}`}
          errors={[
            ["400", `{ "error": "otp not found, please request a new one" }`],
            ["400", `{ "error": "otp expired, please request a new one" }`],
            ["400", `{ "error": "invalid otp code" }`],
            ["404", `{ "error": "user not found" }`],
            ["409", `{ "error": "account already verified" }`],
            ["429", `{ "error": "too many attempts, please request a new otp" }`],
          ]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/auth/resend-otp"
          description="Re-send the signup verification OTP. 60s cooldown between requests."
          request={`{ "email": "ada@example.com" }`}
          response={`{ "message": "otp resent" }`}
          errors={[["429", `{ "error": "please wait before requesting another otp" }`]]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/auth/login"
          description="Authenticate with email + password. Account must be verified."
          request={`{ "email": "ada@example.com", "password": "password123" }`}
          response={`{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "9f1c2a...",
  "user": { "id": "665f1...", "name": "Ada Lovelace", "email": "ada@example.com", "is_verified": true }
}`}
          errors={[
            ["401", `{ "error": "invalid email or password" }`],
            ["403", `{ "error": "account not verified" }`],
          ]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/auth/refresh"
          description="Exchange a refresh token for a new token pair. The submitted refresh token is revoked (single use / rotation)."
          request={`{ "refresh_token": "9f1c2a..." }`}
          response={`{ "access_token": "...", "refresh_token": "...(new)", "user": { ... } }`}
          errors={[["401", `{ "error": "invalid or expired refresh token" }`]]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/auth/logout"
          description="Revoke a single refresh token."
          request={`{ "refresh_token": "9f1c2a..." }`}
          response={`{ "message": "logged out" }`}
          errors={[]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/auth/forgot-password"
          description="Request a password-reset OTP. Always returns a generic success message — does not reveal whether the email is registered."
          request={`{ "email": "ada@example.com" }`}
          response={`{ "message": "if that email is registered, an otp has been sent" }`}
          errors={[]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/auth/reset-password"
          description="Set a new password using the reset OTP. Revokes every existing refresh token for the user (logs out all sessions)."
          request={`{
  "email": "ada@example.com",
  "code": "482913",
  "new_password": "newpassword456"
}`}
          response={`{ "message": "password reset successful" }`}
          errors={[
            ["400", `{ "error": "invalid otp code" } / "otp expired..." / "otp not found..."`],
            ["404", `{ "error": "user not found" }`],
            ["429", `{ "error": "too many attempts, please request a new otp" }`],
          ]}
        />
      </Section>

      <Section title="Users">
        <Endpoint
          method="GET"
          path="/api/v1/users/me"
          auth
          description="Return the authenticated user's profile, resolved from the access token's user id."
          response={`{
  "id": "665f1...",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "is_verified": true
}`}
          errors={[
            ["401", `{ "error": "missing authorization header" } / "invalid authorization header" / "invalid or expired token"`],
            ["404", `{ "error": "user not found" }`],
          ]}
        />

        <Endpoint
          method="GET"
          path="/api/v1/users/me/profile"
          auth
          description="Return the full editable profile: identity, bio/education, socials, and competency/tech-stack fields."
          response={`{
  "id": "665f1...",
  "name": "Aarav Sharma",
  "username": "aarav-sharma",
  "email": "aarav@example.com",
  "is_verified": true,
  "avatar_url": "https://res.cloudinary.com/.../avatar_665f1.jpg",
  "bio": "Full-stack & AI infra hacker",
  "location": "Mumbai, India",
  "institution": "IIT Bombay",
  "degree": "B.Tech, Computer Science",
  "graduation_year": 2026,
  "experience_label": "Senior Competitive Hacker (4+ years)",
  "resume_url": "https://...",
  "socials": { "github": "https://github.com/...", "linkedin": "...", "twitter": "...", "portfolio": "..." },
  "primary_specialization": "Distributed Backend & Cloud AI",
  "domain_capabilities": ["System Architecture", "DevOps & CI/CD"],
  "tech_stack": ["Go", "React", "MongoDB"],
  "created_at": "2026-01-10T12:00:00Z"
}`}
          errors={[["401", `{ "error": "unauthorized" }`]]}
        />

        <Endpoint
          method="PATCH"
          path="/api/v1/users/me/profile"
          auth
          description="Partially update the profile. Every field is optional — omit a field to leave it unchanged (don't send an empty string, it's validated as a real value, e.g. resume_url as a URL)."
          request={`{
  "location": "Mumbai, India",
  "bio": "Full-stack & AI infra hacker",
  "primary_specialization": "Distributed Backend & Cloud AI",
  "domain_capabilities": ["System Architecture", "DevOps & CI/CD"]
}`}
          response={`(same shape as GET /users/me/profile, reflecting the update)`}
          errors={[
            ["400", `{ "error": "username must contain only lowercase letters, numbers, and hyphens" } / field validation errors`],
            ["409", `{ "error": "username already taken" }`],
          ]}
        />

        <Endpoint
          method="POST"
          path="/api/v1/users/me/avatar"
          auth
          description={`Upload a profile avatar. multipart/form-data with a single "avatar" file field (image/*, ≤5MB by default). Uploads to Cloudinary and persists the resulting URL.`}
          response={`{ "avatar_url": "https://res.cloudinary.com/.../hackpilot/avatars/avatar_665f1.jpg" }`}
          errors={[
            ["400", `{ "error": "avatar must be an image file" } / "avatar file is too large" / "missing \\"avatar\\" file field"`],
            ["503", `{ "error": "avatar upload is not configured on this server" } — CLOUDINARY_URL isn't set`],
          ]}
        />
      </Section>

      <Section title="Teams" id="teams">
        <Endpoint
          method="POST"
          path="/api/v1/teams"
          auth
          description="Create a team. The caller becomes lead, active, immediately."
          request={`{ "name": "ByteForce Sentinel", "hackathon": "Smart India Hackathon 2025" }`}
          response={`{
  "id": "665f1...",
  "name": "ByteForce Sentinel",
  "hackathon": "Smart India Hackathon 2025",
  "lead_id": "665f1...",
  "members": [{ "user_id": "665f1...", "name": "Ada Lovelace", "username": "ada", "role": "lead", "status": "active" }],
  "created_at": "2026-01-10T12:00:00Z"
}`}
          errors={[["409", `{ "error": "you are already in a team" }`]]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/teams/me"
          auth
          description="Return the caller's team (as lead, active member, or pending invitee)."
          response={`(same shape as POST /teams)`}
          errors={[["404", `{ "error": "team not found" }`]]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/teams/invite"
          auth
          description="Lead-only. Invite a user by username."
          request={`{ "username": "grace-hopper" }`}
          response={`(same shape as POST /teams, with the new member appended, status "invited")`}
          errors={[
            ["403", `{ "error": "only the team lead can do this" }`],
            ["404", `{ "error": "user not found" }`],
            ["409", `{ "error": "user has already been invited to this team" } / "user is already a member of this team"`],
          ]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/teams/invite/:id"
          auth
          description="Accept or decline the caller's own pending invite for team :id."
          request={`{ "accept": true }`}
          response={`(the team, with the caller now "active") — or null on decline`}
          errors={[["400", `{ "error": "you have no pending invite for this team" }`]]}
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/teams/members/:id"
          auth
          description="Lead-only. Remove member with user id :id."
          response={`(no body, 200)`}
          errors={[
            ["403", `{ "error": "only the team lead can do this" } / "the team lead cannot be removed — transfer leadership or delete the team instead"`],
            ["404", `{ "error": "team member not found" }`],
          ]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/teams/:id"
          auth
          description="Lead-only partial update of name/hackathon. Both fields optional."
          request={`{ "name": "New Name" }`}
          response={`(the updated team)`}
          errors={[["403", `{ "error": "only the team lead can do this" }`]]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/teams/:id/lead"
          auth
          description="Lead-only. Transfer leadership to an existing active member."
          request={`{ "user_id": "665f2..." }`}
          response={`(the team, with lead_id and both members' roles updated)`}
          errors={[
            ["403", `{ "error": "only the team lead can do this" } / "can only transfer leadership to an active team member"`],
          ]}
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/teams/:id"
          auth
          description="Lead-only. Delete the team entirely."
          response={`(no body, 200)`}
          errors={[["403", `{ "error": "only the team lead can do this" }`]]}
        />
      </Section>

      <Section title="Idea Engine" id="ideas">
        <Endpoint
          method="POST"
          path="/api/v1/ideas/generate"
          auth
          description="Generate 5 hackathon ideas via hackpilot-agent, using the caller's team skills. Saves the generation and returns it."
          request={`{
  "hackathon_type": "AI & Machine Learning",
  "duration": "24 hours",
  "target_audience": "Students",
  "problem_statement": "Reduce food waste on campus"
}`}
          response={`{
  "id": "665f3...",
  "team_id": "665f1...",
  "hackathon_type": "AI & Machine Learning",
  "duration": "24 hours",
  "target_audience": "Students",
  "problem_statement": "Reduce food waste on campus",
  "ideas": [
    {
      "title": "...", "description": "...", "tech_stack": ["..."],
      "feasibility_score": 8.0, "impact_score": 7.5, "novelty_score": 6.0, "skill_fit_score": 9.0,
      "judging_angle": "...", "shortlisted": false
    }
    /* × 5 */
  ],
  "created_at": "2026-01-10T12:00:00Z"
}`}
          errors={[
            ["404", `{ "error": "you must be an active member of a team to use this feature" }`],
            ["502", `{ "error": "the AI engine returned an invalid response" }`],
            ["503", `{ "error": "the AI engine is not configured on this server" } / "the AI engine is unavailable"`],
            ["504", `{ "error": "the AI engine took too long to respond" }`],
          ]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/ideas/history"
          auth
          description="All past generations for the caller's team, newest first."
          response={`{ "generations": [ /* GeneratedIdeaResponse, 0 or more */ ] }`}
          errors={[["404", `{ "error": "you must be an active member of a team to use this feature" }`]]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/ideas/:generationId/shortlist/:ideaIndex"
          auth
          description="Set (not toggle) whether one idea within a generation is shortlisted."
          request={`{ "shortlisted": true }`}
          response={`(the updated generation)`}
          errors={[
            ["400", `{ "error": "invalid idea index" }`],
            ["404", `{ "error": "idea generation not found" } — also returned for another team's generation id`],
          ]}
        />
      </Section>

      <Section title="Research Engine" id="research">
        <Endpoint
          method="POST"
          path="/api/v1/research/generate"
          auth
          description="Research an idea via hackpilot-agent, using the caller's team skills. Saves the result and returns it."
          request={`{
  "idea_title": "CampusPlate",
  "idea_description": "A dorm food-waste marketplace",
  "hackathon_type": "Climate & Sustainability",
  "target_audience": "Students"
}`}
          response={`{
  "id": "665f4...",
  "team_id": "665f1...",
  "idea_title": "CampusPlate",
  "idea_description": "A dorm food-waste marketplace",
  "existing_solutions": [{ "name": "...", "type": "...", "url": "...", "summary": "..." }],
  "failed_attempts": [{ "name": "...", "reason": "..." }],
  "market_gap": "...",
  "market_angle": { "target_segment": "...", "problem_scale": "...", "urgency": "..." },
  "differentiation_one_liner": "...",
  "judge_positioning": "...",
  "overall_viability_score": 7.5,
  "created_at": "2026-01-10T12:00:00Z"
}`}
          errors={[
            ["404", `{ "error": "you must be an active member of a team to use this feature" }`],
            ["502", `{ "error": "the AI engine returned an invalid response" }`],
            ["503", `{ "error": "the AI engine is not configured on this server" } / "the AI engine is unavailable"`],
            ["504", `{ "error": "the AI engine took too long to respond" }`],
          ]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/research/history"
          auth
          description="All past research results for the caller's team, newest first."
          response={`{ "researches": [ /* ResearchResultResponse, 0 or more */ ] }`}
          errors={[["404", `{ "error": "you must be an active member of a team to use this feature" }`]]}
        />
      </Section>

      <Callout type="info" title="Adding a new endpoint">
        <P>
          Add the route in <InlineCode>internal/router/router.go</InlineCode>,
          a handler method + DTO, and a service method — then document it
          here as another <InlineCode>&lt;Endpoint /&gt;</InlineCode> block in{" "}
          <InlineCode>app/docs/api-reference/page.tsx</InlineCode>.
        </P>
      </Callout>

      <DocFooterNav
        prev={{ title: "Research Engine", href: "/docs/backend/research-engine" }}
        next={{ title: "Idea & Research Agent", href: "/docs/agent" }}
      />
    </article>
  );
}
