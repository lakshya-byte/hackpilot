"use client";

import type { RubricCriterion } from "@/lib/types";

const inputClass =
  "w-full bg-surface-container-low text-on-surface font-body text-body-sm rounded-xl px-space-md py-2 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all";
const label = "font-display text-label-caps uppercase text-on-surface-variant";

export default function RubricCriteriaEditor({
  criteria,
  onChange,
}: {
  criteria: RubricCriterion[];
  onChange: (criteria: RubricCriterion[]) => void;
}) {
  function updateAt(index: number, patch: Partial<RubricCriterion>) {
    onChange(criteria.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
      {criteria.map((c, i) => (
        <div
          key={i}
          className="rounded-2xl p-space-md bg-surface-container-low flex flex-col gap-space-xs"
        >
          <div className="flex items-center gap-space-xs">
            <div className="flex-1 flex flex-col gap-1">
              <span className={label}>Criterion</span>
              <input
                type="text"
                className={inputClass}
                value={c.criterion}
                onChange={(e) => updateAt(i, { criterion: e.target.value })}
              />
            </div>
            <div className="w-20 flex flex-col gap-1">
              <span className={label}>Weight %</span>
              <input
                type="number"
                min={0}
                max={100}
                className={inputClass}
                value={c.weight}
                onChange={(e) => updateAt(i, { weight: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className={label}>Description</span>
            <textarea
              className={`${inputClass} min-h-[56px] resize-none`}
              value={c.description}
              onChange={(e) => updateAt(i, { description: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
