"use client";

import RotatingLoader from "@/components/shared/rotating-loader";

const MESSAGES = [
  "Researching the space...",
  "Finding gaps...",
  "Generating ideas...",
  "Scoring and validating...",
];

export default function IdeaLoader() {
  return <RotatingLoader messages={MESSAGES} />;
}
