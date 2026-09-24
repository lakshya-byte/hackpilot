"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";

/**
 * Fades + slides in the immediate children matching `itemSelector` once the
 * container scrolls into view, staggered. Uses IntersectionObserver (rather
 * than GSAP ScrollTrigger) to decide *when* to fire, since ScrollTrigger's
 * scroll-position cache can desync from Lenis's virtual scroll and leave
 * some items permanently stuck at their pre-animation state.
 */
export function useScrollReveal<T extends HTMLElement>(itemSelector: string) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = gsap.utils.toArray<HTMLElement>(itemSelector, container);
    if (items.length === 0) return;

    gsap.set(items, { opacity: 0, y: 32 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
        });
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, [itemSelector]);

  return containerRef;
}
