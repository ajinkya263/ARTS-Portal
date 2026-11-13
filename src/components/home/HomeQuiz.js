"use client";

import { useState } from "react";
import MatchingQuiz from "@/components/interactive/MatchingQuiz";

const TABS = [
  { key: "foundations", label: "Foundations" },
  { key: "bols", label: "Bols" },
  { key: "teentaal", label: "Teentaal" },
  { key: "taals", label: "Taals" },
  { key: "anatomy", label: "The Drum" },
];

export default function HomeQuiz() {
  const [quiz, setQuiz] = useState("foundations");
  return (
    <div>
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setQuiz(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              quiz === t.key
                ? "bg-indigo-700 text-cream-50"
                : "bg-white text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* key forces a fresh quiz when switching tabs */}
      <MatchingQuiz key={quiz} quiz={quiz} />
    </div>
  );
}
