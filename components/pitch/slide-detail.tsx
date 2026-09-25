"use client";

import type { SlideOutline } from "@/lib/types";

export default function SlideDetail({ slide }: { slide: SlideOutline }) {
  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md">
      <div className="flex items-center gap-space-md">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary text-on-primary font-display text-headline-sm font-extrabold flex items-center justify-center shadow-[0_4px_16px_rgba(79,70,229,0.24)]">
          {slide.slide_number}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-headline-lg text-on-surface">{slide.title}</h2>
        </div>
        <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-display text-label-caps font-bold">
          {slide.time_allocation_seconds}s
        </span>
      </div>

      <p className="font-body text-body-lg text-on-surface">{slide.content}</p>

      <div>
        <h3 className="font-display text-label-caps uppercase text-on-surface-variant mb-space-xs">
          Talking Points
        </h3>
        <ol className="list-decimal list-inside flex flex-col gap-1 font-body text-body-md text-on-surface">
          {slide.talking_points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ol>
      </div>

      {slide.demo_moment && (
        <div className="bg-tertiary-container/30 border border-tertiary/30 rounded-2xl p-gutter flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-tertiary text-[20px]">play_circle</span>
            <span className="font-display text-label-caps uppercase text-on-surface-variant">
              Demo Moment
            </span>
          </div>
          <p className="font-body text-body-md text-on-surface">{slide.demo_moment}</p>
        </div>
      )}

      {slide.rubric_criteria_addressed.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {slide.rubric_criteria_addressed.map((c) => (
            <span
              key={c}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-display text-label-caps font-bold uppercase"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
