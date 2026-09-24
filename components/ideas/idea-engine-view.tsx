"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { GenerateIdeasInput, GeneratedIdeaSet } from "@/lib/types";
import HistorySidebar from "./history-sidebar";
import IdeaForm from "./idea-form";
import IdeaCard from "./idea-card";
import IdeaLoader from "./idea-loader";

export default function IdeaEngineView({ hasTeam }: { hasTeam: boolean }) {
  const [history, setHistory] = useState<GeneratedIdeaSet[]>([]);
  const [historyLoading, setHistoryLoading] = useState(hasTeam);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [formError, setFormError] = useState("");
  const [shortlistError, setShortlistError] = useState("");
  const [shortlistBusyKey, setShortlistBusyKey] = useState<string | null>(null);

  const selected = useMemo(
    () => history.find((g) => g.id === selectedId) ?? null,
    [history, selectedId]
  );

  useEffect(() => {
    if (!hasTeam) {
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/ideas/history");
        const data = await res.json();
        if (res.ok) {
          setHistory(data.generations ?? []);
        }
      } catch {
        // history is best-effort — a failed fetch just leaves the sidebar empty
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, [hasTeam]);

  async function handleGenerate(input: GenerateIdeasInput) {
    setGenerating(true);
    setFormError("");
    try {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Couldn't generate ideas.");
        return;
      }
      const generated = data as GeneratedIdeaSet;
      setHistory((prev) => [generated, ...prev]);
      setSelectedId(generated.id);
    } catch {
      setFormError("Couldn't reach the server. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleShortlist(generationId: string, ideaIndex: number, next: boolean) {
    const key = `${generationId}:${ideaIndex}`;
    setShortlistBusyKey(key);
    setShortlistError("");

    setHistory((prev) =>
      prev.map((g) =>
        g.id !== generationId
          ? g
          : { ...g, ideas: g.ideas.map((idea, i) => (i === ideaIndex ? { ...idea, shortlisted: next } : idea)) }
      )
    );

    try {
      const res = await fetch(`/api/ideas/${generationId}/shortlist/${ideaIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortlisted: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setShortlistError(data.error ?? "Couldn't update the shortlist.");
        setHistory((prev) =>
          prev.map((g) =>
            g.id !== generationId
              ? g
              : {
                  ...g,
                  ideas: g.ideas.map((idea, i) => (i === ideaIndex ? { ...idea, shortlisted: !next } : idea)),
                }
          )
        );
      }
    } catch {
      setShortlistError("Couldn't reach the server. Please try again.");
      setHistory((prev) =>
        prev.map((g) =>
          g.id !== generationId
            ? g
            : {
                ...g,
                ideas: g.ideas.map((idea, i) => (i === ideaIndex ? { ...idea, shortlisted: !next } : idea)),
              }
        )
      );
    } finally {
      setShortlistBusyKey(null);
    }
  }

  if (!hasTeam) {
    return (
      <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] max-w-xl">
        <h2 className="font-display text-headline-sm text-on-surface mb-space-xs">
          Join or create a team first
        </h2>
        <p className="font-body text-body-md text-on-surface-variant mb-space-md">
          The Idea Engine tailors ideas to your team&apos;s skills, so you&apos;ll need an active team before
          generating ideas.
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
        getLabel={(g) => g.hackathon_type}
      />

      <div>
        {generating && <IdeaLoader />}

        {!generating && !selected && (
          <IdeaForm onSubmit={handleGenerate} submitting={generating} error={formError} />
        )}

        {!generating && selected && (
          <div>
            <div className="flex items-center justify-between mb-gutter">
              <div>
                <h2 className="font-display text-headline-sm text-on-surface">{selected.hackathon_type}</h2>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {selected.duration} · {selected.target_audience}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors"
              >
                New Generation
              </button>
            </div>

            {shortlistError && (
              <p className="mb-space-md text-error font-body text-body-sm">{shortlistError}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {selected.ideas.map((idea, i) => (
                <IdeaCard
                  key={i}
                  idea={idea}
                  busy={shortlistBusyKey === `${selected.id}:${i}`}
                  onShortlist={(next) => handleShortlist(selected.id, i, next)}
                />
              ))}
            </div>
          </div>
        )}

        {historyLoading && !generating && !selected && (
          <p className="mt-space-sm font-body text-body-sm text-on-surface-variant">Loading history…</p>
        )}
      </div>
    </div>
  );
}
