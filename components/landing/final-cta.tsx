export default function FinalCta() {
  return (
    <section className="w-full bg-primary-container text-on-primary py-24 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-secondary blur-3xl opacity-30 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-margin text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-lowest/10 text-secondary-container font-display text-label-caps uppercase font-bold mb-space-md">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          Smart India Hackathon 2025 Approaching
        </span>
        <h2 className="font-display text-display-hero font-extrabold tracking-tight mb-space-md">
          The next SIH PS drops soon.
        </h2>
        <p className="font-body text-body-lg text-on-primary-container max-w-2xl mx-auto mb-space-xl">
          Join 4,200+ students from IITs, NITs, and top engineering colleges
          preparing their winning blueprints right now. Don&apos;t start
          from scratch at the venue.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-space-md">
          <a
            className="w-full sm:w-auto px-space-xl py-4 rounded-full bg-surface-container-lowest text-primary-container hover:bg-surface-bright font-display text-label-lg font-extrabold transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-[1.02] flex items-center justify-center gap-2"
            href="#early-access"
          >
            <span>Get Early Access Now</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </a>
        </div>
        <div className="mt-space-md text-on-primary-container font-body text-body-sm">
          Instant access to the 2025 Framework • Zero configuration required
        </div>
      </div>
    </section>
  );
}
