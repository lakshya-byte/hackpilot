"use client";

export default function NoTeamState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-space-xl">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high mb-space-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
        <span className="font-display text-label-caps uppercase tracking-wider text-primary">Teams</span>
        <span className="text-outline text-xs">/</span>
        <span className="font-display text-label-caps text-on-surface-variant">Setup Stage</span>
      </div>
      <h1 className="font-display text-headline-lg text-on-surface tracking-tight mb-space-sm">
        Assemble your hackathon squad
      </h1>
      <p className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-space-xl">
        Every winning project starts with a strong team. Create a squad and invite teammates by
        username once you&apos;re in.
      </p>

      <div className="relative group bg-surface-container-lowest rounded-2xl p-gutter sm:p-space-xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_24px_-4px_rgba(79,70,229,0.06)] w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary-container mb-space-md transition-transform duration-300 group-hover:scale-110 shadow-sm">
          <span className="material-symbols-outlined text-[30px]">add</span>
        </div>
        <h2 className="font-display text-headline-md text-on-surface mb-space-xs">Create a Team</h2>
        <p className="font-body text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
          Name your squad, lock in your target hackathon, and start inviting collaborators.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="w-full py-3.5 px-gutter bg-primary text-on-primary font-display text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(79,70,229,0.22)] hover:bg-surface-tint transition-all"
        >
          <span>Create New Team</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>

      <p className="mt-space-lg font-body text-body-sm text-on-surface-variant/80 flex items-center gap-space-xs">
        <span className="material-symbols-outlined text-[16px]">mail</span>
        Already have teammates lined up? Ask your team lead to invite you by username instead.
      </p>
    </div>
  );
}
