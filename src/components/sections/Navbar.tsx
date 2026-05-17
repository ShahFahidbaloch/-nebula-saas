"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import NavLink from "@/components/ui/NavLink";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/**
 * Navbar
 * ------
 * - Translucent glass bar that intensifies its blur + border once the user
 *   scrolls past ~30px (gives a "lifted" feel without a hard switch).
 * - Mobile menu uses a slide-down sheet with stagger reveals on links.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between rounded-full border px-4 py-2.5 sm:px-6 transition-all duration-500",
            scrolled
              ? "border-white/10 bg-black/40 backdrop-blur-2xl shadow-soft"
              : "border-white/5 bg-white/[0.02] backdrop-blur-xl"
          )}
        >
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2" data-cursor="">
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-blue to-brand-cyan">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan blur-md opacity-60 -z-10" />
            </span>
            <span className="text-base font-semibold tracking-tight">Nebula</span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <NavLink key={l.href} href={l.href}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <MagneticButton variant="ghost" href="#login">
              Login
            </MagneticButton>
            <MagneticButton variant="primary" href="#pricing">
              Get Started
            </MagneticButton>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden grid place-items-center h-10 w-10 rounded-full bg-white/[0.06] border border-white/10 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            data-cursor=""
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-3 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-6"
            >
              <ul className="flex flex-col gap-4">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block text-base text-white/80 hover:text-white"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <MagneticButton variant="ghost" href="#login">
                  Login
                </MagneticButton>
                <MagneticButton variant="primary" href="#pricing">
                  Get Started
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
