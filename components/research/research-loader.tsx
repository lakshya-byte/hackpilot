"use client";

import RotatingLoader from "@/components/shared/rotating-loader";

const MESSAGES = [
  "Scanning existing solutions...",
  "Finding failed attempts...",
  "Identifying the gap...",
  "Analysing the market...",
  "Building your research brief...",
];

export default function ResearchLoader() {
  return <RotatingLoader messages={MESSAGES} />;
}
