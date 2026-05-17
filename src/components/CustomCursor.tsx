"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * CustomCursor — zero React re-renders version.
 *
 * All state lives in Framer motion values so updates bypass React's
 * reconciler entirely. The label is written via direct DOM mutation.
 * Net result: no component re-render on any pointer event.
 */
export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const hovered = useMotionValue(0);  // 0 | 1
  const pressed  = useMotionValue(0); // 0 | 1

  // Snappy spring — high stiffness keeps it close; mass < 1 removes inertia.
  const x = useSpring(mouseX, { stiffness: 600, damping: 38, mass: 0.25 });
  const y = useSpring(mouseY, { stiffness: 600, damping: 38, mass: 0.25 });

  // Scale replaces width/height animation — GPU only, no layout cost.
  const ringScale = useTransform(() =>
    pressed.get() ? 0.82 : hovered.get() ? 1.7 : 1
  );

  const ringBg = useTransform(
    hovered,
    [0, 1],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.92)"]
  );

  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor], a, button, input, textarea, select, [role='button']"
      );
      hovered.set(hit ? 1 : 0);
      // Direct DOM write — no setState, no re-render.
      if (labelRef.current)
        labelRef.current.textContent = hit?.dataset.cursor ?? "";
    };

    const onDown = () => pressed.set(1);
    const onUp   = () => pressed.set(0);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown,  { passive: true });
    window.addEventListener("mouseup",   onUp,    { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [mouseX, mouseY, hovered, pressed]);

  return (
    <>
      {/* Ring — fixed 36px, scaled up on hover via transform (no layout). */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-white/90 mix-blend-difference"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          scale: ringScale,
          backgroundColor: ringBg,
        }}
      >
        <span
          ref={labelRef}
          className="text-[10px] uppercase tracking-[0.18em] font-medium text-black leading-none"
        />
      </motion.div>

      {/* Dot — raw values, no spring, perfectly precise. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
