"use client";

import { useScrollReveal } from "./use-scroll-reveal";

export default function Pricing() {
  const tiersRef = useScrollReveal<HTMLDivElement>("[data-pricing-card]");

  return (
    <section id="pricing" className="w-full bg-surface-container-lowest py-24">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1 px-space-md py-1 rounded-full bg-surface-container text-on-surface font-display text-label-caps uppercase font-bold mb-space-sm">
            Transparent Pricing
          </div>
          <h2 className="font-display text-headline-lg text-on-surface font-extrabold tracking-tight mb-space-sm">
            Student-friendly pricing. Invest once, build your career.
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant">
            Choose the blueprint that fits your squad&apos;s upcoming
            competition calendar.
          </p>
        </div>

        <div
          ref={tiersRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch"
        >
          {/* Tier 1: Starter */}
          <div
            data-pricing-card
            className="flex flex-col justify-between p-space-lg rounded-3xl bg-surface-bright shadow-sm hover:shadow-md transition-all"
          >
            <div>
              <div className="font-display text-label-caps uppercase tracking-wider text-on-surface-variant font-bold mb-space-xs">
                Starter
              </div>
              <div className="flex items-baseline gap-1 mb-space-sm">
                <span className="font-display text-display-hero font-extrabold text-on-surface">
                  ₹0
                </span>
                <span className="font-body text-body-md text-on-surface-variant">
                  / forever free
                </span>
              </div>
              <p className="font-body text-body-sm text-on-surface-variant mb-space-lg">
                Ideal for individual first-time hackathon attendees getting
                their bearings.
              </p>
              <div className="space-y-space-sm border-t border-surface-container pt-space-md">
                {[
                  "2 Problem Statement evaluations / mo",
                  "Basic Novelty & Duplicate Check",
                  "Standard 3-minute pitch slide outline",
                  "Community Discord access",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-space-xs font-body text-body-sm text-on-surface"
                  >
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      check
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-xl">
              <button className="w-full py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-display text-label-lg font-bold transition-all">
                Start for free
              </button>
            </div>
          </div>

          {/* Tier 2: Pro Hacker */}
          <div
            data-pricing-card
            className="relative flex flex-col justify-between p-space-lg rounded-3xl bg-primary-container text-on-primary shadow-[0_16px_40px_rgba(79,70,229,0.2)] transform lg:-translate-y-2"
          >
            <div className="absolute -top-3.5 right-6 px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-display text-label-caps uppercase font-extrabold shadow-sm">
              Most Popular
            </div>
            <div>
              <div className="font-display text-label-caps uppercase tracking-wider text-primary-fixed-dim font-bold mb-space-xs">
                Pro Hacker
              </div>
              <div className="flex items-baseline gap-1 mb-space-sm">
                <span className="font-display text-display-hero font-extrabold text-on-primary">
                  ₹499
                </span>
                <span className="font-body text-body-md text-on-primary-container">
                  / per hackathon
                </span>
              </div>
              <p className="font-body text-body-sm text-on-primary-container mb-space-lg">
                The championship toolkit used to dominate Smart India
                Hackathon &amp; Devfolio sprints.
              </p>
              <div className="space-y-space-sm border-t border-primary/40 pt-space-md">
                {[
                  "Unlimited AI Problem Statement Analyses",
                  "Full 36-hour hour-by-hour Win Framework",
                  "Past winning presentations vault (50+ decks)",
                  "Real-time Jury Q&A Defense Simulator",
                  "Priority Mentor Slack channel access",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-space-xs font-body text-body-sm text-on-primary"
                  >
                    <span className="material-symbols-outlined text-secondary-container text-[18px]">
                      check_circle
                    </span>
                    <span className={index === 0 ? "font-bold" : undefined}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-xl">
              <button className="w-full py-3.5 rounded-xl bg-surface-container-lowest text-primary-container hover:bg-surface-bright font-display text-label-lg font-bold transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                Get Pro Access
              </button>
            </div>
          </div>

          {/* Tier 3: Full Squad */}
          <div
            data-pricing-card
            className="flex flex-col justify-between p-space-lg rounded-3xl bg-surface-bright shadow-sm hover:shadow-md transition-all"
          >
            <div>
              <div className="font-display text-label-caps uppercase tracking-wider text-on-surface-variant font-bold mb-space-xs">
                Full Squad
              </div>
              <div className="flex items-baseline gap-1 mb-space-sm">
                <span className="font-display text-display-hero font-extrabold text-on-surface">
                  ₹999
                </span>
                <span className="font-body text-body-md text-on-surface-variant">
                  / 6 members squad
                </span>
              </div>
              <p className="font-body text-body-sm text-on-surface-variant mb-space-lg">
                Complete synchronized collaboration suite for your entire
                team.
              </p>
              <div className="space-y-space-sm border-t border-surface-container pt-space-md">
                {[
                  "Everything in Pro Hacker for all 6 seats",
                  "Shared team workspace & git role allocator",
                  "Pitch rehearsal recording & rubric scoring",
                  "1-on-1 strategy call with a previous SIH winner",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-space-xs font-body text-body-sm text-on-surface"
                  >
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      check
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-xl">
              <button className="w-full py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-display text-label-lg font-bold transition-all">
                Equip Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
