"use client";

import { useEffect, useState } from "react";

/** Counts up from 0 to `value` once on mount (eased). */
export default function AnimatedNumber({ value = 0, duration = 900, suffix = "" }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf;
    let start;
    const target = Number(value) || 0;
    function step(t) {
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span>
      {n}
      {suffix}
    </span>
  );
}
