"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ResearchIdeaInput, ResearchResultSet } from "@/lib/types";
import HistorySidebar from "@/components/ideas/history-sidebar";
import ResearchForm from "./research-form";
import ResearchBrief from "./research-brief";
import ResearchLoader from "./research-loader";

export default function ResearchEngineView({ hasTeam }: { hasTeam: boolean }) {
  const [history, setHistory] = useState<ResearchResultSet[]>([]);
  const [historyLoading, setHistoryLoading] = useState(hasTeam);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [formError, setFormError] = useState("");

  const selected = useMemo(
    () => history.find((r) => r.id === selectedId) ?? null,
    [history, selectedId]
  );

  useEffect(() => {
    if (!hasTeam) {
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/research/history");
        const data = await res.json();
        if (res.ok) {
          setHistory(data.researches ?? []);
        }
      } catch {
        // history is best-effort — a failed fetch just leaves the sidebar empty
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, [hasTeam]);

  async function handleGenerate(input: ResearchIdeaInput) {
    setGenerating(true);
    setFormError("");
    try {
      const res = await fetch("/api/research/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Couldn't research this idea.");
        return;
      }
      const generated = data as ResearchResultSet;
      setHistory((prev) => [generated, ...prev]);
      setSelectedId(generated.id);
    } catch {
      setFormError("Couldn't reach the server. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  if (!hasTeam) {
    return (
      <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] max-w-xl">
        <h2 className="font-display text-headline-sm text-on-surface mb-space-xs">
          Join or create a team first
        </h2>
        <p className="font-body text-body-md text-on-surface-variant mb-space-md">
          The Research Engine tailors its brief to your team&apos;s skills, so you&apos;ll need an active team
          before researching an idea.
        </p>
        <Link
          href="/teams"
          className="inline-flex px-gutter py-2.5 bg-primary text-on-primary font-display text-label-lg rounded-xl hover:bg-surface-tint transition-all"
        >
          Go to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-gutter">
      <HistorySidebar
        generations={history}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        getLabel={(r) => r.idea_title}
      />

      <div>
        {generating && <ResearchLoader />}

        {!generating && !selected && (
          <ResearchForm onSubmit={handleGenerate} submitting={generating} error={formError} />
        )}

        {!generating && selected && (
          <div>
            <div className="flex items-center justify-between mb-gutter">
              <div>
                <h2 className="font-display text-headline-sm text-on-surface">{selected.idea_title}</h2>
                <p className="font-body text-body-sm text-on-surface-variant">{selected.idea_description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors shrink-0"
              >
                New Generation
              </button>
            </div>

            <ResearchBrief result={selected} />
          </div>
        )}

        {historyLoading && !generating && !selected && (
          <p className="mt-space-sm font-body text-body-sm text-on-surface-variant">Loading history…</p>
        )}
      </div>
    </div>
  );
}
