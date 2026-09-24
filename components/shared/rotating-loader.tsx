"use client";

import { useEffect, useState } from "react";

const INTERVAL_MS = 13000;

export default function RotatingLoader({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-space-md bg-surface/95 backdrop-blur-sm">
      <div className="h-10 w-10 rounded-full border-2 border-outline-variant border-t-primary animate-spin" />
      <p className="font-display text-headline-sm text-on-surface">{messages[index]}</p>
    </div>
  );
}
