"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

/**
 * Scroll-dive hero. As you scroll through the tall wrapper, a top-down tabla
 * head zooms toward its syahi (black centre) while the headline lifts away,  * then the view "arrives inside" the drum and hands off to the dark intro
 * section below. Driven by a rAF-throttled scroll listener (no deps), and
 * disabled under prefers-reduced-motion.
 */
export default function HomeHero() {
  const wrapRef = useRef(null);
  const tablaRef = useRef(null);
  const textRef = useRef(null);
  const vignetteRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = clamp(total > 0 ? -rect.top / total : 0);

      const scale = 1 + p * 8.5;
      if (tablaRef.current) {
        tablaRef.current.style.transform = `translateZ(0) scale(${scale})`;
        tablaRef.current.style.opacity = String(1 - clamp((p - 0.72) / 0.28));
      }
      if (textRef.current) {
        const t = clamp(p / 0.4);
        textRef.current.style.opacity = String(1 - t);
        textRef.current.style.transform = `translateY(${-t * 70}px)`;
        textRef.current.style.pointerEvents = t > 0.8 ? "none" : "auto";
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - clamp(p / 0.15));
      }
      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = String(clamp((p - 0.58) / 0.42));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-cream">
        {/* ambient glow (follows the tabla, lower-centre) */}
        <div
          className="pointer-events-none absolute left-1/2 top-[65%] h-[56vmin] w-[56vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron-300/30 blur-3xl"
          aria-hidden
        />

        {/* the tabla head, lower-centre, the zoom target */}
        <div className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={tablaRef}
            className="will-change-transform"
            style={{ transformOrigin: "center center" }}
            aria-hidden
          >
            <TablaHead />
          </div>
        </div>

        {/* headline overlay, up top, on the cream, clear of the drum */}
        <div
          ref={textRef}
          className="absolute inset-x-0 top-[9%] z-10 mx-auto max-w-3xl px-6 text-center will-change-transform"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-saffron-300 bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 backdrop-blur">
            <span className="text-saffron-500">ॐ</span> Ajinkya Ranade Tabla School
          </p>
          <h1 className="font-display text-5xl leading-[1.04] text-indigo-900 sm:text-6xl md:text-7xl">
            Learn the <span className="text-gradient">language</span>
            <br /> of the tabla.
          </h1>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="btn-primary">
              Enter the portal <ArrowRight size={16} />
            </Link>
            <a
              href="https://ajinkyaranade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Meet Ajinkya
            </a>
          </div>
          <div className="mt-4">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-saffron-600 transition hover:text-saffron-500 hover:underline"
            >
              Or explore the free Tabla guide <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-saffron-500"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">
            Scroll to explore
          </span>
          <ChevronDown size={20} className="animate-bounce" />
        </div>

        {/* dark vignette that fades in to meet the intro section below */}
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0 z-20 bg-panel2"
          style={{ opacity: 0 }}
          aria-hidden
        />
      </div>
    </section>
  );
}

/** Top-down tabla head, syahi dead-centre (the zoom destination). */
function TablaHead() {
  const lacing = Array.from({ length: 48 });
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-[56vmin] w-[56vmin] drop-shadow-[0_30px_60px_rgba(43,27,90,0.25)]"
      role="img"
      aria-label="Tabla"
    >
      <defs>
        <radialGradient id="skin" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="60%" stopColor="#F3E7D0" />
          <stop offset="100%" stopColor="#E3CFA6" />
        </radialGradient>
        <radialGradient id="syahi" cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#4c3a29" />
          <stop offset="45%" stopColor="#2b2016" />
          <stop offset="100%" stopColor="#120b06" />
        </radialGradient>
        <radialGradient id="rim" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#4c3a29" />
          <stop offset="100%" stopColor="#1b140d" />
        </radialGradient>
      </defs>

      {/* gajra / outer braided rim */}
      <circle cx="200" cy="200" r="196" fill="url(#rim)" />
      <circle cx="200" cy="200" r="178" fill="#E3CFA6" />
      {/* lacing marks around the rim */}
      {lacing.map((_, i) => {
        const a = (i / lacing.length) * Math.PI * 2;
        // round so server + client render identical strings (no hydration drift)
        const r = (v) => Math.round(v * 100) / 100;
        const x1 = r(200 + Math.cos(a) * 180);
        const y1 = r(200 + Math.sin(a) * 180);
        const x2 = r(200 + Math.cos(a) * 196);
        const y2 = r(200 + Math.sin(a) * 196);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#F3E7D0"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
        );
      })}

      {/* kinar / maidan skin */}
      <circle cx="200" cy="200" r="170" fill="url(#skin)" />
      <circle
        cx="200"
        cy="200"
        r="170"
        fill="none"
        stroke="#D9C39A"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle
        cx="200"
        cy="200"
        r="120"
        fill="none"
        stroke="#D9C39A"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* syahi, the black tuning paste, dead centre */}
      <circle cx="200" cy="200" r="92" fill="url(#syahi)" />
      <circle cx="200" cy="200" r="92" fill="none" stroke="#000" strokeWidth="1" opacity="0.4" />
      {/* subtle sheen on the syahi */}
      <ellipse cx="176" cy="172" rx="34" ry="22" fill="#8a6f4a" opacity="0.28" />
    </svg>
  );
}
