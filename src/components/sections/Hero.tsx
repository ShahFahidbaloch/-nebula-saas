"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, Sparkles, Zap, Shield, BarChart3 } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

// 3D scene is dynamic to keep it out of the SSR bundle (it touches `window`).
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * FloatingCard
 * ------------
 * Small UI snippet that drifts on scroll. Each card is offset on the
 * Y-axis by a different factor of scrollYProgress so they feel like
 * separate parallax planes.
 */
function FloatingCard({
  className,
  scrollFactor,
  rotate = 0,
  children,
  delay = 0,
}: {
  className: string;
  scrollFactor: number;
  rotate?: number;
  children: React.ReactNode;
  delay?: number;
}) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, scrollFactor]);

  return (
    <motion.div
      style={{ y, rotate }}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute hidden lg:flex glass rounded-2xl p-4 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax on the hero title — drifts up slowly as you scroll.
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative isolate min-h-screen overflow-hidden pt-32 pb-20"
    >
      {/* Layered backgrounds: aurora glow + grid mesh + radial fade. */}
      <div className="absolute inset-0 -z-10">
        <div className="aurora" />
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      {/* 3D canvas — absolutely positioned so the headline sits on top. */}
      <div className="absolute inset-0 -z-[5] opacity-90">
        <HeroScene />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-white/80"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
            <span>Introducing Nebula v3 — now with AI co-pilot</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
          >
            <span className="gradient-text">Build Your Future</span>
            <br />
            <span className="text-white">With Powerful</span>
            <br />
            <span className="gradient-text">Digital Experiences</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-7 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed"
          >
            Design, ship, and scale premium products with a futuristic toolkit
            crafted for ambitious teams. One platform. Infinite possibilities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton
              variant="primary"
              href="#pricing"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Get Started
            </MagneticButton>
            <MagneticButton
              variant="outline"
              href="#features"
              icon={<Play className="h-4 w-4" />}
            >
              Watch Demo
            </MagneticButton>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-14 text-xs uppercase tracking-[0.25em] text-white/40"
          >
            Trusted by 12,000+ teams worldwide
          </motion.div>
        </motion.div>

        {/* Floating UI cards with parallax depth. */}
        <FloatingCard
          className="left-[5%] top-[28%] w-56"
          scrollFactor={-180}
          rotate={-6}
          delay={0.5}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-blue">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-white/50">Latency</div>
              <div className="text-sm font-semibold text-white">12ms · p99</div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          className="right-[6%] top-[22%] w-60"
          scrollFactor={-260}
          rotate={5}
          delay={0.65}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-white/50">Security</div>
              <div className="text-sm font-semibold text-white">SOC 2 · 99.99%</div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          className="right-[10%] bottom-[8%] w-64"
          scrollFactor={120}
          rotate={-3}
          delay={0.8}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-white/50">Monthly Growth</div>
              <div className="text-sm font-semibold text-white">+248%</div>
            </div>
            <div className="text-brand-cyan text-xs">▲</div>
          </div>
        </FloatingCard>
      </div>
    </section>
  );
}
