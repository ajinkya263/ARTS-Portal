/** @type {import('tailwindcss').Config} */
// All colors are driven by CSS variables (channels), so the whole UI re-skins
// per theme (purple / white / dark) via a [data-theme] attribute. See globals.css.
const ch = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Token names kept (indigo/saffron/cream); values come from CSS vars so
        // they re-theme. `indigo` = text/ink family, `cream` = page bg + light
        // text, `saffron` = accent. Semantic surfaces: card/panel/panel2.
        indigo: {
          DEFAULT: ch("--indigo-700"),
          50: ch("--indigo-50"), 100: ch("--indigo-100"), 200: ch("--indigo-200"),
          300: ch("--indigo-300"), 400: ch("--indigo-400"), 500: ch("--indigo-500"),
          600: ch("--indigo-600"), 700: ch("--indigo-700"), 800: ch("--indigo-800"),
          900: ch("--indigo-900"),
        },
        saffron: {
          DEFAULT: ch("--saffron-400"),
          50: ch("--saffron-50"), 100: ch("--saffron-100"), 200: ch("--saffron-200"),
          300: ch("--saffron-300"), 400: ch("--saffron-400"), 500: ch("--saffron-500"),
          600: ch("--saffron-600"),
        },
        cream: {
          DEFAULT: ch("--cream"),
          50: ch("--cream-50"), 100: ch("--cream-100"), 200: ch("--cream-200"),
          300: ch("--cream-300"),
        },
        card: ch("--card"),       // elevated surface (was bg-white / bg-cream-50)
        panel: ch("--panel"),     // dark decorative surface (sidebar, bands, buttons)
        panel2: ch("--panel2"),   // darker end of panel gradients
        onaccent: ch("--onaccent"), // text that sits on the accent colour
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
