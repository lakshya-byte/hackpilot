"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-badge]", { opacity: 0, y: 16, duration: 0.5 })
        .from(
          "[data-hero-headline]",
          { opacity: 0, y: 24, duration: 0.7 },
          "-=0.25",
        )
        .from(
          "[data-hero-subhead]",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.4",
        )
        .from(
          "[data-hero-form]",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.4",
        )
        .from(
          "[data-hero-trust]",
          { opacity: 0, y: 12, duration: 0.5 },
          "-=0.35",
        )
        .from(
          "[data-hero-card]",
          { opacity: 0, scale: 0.96, y: 24, duration: 0.8 },
          "-=0.6",
        )
        .from(
          "[data-hero-orbit]",
          { opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.08 },
          "-=0.4",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const xTo = gsap.quickTo(card, "rotationY", {
      duration: 0.6,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(card, "rotationX", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(relX * 8);
      yTo(relY * -8);
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden pt-space-xl pb-space-xl md:pb-24 bg-surface-container-lowest"
    >
      <div
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#4f46e5 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="max-w-7xl mx-auto px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Left Column: Value Prop & Conversion */}
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-space-md">
            <div
              data-hero-badge
              className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-variant text-on-primary-fixed-variant shadow-sm mb-space-lg"
            >
              <span
                className="material-symbols-outlined text-[16px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span className="font-display text-label-caps uppercase tracking-wider font-bold">
                The complete hackathon OS
              </span>
            </div>

            <h1
              data-hero-headline
              className="font-display text-display-hero text-on-surface tracking-tight leading-none mb-space-md"
            >
              Your hackathon strategy,{" "}
              <span className="text-primary-container">sorted.</span>
            </h1>

            <p
              data-hero-subhead
              className="font-body text-body-lg text-on-surface-variant max-w-xl mb-space-xl"
            >
              From idea validation to pitch day — the unified execution
              system 2× Smart India Hackathon national winners use to
              repeatedly finish on the podium.
            </p>

            <form
              data-hero-form
              className="w-full max-w-lg mb-space-sm"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-surface-container-lowest rounded-2xl sm:rounded-full p-1.5 pl-5 shadow-[0_4px_24px_rgba(79,70,229,0.08)] transition-all focus-within:shadow-[0_4px_28px_rgba(79,70,229,0.16)]">
                <input
                  className="w-full bg-transparent font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none py-2.5 sm:py-0"
                  placeholder="Enter college or team email..."
                  required
                  type="email"
                />
                <button
                  className="mt-2 sm:mt-0 flex items-center justify-center gap-space-xs px-gutter py-3 rounded-full bg-secondary text-on-secondary font-display text-label-lg hover:bg-secondary-fixed-variant transition-all shrink-0 shadow-[0_2px_8px_rgba(0,108,73,0.25)] hover:scale-[1.02]"
                  type="submit"
                >
                  <span>Get Early Access</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
              {submitted && (
                <div className="mt-space-sm text-secondary font-display text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  Invite locked! Check your inbox for the championship
                  starter deck.
                </div>
              )}
            </form>

            <div
              data-hero-trust
              className="flex items-center gap-space-xs text-on-surface-variant font-display text-label-md pt-space-xs"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">
                verified
              </span>
              <span>
                Free to start. No credit card required. Official SIH 2025
                ready.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Cockpit Mockup + Orbiting Badges */}
          <div className="lg:col-span-6 relative mt-space-xl lg:mt-0">
            <div className="absolute -top-12 -left-8 w-72 h-72 rounded-full bg-primary-fixed blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-10 -right-8 w-60 h-60 rounded-full bg-secondary-fixed blur-2xl opacity-40 pointer-events-none" />

            <div
              data-hero-orbit
              className="absolute -top-5 left-4 z-20 bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-[0_6px_20px_rgba(19,27,46,0.06)] flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-display text-label-caps font-bold text-on-surface">
                SIH Grand Finale
              </span>
            </div>
            <div
              data-hero-orbit
              className="absolute top-12 -right-4 z-20 bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-[0_6px_20px_rgba(19,27,46,0.06)] flex items-center gap-2"
            >
              <div className="w-4 h-4 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">
                D
              </div>
              <span className="font-display text-label-caps font-bold text-on-surface">
                Devfolio Verified
              </span>
            </div>
            <div
              data-hero-orbit
              className="absolute -bottom-4 left-8 z-20 bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-[0_6px_20px_rgba(19,27,46,0.06)] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">
                terminal
              </span>
              <span className="font-display text-label-caps font-bold text-on-surface">
                Unstop • Top 1%
              </span>
            </div>
            <div
              data-hero-orbit
              className="absolute -bottom-6 right-8 z-20 bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-[0_6px_20px_rgba(19,27,46,0.06)] flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-error" />
              <span className="font-display text-label-caps font-bold text-on-surface">
                MLH Track Certified
              </span>
            </div>

            {/* Main App Window Frame */}
            <div
              ref={cardRef}
              data-hero-card
              className="relative bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_16px_48px_rgba(19,27,46,0.08)]"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="ml-space-sm font-display text-label-md text-on-surface-variant font-medium">
                    Idea Engine • Matrix Workspace v2.4
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-display text-label-caps">
                    LIVE VALIDATION
                  </span>
                </div>
              </div>

              <div className="pt-space-md space-y-space-md">
                <div className="flex flex-wrap items-center justify-between gap-space-sm p-space-md rounded-2xl bg-surface-container-low">
                  <div>
                    <div className="font-display text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
                      Problem Statement
                    </div>
                    <div className="font-display text-headline-sm text-on-surface font-bold">
                      PS-742: Autonomous Rail Defect Radar
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-label-caps text-secondary font-bold">
                      UNIQUENESS SCORE
                    </div>
                    <div className="font-display text-headline-md font-extrabold text-on-surface flex items-baseline justify-end gap-0.5">
                      <span className="text-primary">94</span>
                      <span className="text-on-surface-variant font-body text-body-sm">
                        /100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-space-sm text-center">
                  <div className="p-space-sm rounded-xl bg-surface-bright">
                    <span className="font-display text-label-caps text-on-surface-variant block">
                      Feasibility
                    </span>
                    <span className="font-display text-label-lg text-secondary font-bold">
                      Very High
                    </span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-surface-bright">
                    <span className="font-display text-label-caps text-on-surface-variant block">
                      Target Jury
                    </span>
                    <span className="font-display text-label-lg text-on-surface font-bold">
                      Govt / PSU
                    </span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-surface-bright">
                    <span className="font-display text-label-caps text-on-surface-variant block">
                      36-Hr Risk
                    </span>
                    <span className="font-display text-label-lg text-primary font-bold">
                      Controlled
                    </span>
                  </div>
                </div>

                <div className="p-space-md rounded-2xl bg-primary-fixed/40 space-y-space-xs">
                  <div className="flex items-center gap-space-xs text-primary font-display text-label-lg font-bold">
                    <span className="material-symbols-outlined text-[18px]">
                      psychology
                    </span>
                    <span>Jury Strategy Angle Identified</span>
                  </div>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    Pivot from raw IoT sensors to edge computer vision with
                    offline fallback. Past Ministry of Railways evaluators
                    penalize remote cloud latency in subterranean tracks.
                  </p>
                  <div className="pt-space-xs flex items-center gap-space-sm">
                    <span className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-primary font-display text-label-caps font-bold shadow-sm">
                      Angle 02: Edge Pipeline Selected
                    </span>
                    <span className="font-display text-label-caps text-secondary font-semibold">
                      +18 pts Rubric Alignment
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-space-xs">
                  <div className="flex justify-between font-display text-label-md text-on-surface-variant">
                    <span>Pre-Hack Submission Readiness</span>
                    <span className="font-bold text-on-surface">
                      88% (Ready for Round 1 Review)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full"
                      style={{ width: "88%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
