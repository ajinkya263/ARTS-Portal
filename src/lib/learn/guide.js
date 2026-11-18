/* =============================================================================
   LEARN TABLA  ·  content for the free, self-paced guide at /learn
   -----------------------------------------------------------------------------
   General educational material on North Indian classical Tabla. This page is a
   free, text-based reference anyone can read on their own time — it is separate
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
  { name: "Syāhī", tag: "the black circle", def: "The black tuning patch of iron filings and paste at the centre of each head — the source of the Tabla’s clear, pitched tone." },
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
    note: "The most common cycle in Hindustani music and the usual first taal. Three claps and one wave (khali on beat 9).",
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
    note: "A graceful ten-beat cycle with its khali falling on beat 6.",
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
    note: "A light-classical / folk cycle of eight beats. (There is no single “standard” Kaharwa theka — many variants exist.)",
    beats: [
      { b: "Dhā", m: "X" }, { b: "Ge" }, { b: "Nā" }, { b: "Tin" },
      { b: "Nā", m: "0" }, { b: "Ke" }, { b: "Dhin" }, { b: "Nā" },
    ],
    video: { search: "kaharwa taal 8 beat theka tabla demonstration" } },
  { id: "dadra", name: "Dādrā", matras: 6, structure: "3 + 3",
    note: "A six-beat light-classical cycle, common under thumri and bhajan.",
    beats: [
      { b: "Dhā", m: "X" }, { b: "Dhin" }, { b: "Nā" },
      { b: "Dhā", m: "0" }, { b: "Tin" }, { b: "Nā" },
    ],
    video: { search: "dadra taal 6 beat theka tabla demonstration" } },
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

/* -------------------------------------------------------- COMPOSITION FORMS */
export const forms = [
  { name: "Peshkar", tagline: "the opening", desc: "The slow, improvisatory “presentation” that opens a solo — a core theme gradually expanded with phrases and incomplete tihais before the kayda begins.", video: { id: "Gn8m0aVTz1E" } },
  { name: "Kayda", tagline: "rule / system", desc: "The central theme-and-variation form. A fixed theme (mukh) is developed through systematic variations (paltas) built only from its own bols, resolving with a tihai.", video: { id: "hisMUu2FHgM" } },
  { name: "Rela", tagline: "a torrent", desc: "Like a kayda but built for speed — smooth, flowing, interwoven fast phrases such as tirakiṭa and dheradhera.", video: { id: "xwjalB8LgeU" } },
  { name: "Gat", tagline: "a fixed piece", desc: "A fixed, often cyclic composition at medium-to-fast tempo, strongest in the eastern gharanas.", video: { id: "bdEM2trJ_tQ" } },
  { name: "Tukra", tagline: "a fragment", desc: "A short fixed cadence: an opening (mukhra) that builds asymmetrically to sam and resolves with a tihai.", video: { id: "TEQe4jk3yXo" } },
  { name: "Chakradar", tagline: "a spiral", desc: "A tukra or tihai played three times in succession; the ending “spirals” through the cycle and lands on sam only on the third pass.", video: { id: "7lgUkZzKQKg" } },
  { name: "Paran", tagline: "from the pakhawaj", desc: "A powerful composition drawn from the pakhawaj tradition — strong, loud, open strokes and a less-inflected bass.", video: { id: "2gwswbOb8qA" } },
  { name: "Uthan", tagline: "to rise", desc: "An introductory piece that opens a solo or the Tabla’s entry in accompaniment, ending on a tihai at sam.", video: { id: "MxKZyg9aZnE" } },
  { name: "Tihai", tagline: "three times", desc: "Any phrase repeated three times so the final stroke lands on sam. “Damdar” tihais leave rests between repetitions; “bedam” tihais have none.", video: { search: "tabla tihai explained teental landing on sam" } },
  { name: "Laggi", tagline: "linked & fast", desc: "Short, fast, repetitive patterns used in light-classical genres (thumri, bhajan, ghazal), usually in Kaharwa or Dadra.", video: { search: "tabla laggi kaharwa dadra thumri demonstration" } },
];

export const moreForms =
  "Other forms you’ll meet include the bant and chalan (developmental), the gat-kayda hybrid, the mukhra/mohra (a short fill to sam), the fard (a guarded Benares cadence), and the nauhakka — an extended tihai of nine repetitions.";

/* ---------------------------------------------- PRACTICE: COMPOSITIONS */
export const compositions = [
  { taal: "Tintāl", items: [
    { name: "Dilli Kayda", form: "Kayda", bols: "Dhāte ṭedhā teṭe dhādhā · teṭe dhādhā tināki ná" },
    { name: "Ajrara Kayda", form: "Kayda", bols: "Dhā — — ghetaka dhinādhin nagina" },
    { name: "Benares Kayda", form: "Kayda", bols: "Dhādhā teṭe dhādhā tūnā" },
    { name: "Benares Rela", form: "Rela", bols: "Dhā — tira kiṭataka tū — nā — kiṭataka" },
    { name: "Benares Tukra", form: "Tukra", bols: "Dhādhā dindin nāná teṭe teṭe" },
    { name: "Benares Chakradar", form: "Chakradar", bols: "Dhāgeteṭe tāgeteṭe kradhā — kra dhā —  (×3 → sam)" },
    { name: "Peshkar (Dilli)", form: "Peshkar", bols: "Dhā — — kra dhā — tira kiṭadhā — tiṭdhā" },
  ]},
  { taal: "Rupak (7)", items: [
    { name: "Rupak Kayda", form: "Kayda", bols: "Dhāge teṭe teṭe" },
    { name: "Rupak Tukra", form: "Tukra", bols: "Dhāgeteṭe kateṭedhe teṭedhāge" },
  ]},
  { taal: "Jhaptāl (10)", items: [
    { name: "Jhaptal Kayda", form: "Kayda", bols: "Dhāge tirakiṭa dhāge nādhā tirakiṭa" },
    { name: "Jhaptal Tukra", form: "Tukra", bols: "Kateṭedhe teṭedhāge teṭe teṭe" },
  ]},
  { taal: "Ektāl (12)", items: [
    { name: "Ektal Kayda", form: "Kayda", bols: "Dhāte ṭedhā gina dhāge tinnā kina" },
    { name: "Ektal Paran", form: "Paran", bols: "Dheṭedheṭe dhāgeteṭe kradheṭete dhāgeteṭe" },
  ]},
  { taal: "Ara Chautāl (14)", items: [
    { name: "Arachartal Kayda", form: "Kayda", bols: "Dhāgetraka dhinagina dhāgenage dhinagina" },
  ]},
  { taal: "Kaharwā / Dādrā (light-classical)", items: [
    { name: "Benares Laggi", form: "Laggi", bols: "Dhāge nādhā getin nara · gina dhādhi geti nara" },
  ]},
];

/* ----------------------------------------------- FULL SOLO LISTENING REFS */
export const solos = [
  { id: "2gwswbOb8qA", title: "Full Tabla Solo in Tintāl", note: "A complete solo that moves through peshkar, kayda, rela, gat, tukra, paran, laggi and chakradar — hear the whole arc in one sitting." },
  { id: "5Sia8V9-VRo", title: "Benares Gharana Solo", note: "A traditional solo in the bold eastern (purab) style." },
  { id: "bGnlvPP_lLQ", title: "A Legendary Tabla Solo", note: "One of the tradition’s great masters in full flight." },
];

/* Table of contents — ids must match each section id on the page. */
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
];
