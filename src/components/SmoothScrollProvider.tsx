"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SmoothScrollProvider
 * ---------------------
 * - Boots Lenis once on mount to drive the page scroll.
 * - Feeds Lenis into GSAP's own ticker (one RAF loop, not two) so
 *   ScrollTrigger reads the smoothed scroll position without drift.
 *
 * Previous pattern used a manual requestAnimationFrame loop alongside
 * GSAP's internal ticker — two competing loops that caused ScrollTrigger
 * to fire update() twice per frame during scroll.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      // Custom ease — gentle settle at the end (Vercel / Apple feel).
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    // Single RAF loop: GSAP ticker drives Lenis. GSAP time is in seconds;
    // lenis.raf() expects milliseconds.
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);

    // Prevent GSAP from throttling on tab-blur — keeps Lenis position accurate.
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync whenever Lenis emits a scroll position update.
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
