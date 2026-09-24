"use client";

import type { IdeaResult } from "@/lib/types";
import ScoreBar from "./score-bar";

export default function IdeaCard({
  idea,
  onShortlist,
  busy,
}: {
  idea: IdeaResult;
  onShortlist: (next: boolean) => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md">
      <h3 className="font-display text-headline-sm text-on-surface">{idea.title}</h3>
      <p className="font-body text-body-md text-on-surface-variant">{idea.description}</p>

      <div className="flex flex-wrap gap-space-xs">
        {idea.tech_stack.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-primary-fixed/60 text-primary font-display text-label-caps font-bold uppercase"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-space-sm">
        <ScoreBar label="Feasibility" value={idea.feasibility_score} colorVar="--color-primary" />
        <ScoreBar label="Impact" value={idea.impact_score} colorVar="--color-tertiary" />
        <ScoreBar label="Novelty" value={idea.novelty_score} colorVar="--color-secondary" />
        <ScoreBar label="Skill Fit" value={idea.skill_fit_score} colorVar="--color-primary-fixed-dim" />
      </div>

      <p className="font-body text-body-sm text-on-surface-variant italic">&quot;{idea.judging_angle}&quot;</p>

      <button
        type="button"
        disabled={busy}
        onClick={() => onShortlist(!idea.shortlisted)}
        className={
          idea.shortlisted
            ? "px-gutter py-2 rounded-xl bg-tertiary text-on-tertiary font-display text-label-md transition-colors disabled:opacity-60"
            : "px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors disabled:opacity-60"
        }
      >
        {idea.shortlisted ? "Shortlisted" : "Shortlist"}
      </button>
    </div>
  );
}
