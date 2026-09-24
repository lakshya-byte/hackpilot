import type { Metadata } from "next";
import DocsShell from "@/components/docs/docs-shell";

export const metadata: Metadata = {
  title: "Docs — HackPilot",
  description: "Architecture and reference documentation for the HackPilot platform.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
