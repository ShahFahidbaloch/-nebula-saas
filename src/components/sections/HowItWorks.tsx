"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rocket, Wand2, Globe } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    icon: Wand2,
    title: "Design",
    body: "Sketch ideas with the AI co-pilot. Iterate on tone, layout, and flow in seconds.",
  },
  {
    icon: Rocket,
    title: "Build",
    body: "Wire components together visually or in code — whichever feels right for your team.",
  },
  {
    icon: Globe,
    title: "Launch",
    body: "Ship globally on the edge with one click. Live in 12 regions before your coffee's cold.",
  },
];

/**
 * HowItWorks
 * ----------
 * Animated 3-step timeline. The vertical/horizontal connector "draws"
 * itself as you scroll using a scaleX(or Y) on a gradient line tied to
 * scroll progress within the section.
 */
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    // When user prefers reduced motion, skip the draw animation entirely.
    // The line renders at full width via CSS (no scaleX: 0 applied), which
    // is the correct static fallback — immediately readable, no motion.
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="about" ref={sectionRef} className="relative py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
              How it works
            </span>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
              <span className="gradient-text">From idea to live</span>
              <br /> in three steps.
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-20">
          {/* Animated connector (horizontal on lg, vertical on small) */}
          <div className="absolute left-0 right-0 top-12 hidden h-px lg:block">
            <div
              ref={lineRef}
              className="h-full origin-left bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-blue"
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 0.12}>
                  <div className="relative">
                    {/* Floating 3D-ish glyph */}
                    <div className="relative mx-auto h-24 w-24">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-violet/30 via-brand-blue/20 to-brand-cyan/30 blur-2xl" />
                      <div className="relative grid h-24 w-24 place-items-center rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-soft animate-float">
                        <Icon className="h-9 w-9 text-white" />
                      </div>
                      <div className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-semibold text-black shadow-glow">
                        {i + 1}
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <h3 className="text-xl font-semibold text-white">
                        {s.title}
                      </h3>
                      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
