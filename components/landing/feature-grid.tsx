"use client";

import { useScrollReveal } from "./use-scroll-reveal";

const cards = [
  {
    bg: "bg-[#F5F3FF]",
    hoverShadow: "hover:shadow-[0_12px_32px_rgba(79,70,229,0.08)]",
    eyebrow: "IDEA",
    eyebrowClass: "text-purple-700",
    title: "Idea Engine & Novelty Scanner",
    body: "Instantly benchmark your concept against 1,000+ past winning submissions. Flag saturated approaches before wasting 36 hours.",
    linkClass: "text-purple-900",
    mockup: (
      <>
        <div className="flex items-center justify-between text-purple-700 font-display text-label-caps font-bold mb-2">
          <span>PS NOVELTY SCAN</span>
          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800">
            92% Match Free
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-2.5 bg-purple-100 rounded-full w-4/5" />
          <div className="h-2 bg-purple-50 rounded-full w-3/5" />
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span className="font-body text-body-sm font-semibold text-purple-900">
              3 Defensible Technical Angles
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    bg: "bg-[#DCFCE7]",
    hoverShadow: "hover:shadow-[0_12px_32px_rgba(0,108,73,0.08)]",
    eyebrow: "RESEARCH",
    eyebrowClass: "text-emerald-800",
    title: "Deep Research Scanner",
    body: "Automate technical feasibility checks and benchmark against existing commercial and ministry solutions in under 3 minutes.",
    linkClass: "text-emerald-900",
    mockup: (
      <>
        <div className="flex items-center justify-between text-emerald-700 font-display text-label-caps font-bold mb-2">
          <span>DATA VALIDATION</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            API Verified
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-emerald-50/60 p-2 rounded-xl">
            <span className="font-display text-label-caps text-emerald-800 font-bold block">
              Datasets
            </span>
            <span className="font-display text-headline-sm text-emerald-900 font-extrabold">
              14 Govt
            </span>
          </div>
          <div className="bg-emerald-50/60 p-2 rounded-xl">
            <span className="font-display text-label-caps text-emerald-800 font-bold block">
              Feasibility
            </span>
            <span className="font-display text-headline-sm text-emerald-900 font-extrabold">
              98.2%
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    bg: "bg-[#FFE4E6]",
    hoverShadow: "hover:shadow-[0_12px_32px_rgba(186,26,26,0.08)]",
    eyebrow: "PITCH",
    eyebrowClass: "text-rose-700",
    title: "Championship Pitch Builder",
    body: "Structure high-impact 3-minute slides calibrated strictly to official jury evaluation criteria, Q&A defense, and scoring rubrics.",
    linkClass: "text-rose-900",
    mockup: (
      <>
        <div className="flex items-center justify-between text-rose-700 font-display text-label-caps font-bold mb-2">
          <span>3-MIN DECK CADENCE</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">
            Rubric 10/10
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between font-display text-label-caps text-rose-900">
            <span>Problem Hook (0-30s)</span>
            <span className="font-bold">Ready</span>
          </div>
          <div className="flex justify-between font-display text-label-caps text-rose-900">
            <span>Architecture Demo (30-120s)</span>
            <span className="font-bold">Ready</span>
          </div>
          <div className="flex justify-between font-display text-label-caps text-rose-900">
            <span>Cost ROI &amp; Roadmap (120-180s)</span>
            <span className="font-bold">Ready</span>
          </div>
        </div>
      </>
    ),
  },
  {
    bg: "bg-[#E0F2FE]",
    hoverShadow: "hover:shadow-[0_12px_32px_rgba(2,132,199,0.08)]",
    eyebrow: "FRAMEWORK",
    eyebrowClass: "text-sky-800",
    title: "36-Hour Win Framework",
    body: "Hour-by-hour operational cadence designed to keep all 6 team members building in sync without merge conflicts or 4 AM burnout.",
    linkClass: "text-sky-900",
    mockup: (
      <>
        <div className="flex items-center justify-between text-sky-700 font-display text-label-caps font-bold mb-2">
          <span>36-HR MILESTONES</span>
          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800">
            Sprint S02
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600 text-[18px]">
              check_circle
            </span>
            <span className="font-body text-body-sm text-sky-950 font-medium">
              Hour 08: Mock API Frozen
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600 text-[18px]">
              radio_button_checked
            </span>
            <span className="font-body text-body-sm text-sky-950 font-bold">
              Hour 20: Jury Round 1 Check
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    bg: "bg-[#FEF3C7]",
    hoverShadow: "hover:shadow-[0_12px_32px_rgba(217,119,6,0.08)]",
    eyebrow: "PREPARATION",
    eyebrowClass: "text-amber-800",
    title: "Pre-Hack Mission Checklist",
    body: "Never get disqualified on minor submission formatting, video length, or missing repository documentation ever again.",
    linkClass: "text-amber-950",
    mockup: (
      <>
        <div className="flex items-center justify-between text-amber-800 font-display text-label-caps font-bold mb-2">
          <span>SUBMISSION AUDIT</span>
          <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
            100% Pass
          </span>
        </div>
        <div className="space-y-1.5 font-display text-label-md text-amber-950">
          <div className="flex items-center justify-between">
            <span>PPT Aspect Ratio (16:9)</span>
            <span className="text-secondary font-bold">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Architecture Diagram Readme</span>
            <span className="text-secondary font-bold">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hardware Pinout Manifest</span>
            <span className="text-secondary font-bold">✓</span>
          </div>
        </div>
      </>
    ),
  },
  {
    bg: "bg-[#EDE9FE]",
    hoverShadow: "hover:shadow-[0_12px_32px_rgba(79,70,229,0.08)]",
    eyebrow: "ANALYTICS",
    eyebrowClass: "text-indigo-800",
    title: "Jury & Win Analytics",
    body: "Discover what specific judges from Indian ministries and top tech sponsors evaluate during rapid final demo presentations.",
    linkClass: "text-indigo-950",
    mockup: (
      <>
        <div className="flex items-center justify-between text-indigo-700 font-display text-label-caps font-bold mb-2">
          <span>EVALUATOR RADAR</span>
          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
            Jury Bias Matrix
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-display text-label-caps text-indigo-900">
            <span>Ministry / Civil Weight</span>
            <span className="font-bold">Practical Scalability</span>
          </div>
          <div className="flex justify-between font-display text-label-caps text-indigo-900">
            <span>Industry Sponsor Weight</span>
            <span className="font-bold">Code Architecture</span>
          </div>
        </div>
      </>
    ),
  },
];

export default function FeatureGrid() {
  const gridRef = useScrollReveal<HTMLDivElement>("[data-feature-card]");

  return (
    <section id="features" className="w-full bg-surface-bright py-24">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <div className="inline-flex items-center gap-1 px-space-md py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-display text-label-caps uppercase font-bold mb-space-sm">
            Features &amp; Tools
          </div>
          <h2 className="font-display text-headline-lg text-on-surface font-extrabold tracking-tight mb-space-sm">
            Everything you need to reach the podium
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant">
            Stop brainstorming in random Google Docs. Run every round through
            a championship blueprint proven across India&apos;s hardest
            hackathons.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
        >
          {cards.map((card) => (
            <div
              key={card.title}
              data-feature-card
              className={`flex flex-col justify-between rounded-3xl p-space-lg ${card.bg} shadow-sm ${card.hoverShadow} transition-all transform hover:-translate-y-1`}
            >
              <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm mb-space-lg">
                {card.mockup}
              </div>
              <div>
                <span
                  className={`font-display text-label-caps uppercase tracking-wider font-extrabold ${card.eyebrowClass}`}
                >
                  {card.eyebrow}
                </span>
                <h3 className="font-display text-headline-md text-on-surface font-bold mt-1 mb-space-xs">
                  {card.title}
                </h3>
                <p className="font-body text-body-md text-on-surface-variant mb-space-md">
                  {card.body}
                </p>
                <a
                  className={`inline-flex items-center gap-1 font-display text-label-lg ${card.linkClass} font-bold hover:gap-2 transition-all`}
                  href="#"
                >
                  <span>Learn more</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
