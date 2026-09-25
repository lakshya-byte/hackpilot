"use client";

import RotatingLoader from "@/components/shared/rotating-loader";

const PITCH_MESSAGES = [
  "Parsing your rubric...",
  "Mapping criteria to slides...",
  "Building your story arc...",
  "Writing slide content...",
  "Validating rubric coverage...",
];

export default function PitchLoader() {
  return <RotatingLoader messages={PITCH_MESSAGES} />;
}
