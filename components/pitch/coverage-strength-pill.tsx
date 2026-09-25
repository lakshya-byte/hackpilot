"use client";

export default function CoverageStrengthPill({ strength }: { strength: string }) {
  const recipe =
    strength === "Strong"
      ? "bg-secondary-container/40 text-secondary"
      : strength === "Weak"
        ? "bg-error-container text-on-error-container"
        : "bg-tertiary-container/40 text-tertiary";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-display text-label-caps font-bold uppercase ${recipe}`}
    >
      {strength}
    </span>
  );
}
