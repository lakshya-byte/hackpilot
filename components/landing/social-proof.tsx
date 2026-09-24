export default function SocialProof() {
  return (
    <section className="w-full bg-surface-container-lowest py-space-xl border-y border-surface-container">
      <div className="max-w-7xl mx-auto px-margin text-center">
        <p className="font-display text-label-caps font-bold uppercase tracking-widest text-on-surface-variant mb-space-lg">
          Trusted by finalists &amp; champions competing at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 font-display text-headline-sm font-bold text-on-surface tracking-tighter">
            <span className="inline-flex w-3 h-3 rounded-full bg-amber-500" />
            <span>Smart India Hackathon</span>
          </div>
          <div className="flex items-center gap-1.5 font-display text-headline-sm font-bold text-on-surface">
            <span className="w-4 h-4 bg-primary text-on-primary rounded text-[11px] flex items-center justify-center">
              D
            </span>
            <span>devfolio</span>
          </div>
          <div className="flex items-center gap-1.5 font-display text-headline-sm font-bold text-on-surface tracking-tight">
            <span className="text-primary font-mono text-[16px]">&lt;/&gt;</span>
            <span>hackerearth</span>
          </div>
          <div className="flex items-center gap-1.5 font-display text-headline-sm font-bold text-on-surface">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span>unstop</span>
          </div>
          <div className="flex items-center gap-1.5 font-display text-headline-sm font-extrabold text-on-surface tracking-wider">
            <span>MLH</span>
            <span className="font-body text-body-sm font-normal text-on-surface-variant">
              COMMUNITY
            </span>
          </div>
          <div className="flex items-center gap-1 font-display text-headline-sm font-bold text-on-surface">
            <span className="text-error font-mono">•</span>
            <span>AngelHack</span>
          </div>
        </div>
      </div>
    </section>
  );
}
