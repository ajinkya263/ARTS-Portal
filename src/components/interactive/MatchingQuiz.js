"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, Trophy, X } from "lucide-react";

/**
 * Click-to-match quiz. media_url = `interactive:quiz:<key>`.
 * Tap a term, then tap its definition (or vice-versa). Correct pairs lock in
 * green; wrong attempts flash red. Progress + score at the top.
 */

const QUIZZES = {
  foundations: {
    intro: "Match each term to its meaning. Tap one on the left, then its pair on the right.",
    pairs: [
      { term: "Taal", def: "A repeating rhythmic cycle of a set number of beats" },
      { term: "Matra", def: "The fundamental beat, the pulse of the taal" },
      { term: "Bol", def: "A spoken syllable for a stroke on the tabla" },
      { term: "Laya", def: "The tempo, or speed, of the rhythm" },
      { term: "Sam", def: "The first beat of the cycle, the “home base”" },
      { term: "Khali", def: "The empty, unaccented section (matra 9 in Teentaal)" },
      { term: "Syahi", def: "The black, weighted circle at the centre of the skin" },
      { term: "Kinar", def: "The outer rim of the drum head" },
    ],
  },
  bols: {
    intro: "Match each bol to how it sounds or is played.",
    pairs: [
      { term: "Dha", def: "Ge (bass) + Na (treble) struck together, the key bol" },
      { term: "Na / Ta", def: "A ringing edge tone on the rim (kinar)" },
      { term: "Ge", def: "A deep, open, resonant bass on the bayan" },
      { term: "Ka / Kat", def: "A flat, closed, muted bass" },
      { term: "Tin", def: "A rounder open ring near the syahi" },
      { term: "Dhin", def: "Ge (bass) + Tin (treble) together" },
      { term: "Tirakita", def: "A quick four-stroke rolling filler" },
      { term: "Tu / Tun", def: "A single finger on the syahi, left to ring" },
    ],
  },
  teentaal: {
    intro: "Test your Teentaal, match each idea to its meaning.",
    pairs: [
      { term: "16", def: "The number of matras in Teentaal" },
      { term: "Sam", def: "Matra 1, clap, the home beat" },
      { term: "Khali", def: "Matra 9, marked by a wave of the hand" },
      { term: "Taali", def: "The claps on matras 5 and 13" },
      { term: "Vibhag", def: "A section of four matras" },
      { term: "Theka", def: "Dha Dhin Dhin Dha… the defining pattern" },
      { term: "Tihai", def: "A phrase played thrice, landing on sam" },
      { term: "Avartan", def: "One full cycle, sam to sam" },
    ],
  },
  taals: {
    intro: "Match each taal to its number of beats.",
    pairs: [
      { term: "Teentaal", def: "16 matras" },
      { term: "Dadra", def: "6 matras" },
      { term: "Bhajani", def: "8 matras" },
      { term: "Jhaptaal", def: "10 matras" },
      { term: "Ektaal", def: "12 matras" },
      { term: "Rupak", def: "7 matras (begins on khali)" },
      { term: "Keherwa", def: "8-beat light taal" },
      { term: "Dhamar", def: "14 matras" },
    ],
  },
  anatomy: {
    intro: "Match each part of the tabla to what it is.",
    pairs: [
      { term: "Syahi", def: "The black weighted circle at the centre" },
      { term: "Maidan", def: "The open ring of bare skin" },
      { term: "Kinar", def: "The outer rim of the head" },
      { term: "Gajra", def: "The braided ring around the edge" },
      { term: "Dayan", def: "The wooden treble (right) drum" },
      { term: "Bayan", def: "The metal bass (left) drum" },
      { term: "Gatta", def: "Wooden tuning blocks under the straps" },
      { term: "Pudi", def: "The drum head (skin) itself" },
    ],
  },
};

// Deterministic-enough shuffle for the client (runs in the browser).
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingQuiz({ quiz }) {
  const data = QUIZZES[quiz];
  const pairs = data?.pairs || [];

  const [round, setRound] = useState(0); // bump to reshuffle
  const [matched, setMatched] = useState(() => new Set());
  const [selected, setSelected] = useState(null); // { col, id }
  const [wrong, setWrong] = useState(null); // { col, id }
  const [attempts, setAttempts] = useState(0);

  // Initial order is deterministic (SSR-safe: no Math.random during render),   // terms in order, defs reversed so pairs aren't aligned. We shuffle for real
  // on the client after mount / reshuffle to avoid hydration mismatches.
  const [cols, setCols] = useState({
    terms: pairs.map((p, i) => ({ id: i, text: p.term })),
    defs: [...pairs.map((p, i) => ({ id: i, text: p.def }))].reverse(),
  });

  useEffect(() => {
    setCols({
      terms: shuffle(pairs.map((p, i) => ({ id: i, text: p.term }))),
      defs: shuffle(pairs.map((p, i) => ({ id: i, text: p.def }))),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, round]);

  const terms = cols.terms;
  const defs = cols.defs;

  if (!data) {
    return (
      <div className="rounded-xl border border-dashed border-indigo-200 bg-cream-50 p-8 text-center text-indigo-400">
        Unknown quiz: {quiz}
      </div>
    );
  }

  const total = pairs.length;
  const done = matched.size === total;

  function pick(col, id) {
    if (matched.has(id)) return;
    setWrong(null);
    if (!selected) {
      setSelected({ col, id });
      return;
    }
    if (selected.col === col) {
      setSelected({ col, id }); // switch selection within a column
      return;
    }
    // one from each column → evaluate
    setAttempts((a) => a + 1);
    if (selected.id === id) {
      setMatched((m) => new Set(m).add(id));
      setSelected(null);
    } else {
      setWrong({ col, id });
      setSelected(null);
      setTimeout(() => setWrong(null), 650);
    }
  }

  function reset() {
    setMatched(new Set());
    setSelected(null);
    setWrong(null);
    setAttempts(0);
    setRound((r) => r + 1);
  }

  const accuracy = attempts ? Math.round((total / attempts) * 100) : 100;

  return (
    <div className="rounded-2xl border border-cream-200 bg-gradient-to-br from-cream-50 to-cream-100 p-5 md:p-7">
      {/* Header / progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-indigo-500">{data.intro}</p>
          <span className="shrink-0 rounded-full bg-indigo-700 px-3 py-1 text-xs font-semibold text-cream-50">
            {matched.size}/{total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-500 transition-all duration-500"
            style={{ width: `${(matched.size / total) * 100}%` }}
          />
        </div>
      </div>

      {done ? (
        <div className="animate-pop grid place-items-center gap-3 rounded-xl bg-white/70 py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-saffron-400 text-indigo-900">
            <Trophy size={30} />
          </span>
          <p className="font-display text-2xl text-indigo-900">Shabash!</p>
          <p className="text-indigo-500">
            All {total} matched · {accuracy}% accuracy ({attempts} tries)
          </p>
          <button onClick={reset} className="btn-primary mt-2">
            <RotateCcw size={16} /> Play again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          <Column items={terms} col="term" matched={matched} selected={selected} wrong={wrong} onPick={pick} />
          <Column items={defs} col="def" matched={matched} selected={selected} wrong={wrong} onPick={pick} />
        </div>
      )}

      {!done && (
        <div className="mt-5 flex items-center justify-between text-xs text-indigo-400">
          <span>Tries: {attempts}</span>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:text-indigo-700"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      )}
    </div>
  );
}

function Column({ items, col, matched, selected, wrong, onPick }) {
  return (
    <div className="space-y-3">
      {items.map((it) => {
        const isMatched = matched.has(it.id);
        const isSelected = selected?.col === col && selected?.id === it.id;
        const isWrong = wrong?.col === col && wrong?.id === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onPick(col, it.id)}
            disabled={isMatched}
            className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left text-sm transition-all duration-200 ${
              isMatched
                ? "animate-pop cursor-default border-green-300 bg-green-50 text-green-700"
                : isWrong
                ? "border-red-400 bg-red-50 text-red-700 animate-pulse"
                : isSelected
                ? "-translate-y-0.5 border-saffron-400 bg-white text-indigo-900 shadow-card"
                : "border-cream-200 bg-white/70 text-indigo-700 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white"
            }`}
          >
            {isMatched && <Check size={15} className="shrink-0 text-green-600" />}
            {isWrong && <X size={15} className="shrink-0 text-red-500" />}
            <span className={col === "term" ? "font-display text-base" : ""}>
              {it.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
