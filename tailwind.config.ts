import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05060a",
        surface: "#0a0c14",
        // Brand palette tuned for a luxury futuristic feel.
        brand: {
          violet: "#7c3aed",
          purple: "#a855f7",
          blue: "#3b82f6",
          cyan: "#22d3ee",
          neon: "#67e8f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(5,6,10,0) 0%, rgba(5,6,10,1) 80%)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.35), transparent 60%)",
        "hero-conic":
          "conic-gradient(from 200deg at 50% 50%, rgba(124,58,237,0.45), rgba(34,211,238,0.35), rgba(59,130,246,0.45), rgba(124,58,237,0.45))",
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(124, 58, 237, 0.55)",
        "glow-cyan": "0 0 60px -10px rgba(34, 211, 238, 0.45)",
        soft: "0 30px 80px -30px rgba(0,0,0,0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(124,58,237,0.5)" },
          "50%": { boxShadow: "0 0 0 24px rgba(124,58,237,0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        spinSlow: "spinSlow 18s linear infinite",
        pulseGlow: "pulseGlow 2.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
