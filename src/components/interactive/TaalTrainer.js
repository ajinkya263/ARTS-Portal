"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { TEENTAAL } from "@/components/interactive/taals";

/**
 * Interactive taal cycle trainer (generic).
 * Renders any taal definition (see taals.js): the theka as a grid of matras,
 * a synthesized metronome (Web Audio) accented on Sam / softened on Khali,
 * laya presets, a tempo slider, and tap-to-hear on each matra.
 */

const LAYA = [
  { label: "Vilambit", bpm: 60 },
  { label: "Madhya", bpm: 100 },
  { label: "Drut", bpm: 180 },
];

// Tailwind needs static class names, so map col counts explicitly.
const COLS = { 3: "grid-cols-3", 4: "grid-cols-4", 6: "grid-cols-6" };

export default function TaalTrainer({ taal = TEENTAAL }) {
  const theka = taal.theka;
  const n = theka.length;
  const khaliIndex = taal.khaliIndex;
  const cols = COLS[taal.cols] || "grid-cols-4";

  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(taal.defaultBpm || 80);
  const [current, setCurrent] = useState(-1);
  const [muted, setMuted] = useState(false);

  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const beatRef = useRef(0);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Synthesize a short percussive click. accent: Sam > vibhag > normal; khali is hollow.
  function click(kind) {
    if (mutedRef.current) return;
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
    }
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq =
      kind === "sam" ? 880 : kind === "khali" ? 330 : kind === "vibhag" ? 660 : 520;
    const peak = kind === "sam" ? 0.5 : kind === "khali" ? 0.18 : 0.3;
    osc.frequency.setValueAtTime(freq, t);
    osc.type = kind === "khali" ? "sine" : "triangle";
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  function beatKind(i) {
    if (i === 0) return "sam";
    if (i === khaliIndex) return "khali";
    if (theka[i].marker || i % taal.cols === 0) return "vibhag";
    return "normal";
  }

  function playBeat(i) {
    click(beatKind(i));
    setCurrent(i);
  }

  // Start/stop the beat loop when playing or tempo changes.
  useEffect(() => {
    if (!playing) {
      clearInterval(timerRef.current);
      return;
    }
    const interval = 60000 / bpm;
    playBeat(beatRef.current % n);
    beatRef.current = (beatRef.current + 1) % n;
    timerRef.current = setInterval(() => {
      playBeat(beatRef.current % n);
      beatRef.current = (beatRef.current + 1) % n;
    }, interval);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, bpm, n]);

  function toggle() {
    if (!playing && audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setPlaying((p) => !p);
  }

  function reset() {
    setPlaying(false);
    beatRef.current = 0;
    setCurrent(-1);
  }

  const hasTaali = theka.some((m) => m.marker && m.marker !== "X" && m.marker !== "0");

  return (
    <div className="rounded-xl bg-gradient-to-br from-panel to-panel2 p-5 text-cream-50 md:p-7">
      {/* header */}
      <div className="mb-4 flex items-baseline justify-between">
        <h4 className="font-display text-lg text-cream-50">
          {taal.name} <span className="text-saffron-300">· {n} matras</span>
        </h4>
      </div>

      {/* the cycle */}
      <div className={`grid ${cols} gap-2 md:gap-3`}>
        {theka.map((m, i) => {
          const active = i === current;
          const isKhali = i === khaliIndex;
          return (
            <button
              key={i}
              onClick={() => {
                beatRef.current = i;
                playBeat(i);
              }}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border px-1 text-center transition-all duration-100 ${
                active
                  ? "scale-105 border-saffron-400 bg-saffron-400 text-onaccent shadow-soft"
                  : isKhali
                  ? "border-panel bg-panel/40 text-indigo-200"
                  : "border-panel bg-panel/70 text-cream-50 hover:bg-panel"
              }`}
            >
              {m.marker && (
                <span
                  className={`absolute left-1.5 top-1 text-[10px] font-bold ${
                    active ? "text-indigo-800" : "text-saffron-300"
                  }`}
                >
                  {m.marker}
                </span>
              )}
              <span
                className={`absolute right-1.5 top-1 text-[10px] ${
                  active ? "text-indigo-700" : "text-indigo-400"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`font-display leading-tight ${
                  m.bol.length > 4 ? "text-xs md:text-sm" : "text-base md:text-lg"
                }`}
              >
                {m.bol}
              </span>
            </button>
          );
        })}
      </div>

      {/* legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-indigo-300">
        <span>
          <b className="text-saffron-300">X</b> Sam (clap)
        </span>
        {hasTaali && (
          <span>
            <b className="text-saffron-300">2 / 3</b> Taali (clap)
          </span>
        )}
        <span>
          <b className="text-saffron-300">0</b> Khali (wave)
        </span>
      </div>

      {/* controls */}
      <div className="mt-5 flex flex-col gap-4 border-t border-panel/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="btn-primary !px-4">
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-panel px-4 py-2.5 text-sm text-indigo-100 transition hover:bg-panel"
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
            className="grid h-11 w-11 place-items-center rounded-xl border border-panel text-indigo-100 transition hover:bg-panel"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* tempo */}
        <div className="flex-1 sm:max-w-xs">
          <div className="mb-1 flex justify-between text-xs text-indigo-300">
            <span>Laya (tempo)</span>
            <span className="font-semibold text-cream-50">{bpm} BPM</span>
          </div>
          <input
            type="range"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-saffron-400"
          />
          <div className="mt-2 flex gap-2">
            {LAYA.map((l) => (
              <button
                key={l.label}
                onClick={() => setBpm(l.bpm)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  bpm === l.bpm
                    ? "bg-saffron-400 text-onaccent"
                    : "bg-panel text-indigo-100 hover:bg-panel"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-indigo-300">
        Tip: tap any matra to hear it. Recite the bols aloud with the beat
        (padhant), clap on X{hasTaali ? " / 2 / 3" : ""}, wave on 0.
      </p>
    </div>
  );
}
