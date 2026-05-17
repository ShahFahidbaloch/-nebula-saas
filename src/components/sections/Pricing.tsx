"use client";

import { Check, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    desc: "For curious builders kicking the tires.",
    features: [
      "1 workspace",
      "Up to 3 collaborators",
      "Community support",
      "100 AI runs / month",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$24",
    period: "/mo",
    desc: "For serious teams shipping every day.",
    features: [
      "Unlimited workspaces",
      "Up to 25 collaborators",
      "Priority support",
      "10,000 AI runs / month",
      "Edge functions included",
      "Custom domains",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations that need it all.",
    features: [
      "SSO + SCIM",
      "Unlimited collaborators",
      "Dedicated success manager",
      "Unlimited AI runs",
      "Region-pinned data",
      "99.99% SLA",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="absolute inset-0 -z-10 bg-radial-glow opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
              Pricing
            </span>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
              <span className="gradient-text">Simple, scalable</span>
              <br />
              pricing for every stage.
            </h2>
            <p className="mt-5 text-white/60">
              Start free. Upgrade when you outgrow it. Cancel any time.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={cn(
                  "relative h-full rounded-3xl p-8",
                  p.highlight
                    ? "bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 shadow-glow"
                    : "glass"
                )}
              >
                {/* Glowing border ring for the highlighted (middle) plan. */}
                {p.highlight && (
                  <>
                    <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-blue opacity-60 blur-xl" />
                    <div className="pointer-events-none absolute inset-0 rounded-3xl gradient-border" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan px-3 py-1 text-[11px] font-medium text-white shadow-glow">
                      <Sparkles className="h-3 w-3" />
                      Most popular
                    </div>
                  </>
                )}

                <div className="relative">
                  <div className="text-sm uppercase tracking-[0.2em] text-white/60">
                    {p.name}
                  </div>
                  <div className="mt-4 flex items-end gap-1">
                    <div className="text-5xl font-semibold text-white">
                      {p.price}
                    </div>
                    <div className="pb-2 text-white/50">{p.period}</div>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{p.desc}</p>

                  <div className="my-7 h-px w-full bg-white/10" />

                  <ul className="space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <MagneticButton
                      variant={p.highlight ? "primary" : "outline"}
                      className="w-full justify-center"
                    >
                      {p.cta}
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
