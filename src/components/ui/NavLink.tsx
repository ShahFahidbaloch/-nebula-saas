"use client";

import { ReactNode } from "react";

/**
 * NavLink
 * -------
 * Underline grows from left to right on hover. Pure CSS — cheap and crisp.
 */
export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      data-cursor=""
      className="group relative inline-block text-sm text-white/70 hover:text-white transition-colors duration-300"
    >
      {children}
      <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-blue transition-transform duration-500 ease-out group-hover:scale-x-100" />
    </a>
  );
}
