"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github, Apple, Chrome } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";

const LoginScene = dynamic(() => import("@/components/three/LoginScene"), {
  ssr: false,
});

/**
 * Login section
 * -------------
 * Glassmorphic card centered over a 3D scene. Inputs are uncontrolled
 * (purely visual for the landing demo) — wire to real auth when needed.
 */
export default function Login() {
  const [showPass, setShowPass] = useState(false);

  return (
    <section id="login" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 -z-10 opacity-70">
        <LoginScene />
      </div>
      <div className="absolute inset-0 -z-[5] bg-gradient-to-b from-background via-transparent to-background" />

      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
        {/* Left column — copy */}
        <Reveal>
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
              Secure access
            </div>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
              <span className="gradient-text">Sign in to your</span>
              <br />
              command center.
            </h2>
            <p className="mt-5 text-white/60 leading-relaxed">
              Pick up where you left off. Real-time dashboards, AI workflows,
              and your entire team — one tap away.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              {[
                "Passwordless and biometric sign-in",
                "End-to-end encrypted by default",
                "Single sign-on for enterprise teams",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan text-[10px] text-white">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Right column — glass card */}
        <Reveal delay={0.15}>
          <motion.div
            initial={{ rotateX: 10, rotateY: -5, opacity: 0 }}
            whileInView={{ rotateX: 0, rotateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="glass-strong gradient-border noise rounded-3xl p-8 sm:p-10 shadow-soft">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white">Welcome back</h3>
                <p className="mt-1 text-sm text-white/60">
                  Enter your details to access your workspace.
                </p>
              </div>

              {/* Email */}
              <div className="mt-8 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-white/60">
                    Email
                  </span>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition focus-within:border-brand-cyan/60 focus-within:bg-white/[0.06]">
                    <Mail className="h-4 w-4 text-white/50" />
                    <input
                      type="email"
                      placeholder="you@nebula.io"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                    />
                  </div>
                </label>

                {/* Password */}
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-white/60">
                    Password
                  </span>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition focus-within:border-brand-cyan/60 focus-within:bg-white/[0.06]">
                    <Lock className="h-4 w-4 text-white/50" />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••••"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label="Toggle password visibility"
                      className="text-white/40 hover:text-white"
                      data-cursor=""
                    >
                      {showPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-white/60 cursor-none">
                    <span className="relative grid h-4 w-4 place-items-center rounded border border-white/20 bg-white/[0.05] peer-checked:bg-brand-violet">
                      <input
                        type="checkbox"
                        className="peer absolute inset-0 h-full w-full appearance-none rounded"
                      />
                      <span className="pointer-events-none h-2 w-2 rounded-sm bg-brand-cyan opacity-0 peer-checked:opacity-100" />
                    </span>
                    Remember me
                  </label>
                  <a href="#" className="text-white/60 hover:text-brand-cyan transition">
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <MagneticButton variant="primary" className="w-full justify-center">
                    Login to Nebula
                  </MagneticButton>
                </div>

                {/* Divider */}
                <div className="my-2 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
                  <div className="h-px flex-1 bg-white/10" />
                  Or continue with
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Social */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { Icon: Chrome, label: "Google" },
                    { Icon: Apple, label: "Apple" },
                    { Icon: Github, label: "GitHub" },
                  ].map(({ Icon, label }) => (
                    <button
                      key={label}
                      data-cursor={label}
                      className="group flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-2.5 text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      <Icon className="h-4 w-4 transition group-hover:scale-110" />
                    </button>
                  ))}
                </div>

                <p className="pt-4 text-center text-xs text-white/50">
                  Don&apos;t have an account?{" "}
                  <a href="#pricing" className="text-brand-cyan hover:underline">
                    Create one →
                  </a>
                </p>
              </div>
            </div>

            {/* Glow under the card. */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-r from-brand-violet/30 via-brand-blue/20 to-brand-cyan/30 blur-3xl opacity-60" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
