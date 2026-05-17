"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Cpu,
  Layers,
  Lock,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Co-Pilot",
    description:
      "An always-on assistant that drafts, summarizes, and ships work alongside your team in real time.",
    accent: "from-brand-violet to-brand-blue",
  },
  {
    icon: Zap,
    title: "Realtime Sync",
    description:
      "Sub-50ms updates across every device. Your team stays in flow, no matter where they work from.",
    accent: "from-brand-cyan to-brand-blue",
  },
  {
    icon: Lock,
    title: "End-to-End Security",
    description:
      "SOC 2 Type II, ISO 27001, and zero-knowledge encryption baked in by default — not as an add-on.",
    accent: "from-brand-violet to-brand-purple",
  },
  {
    icon: Workflow,
    title: "Visual Workflows",
    description:
      "Design pipelines that anyone on the team can read at a glance — and tweak without writing code.",
    accent: "from-brand-blue to-brand-cyan",
  },
  {
    icon: Layers,
    title: "Composable Stack",
    description:
      "200+ integrations. Mix, match, and swap any layer of your stack without breaking your flow.",
    accent: "from-brand-purple to-brand-cyan",
  },
  {
    icon: Cpu,
    title: "Edge Compute",
    description:
      "Run code at the edge — closer to your users, faster than ever, with zero infra to manage.",
    accent: "from-brand-cyan to-brand-violet",
  },
];

/**
 * TiltCard
 * --------
 * Tracks pointer offset relative to the card center, then converts the
 * normalized vector to a small rotateX/rotateY pair. We use Framer's
 * spring on the motion values to smooth out jitter at the edges.
 */
function TiltCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 180,
    damping: 18,
  });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 180,
    damping: 18,
  });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = feature.icon;

  return (
    <Reveal delay={index * 0.06}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
        className="group relative h-full rounded-3xl"
        data-cursor=""
      >
        <div className="glass gradient-border relative h-full overflow-hidden rounded-3xl p-7">
          {/* Spotlight that follows the cursor on hover. */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(450px circle at var(--mx, 50%) var(--my, 50%), rgba(124,58,237,0.18), transparent 60%)",
            }}
          />
          <div
            className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} shadow-glow`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            {feature.description}
          </p>

          {/* Corner accent. */}
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br from-brand-violet/20 to-brand-cyan/10 blur-3xl" />
        </div>
      </motion.div>
    </Reveal>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-radial-glow" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
              Features
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              <span className="gradient-text">Everything you need</span>
              <br /> to build at the edge.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/60">
              A complete toolkit for teams who want to ship faster, sleep
              better, and create products people actually love.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14 lg:mt-16 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <TiltCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
