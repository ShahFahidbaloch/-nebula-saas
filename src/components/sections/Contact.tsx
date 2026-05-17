"use client";

import { Mail, MapPin, Clock } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";

const INFO = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@nebula.io",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 24 hours",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "San Francisco, CA",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-radial-glow opacity-50" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center mb-14 sm:mb-20">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/70">
              Contact
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              <span className="gradient-text">Get in touch</span>
              <br />
              we&apos;d love to hear from you.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/60">
              Have a question, need a demo, or want to talk enterprise? Drop us a
              line and we&apos;ll get back to you fast.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left: info + decorative */}
          <Reveal className="lg:col-span-2">
            <div className="glass gradient-border rounded-3xl p-8 h-full flex flex-col gap-8">
              {INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-violet/30 to-brand-cyan/20 border border-white/10">
                    <Icon className="h-4 w-4 text-white/80" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-[0.15em] mb-1">
                      {label}
                    </div>
                    <div className="text-sm text-white/80">{value}</div>
                  </div>
                </div>
              ))}

              {/* Decorative gradient blob */}
              <div className="mt-auto pt-8 border-t border-white/5">
                <div className="relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet/10 via-brand-blue/5 to-brand-cyan/10">
                  <div className="absolute inset-0 bg-grid opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-semibold gradient-text">24h</div>
                      <div className="text-xs text-white/40 mt-1">avg. response time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="glass gradient-border rounded-3xl p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
