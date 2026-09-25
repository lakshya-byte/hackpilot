"use client";

import type { RubricCoverage } from "@/lib/types";
import CoverageStrengthPill from "./coverage-strength-pill";

export default function RubricCoveragePanel({ coverage }: { coverage: RubricCoverage[] }) {
  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md">
      <h2 className="font-display text-label-caps uppercase text-on-surface-variant">Rubric Coverage</h2>
      <div className="flex flex-col gap-space-sm">
        {coverage.map((c) => (
          <div key={c.criterion} className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display text-label-md text-on-surface font-semibold">
                {c.criterion}
              </span>
              <span className="font-display text-label-md text-on-surface">{c.weight}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${c.weight}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-body text-body-sm text-on-surface-variant">
                {c.addressed_in_slides.length === 0
                  ? "Not addressed"
                  : `Slides ${c.addressed_in_slides.join(", ")}`}
              </span>
              <CoverageStrengthPill strength={c.coverage_strength} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
