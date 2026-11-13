"use client";

import { useEffect, useState } from "react";

// Preview swatch colours are fixed per theme so they read correctly whatever
// the active theme is.
const THEMES = [
  { id: "purple", label: "Purple", dot: "#2B1B5A" },
  { id: "white", label: "Light", dot: "#ffffff" },
  { id: "dark", label: "Dark", dot: "#0d0d10" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("purple");

  useEffect(() => {
    const saved =
      document.documentElement.getAttribute("data-theme") ||
      (typeof localStorage !== "undefined" && localStorage.getItem("theme")) ||
      "purple";
    setTheme(saved);
  }, []);

  function choose(id) {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem("theme", id);
    } catch {}
  }

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="fixed bottom-5 left-5 z-[60] flex items-center gap-1.5 rounded-full border border-cream-200 bg-card/90 px-2 py-1.5 shadow-soft backdrop-blur"
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => choose(t.id)}
          title={`${t.label} theme`}
          aria-label={`${t.label} theme`}
          aria-pressed={theme === t.id}
          className={`h-6 w-6 rounded-full border border-black/15 transition ${
            theme === t.id
              ? "scale-110 ring-2 ring-saffron-400 ring-offset-2 ring-offset-card"
              : "opacity-70 hover:opacity-100"
          }`}
          style={{ background: t.dot }}
        />
      ))}
    </div>
  );
}
