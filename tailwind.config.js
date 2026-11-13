/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Resonance Studios palette (natural / earthy) ──────────
        // Token names kept (indigo/saffron/cream) so existing classes
        // re-skin automatically; the hues are now warm, muted and natural.
        indigo: {
          // deep espresso / warm umber — primary brand + text on cream
          DEFAULT: "#3b2c1e",
          50: "#f1ece6",
          100: "#e2d8cc",
          200: "#c9b9a6",
          300: "#a8927a",
          400: "#86705a",
          500: "#5f4b39",
          600: "#4c3a29",
          700: "#3b2c1e",
          800: "#2b2016",
          900: "#1b140d",
        },
        saffron: {
          // aged brass / ochre accent (muted, not neon)
          DEFAULT: "#bd9a4f",
          50: "#f7f1e3",
          100: "#efe2c6",
          200: "#e0c893",
          300: "#cdae6e",
          400: "#bd9a4f",
          500: "#a07f38",
          600: "#826728",
        },
        cream: {
          // warm parchment backgrounds
          DEFAULT: "#f4ede0",
          50: "#faf6ee",
          100: "#f4ede0",
          200: "#e9dcc8",
          300: "#dcc9ad",
        },
      },
      fontFamily: {
        // wired up via next/font in layout.js (CSS variables)
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(43, 32, 22, 0.20)",
        card: "0 4px 24px -8px rgba(43, 32, 22, 0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-pan": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(189,154,79,0)" },
          "50%": { boxShadow: "0 0 24px 3px rgba(189,154,79,0.30)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        ripple: {
          "0%": { transform: "scale(0.7)", opacity: "0.55" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        gradient: "gradient-pan 8s ease infinite",
        glow: "glow 3.5s ease-in-out infinite",
        "spin-slow": "spin-slow 120s linear infinite",
        "spin-slow-reverse": "spin-slow 90s linear infinite reverse",
        ripple: "ripple 2.6s ease-out infinite",
        pop: "pop 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
