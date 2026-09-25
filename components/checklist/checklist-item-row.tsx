"use client";

import type { ChecklistItem } from "@/lib/types";

export default function ChecklistItemRow({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-space-sm p-space-sm rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-5 w-5 rounded-md border-2 border-outline-variant accent-primary cursor-pointer"
      />
      <span
        className={`font-body text-body-md ${
          item.checked ? "line-through text-on-surface-variant" : "text-on-surface"
        }`}
      >
        {item.text}
      </span>
    </label>
  );
}
