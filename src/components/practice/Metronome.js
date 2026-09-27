"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Minus, Plus, Volume2 } from "lucide-react";

/**
 * Metronome with an animated mechanical-style pendulum.
 * Web Audio schedules the ticks (accurate); the pendulum arm swings one beat
 * per tick and reaches each extreme exactly on the beat. Accent on the downbeat,
 * selectable beats-per-bar, tap tempo, and a light tempo marking.
 */

const MAX_ANGLE = 32; // degrees each side

function tempoMark(bpm) {
  if (bpm < 40) return "Grave";
  if (bpm < 60) return "Largo";
  if (bpm < 66) return "Larghetto";
  if (bpm < 76) return "Adagio";
  if (bpm < 108) return "Andante";
  if (bpm < 120) return "Moderato";
  if (bpm < 168) return "Allegro";
  if (bpm < 200) return "Presto";
  return "Prestissimo";
}

export default function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [current, setCurrent] = useState(-1);
  const [side, setSide] = useState(-1);
  const [volume, setVolume] = useState(0.7);

  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const timerRef = useRef(null);
  const stateRef = useRef({ next: 0, i: 0 });
  const bpmRef = useRef(bpm);
  const beatsRef = useRef(beatsPerBar);
  const volRef = useRef(volume);
  const tapsRef = useRef([]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    beatsRef.current = beatsPerBar;
  }, [beatsPerBar]);
  useEffect(() => {
    volRef.current = volume;
    if (masterRef.current && ctxRef.current)
      masterRef.current.gain.setTargetAtTime(volume, ctxRef.current.currentTime, 0.03);
  }, [volume]);
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  function ensureAudio() {
    if (ctxRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;
  }

  function tick(time, accent) {
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = accent ? 1650 : 1050;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(accent ? 0.55 : 0.34, time + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    osc.connect(g).connect(masterRef.current);
    osc.start(time);
    osc.stop(time + 0.06);
  }

  function schedule() {
    const ctx = ctxRef.current;
    const st = stateRef.current;
    while (st.next < ctx.currentTime + 0.12) {
      const beat = 60 / bpmRef.current;
      const idx = st.i % beatsRef.current;
      tick(st.next, idx === 0);
      const delayMs = Math.max(0, (st.next - ctx.currentTime) * 1000);
      setTimeout(() => {
        setCurrent(idx);
        setSide((s) => -s);
      }, delayMs);
      st.next += beat;
      st.i++;
    }
  }

  function start() {
    ensureAudio();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    masterRef.current.gain.setTargetAtTime(volRef.current, ctx.currentTime, 0.03);
    stateRef.current = { next: ctx.currentTime + 0.1, i: 0 };
    timerRef.current = setInterval(schedule, 25);
    setPlaying(true);
  }

  function stop() {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
    setCurrent(-1);
  }

  function nudge(delta) {
    setBpm((b) => Math.min(240, Math.max(30, b + delta)));
  }

  function tap() {
    const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
    const taps = tapsRef.current.filter((t) => now - t < 2000);
    taps.push(now);
    tapsRef.current = taps;
    if (taps.length >= 2) {
      let sum = 0;
      for (let i = 1; i < taps.length; i++) sum += taps[i] - taps[i - 1];
      const avg = sum / (taps.length - 1);
      setBpm(Math.min(240, Math.max(30, Math.round(60000 / avg))));
    }
  }

  const beatSec = 60 / bpm;

  return (
    <div className="surface mx-auto max-w-xl p-6 md:p-8">
      {/* Tempo readout */}
      <div className="mb-6 text-center">
        <div className="font-display text-6xl leading-none text-indigo-900">{bpm}</div>
        <div className="mt-1 text-sm uppercase tracking-widest text-saffron-500">
          {tempoMark(bpm)} · BPM
        </div>
      </div>

      {/* Pendulum */}
      <div className="relative mx-auto mb-6 h-52 w-56">
        {/* metronome body (trapezoid) */}
        <div
          className="absolute bottom-0 left-1/2 h-24 w-40 -translate-x-1/2 bg-gradient-to-b from-indigo-700 to-indigo-900"
          style={{ clipPath: "polygon(22% 0, 78% 0, 100% 100%, 0 100%)" }}
        />
        {/* scale line */}
        <div className="absolute bottom-24 left-1/2 h-28 w-px -translate-x-1/2 bg-indigo-200" />
        {/* pendulum arm */}
        <div
          className="absolute bottom-3 left-1/2 origin-bottom"
          style={{
            transform: `translateX(-50%) rotate(${side * MAX_ANGLE}deg)`,
            transition: playing
              ? `transform ${beatSec}s ease-in-out`
              : "transform 0.3s ease-out",
          }}
        >
          <div className="relative h-44 w-1.5 rounded-full bg-indigo-800">
            {/* sliding weight (bob) */}
            <div className="absolute left-1/2 top-10 h-6 w-9 -translate-x-1/2 rounded-sm bg-saffron-400 shadow-card" />
          </div>
        </div>
        {/* pivot */}
        <div className="absolute bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-indigo-900 bg-saffron-400" />
      </div>

      {/* Beat dots */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {Array.from({ length: beatsPerBar }).map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-100 ${
              current === i
                ? i === 0
                  ? "h-4 w-4 bg-saffron-500"
                  : "h-4 w-4 bg-indigo-600"
                : "h-3 w-3 bg-cream-200"
            }`}
          />
        ))}
      </div>

      {/* Transport */}
      <div className="mb-5 flex items-center justify-center gap-3">
        <button
          onClick={() => nudge(-1)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-cream-200 text-indigo-700 transition hover:border-saffron-400"
          aria-label="Slower"
        >
          <Minus size={18} />
        </button>
        <button onClick={() => (playing ? stop() : start())} className="btn-primary !px-8 !py-3">
          {playing ? <Pause size={20} /> : <Play size={20} />}
          {playing ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => nudge(1)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-cream-200 text-indigo-700 transition hover:border-saffron-400"
          aria-label="Faster"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Tempo slider */}
      <input
        type="range"
        min={30}
        max={240}
        step={1}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="mb-5 w-full accent-saffron-400"
      />

      {/* Bottom controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button onClick={tap} className="btn-outline">
          Tap tempo
        </button>

        <label className="flex items-center gap-2 text-sm text-indigo-600">
          Beats
          <select
            value={beatsPerBar}
            onChange={(e) => setBeatsPerBar(Number(e.target.value))}
            className="rounded-lg border border-cream-200 bg-white px-2 py-1.5 text-indigo-800 focus:border-saffron-400 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 items-center gap-2 text-indigo-400" title="Volume">
          <Volume2 size={16} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full min-w-[80px] accent-saffron-400"
          />
        </label>
      </div>
    </div>
  );
}
