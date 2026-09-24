"use client";

import { useScrollReveal } from "./use-scroll-reveal";

const steps = [
  {
    number: "01",
    bg: "bg-primary",
    text: "text-on-primary",
    shadow: "shadow-[0_4px_12px_rgba(79,70,229,0.25)]",
    title: "Pick Problem Statement",
    body: "Select your hackathon track or paste the official ministry/sponsor prompt directly into HackPilot.",
  },
  {
    number: "02",
    bg: "bg-secondary",
    text: "text-on-secondary",
    shadow: "shadow-[0_4px_12px_rgba(0,108,73,0.25)]",
    title: "AI Validation & Angle",
    body: "Generate 3 defensible technical architectures, novelty scores, and verify public APIs automatically.",
  },
  {
    number: "03",
    bg: "bg-primary-container",
    text: "text-on-primary",
    shadow: "shadow-[0_4px_12px_rgba(79,70,229,0.25)]",
    title: "Sprint & Build Cadence",
    body: "Follow the 36-hour synchronized checklist with lock-in milestones, live commits, and demo dress rehearsals.",
  },
  {
    number: "04",
    bg: "bg-on-surface",
    text: "text-surface",
    shadow: "shadow-[0_4px_12px_rgba(19,27,46,0.2)]",
    title: "Pitch with Jury Proof",
    body: "Export judge-aligned 3-minute slides, live failover architectures, and real-world deployment cost equations.",
  },
];

export default function HowItWorks() {
  const stepsRef = useScrollReveal<HTMLDivElement>("[data-step-card]");

  return (
    <section id="how-it-works" className="w-full bg-surface-container-lowest py-24">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1 px-space-md py-1 rounded-full bg-surface-container text-primary font-display text-label-caps uppercase font-bold mb-space-sm">
            Execution Flow
          </div>
          <h2 className="font-display text-headline-lg text-on-surface font-extrabold tracking-tight mb-space-sm">
            From problem statement to the podium in 4 steps
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant">
            Engineered to eliminate second-guessing and align your squad
            instantly.
          </p>
        </div>

        <div
          ref={stepsRef}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter"
        >
          {steps.map((step) => (
            <div
              key={step.number}
              data-step-card
              className="relative flex flex-col items-start p-space-md bg-surface-bright rounded-2xl"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${step.bg} ${step.text} font-display text-headline-sm font-extrabold flex items-center justify-center mb-space-md ${step.shadow}`}
              >
                {step.number}
              </div>
              <h3 className="font-display text-headline-sm text-on-surface font-bold mb-space-xs">
                {step.title}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
