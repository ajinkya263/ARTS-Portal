"use client";

import TaalTrainer from "@/components/interactive/TaalTrainer";
import { TEENTAAL } from "@/components/interactive/taals";

/**
 * Teentaal cycle trainer, kept for backwards compatibility with lessons that
 * reference `interactive:teentaal-trainer`. The engine now lives in
 * TaalTrainer (which also powers Dadra, Bhajani, etc.).
 */
export default function TeentaalTrainer() {
  return <TaalTrainer taal={TEENTAAL} />;
}
