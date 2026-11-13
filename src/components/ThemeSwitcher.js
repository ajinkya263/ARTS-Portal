"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const OPTIONS = [
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "white", label: "Light", Icon: Sun },
];

/**
 * Dark / Light theme toggle. Reads + writes localStorage("theme") and sets the
 * [data-theme] attribute on <html>. Default is dark. Pass a className to place
 * it (sidebar, page header, etc.).
 */
export default function ThemeSwitcher({ className = "" }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    const saved =
      attr === "white" || attr === "dark"
        ? attr
        : typeof localStorage !== "undefined" && localStorage.getItem("theme");
    setTheme(saved === "white" ? "white" : "dark");
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
      className={`inline-flex items-center gap-0.5 rounded-full border border-cream-200 bg-card/80 p-0.5 backdrop-blur ${className}`}
    >
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => choose(id)}
          aria-pressed={theme === id}
          title={`${label} theme`}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
            theme === id
              ? "bg-saffron-400 text-onaccent shadow-sm"
              : "text-indigo-500 hover:text-indigo-800"
          }`}
        >
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
