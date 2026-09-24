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

export default function GettingStartedPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Introduction"
        title="Getting started"
        description="How to run the backend API and the frontend locally, and how they're configured."
      />

      <Section title="Prerequisites">
        <Table
          head={["Tool", "Version used", "Needed for"]}
          rows={[
            ["Go", "1.27+", "hackpilot-backend"],
            ["Node.js", "20+", "hackpilot (Next.js)"],
            ["Python", "3.11+", "hackpilot-agent"],
            ["MongoDB", "7.x (local or Atlas)", "hackpilot-backend"],
            ["Resend account", "—", "sending OTP emails"],
            ["OpenAI API key", "—", "Idea Engine & Research Engine (GPT-4o)"],
            ["Tavily API key", "—", "Idea Engine & Research Engine (web search)"],
          ]}
        />
      </Section>

      <Section title="1. Run the backend">
        <P>
          Copy the example env file and fill in real secrets, then start the
          server. It listens on <InlineCode>PORT</InlineCode> (default{" "}
          <InlineCode>8080</InlineCode>) and connects to MongoDB on boot,
          creating indexes automatically.
        </P>
        <CodeBlock
          filename="terminal"
          language="bash"
          code={`cd hackpilot-backend
cp .env.example .env   # then fill in JWT_ACCESS_SECRET, MONGO_URI, RESEND_API_KEY...
go run ./cmd/server`}
        />
        <SubSection title="Environment variables">
          <Table
            head={["Variable", "Required", "Default", "Notes"]}
            rows={[
              ["PORT", "no", "8080", "HTTP port"],
              ["ENVIRONMENT", "no", "development", "\"production\" switches Gin to release mode"],
              ["MONGO_URI", "no", "mongodb://localhost:27017", ""],
              ["MONGO_DB", "no", "hackpilot", "database name"],
              ["JWT_ACCESS_SECRET", "yes", "—", "signs access-token JWTs; boot fails if unset"],
              ["ACCESS_TOKEN_TTL", "no", "15m", "Go duration string"],
              ["REFRESH_TOKEN_TTL", "no", "720h (30d)", "Go duration string"],
              ["RESEND_API_KEY", "no*", "\"\"", "*required for real email delivery; empty just fails sends silently (logged)"],
              ["RESEND_FROM_ADDRESS", "no", "onboarding@resend.dev", ""],
              ["OTP_TTL", "no", "10m", "how long a code is valid"],
              ["OTP_LENGTH", "no", "6", "digits"],
              ["OTP_HASH_SECRET", "no", "falls back to JWT_ACCESS_SECRET", "keys the OTP hash — see Auth System"],
              ["CLOUDINARY_URL", "no*", "\"\"", "*required for avatar uploads; empty makes POST /users/me/avatar return 503"],
              ["MAX_AVATAR_SIZE_MB", "no", "5", "avatar upload size limit"],
              ["AGENT_SERVICE_URL", "no*", "\"\"", "*required for Idea/Research Engine; empty makes those endpoints return 503. Points at hackpilot-agent, e.g. http://localhost:8000"],
              ["AGENT_SERVICE_TIMEOUT", "no", "120s", "Go duration string — generous because the agent makes several sequential LLM calls plus web searches"],
            ]}
          />
        </SubSection>
        <Callout type="success" title="Health check">
          <P>
            Once running, <InlineCode>GET /health</InlineCode> returns{" "}
            <InlineCode>{`{"status":"ok"}`}</InlineCode>.
          </P>
        </Callout>
      </Section>

      <Section title="2. Run the AI agent service">
        <P>
          <InlineCode>hackpilot-agent</InlineCode> is a standalone FastAPI
          service the Go backend calls server-to-server — it powers both the
          Idea Engine and the Research Engine.
        </P>
        <CodeBlock
          filename="terminal"
          language="bash"
          code={`cd hackpilot-agent
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in OPENAI_API_KEY and TAVILY_API_KEY
uvicorn app.main:app --host 0.0.0.0 --port 8000`}
        />
        <SubSection title="Environment variables">
          <Table
            head={["Variable", "Required", "Default", "Notes"]}
            rows={[
              ["OPENAI_API_KEY", "yes", "—", "used for every LLM call (gpt-4o via langchain-openai); boot fails if unset"],
              ["TAVILY_API_KEY", "yes", "—", "web search; boot fails if unset (a failed search still degrades gracefully at request time, this is only the startup check)"],
              ["CORS_ORIGINS", "no", "http://localhost:8080", "comma-separated"],
              ["PORT", "no", "8000", ""],
            ]}
          />
        </SubSection>
        <Callout type="success" title="Health check">
          <P>
            Once running, <InlineCode>GET /health</InlineCode> returns{" "}
            <InlineCode>{`{"status":"ok"}`}</InlineCode>. See{" "}
            <a href="/docs/agent" className="text-primary underline underline-offset-2">
              Idea &amp; Research Agent
            </a>{" "}
            for the two real endpoints.
          </P>
        </Callout>
      </Section>

      <Section title="3. Run the frontend">
        <CodeBlock
          filename="terminal"
          language="bash"
          code={`cd hackpilot
npm install
npm run dev   # http://localhost:3000`}
        />
        <P>
          The auth screens (<InlineCode>/sign-in</InlineCode>,{" "}
          <InlineCode>/sign-up</InlineCode>,{" "}
          <InlineCode>/forgot-password</InlineCode>,{" "}
          <InlineCode>/reset-password</InlineCode>) currently render as
          standalone UI and don&apos;t call the backend yet — see{" "}
          <a
            href="/docs/frontend"
            className="text-primary underline underline-offset-2"
          >
            App Structure
          </a>{" "}
          for the wiring that&apos;s still needed.
        </P>
      </Section>

      <Section title="Smoke-testing the API">
        <P>
          With no frontend integration yet, the fastest way to exercise the
          auth flow is curl. Full request/response shapes are in the{" "}
          <a
            href="/docs/api-reference"
            className="text-primary underline underline-offset-2"
          >
            API Reference
          </a>
          .
        </P>
        <CodeBlock
          filename="terminal"
          language="bash"
          code={`curl -X POST localhost:8080/api/v1/auth/signup \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123"}'

# grab the OTP emailed to ada@example.com, then:
curl -X POST localhost:8080/api/v1/auth/verify-otp \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"ada@example.com","code":"123456"}'`}
        />
      </Section>

      <DocFooterNav
        prev={{ title: "Overview", href: "/docs" }}
        next={{ title: "Architecture", href: "/docs/architecture" }}
      />
    </article>
  );
}
