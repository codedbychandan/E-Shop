import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface-2) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: {
          50: "#f4f2ff",
          100: "#ebe7ff",
          200: "#d9d1ff",
          300: "#bcabff",
          400: "#9a7dff",
          500: "#7c4dff",
          600: "#6c2bf2",
          700: "#5c1bd6",
          800: "#4d17b0",
          900: "#40178c",
          950: "#260a5c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgb(16 16 32 / 0.04), 0 8px 24px -12px rgb(16 16 32 / 0.12)",
        "card-lg":
          "0 2px 6px rgb(16 16 32 / 0.05), 0 18px 44px -16px rgb(16 16 32 / 0.22)",
        glow: "0 10px 32px -10px rgb(124 77 255 / 0.55)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
