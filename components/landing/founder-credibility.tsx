"use client";

import { useScrollReveal } from "./use-scroll-reveal";

const badges = [
  {
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    icon: "emoji_events",
    filled: true,
    title: "2× SIH National Winner",
    body: "Smart India Hackathon Grand Finale 1st Prize Champions",
  },
  {
    iconBg: "bg-secondary-fixed/40",
    iconText: "text-secondary",
    icon: "code_blocks",
    title: "GSoC Selected Alumni",
    body: "Google Summer of Code Alumni, Mentors & Open Source Contributors",
  },
  {
    iconBg: "bg-primary-fixed",
    iconText: "text-primary",
    icon: "military_tech",
    title: "ICPC Regional Finalists",
    body: "Amritapuri & Kanpur On-Site Collegiate Finalists",
  },
];

export default function FounderCredibility() {
  const rootRef = useScrollReveal<HTMLDivElement>("[data-proof-badge]");

  return (
    <section className="w-full bg-[#EEF2FF] py-20">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-7 pr-0 lg:pr-space-lg">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-[24px]">
                format_quote
              </span>
            </div>
            <blockquote className="font-display text-headline-md md:text-headline-lg text-on-surface font-bold leading-snug mb-space-md">
              &ldquo;Most hackathon teams don&apos;t lose on code — they lose
              because they pick the wrong problem angle, build without
              validation, and fail to speak the jury&apos;s language in the
              final 3 minutes.&rdquo;
            </blockquote>
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
                HP
              </div>
              <div>
                <div className="font-display text-label-lg font-bold text-on-surface">
                  Built by Competitive Hackers
                </div>
                <div className="font-body text-body-sm text-on-surface-variant">
                  Who have repeatedly hoisted trophies across India
                </div>
              </div>
            </div>
          </div>

          <div ref={rootRef} className="lg:col-span-5 flex flex-col gap-space-md">
            {badges.map((badge) => (
              <div
                key={badge.title}
                data-proof-badge
                className="p-space-md rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(79,70,229,0.06)] flex items-center gap-space-md"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${badge.iconBg} ${badge.iconText} flex items-center justify-center shrink-0`}
                >
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={
                      badge.filled
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    {badge.icon}
                  </span>
                </div>
                <div>
                  <div className="font-display text-headline-sm font-bold text-on-surface">
                    {badge.title}
                  </div>
                  <div className="font-body text-body-sm text-on-surface-variant">
                    {badge.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
