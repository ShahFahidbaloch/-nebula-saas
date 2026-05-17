import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nebula — Build Your Future With Powerful Digital Experiences",
  description:
    "Nebula is a futuristic platform for designing, shipping, and scaling premium digital products.",
};

export const viewport: Viewport = {
  themeColor: "#05060a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable}`}>
      <body className="font-sans antialiased selection:bg-brand-violet/40">
        {/* Lenis-powered smooth scroll for the premium "buttery" feel. */}
        <SmoothScrollProvider>
          {/* Single global cursor — children stay default-cursor-free via globals.css. */}
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
        {/*
          Analytics: tracks page views, referrers, countries, devices.
          SpeedInsights: tracks real-user Core Web Vitals (LCP, CLS, INP).
          Both are no-ops outside of Vercel deployments — safe locally.
          Injected as deferred async scripts — zero impact on page load.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
