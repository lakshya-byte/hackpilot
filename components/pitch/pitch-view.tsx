"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { GeneratePitchInput, IdeaHistory, PitchResultSet, ResearchHistory } from "@/lib/types";
import HistorySidebar from "@/components/ideas/history-sidebar";
import PitchForm from "./pitch-form";
import PitchLoader from "./pitch-loader";
import SlideNavigator from "./slide-navigator";
import SlideDetail from "./slide-detail";
import RubricCoveragePanel from "./rubric-coverage-panel";
import PitchStatsPanel from "./pitch-stats-panel";

export default function PitchView({ hasTeam, teamId }: { hasTeam: boolean; teamId: string | null }) {
  const [history, setHistory] = useState<PitchResultSet[]>([]);
  const [historyLoading, setHistoryLoading] = useState(hasTeam && !!teamId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSlideNumber, setActiveSlideNumber] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [formError, setFormError] = useState("");

  const [prefillReady, setPrefillReady] = useState(!hasTeam);
  const [prefillTitle, setPrefillTitle] = useState("");
  const [prefillDescription, setPrefillDescription] = useState("");
  const [researchNote, setResearchNote] = useState("");
  const [marketGap, setMarketGap] = useState("");
  const [differentiationOneLiner, setDifferentiationOneLiner] = useState("");

  const selected = useMemo(
    () => history.find((p) => p.id === selectedId) ?? null,
    [history, selectedId]
  );
  const activeSlide = useMemo(
    () => selected?.pitch_outline.find((s) => s.slide_number === activeSlideNumber) ?? null,
    [selected, activeSlideNumber]
  );

  useEffect(() => {
    if (!hasTeam || !teamId) {
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/pitch/${teamId}`);
        const data = await res.json();
        if (res.ok) {
          setHistory((data.pitches ?? []) as PitchResultSet[]);
        }
      } catch {
        // history is best-effort — a failed fetch just leaves the sidebar empty
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, [hasTeam, teamId]);

  useEffect(() => {
    if (!hasTeam) {
      return;
    }
    (async () => {
      let foundTitle = "";
      let foundDescription = "";
      try {
        const res = await fetch("/api/ideas/history");
        const data = (await res.json()) as IdeaHistory;
        if (res.ok) {
          outer: for (const generation of data.generations ?? []) {
            for (const idea of generation.ideas) {
              if (idea.shortlisted) {
                foundTitle = idea.title;
                foundDescription = idea.description;
                break outer;
              }
            }
          }
        }
      } catch {
        // auto-populate is best-effort — the form just starts empty
      }

      setPrefillTitle(foundTitle);
      setPrefillDescription(foundDescription);

      if (foundTitle) {
        try {
          const res = await fetch("/api/research/history");
          const data = (await res.json()) as ResearchHistory;
          if (res.ok) {
            const match = (data.researches ?? []).find((r) => r.idea_title === foundTitle);
            if (match) {
              setMarketGap(match.market_gap);
              setDifferentiationOneLiner(match.differentiation_one_liner);
              setResearchNote(`Using research: ${match.differentiation_one_liner}`);
            }
          }
        } catch {
          // research context is best-effort too
        }
      }

      setPrefillReady(true);
    })();
  }, [hasTeam]);

  async function handleGenerate(input: GeneratePitchInput) {
    setGenerating(true);
    setFormError("");
    try {
      const res = await fetch("/api/pitch/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, market_gap: marketGap, differentiation_one_liner: differentiationOneLiner }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Couldn't generate the pitch.");
        return;
      }
      const generated = data as PitchResultSet;
      setHistory((prev) => [generated, ...prev]);
      setSelectedId(generated.id);
      setActiveSlideNumber(1);
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
          The Pitch Builder tailors a deck to your team&apos;s idea, so you&apos;ll need an active team
          before generating one.
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
        onSelect={(id) => {
          setSelectedId(id);
          setActiveSlideNumber(1);
        }}
        getLabel={(p) => p.idea_title}
      />

      <div>
        {generating && <PitchLoader />}

        {!generating && !selected && !prefillReady && (
          <p className="font-body text-body-sm text-on-surface-variant">Loading...</p>
        )}

        {!generating && !selected && prefillReady && (
          <PitchForm
            initialIdeaTitle={prefillTitle}
            initialIdeaDescription={prefillDescription}
            researchNote={researchNote}
            onSubmit={handleGenerate}
            submitting={generating}
            error={formError}
          />
        )}

        {!generating && selected && activeSlide && (
          <div>
            <div className="flex items-center justify-between mb-gutter">
              <div>
                <h2 className="font-display text-headline-sm text-on-surface">{selected.idea_title}</h2>
                <p className="font-body text-body-sm text-on-surface-variant">{selected.hackathon_type}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors"
              >
                New Pitch
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-gutter items-start">
              <SlideNavigator
                slides={selected.pitch_outline}
                activeSlideNumber={activeSlideNumber}
                onSelect={setActiveSlideNumber}
              />
              <SlideDetail slide={activeSlide} />
              <div className="flex flex-col gap-gutter">
                <RubricCoveragePanel coverage={selected.rubric_coverage} />
                <PitchStatsPanel pitch={selected} />
              </div>
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
