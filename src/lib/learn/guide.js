/* =============================================================================
   LEARN TABLA  ·  content for the free, self-paced guide at /learn
   -----------------------------------------------------------------------------
   General educational material on North Indian classical Tabla. This page is a
   free, text-based reference anyone can read on their own time, it is separate
   from the interactive curriculum modules in the student portal.

   YouTube references: every `id` below was verified live + embeddable at build
   time via YouTube's oEmbed endpoint. Where no clean embeddable video existed,
   a `search` query is provided instead so the link always surfaces a current
   performance. To swap a video, paste a new 11-char YouTube ID as `id`.
   ========================================================================== */

export const ytSearch = (q) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export const ytWatch = (id) => `https://www.youtube.com/watch?v=${id}`;
export const ytEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;

/* ------------------------------------------------------------------ ANATOMY */
export const parts = [
  { name: "Dāyā", tag: "the right drum", def: "The smaller, wooden, higher-pitched drum played with the right hand. Often called simply “tabla.”" },
  { name: "Bāyā", tag: "the left drum", def: "The larger, metal (or clay) bass drum played with the left hand. Its heel-of-the-hand pressure bends the pitch." },
  { name: "Syāhī", tag: "the black circle", def: "The black tuning patch of iron filings and paste at the centre of each head, the source of the Tabla’s clear, pitched tone." },
  { name: "Maidān", tag: "the open skin", def: "The ring of bare skin between the syahi and the rim. Gives the softer “pure” tone and is the main tuning area." },
  { name: "Kinār / Chānṭī", tag: "the rim", def: "The outer braided edge of the head, struck for the bright, cutting rim sounds." },
  { name: "Gaṭṭā", tag: "tuning dowels", def: "Wooden cylinders under the lacing: tap them down to raise the pitch, up to lower it." },
  { name: "Baddhī / Tasma", tag: "the lacing", def: "The single long rawhide strap that laces the head to the shell and holds the whole instrument under tension." },
  { name: "Hathauṛī", tag: "the hammer", def: "The small steel tuning hammer used to tap the rim and the gaṭṭā into tune." },
];

/* -------------------------------------------------------------------- BOLS */
export const bolFamilies = [
  { label: "Resonant dāyā (ringing)", bols: [
    { name: "Nā / Tā", desc: "ringing stroke at the rim" },
    { name: "Tin", desc: "ringing tone near the syahi" },
    { name: "Din", desc: "open sustaining tone" },
  ]},
  { label: "Closed dāyā (muted)", bols: [
    { name: "Te / Ṭe", desc: "dry, damped tap" },
    { name: "Tak", desc: "short closed stroke" },
    { name: "Tī", desc: "crisp muted stroke" },
  ]},
  { label: "Bāyā (bass)", bols: [
    { name: "Ga / Ghe", desc: "open, resonant, pitch-bending bass" },
    { name: "Ka / Kat", desc: "flat, closed, non-resonant bass" },
  ]},
  { label: "Combined (two hands)", bols: [
    { name: "Dhā", desc: "nā + ga together" },
    { name: "Dhin", desc: "tin + ga together" },
    { name: "Dhe", desc: "te + ga together" },
  ]},
  { label: "Compound phrases", bols: [
    { name: "Tirakiṭa", desc: "the essential four-stroke roll" },
    { name: "Teṭe", desc: "quick two-stroke figure" },
    { name: "Dhāge", desc: "common lead-in phrase" },
    { name: "Gadigana", desc: "rolling bass-led phrase" },
  ]},
];

/* ------------------------------------------------------------------- TAALS
   Each beat: { b: bol, m?: vibhag marker (X=sam, 2/3/4=tali, 0=khali) }      */
export const taals = [
  { id: "tintal", name: "Tintāl (Trital)", matras: 16, structure: "4 + 4 + 4 + 4",
    note: "The most common cycle in Hindustani music and the usual first taal. Three claps and one wave (khali on beat 9). Below, a clear theka lesson by Sandeep Das.",
    beats: [
      { b: "Dhā", m: "X" }, { b: "Dhin" }, { b: "Dhin" }, { b: "Dhā" },
      { b: "Dhā", m: "2" }, { b: "Dhin" }, { b: "Dhin" }, { b: "Dhā" },
      { b: "Dhā", m: "0" }, { b: "Tin" }, { b: "Tin" }, { b: "Tā" },
      { b: "Tā", m: "3" }, { b: "Dhin" }, { b: "Dhin" }, { b: "Dhā" },
    ],
    video: { id: "8_BVZdJN78E" } },
  { id: "rupak", name: "Rupak", matras: 7, structure: "3 + 2 + 2",
    note: "Unusual in that the cycle begins on a khali (an open, un-clapped sam) rather than a strong clap.",
    beats: [
      { b: "Tin", m: "X" }, { b: "Tin" }, { b: "Nā" },
      { b: "Dhin", m: "2" }, { b: "Nā" },
      { b: "Dhin", m: "3" }, { b: "Nā" },
    ],
    video: { id: "w9Xc5IFfHq0" } },
  { id: "jhaptal", name: "Jhaptāl", matras: 10, structure: "2 + 3 + 2 + 3",
    note: "A graceful ten-beat cycle with its khali falling on beat 6. Below, a Jhaptāl solo by Pandit Anindo Chatterjee.",
    beats: [
      { b: "Dhin", m: "X" }, { b: "Nā" },
      { b: "Dhin", m: "2" }, { b: "Dhin" }, { b: "Nā" },
      { b: "Tin", m: "0" }, { b: "Nā" },
      { b: "Dhin", m: "3" }, { b: "Dhin" }, { b: "Nā" },
    ],
    video: { id: "u1m3mFaFPVc" } },
  { id: "ektal", name: "Ektāl", matras: 12, structure: "2 × 6",
    note: "A twelve-beat cycle widely used for slow, expansive khyal vocal music.",
    beats: [
      { b: "Dhin", m: "X" }, { b: "Dhin" },
      { b: "Dhāge", m: "0" }, { b: "Tirakiṭa" },
      { b: "Tū", m: "2" }, { b: "Nā" },
      { b: "Kat", m: "0" }, { b: "Tā" },
      { b: "Dhāge", m: "3" }, { b: "Tirakiṭa" },
      { b: "Dhin", m: "4" }, { b: "Nā" },
    ],
    video: { id: "6ayy4BhKkX8" } },
  { id: "kaharwa", name: "Kaharwā", matras: 8, structure: "4 + 4",
    note: "A light-classical / folk cycle of eight beats. (There is no single “standard” Kaharwa theka, many variants exist.)",
    beats: [
      { b: "Dhā", m: "X" }, { b: "Ge" }, { b: "Nā" }, { b: "Tin" },
      { b: "Nā", m: "0" }, { b: "Ke" }, { b: "Dhin" }, { b: "Nā" },
    ],
    video: { id: "s3Xf_qvZKpM" } },
  { id: "dadra", name: "Dādrā", matras: 6, structure: "3 + 3",
    note: "A six-beat light-classical cycle, common under thumri and bhajan.",
    beats: [
      { b: "Dhā", m: "X" }, { b: "Dhin" }, { b: "Nā" },
      { b: "Dhā", m: "0" }, { b: "Tin" }, { b: "Nā" },
    ],
    video: { id: "ZvlnPh1Zz3Y" } },
];

/* --------------------------------------------------------------- GHARANAS */
export const gharanas = [
  { name: "Dilli (Delhi)", when: "c. 1700", note: "The foundational school: delicate, refined, nimble two-finger technique played at the rim. Originated the kayda and the peshkar." },
  { name: "Lucknow", when: "c. 1770", note: "Grew out of Dilli with kathak-dance influence; developed gats, tukras and parans, and pioneered the bold, open “purab” (eastern) style." },
  { name: "Ajrara", when: "c. 1800", note: "Close to Dilli, famous for distinctive kaydas in a particular rhythmic gait now borrowed across all gharanas." },
  { name: "Farrukhabad", when: "c. 1780", note: "From Lucknow; prized for balancing Dilli’s refinement with eastern boldness across gats, tukras, relas and chalans." },
  { name: "Benares (Banaras)", when: "c. 1830", note: "Strongly pakhawaj-influenced eastern style, rich in tukras, gats, uthan, paran and the guarded fard form." },
  { name: "Punjab", when: "c. 1810", note: "Adapted to the Tabla from the Lahore pakhawaj tradition; a “mathematical” approach with gats, relas and unusual phrase divisions." },
];

/* -------------------------------------------------------- COMPOSITION FORMS
   Videos are performances by named maestros. The two Yogesh Samsi "Tabla
   Series" solos (2gwswbOb8qA, ifhEMnUsul0) name each section in their titles,
   so they double as clear references for the forms they contain.             */
export const forms = [
  { name: "Peshkar", tagline: "the opening", desc: "The slow, improvisatory “presentation” that opens a solo, a core theme gradually expanded with phrases and incomplete tihais before the kayda begins.", artist: "Pandit Yogesh Samsi", video: { id: "2gwswbOb8qA" } },
  { name: "Kayda", tagline: "rule / system", desc: "The central theme-and-variation form. A fixed theme (mukh) is developed through systematic variations (paltas) built only from its own bols, resolving with a tihai.", artist: "Ustad Zakir Hussain", video: { id: "FnRQmM-v3HQ" } },
  { name: "Rela", tagline: "a torrent", desc: "Like a kayda but built for speed, smooth, flowing, interwoven fast phrases such as tirakiṭa and dheradhera.", artist: "Pt. Yogesh Samsi & Pt. Subhankar Banerjee", video: { id: "xwjalB8LgeU" } },
  { name: "Gat", tagline: "a fixed piece", desc: "A fixed, often cyclic composition at medium-to-fast tempo, strongest in the eastern gharanas.", artist: "Pandit Yogesh Samsi", video: { id: "2gwswbOb8qA" } },
  { name: "Tukra", tagline: "a fragment", desc: "A short fixed cadence: an opening (mukhra) that builds asymmetrically to sam and resolves with a tihai.", artist: "Pandit Yogesh Samsi", video: { id: "ifhEMnUsul0" } },
  { name: "Chakradar", tagline: "a spiral", desc: "A tukra or tihai played three times in succession; the ending “spirals” through the cycle and lands on sam only on the third pass.", artist: "Pandit Yogesh Samsi", video: { id: "2gwswbOb8qA" } },
  { name: "Paran", tagline: "from the pakhawaj", desc: "A powerful composition drawn from the pakhawaj tradition, strong, loud, open strokes and a less-inflected bass.", artist: "Pandit Yogesh Samsi", video: { id: "2gwswbOb8qA" } },
  { name: "Uthan", tagline: "to rise", desc: "An introductory piece that opens a solo or the Tabla’s entry in accompaniment, ending on a tihai at sam.", artist: "Pandit Yogesh Samsi", video: { id: "ifhEMnUsul0" } },
  { name: "Tihai", tagline: "three times", desc: "Any phrase repeated three times so the final stroke lands on sam. “Damdar” tihais leave rests between repetitions; “bedam” tihais have none.", artist: "Shubhendu Sarkar", video: { id: "M5iZzAaNOZU" } },
  { name: "Laggi", tagline: "linked & fast", desc: "Short, fast, repetitive patterns used in light-classical genres (thumri, bhajan, ghazal), usually in Kaharwa or Dadra.", artist: "Pandurang Pawar", video: { id: "tZRHYqfoFIU" } },
];

export const moreForms =
  "Other forms you’ll meet include the bant and chalan (developmental), the gat-kayda hybrid, the mukhra/mohra (a short fill to sam), the fard (a guarded Benares cadence), and the nauhakka, an extended tihai of nine repetitions.";

/* A couple of the form references are drawn from the two labelled Yogesh Samsi
   solos; this note makes that explicit under the grid. */
export const formsNote =
  "Several examples above are drawn from two complete solos by Pandit Yogesh Samsi, their video titles list each section in order, so you can jump straight to the form you want to hear.";

/* ----------------------------------------------- FULL SOLO LISTENING REFS
   Complete solos by named maestros, to study the whole arc of a performance. */
export const solos = [
  { id: "2gwswbOb8qA", title: "Pandit Yogesh Samsi, Teentāl Solo", note: "A complete solo whose titled sections move through peshkar, kayda, rela, gat, tukra, paran, laggi and chakradar, the whole arc in one sitting." },
  { id: "BWVolb7wQgw", title: "Ustad Zakir Hussain, Teentāl Solo", note: "The modern era’s most celebrated tabla virtuoso, in a full 16-beat solo." },
  { id: "D-V5h-LtXms", title: "Pandit Anindo Chatterjee, Tintāl Solo", note: "A Farrukhabad-gharana master; crystalline clarity across a complete solo." },
  { id: "C8ni93nnfIc", title: "Pandit Suresh Talwalkar, Tabla Solo", note: "A towering soloist, live at the Saptak Festival, with his son Satyajit." },
  { id: "qrBQhgOkaB8", title: "Pandit Subhankar Banerjee, Tabla Solo", note: "A powerful, deeply musical soloist in full flight." },
];

/* ------------------------------------------- LEARN FROM A MASTER (Y. Samsi)
   Pandit Yogesh Samsi's own instructional videos, one of Ajinkya's gurus,    grouped from "start here" through technique to mastery. All embeddable.    */
export const samsiIntro =
  "Pandit Yogesh Samsi, one of the foremost tabla maestros of his generation, and one of Ajinkya's own gurus, shares a wealth of teaching on his YouTube channel. Here is a curated path through it, from first steps to the finer points of technique and musicianship.";

export const samsiSeries = [
  {
    theme: "Start here",
    items: [
      { id: "bTBBT7L9xS4", title: "Basic Syllables of the Tabla", note: "The fundamental bols, taught from scratch for absolute beginners." },
      { id: "0NHgNFOHecs", title: "No Time to Practice? A Word of Advice", note: "How to keep growing on the tabla when life is busy, on making practice count." },
    ],
  },
  {
    theme: "Technique & tone",
    items: [
      { id: "ltKch2qxiRs", title: "Improving Your Bayan Sound, “GheGhe”", note: "An exercise to build finger attack and a strong, consistent bass tone." },
      { id: "0QzfqL_I1jI", title: "Balancing the Tabla & Bayan Hands", note: "Building coordination and equilibrium between the right and left hands." },
      { id: "s-u9Df-OKeQ", title: "The “DhereDhere” Technique", note: "An easy, effective rela and a fresh way to play DhereDhere cleanly." },
      { id: "Ulse_l2AFmQ", title: "The Bayan’s Role in TeReKeTe Relas", note: "How the bass drum shapes and drives fast rolling phrases." },
      { id: "rDLgPwQIQZY", title: "Advanced Bayan Technique, Delhi Gharana", note: "Refined bayan technique applied to a kaida from the Habibuddin Khan legacy." },
    ],
  },
  {
    theme: "Compositions & mastery",
    items: [
      { id: "NyMcA14Iw3w", title: "Exploring an Ajrada Gharana Qaida", note: "A full breakdown of a qaida and how its theme is developed." },
      { id: "CvbCGiuIOkw", title: "The Art of Tabla, Masterclass", note: "From his masterclass: part teaching, part demonstration of the instrument’s depth." },
      { id: "88D81jLyETo", title: "How to Accompany on Tabla", note: "Pandit Yogesh Samsi with Pandit Suresh Talwalkar on the art of accompaniment (sangat)." },
    ],
  },
];

/* Table of contents, ids must match each section id on the page. */
export const TOC = [
  { id: "what-is", label: "What is the Tabla?" },
  { id: "history", label: "A Brief History" },
  { id: "anatomy", label: "The Two Drums" },
  { id: "bols", label: "The Spoken Language" },
  { id: "taal", label: "Taal & Theka" },
  { id: "forms", label: "The Compositions" },
  { id: "gharanas", label: "The Six Gharanas" },
  { id: "baj", label: "Playing Styles" },
  { id: "notation", label: "Reading the Rhythm" },
  { id: "practice", label: "Practice on Your Own" },
  { id: "listen", label: "Solos to Study" },
  { id: "masterclass", label: "Learn from a Master" },
];
