"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

// A small dependency-free confetti burst. Reads the brand colors from the
// design system's CSS variables at mount (rather than hardcoding hex) so it
// stays in sync with app/globals.css if the palette ever changes.
export default function ConfettiBurst({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rootStyle = getComputedStyle(document.documentElement);
    const colors = [
      rootStyle.getPropertyValue("--color-primary").trim() || "#3525cd",
      rootStyle.getPropertyValue("--color-secondary").trim() || "#006c49",
      rootStyle.getPropertyValue("--color-secondary-container").trim() || "#6cf8bb",
      rootStyle.getPropertyValue("--color-primary-container").trim() || "#4f46e5",
      rootStyle.getPropertyValue("--color-tertiary-container").trim() || "#006e4c",
    ].filter(Boolean);

    const particleCount = 140;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
    }));

    const gravity = 0.35;
    const durationMs = 2600;
    const start = performance.now();
    let rafId: number;

    function frame(now: number) {
      const elapsed = now - start;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx!.restore();
      }

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(frame);
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        onDone?.();
      }
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
}
