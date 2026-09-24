"use client";

import type { ExistingSolution } from "@/lib/types";

export default function ExistingSolutionCard({ solution }: { solution: ExistingSolution }) {
  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-sm">
      <div className="flex items-start justify-between gap-space-sm">
        <h3 className="font-display text-headline-sm text-on-surface">{solution.name}</h3>
        <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-display text-label-caps font-bold uppercase">
          {solution.type}
        </span>
      </div>
      {solution.url && (
        <a
          href={solution.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline font-body text-body-sm break-all"
        >
          {solution.url}
        </a>
      )}
      <p className="font-body text-body-md text-on-surface-variant">{solution.summary}</p>
    </div>
  );
}
