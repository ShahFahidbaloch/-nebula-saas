"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/ui/Reveal";

/**
 * Each card is built from gradient stops + a glyph rather than an external
 * image so the page has no network dependency. Looks luxe, ships instantly.
 */
const CARDS = [
  {
    title: "Dashboards",
    sub: "Realtime analytics",
    grad: "from-brand-violet via-purple-500 to-brand-blue",
    glyph: "◉",
  },
  {
    title: "Pipelines",
    sub: "Visual automation",
    grad: "from-brand-cyan via-sky-400 to-brand-blue",
    glyph: "⌬",
  },
  {
    title: "AI Agents",
    sub: "Autonomous workflows",
    grad: "from-fuchsia-500 via-brand-violet to-indigo-500",
    glyph: "✦",
  },
  {
    title: "Identity",
    sub: "Zero-trust access",
    grad: "from-emerald-400 via-brand-cyan to-blue-500",
    glyph: "❖",
  },
  {
    title: "Vault",
    sub: "Secrets & keys",
    grad: "from-amber-400 via-rose-500 to-brand-violet",
    glyph: "◈",
  },
  {
    title: "Edge Functions",
    sub: "Compute, globally",
    grad: "from-brand-blue via-indigo-500 to-brand-violet",
    glyph: "⌁",
  },
];

/** Shared card interior — identical markup for both animated and static layouts. */
function CardInner({ c, i }: { c: (typeof CARDS)[number]; i: number }) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.grad}`} />
      <div className="absolute inset-0 bg-black/30" />
      <div className="noise absolute inset-0" />
      <div className="relative flex h-full flex-col justify-between p-7">
        <div className="flex items-center justify-between text-white/80">
          <span className="text-xs uppercase tracking-[0.25em]">
            Module · {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-2xl">{c.glyph}</span>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-white/60">{c.sub}</div>
          <div className="mt-2 text-3xl font-semibold text-white">{c.title}</div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur">
            Explore →
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * 3D Scroll Gallery
 * -----------------
 * Default: pins the section and horizontally translates the track via
 * ScrollTrigger.scrub. Cards have per-card Y/scale parallax.
 *
 * Reduced motion: renders the same cards in a static responsive grid —
 * no pinning, no transforms, fully readable without animation.
 */
export default function ScrollGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    // Skip all GSAP setup when user prefers reduced motion.
    // The static grid branch (below) handles the no-motion layout.
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const section = sectionRef.current!;

      // Distance to translate = full track width minus the viewport width.
      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Per-card parallax: each card lifts on its own scrubbed timeline.
      const cards = gsap.utils.toArray<HTMLElement>("[data-gallery-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, rotate: i % 2 === 0 ? -3 : 3, scale: 0.95 },
          {
            y: -40,
            rotate: i % 2 === 0 ? 3 : -3,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  // --- Reduced-motion branch: static responsive grid ---
  if (reduce) {
    return (
      <section className="relative py-32 bg-gradient-to-b from-background via-surface to-background">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
                  Modules
                </span>
                <h2 className="mt-5 max-w-xl text-4xl sm:text-5xl font-semibold tracking-tight">
                  <span className="gradient-text">A modular universe</span>
                  <br />
                  for modern teams.
                </h2>
              </div>
              <p className="max-w-md text-white/60">
                Each module works on its own and feels right at home together.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="relative h-[320px] overflow-hidden rounded-[28px] border border-white/10 shadow-soft">
                  <CardInner c={c} i={i} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- Default branch: GSAP pinned horizontal scroll ---
  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-gradient-to-b from-background via-surface to-background"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
                Modules
              </span>
              <h2 className="mt-5 max-w-xl text-4xl sm:text-5xl font-semibold tracking-tight">
                <span className="gradient-text">A modular universe</span>
                <br />
                for modern teams.
              </h2>
            </div>
            <p className="max-w-md text-white/60">
              Scroll to explore the modules that power Nebula — each one
              works on its own and feels right at home together.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Track */}
      <div className="absolute bottom-12 left-0 right-0 top-1/2 -translate-y-1/3">
        <div
          ref={trackRef}
          className="flex gap-8 pl-[8vw] pr-[20vw] will-change-transform"
        >
          {CARDS.map((c, i) => (
            <div
              key={c.title}
              data-gallery-card
              className="relative h-[420px] w-[320px] sm:w-[360px] shrink-0 overflow-hidden rounded-[28px] border border-white/10 shadow-soft"
            >
              <CardInner c={c} i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
