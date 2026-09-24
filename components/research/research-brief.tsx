"use client";

import type { ResearchResultSet } from "@/lib/types";
import ExistingSolutionCard from "./existing-solution-card";
import ViabilityScoreBadge from "./viability-score-badge";

export default function ResearchBrief({ result }: { result: ResearchResultSet }) {
  return (
    <div className="flex flex-col gap-gutter">
      <section>
        <h3 className="font-display text-label-caps uppercase text-on-surface-variant mb-space-sm">
          Existing Solutions
        </h3>
        {result.existing_solutions.length === 0 ? (
          <p className="font-body text-body-sm text-on-surface-variant">No existing solutions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {result.existing_solutions.map((s, i) => (
              <ExistingSolutionCard key={i} solution={s} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display text-label-caps uppercase text-on-surface-variant mb-space-sm">
          Failed Attempts
        </h3>
        {result.failed_attempts.length === 0 ? (
          <p className="font-body text-body-sm text-on-surface-variant">No failed attempts found.</p>
        ) : (
          <div className="flex flex-col gap-space-xs">
            {result.failed_attempts.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-space-sm p-space-sm rounded-xl bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-error text-[20px] mt-0.5">block</span>
                <div>
                  <span className="font-display text-label-md text-on-surface font-semibold">{a.name}</span>
                  <p className="font-body text-body-sm text-on-surface-variant">{a.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display text-label-caps uppercase text-on-surface-variant mb-space-sm">
          Market Gap
        </h3>
        <div className="rounded-3xl p-gutter bg-primary-fixed/30 border border-primary/20">
          <p className="font-body text-body-lg text-on-surface">{result.market_gap}</p>
        </div>
      </section>

      <section>
        <h3 className="font-display text-label-caps uppercase text-on-surface-variant mb-space-sm">
          Market Angle
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
          <div className="flex flex-col gap-1 px-gutter py-space-sm rounded-2xl bg-surface-container-low">
            <span className="font-display text-label-caps uppercase text-on-surface-variant">
              Target Segment
            </span>
            <span className="font-display text-headline-sm text-on-surface">
              {result.market_angle.target_segment}
            </span>
          </div>
          <div className="flex flex-col gap-1 px-gutter py-space-sm rounded-2xl bg-surface-container-low">
            <span className="font-display text-label-caps uppercase text-on-surface-variant">
              Problem Scale
            </span>
            <span className="font-display text-headline-sm text-on-surface">
              {result.market_angle.problem_scale}
            </span>
          </div>
          <div className="flex flex-col gap-1 px-gutter py-space-sm rounded-2xl bg-surface-container-low">
            <span className="font-display text-label-caps uppercase text-on-surface-variant">Urgency</span>
            <span className="font-display text-headline-sm text-on-surface">{result.market_angle.urgency}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr] gap-gutter items-stretch">
        <div className="bg-surface-container-lowest/90 rounded-2xl p-gutter shadow-lg border-t-4 border-primary flex items-center">
          <p className="font-display text-headline-sm md:text-headline-lg font-extrabold leading-snug text-on-surface">
            &ldquo;{result.differentiation_one_liner}&rdquo;
          </p>
        </div>

        <div className="bg-tertiary-container/30 border border-tertiary/30 rounded-2xl p-gutter flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-tertiary text-[20px]">gavel</span>
            <span className="font-display text-label-caps uppercase text-on-surface-variant">
              Judge Positioning
            </span>
          </div>
          <p className="font-body text-body-md text-on-surface">{result.judge_positioning}</p>
        </div>

        <ViabilityScoreBadge score={result.overall_viability_score} />
      </div>
    </div>
  );
}
