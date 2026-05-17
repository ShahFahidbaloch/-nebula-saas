"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/ui/Reveal";

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

/** Shared card interior — same markup across all three layout branches. */
function CardInner({ c, i }: { c: (typeof CARDS)[number]; i: number }) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.grad}`} />
      <div className="absolute inset-0 bg-black/30" />
      <div className="noise absolute inset-0" />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-center justify-between text-white/80">
          <span className="text-xs uppercase tracking-[0.25em]">
            Module · {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-2xl">{c.glyph}</span>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-white/60">{c.sub}</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-white">{c.title}</div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur">
            Explore →
          </div>
        </div>
      </div>
    </>
  );
}

/** Shared section heading used in all three layout branches. */
function Heading({ scrollable = false }: { scrollable?: boolean }) {
  return (
    <Reveal>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
            Modules
          </span>
          <h2 className="mt-4 max-w-xl text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            <span className="gradient-text">A modular universe</span>
            <br />
            for modern teams.
          </h2>
        </div>
        <p className="max-w-xs text-sm text-white/60">
          {scrollable
            ? "Swipe to explore every module."
            : "Each module works on its own and feels right at home together."}
        </p>
      </div>
    </Reveal>
  );
}

/**
 * ScrollGallery — three layout branches based on context:
 *
 * 1. prefers-reduced-motion → static 2–3 col grid (no animation at all)
 * 2. mobile / tablet (< lg, < 1024px) → CSS snap-scroll horizontal carousel
 *    • Native browser scroll, no GSAP, works perfectly on iOS Safari
 *    • Cards fill ~80vw so users can see the next card peeking in
 * 3. desktop (lg+) → GSAP pinned horizontal scroll with per-card parallax
 *    • GSAP only activates when window.innerWidth >= 1024 (checked synchronously
 *      in useLayoutEffect before first paint)
 */
export default function ScrollGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    // Skip GSAP for reduced motion users — the static grid handles their view.
    if (reduce) return;
    // Skip GSAP on mobile/tablet — the CSS snap carousel handles their view.
    // Checking synchronously here prevents GSAP from reading wrong dimensions
    // on a layout that is display:none at this viewport width.
    if (window.innerWidth < 1024) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const section = sectionRef.current!;

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

  /* ── Branch 1: prefers-reduced-motion ──────────────────────────────── */
  if (reduce) {
    return (
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-background via-surface to-background">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <div className="relative h-[300px] sm:h-[320px] overflow-hidden rounded-[24px] border border-white/10 shadow-soft">
                  <CardInner c={c} i={i} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── Branch 2: mobile / tablet — CSS snap carousel (lg:hidden) ─── */}
      <section className="lg:hidden relative py-20 sm:py-24 bg-gradient-to-b from-background via-surface to-background">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Heading scrollable />
        </div>
        {/*
          Negative horizontal margin + padding lets the track bleed to the
          screen edge while keeping card content aligned to the grid.
          scrollbar-none hides the native scrollbar on all browsers.
        */}
        <div className="relative z-10 mt-8 -mx-4 sm:-mx-6 px-4 sm:px-6
                        flex gap-4 overflow-x-auto snap-x snap-mandatory
                        scrollbar-none pb-6">
          {CARDS.map((c, i) => (
            <div
              key={c.title}
              className="snap-center shrink-0 relative
                         w-[78vw] max-w-[320px]
                         h-[320px] sm:h-[360px]
                         overflow-hidden rounded-[24px]
                         border border-white/10 shadow-soft"
            >
              <CardInner c={c} i={i} />
            </div>
          ))}
          {/* Trailing spacer so the last card doesn't flush against the edge */}
          <div className="shrink-0 w-4 sm:w-6" aria-hidden />
        </div>
      </section>

      {/* ── Branch 3: desktop — GSAP pinned horizontal scroll (hidden lg:block) */}
      <section
        ref={sectionRef}
        className="hidden lg:block relative h-screen overflow-hidden
                   bg-gradient-to-b from-background via-surface to-background"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <Heading scrollable />
        </div>

        <div className="absolute bottom-12 left-0 right-0 top-1/2 -translate-y-1/3">
          <div
            ref={trackRef}
            className="flex gap-8 pl-[8vw] pr-[20vw] will-change-transform"
          >
            {CARDS.map((c, i) => (
              <div
                key={c.title}
                data-gallery-card
                className="relative h-[420px] w-[340px] xl:w-[380px] shrink-0
                           overflow-hidden rounded-[28px]
                           border border-white/10 shadow-soft"
              >
                <CardInner c={c} i={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
