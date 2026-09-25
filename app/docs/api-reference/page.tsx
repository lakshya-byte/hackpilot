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
  pro,
  description,
  request,
  response,
  errors,
}: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  auth?: boolean;
  pro?: boolean;
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
        {(auth || pro) && (
          <span className="ml-auto flex items-center gap-space-md">
            {auth && (
              <span className="flex items-center gap-space-xs font-display text-label-caps text-on-surface-variant uppercase">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                requires access token
              </span>
            )}
            {pro && (
              <span className="flex items-center gap-space-xs font-display text-label-caps text-primary uppercase">
                <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                requires Pro plan
              </span>
            )}
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
            ["403", `{ "error": "free plan limit reached: 3 idea generations per month, upgrade to Pro for unlimited" }`],
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

      <Section title="Checklist" id="checklist">
        <Endpoint
          method="GET"
          path="/api/v1/checklist/progress"
          auth
          description="Overall checklist completion percentage for the given hackathon, for the caller's team."
          request={`?hackathonId=SIH2025 (query param)`}
          response={`{ "progress": 34.78 }`}
          errors={[["400", `{ "error": "hackathonId is required" }`]]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/checklist/:hackathonId"
          auth
          description="Return the full checklist for this hackathon, creating it from the default template on first access."
          response={`{
  "id": "665f5...",
  "team_id": "665f1...",
  "hackathon_id": "SIH2025",
  "phases": [
    {
      "phase_id": "phase-1",
      "label": "1 Week Before",
      "items": [
        { "item_id": "phase-1-item-1", "text": "Read rules, rubric, and prize structure", "checked": false, "updated_at": "..." }
        /* × 5 */
      ],
      "progress": 0
    }
    /* × 4 phases */
  ],
  "progress": 0,
  "created_at": "...",
  "updated_at": "..."
}`}
          errors={[]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/checklist/item"
          auth
          description="Toggle one item. Returns the whole updated checklist."
          request={`{ "hackathon_id": "SIH2025", "phase_id": "phase-1", "item_id": "phase-1-item-1", "checked": true }`}
          response={`(same shape as GET /checklist/:hackathonId)`}
          errors={[["404", `{ "error": "checklist not found" } / "checklist item not found"`]]}
        />
      </Section>

      <Section title="Win Framework" id="framework">
        <Endpoint
          method="POST"
          path="/api/v1/framework"
          auth
          description="Create the caller's team's win framework. One per team."
          request={`{ "hackathon_name": "Smart India Hackathon 2025", "start_time": "2026-03-01T09:00:00Z", "duration_hours": 36 }`}
          response={`{
  "id": "665f6...",
  "team_id": "665f1...",
  "hackathon_name": "Smart India Hackathon 2025",
  "start_time": "2026-03-01T09:00:00Z",
  "end_time": "2026-03-02T21:00:00Z",
  "duration_hours": 36,
  "phases": [
    { "phase_id": "phase-1", "name": "Idea & Validation", "percentage": 15, "description": "Lock in the problem and solution before writing any code.",
      "tasks": ["Read the PS", "Run Idea Engine", "Run Research Engine", "Pick the idea", "Write a 1-sentence problem + solution"],
      "start_time": "2026-03-01T09:00:00Z", "end_time": "2026-03-01T14:24:00Z" }
    /* phase-2 "Build" 65%, phase-3 "Pitch Prep" 20% */
  ],
  "created_at": "..."
}`}
          errors={[
            ["400", `{ "error": "duration_hours must be one of 12, 24, 36, 48, 72" }`],
            ["409", `{ "error": "a win framework already exists for this team" }`],
          ]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/framework/:teamId"
          auth
          description="Fetch the caller's own team's framework. :teamId must match the caller's resolved team."
          response={`(same shape as POST /framework)`}
          errors={[["404", `{ "error": "win framework not found" }`]]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/framework/:id"
          auth
          description="Update start_time and/or duration_hours. Both optional; phase times are recomputed from scratch."
          request={`{ "duration_hours": 48 }`}
          response={`(the updated framework)`}
          errors={[
            ["400", `{ "error": "duration_hours must be one of 12, 24, 36, 48, 72" }`],
            ["404", `{ "error": "win framework not found" }`],
          ]}
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/framework/:id"
          auth
          description="Delete the framework so the team can create a new one."
          response={`{ "message": "framework deleted" }`}
          errors={[["404", `{ "error": "win framework not found" }`]]}
        />
      </Section>

      <Section title="Pitch Builder" id="pitch">
        <Endpoint
          method="POST"
          path="/api/v1/pitch/generate"
          auth
          pro
          description="Generate a rubric-aligned pitch deck via hackpilot-agent. Saves and returns the result."
          request={`{
  "idea_title": "CampusPlate",
  "idea_description": "A dorm food-waste marketplace",
  "hackathon_type": "Climate & Sustainability",
  "target_audience": "Students",
  "rubric_criteria": [{ "criterion": "Technical Feasibility", "weight": 30, "description": "..." }],
  "market_gap": "...",
  "differentiation_one_liner": "..."
}`}
          response={`{
  "id": "665f7...",
  "team_id": "665f1...",
  "idea_title": "CampusPlate",
  "hackathon_type": "Climate & Sustainability",
  "pitch_outline": [
    { "slide_number": 1, "title": "...", "content": "...", "talking_points": ["..."], "demo_moment": "...",
      "rubric_criteria_addressed": ["Technical Feasibility"], "time_allocation_seconds": 45 }
  ],
  "total_duration_seconds": 300,
  "opening_hook": "...",
  "closing_line": "...",
  "demo_flow": ["..."],
  "rubric_coverage": [
    { "criterion": "Technical Feasibility", "weight": 30, "addressed_in_slides": [1, 3], "coverage_strength": "strong" }
  ],
  "created_at": "..."
}`}
          errors={[
            ["403", `{ "error": "this feature requires a Pro plan" }`],
            ["404", `{ "error": "you must be an active member of a team to use this feature" }`],
            ["502", `{ "error": "the AI engine returned an invalid response" }`],
            ["503", `{ "error": "the AI engine is not configured on this server" } / "the AI engine is unavailable"`],
            ["504", `{ "error": "the AI engine took too long to respond" }`],
          ]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/pitch/parse-rubric"
          auth
          pro
          description={`multipart/form-data, file field "rubric" — must be application/pdf, ≤10MB. Parsed by hackpilot-agent.`}
          response={`{ "rubric_criteria": [{ "criterion": "...", "weight": 30, "description": "..." }] }`}
          errors={[
            ["400", `{ "error": "rubric must be a PDF file" } / "couldn't extract rubric criteria from that PDF"`],
            ["403", `{ "error": "this feature requires a Pro plan" }`],
            ["413", `{ "error": "rubric file is too large" }`],
          ]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/pitch/:teamId"
          auth
          pro
          description="All past pitches for the caller's own team, newest first."
          response={`{ "pitches": [ /* PitchResultResponse, 0 or more */ ] }`}
          errors={[["403", `{ "error": "this feature requires a Pro plan" }`]]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/pitch/:id"
          auth
          pro
          description="Edit the outline, hook, closing line, or demo flow of an existing pitch without regenerating. All fields optional."
          request={`{ "opening_hook": "A better opening line." }`}
          response={`(the updated pitch)`}
          errors={[
            ["403", `{ "error": "this feature requires a Pro plan" }`],
            ["404", `{ "error": "pitch not found" }`],
          ]}
        />
      </Section>

      <Section title="Billing" id="billing">
        <Endpoint
          method="POST"
          path="/api/v1/billing/create-order"
          auth
          description="Create a Razorpay order for one Pro activation (₹199 / 30 days). Records a pending payment row."
          response={`{ "order_id": "order_...", "amount": 19900, "currency": "INR", "key_id": "rzp_test_..." }`}
          errors={[["503", `{ "error": "billing is not configured on this server" }`]]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/billing/verify-payment"
          auth
          description="Verify the Razorpay checkout callback's signature and activate Pro. Idempotent — a duplicate call for an already-captured payment is a no-op."
          request={`{ "razorpay_order_id": "order_...", "razorpay_payment_id": "pay_...", "razorpay_signature": "..." }`}
          response={`{ "message": "payment verified, plan activated" }`}
          errors={[
            ["400", `{ "error": "payment signature verification failed" }`],
            ["404", `{ "error": "payment order not found" } — also returned if the order belongs to a different user`],
            ["503", `{ "error": "billing is not configured on this server" }`],
          ]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/billing/status"
          auth
          description="Current plan, expiry, and — for free-plan users — this month's idea-generation usage."
          response={`{
  "plan": "free",
  "days_remaining": 0,
  "idea_generations_used_this_month": 2,
  "idea_generations_limit": 3
}
/* or, for an active Pro user: */
{ "plan": "pro", "expires_at": "2026-04-10T00:00:00Z", "days_remaining": 12, "idea_generations_used_this_month": 0, "idea_generations_limit": 0 }`}
          errors={[]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/billing/history"
          auth
          description={`All payment attempts for the caller, newest first — including abandoned checkouts (status "created") and failures.`}
          response={`{
  "payments": [
    { "id": "...", "razorpay_order_id": "order_...", "razorpay_payment_id": "pay_...",
      "amount": 19900, "currency": "INR", "status": "captured", "plan": "pro", "duration_days": 30, "created_at": "..." }
  ]
}`}
          errors={[]}
        />
        <Callout type="info" title="POST /api/v1/webhooks/razorpay isn't user-callable">
          <P>
            No JWT — Razorpay calls this server-to-server, authenticated by
            an <InlineCode>X-Razorpay-Signature</InlineCode> HMAC over the
            raw request body instead. It handles{" "}
            <InlineCode>payment.captured</InlineCode> (same idempotent
            activation as <InlineCode>verify-payment</InlineCode>) and{" "}
            <InlineCode>payment.failed</InlineCode>. See{" "}
            <a href="/docs/backend/billing" className="text-primary underline underline-offset-2">
              Billing &amp; Plans
            </a>{" "}
            for the signature scheme.
          </P>
        </Callout>
      </Section>

      <Section title="Admin Auth" id="admin-auth">
        <Endpoint
          method="POST"
          path="/api/v1/admin/auth/signup"
          description={`Create an admin account. Requires an X-Admin-Signup-Secret header matching ADMIN_SIGNUP_SECRET — unset entirely disables this endpoint. No email verification, no tokens issued (login separately).`}
          request={`{ "name": "Priya Nair", "email": "priya@hackpilot.dev", "password": "password123" }`}
          response={`{ "message": "admin account created" }`}
          errors={[
            ["403", `{ "error": "admin signup is not permitted" } — missing/wrong header, or ADMIN_SIGNUP_SECRET unset`],
            ["409", `{ "error": "an admin with that email already exists" }`],
          ]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/admin/auth/login"
          description="Authenticate an admin. Signed with JWT_ADMIN_SECRET — never valid against user-scoped routes."
          request={`{ "email": "priya@hackpilot.dev", "password": "password123" }`}
          response={`{
  "access_token": "...", "refresh_token": "...",
  "admin": { "id": "...", "name": "Priya Nair", "email": "priya@hackpilot.dev", "created_at": "..." }
}`}
          errors={[["401", `{ "error": "invalid email or password" }`]]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/admin/auth/refresh"
          description="Rotate an admin refresh token (single-use, same pattern as user auth)."
          request={`{ "refresh_token": "..." }`}
          response={`(same shape as login)`}
          errors={[["401", `{ "error": "invalid or expired refresh token" }`]]}
        />
        <Endpoint
          method="POST"
          path="/api/v1/admin/auth/logout"
          description="Revoke one admin refresh token."
          request={`{ "refresh_token": "..." }`}
          response={`{ "message": "logged out" }`}
          errors={[]}
        />
      </Section>

      <Section title="Admin Teams" id="admin-teams">
        <Endpoint
          method="GET"
          path="/api/v1/admin/teams"
          auth
          description="Search/list all teams platform-wide, for the admin Teams picker."
          request={`?search=ByteForce (query param, optional)`}
          response={`{ "teams": [{ "id": "...", "name": "ByteForce Sentinel", "hackathon": "SIH 2025", "lead_id": "...", "member_count": 4, "created_at": "..." }] }`}
          errors={[]}
        />
      </Section>

      <Section title="Admin Billing" id="admin-billing">
        <Endpoint
          method="GET"
          path="/api/v1/admin/billing/overview"
          auth
          description="Platform-wide billing KPIs for the Revenue dashboard."
          response={`{ "total_pro_users": 42, "mrr_estimate": 8358, "payments_today": 3, "payments_this_month": 21 }`}
          errors={[]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/admin/billing/payments"
          auth
          description="All payment records, optionally filtered."
          request={`?status=captured&plan=pro (both optional query params)`}
          response={`{
  "payments": [
    { "id": "...", "user_id": "...", "user_name": "Ada Lovelace", "user_email": "ada@example.com",
      "institution": "IIT Bombay", "razorpay_order_id": "order_...", "razorpay_payment_id": "pay_...",
      "amount": 19900, "currency": "INR", "status": "captured", "plan": "pro", "duration_days": 30, "created_at": "..." }
  ]
}`}
          errors={[]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/admin/billing/users/lookup"
          auth
          description="Look up a single user by exact email — the entry point for the manual plan-override panel."
          request={`?email=ada@example.com`}
          response={`{ "id": "...", "name": "Ada Lovelace", "email": "ada@example.com", "plan": "free" }`}
          errors={[["404", `{ "error": "user not found" }`]]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/admin/billing/users/:id/plan"
          auth
          description={`Manually set a user's plan. expires_at is required when plan is "pro" (see the invariant in Billing & Plans).`}
          request={`{ "plan": "pro", "expires_at": "2026-05-01T00:00:00Z" }`}
          response={`{ "message": "plan updated" }`}
          errors={[
            ["400", `{ "error": "plan must be one of free, pro" } / "expires_at is required when setting plan to pro"`],
            ["404", `{ "error": "user not found" }`],
          ]}
        />
      </Section>

      <Section title="Analytics" id="analytics">
        <Callout type="warn" title="Requires admin auth, not user auth">
          <P>
            Every endpoint below lives at <InlineCode>/api/v1/analytics/*</InlineCode>{" "}
            (not <InlineCode>/api/v1/admin/analytics/*</InlineCode>) but still
            requires an admin access token — there is no user-facing
            equivalent. See{" "}
            <a href="/docs/backend/analytics" className="text-primary underline underline-offset-2">
              Analytics &amp; Hackathon Logs
            </a>
            .
          </P>
        </Callout>
        <Endpoint
          method="POST"
          path="/api/v1/analytics/log"
          auth
          description="Log one hackathon result for a team."
          request={`{
  "team_id": "665f1...", "hackathon_name": "SIH 2025", "hackathon_type": "AI & ML",
  "idea_title": "CampusPlate", "idea_category": "climate", "result": "finalist", "round": "national",
  "judge_feedback": "Strong demo, weak monetization story.", "team_size": 4, "duration": "36 hours",
  "pitch_used": true, "checklist_used": true, "date": "2026-02-15T00:00:00Z"
}`}
          response={`(the created log, same shape as GET /analytics/:teamId's entries)`}
          errors={[
            ["400", `{ "error": "result must be one of won, finalist, top10, eliminated, withdrawn" } / similar for round, idea_category`],
          ]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/analytics/stats/:teamId"
          auth
          description="Computed stats for one team — see Analytics & Hackathon Logs for how each field is derived."
          response={`{
  "total_hackathons": 6, "total_wins": 1, "win_rate": 16.67, "finalist_rate": 33.33,
  "best_result": "won", "strongest_category": "climate", "weakest_category": "fintech",
  "best_hackathon_type": "AI & ML", "average_round_reached": "national",
  "pitch_win_rate": 25.0, "checklist_win_rate": 20.0,
  "results_breakdown": { "won": 1, "finalist": 2, "top10": 1, "eliminated": 2, "withdrawn": 0 },
  "category_breakdown": [{ "category": "climate", "total": 3, "wins": 1, "win_rate": 33.33 }],
  "monthly_activity": [{ "month": "2026-02", "total": 2, "wins": 1 }],
  "insights": [
    { "type": "positive", "text": "Your strongest category is Climate with a 33.3% win rate." },
    { "type": "warning", "text": "You've struggled to advance past the regional round — 2 eliminations with zero wins." },
    { "type": "tool_correlation", "text": "Teams that used the Pitch Builder won 2.1× more often than those who didn't." }
  ]
}`}
          errors={[]}
        />
        <Endpoint
          method="GET"
          path="/api/v1/analytics/:teamId"
          auth
          description="Raw hackathon logs for a team, newest first."
          response={`{ "logs": [ /* LogResponse, 0 or more */ ] }`}
          errors={[]}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/analytics/:id"
          auth
          description="Partially update a log. Every field optional; enum fields re-validated if present."
          request={`{ "judge_feedback": "Updated after the second round of feedback." }`}
          response={`(the updated log)`}
          errors={[
            ["400", `{ "error": "result must be one of won, finalist, top10, eliminated, withdrawn" }`],
            ["404", `{ "error": "hackathon log not found" }`],
          ]}
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/analytics/:id"
          auth
          description="Delete a log entry."
          response={`{ "message": "log deleted" }`}
          errors={[["404", `{ "error": "hackathon log not found" }`]]}
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
        prev={{ title: "Analytics & Hackathon Logs", href: "/docs/backend/analytics" }}
        next={{ title: "Idea & Research Agent", href: "/docs/agent" }}
      />
    </article>
  );
}
