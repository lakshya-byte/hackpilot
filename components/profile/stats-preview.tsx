const stats = [
  { label: "Hackathons entered", value: "14", icon: "emoji_events" },
  { label: "Total cash grants won", value: "₹2.4L", icon: "payments" },
  { label: "Avg rubric validation", value: "98.4%", icon: "gavel" },
];

const submissions = [
  { name: "Smart India Hackathon 2024", track: "National", status: "Winner · 1st Place" },
  { name: "ETHIndia 2024", track: "Global", status: "Top 10 Finalist" },
  { name: "HackInOut 2024", track: "Regional", status: "Best Hardware/IoT" },
  { name: "Devfolio HackOdisha 3.0", track: "Regional", status: "Runner-up" },
];

export default function StatsPreview() {
  return (
    <div>
      <div className="mb-space-md rounded-2xl border border-dashed border-outline-variant bg-surface-container-low px-gutter py-space-sm flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-outline text-[18px]">visibility</span>
        <p className="font-body text-body-sm text-on-surface-variant">
          Preview data — hackathon tracking isn&apos;t built yet, so tournaments, prize money, and
          submissions below aren&apos;t real numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-gutter">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-gutter"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">{s.icon}</span>
            <p className="mt-space-sm font-display text-headline-md text-on-surface">{s.value}</p>
            <p className="font-body text-body-sm text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
        <div className="px-gutter py-space-sm border-b border-outline-variant">
          <p className="font-display text-label-lg text-on-surface">
            Hackathon tournaments &amp; submissions
          </p>
        </div>
        <ul>
          {submissions.map((s, i) => (
            <li
              key={s.name}
              className={`flex items-center justify-between gap-space-sm px-gutter py-space-sm ${
                i !== submissions.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="font-display text-label-lg text-on-surface truncate">{s.name}</p>
                <p className="font-body text-body-sm text-on-surface-variant">{s.track}</p>
              </div>
              <span className="shrink-0 px-space-sm py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-display text-label-caps uppercase">
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
