"use client";

import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const QUOTES = [
  {
    name: "Ava Martinez",
    role: "Head of Product · Lumen",
    text: "Nebula collapsed weeks of integration work into an afternoon. Our team ships twice as much, with half the bugs.",
  },
  {
    name: "Jonas Becker",
    role: "CTO · Kairos Labs",
    text: "The AI co-pilot feels like a senior engineer who never sleeps. It's quietly become the heartbeat of our workflow.",
  },
  {
    name: "Priya Nair",
    role: "Design Lead · Northwind",
    text: "I've never seen a tool this powerful that respects taste this much. Every detail feels intentional and luxurious.",
  },
  {
    name: "Marcus Lee",
    role: "Founder · Helix",
    text: "We replaced four tools with Nebula and saw a 40% lift in delivery speed in the first quarter. Easy decision.",
  },
  {
    name: "Sofia Romano",
    role: "VP Engineering · Spectra",
    text: "Realtime sync just works. Even at 200 collaborators, our staging environment feels instant.",
  },
  {
    name: "Daniel Yu",
    role: "Founder · Orbital",
    text: "The polish is unreal. Nebula is what Linear, Vercel, and Figma would be if they had a baby.",
  },
];

function Card({ q }: { q: (typeof QUOTES)[number] }) {
  return (
    <div
      data-cursor=""
      className="group relative w-[82vw] max-w-[340px] sm:w-[360px] md:w-[400px] shrink-0 rounded-3xl glass gradient-border p-6 sm:p-7 transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="flex items-center gap-1 text-brand-cyan">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/80">
        &ldquo;{q.text}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan text-sm font-semibold text-white">
          {q.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{q.name}</div>
          <div className="text-xs text-white/50">{q.role}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Testimonials
 * ------------
 * Single horizontally-scrolling marquee. We render the list twice so the
 * track can loop seamlessly: the CSS animation translates -50% (one full
 * copy width) and snaps back to 0, invisible to the eye.
 */
export default function Testimonials() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
              Loved by makers
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              <span className="gradient-text">Real teams.</span> Real results.
            </h2>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-10 sm:mt-16">
        {/* Edge fade — narrower on mobile so first card is more visible */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24 lg:w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24 lg:w-40 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max marquee gap-6 pl-6">
          {QUOTES.concat(QUOTES).map((q, i) => (
            <Card key={i} q={q} />
          ))}
        </div>
      </div>
    </section>
  );
}
