"use client";

interface HistoryItem {
  id: string;
  created_at: string;
}

export default function HistorySidebar<T extends HistoryItem>({
  generations,
  selectedId,
  onSelect,
  getLabel,
}: {
  generations: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  getLabel: (item: T) => string;
}) {
  return (
    <div className="rounded-3xl p-space-sm bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] h-fit">
      <h2 className="font-display text-label-caps uppercase text-on-surface-variant px-space-sm py-space-xs">
        History
      </h2>

      {generations.length === 0 && (
        <p className="px-space-sm py-space-sm font-body text-body-sm text-on-surface-variant">
          No generations yet.
        </p>
      )}

      <ul className="space-y-1">
        {generations.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => onSelect(g.id)}
              className={`w-full text-left px-space-sm py-space-sm rounded-xl font-display text-label-md transition-colors ${
                g.id === selectedId
                  ? "bg-primary-fixed text-on-primary-fixed-variant"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <div className="truncate">{getLabel(g)}</div>
              <div className="text-label-caps uppercase opacity-70">
                {new Date(g.created_at).toLocaleDateString()}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
