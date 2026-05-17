"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

/**
 * MagneticButton
 * --------------
 * Translates toward the cursor when it's near, then springs back when it
 * leaves. Strength is dampened (0.35) so the effect feels premium rather
 * than rubbery.
 */
export default function MagneticButton({
  children,
  variant = "primary",
  className,
  href,
  onClick,
  icon,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  // Inner text moves at 40% of the outer displacement in the same direction.
  // This creates a parallax depth layer: the border "lifts" while the label
  // follows at a slight lag — without overflowing the button boundary.
  // Previous bug: applying the full sx/sy to both layers doubled displacement
  // and pushed text outside the button's border on wide screens.
  const innerX = useTransform(sx, (v) => v * 0.4);
  const innerY = useTransform(sy, (v) => v * 0.4);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Offset from the center of the element, dampened to 35% magnitude.
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide select-none transition-colors";

  const variants: Record<Variant, string> = {
    primary:
      "bg-white text-black hover:bg-white/90 shadow-glow",
    ghost:
      "bg-white/[0.04] text-white hover:bg-white/[0.1] border border-white/10",
    outline:
      "bg-transparent text-white border border-white/15 hover:border-white/40",
  };

  const Inner = (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
      className="inline-block"
      data-cursor="click"
    >
      <span className={cn(base, variants[variant], className)}>
        <motion.span
          style={{ x: innerX, y: innerY }}
          className="pointer-events-none inline-flex items-center gap-2"
        >
          {children}
          {icon}
        </motion.span>

        {variant === "primary" && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-brand-violet/0 via-brand-violet/40 to-brand-cyan/40 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        )}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className="group inline-block">
        {Inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="group inline-block">
      {Inner}
    </button>
  );
}
