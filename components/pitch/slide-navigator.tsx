"use client";

import type { SlideOutline } from "@/lib/types";

export default function SlideNavigator({
  slides,
  activeSlideNumber,
  onSelect,
}: {
  slides: SlideOutline[];
  activeSlideNumber: number;
  onSelect: (slideNumber: number) => void;
}) {
  return (
    <div className="rounded-3xl p-space-sm bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] h-fit">
      <h2 className="font-display text-label-caps uppercase text-on-surface-variant px-space-sm py-space-xs">
        Slides
      </h2>
      <ul className="space-y-1">
        {slides.map((s) => (
          <li key={s.slide_number}>
            <button
              type="button"
              onClick={() => onSelect(s.slide_number)}
              className={`w-full text-left px-space-sm py-space-sm rounded-xl font-display text-label-md transition-colors ${
                s.slide_number === activeSlideNumber
                  ? "bg-primary-fixed text-on-primary-fixed-variant"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="opacity-70 mr-1">{s.slide_number}.</span>
              {s.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
