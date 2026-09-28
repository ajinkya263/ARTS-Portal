/**
 * Decorative line-art of a tabla pair (Bayan + Dayan). Uses currentColor so it
 * tints to whatever you set via `className` (great as a faint accent on light
 * or dark panels).
 */
export default function TablaArt({ className = "" }) {
  return (
    <svg
      viewBox="0 0 230 175"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bayan — bass drum (left, larger, bulbous) */}
      <g>
        <path d="M24 66 C24 44 78 44 78 66 C82 92 82 108 72 130 C64 148 38 148 30 130 C20 108 20 92 24 66 Z" />
        <ellipse cx="51" cy="64" rx="29" ry="10" />
        <ellipse cx="51" cy="64" rx="19" ry="6.5" />
        <ellipse cx="55" cy="65" rx="8" ry="3.4" fill="currentColor" stroke="none" />
        <path d="M27 74 L36 132 M51 68 L51 140 M75 74 L66 132" strokeWidth="1" opacity="0.55" />
      </g>

      {/* Dayan — treble drum (right, smaller, tapered) */}
      <g>
        <path d="M136 60 C136 42 178 42 178 60 L170 138 C168 158 146 158 144 138 Z" />
        <ellipse cx="157" cy="58" rx="22" ry="8" />
        <ellipse cx="157" cy="58" rx="14" ry="5" />
        <ellipse cx="159" cy="59" rx="6" ry="2.6" fill="currentColor" stroke="none" />
        <ellipse cx="157" cy="142" rx="15" ry="5.5" />
        <path d="M139 66 L147 138 M157 62 L157 146 M175 66 L167 138" strokeWidth="1" opacity="0.55" />
      </g>
    </svg>
  );
}
