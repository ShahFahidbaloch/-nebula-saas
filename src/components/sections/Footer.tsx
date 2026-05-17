"use client";

import { Sparkles, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import NewsletterForm from "@/components/forms/NewsletterForm";

const NAV = [
  {
    title: "Product",
    items: ["Features", "Pricing", "Integrations", "Changelog"],
  },
  { title: "Company", items: ["About", "Customers", "Careers", "Contact"] },
  { title: "Resources", items: ["Docs", "Guides", "API", "Status"] },
  { title: "Legal", items: ["Privacy", "Terms", "Security", "DPA"] },
];

const SOCIALS = [
  { Icon: Github, label: "GitHub" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Instagram, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/5 bg-surface/50 backdrop-blur-xl">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <a href="#home" className="inline-flex items-center gap-2" data-cursor="">
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-blue to-brand-cyan">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="text-lg font-semibold tracking-tight">Nebula</span>
            </a>

            <p className="mt-5 max-w-md text-sm text-white/60">
              Premium tools for ambitious teams. Join 12,000+ makers building
              the next era of software with Nebula.
            </p>

            {/* Newsletter */}
            <NewsletterForm />

            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  data-cursor={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {NAV.map((col) => (
              <div key={col.title}>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {col.title}
                </div>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.items.map((it) => (
                    <li key={it}>
                      <a
                        href="#"
                        className="text-white/70 transition hover:text-white"
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/40 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Nebula Inc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>

      {/* Oversize wordmark for that Stripe-y final flourish. */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden text-center font-display text-[18vw] font-semibold leading-none tracking-tighter"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(124,58,237,0.15) 60%, transparent)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        NEBULA
      </div>
    </footer>
  );
}
