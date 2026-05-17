"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor
 * -------------
 * Two-part cursor:
 *  - Outer ring: lerps toward the mouse via a soft spring (trailing feel).
 *  - Inner dot:  follows the pointer 1:1 for precision.
 *
 * Hover state expands the ring and adds a label when over `[data-cursor]`
 * elements. Mouse-down adds a satisfying squeeze.
 */
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Spring eases the outer ring without making it feel laggy.
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const enabledRef = useRef(false);

  useEffect(() => {
    // Don't run on touch devices — would just sit at (0,0).
    enabledRef.current = window.matchMedia("(pointer: fine)").matches;
    if (!enabledRef.current) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    // Delegate hover state once for the entire document — much cheaper than
    // attaching listeners to every interactive element.
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>(
        "[data-cursor], a, button, input, textarea, [role='button']"
      );
      if (hit) {
        setHovered(true);
        setLabel(hit.dataset.cursor || null);
      } else {
        setHovered(false);
        setLabel(null);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  return (
    <>
      {/* Ring — translate centers it on the pointer (50% of its own size). */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:flex items-center justify-center rounded-full mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovered ? 64 : 36,
          height: hovered ? 64 : 36,
          backgroundColor: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)",
          borderColor: "rgba(255,255,255,0.9)",
          borderWidth: 1.5,
          scale: pressed ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        {label && (
          <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-black">
            {label}
          </span>
        )}
      </motion.div>

      {/* Dot — uses the raw motion values (no spring) for precision. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
