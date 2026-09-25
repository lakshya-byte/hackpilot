"use client";

import type { ChecklistPhase } from "@/lib/types";
import PhaseProgressBar from "./phase-progress-bar";
import ChecklistItemRow from "./checklist-item-row";

export default function PhaseSection({
  phase,
  onToggleItem,
}: {
  phase: ChecklistPhase;
  onToggleItem: (itemId: string, checked: boolean) => void;
}) {
  const checkedCount = phase.items.filter((i) => i.checked).length;

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] mb-gutter">
      <div className="flex items-center justify-between mb-space-md">
        <h2 className="font-display text-headline-sm text-on-surface">{phase.label}</h2>
        <span className="font-display text-label-md text-on-surface-variant">
          {checkedCount}/{phase.items.length}
        </span>
      </div>

      <div className="mb-space-md">
        <PhaseProgressBar label="Phase progress" value={phase.progress} />
      </div>

      <div className="flex flex-col gap-1">
        {phase.items.map((item) => (
          <ChecklistItemRow
            key={item.item_id}
            item={item}
            onToggle={(checked) => onToggleItem(item.item_id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
