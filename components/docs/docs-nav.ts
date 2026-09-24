export type DocNavItem = {
  title: string;
  href: string;
  icon: string;
  description: string;
};

export type DocNavGroup = {
  label: string;
  items: DocNavItem[];
};

export const docsNav: DocNavGroup[] = [
  {
    label: "Introduction",
    items: [
      {
        title: "Overview",
        href: "/docs",
        icon: "dashboard",
        description: "What HackPilot is and how the repos fit together",
      },
      {
        title: "Getting Started",
        href: "/docs/getting-started",
        icon: "rocket_launch",
        description: "Run the frontend and backend locally",
      },
    ],
  },
  {
    label: "System Design",
    items: [
      {
        title: "Architecture",
        href: "/docs/architecture",
        icon: "account_tree",
        description: "How the frontend, backend, and database interact",
      },
    ],
  },
  {
    label: "Backend",
    items: [
      {
        title: "Auth System",
        href: "/docs/backend/auth",
        icon: "verified_user",
        description: "Signup, login, OTP verification, JWT & refresh tokens",
      },
      {
        title: "Teams",
        href: "/docs/backend/teams",
        icon: "groups",
        description: "One team per hacker, invites, leadership transfer",
      },
      {
        title: "Idea Engine",
        href: "/docs/backend/idea-engine",
        icon: "lightbulb",
        description: "Calls the AI agent, scores and saves 5 ideas per team",
      },
      {
        title: "Research Engine",
        href: "/docs/backend/research-engine",
        icon: "travel_explore",
        description: "Calls the AI agent, saves a market research brief per team",
      },
      {
        title: "API Reference",
        href: "/docs/api-reference",
        icon: "api",
        description: "Every route, request body, and response shape",
      },
    ],
  },
  {
    label: "AI Agent Service",
    items: [
      {
        title: "Idea & Research Agent",
        href: "/docs/agent",
        icon: "smart_toy",
        description: "The Python/FastAPI/LangGraph service behind both engines",
      },
    ],
  },
  {
    label: "Frontend",
    items: [
      {
        title: "App Structure",
        href: "/docs/frontend",
        icon: "web",
        description: "Next.js routes, components, and the design system",
      },
    ],
  },
];

export const docsNavFlat: DocNavItem[] = docsNav.flatMap((group) => group.items);
