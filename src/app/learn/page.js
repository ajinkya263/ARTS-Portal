import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Youtube } from "lucide-react";

import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import VideoEmbed from "@/components/learn/VideoEmbed";
import { PERSONAL_SITE } from "@/lib/config";
import {
  parts, bolFamilies, taals, gharanas, forms, moreForms, formsNote,
  solos, samsiIntro, samsiSeries, TOC, ytWatch, ytSearch,
} from "@/lib/learn/guide";

export const metadata = {
  title: "Learn Tabla, A Free Guide | Ajinkya Ranade Tabla School",
  description:
    "A free, self-paced introduction to the Tabla: the two drums, the bols, taals and thekas, the compositional forms, the gharanas, plus real composition themes to practice and performances to listen to.",
  alternates: { canonical: "https://ajinkyaranademusic.com/learn" },
  openGraph: {
    title: "Learn Tabla, A Free Guide",
    description:
      "A free, self-paced guide to North Indian classical rhythm, the drums, bols, taals, compositional forms, gharanas, and listening references.",
    url: "https://ajinkyaranademusic.com/learn",
    type: "article",
  },
};

/* ---- small presentational helpers (static, server-rendered) ---- */

function ThekaTable({ taal }) {
  return (
    <div className="surface overflow-x-auto p-4">
      <p className="mb-3 font-display text-lg text-indigo-900">
        {taal.name} <span className="text-indigo-400">· {taal.matras} matras · {taal.structure}</span>
      </p>
      <table className="w-full min-w-[460px] border-collapse text-center text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-indigo-300">
            {taal.beats.map((_, i) => (
              <th key={i} className="px-2 py-1 font-medium">{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs font-bold text-saffron-500">
            {taal.beats.map((beat, i) => (
              <td key={i} className="px-2 pt-1">{beat.m || ""}</td>
            ))}
          </tr>
          <tr className="font-display">
            {taal.beats.map((beat, i) => (
              <td
                key={i}
                className={`px-2 py-1.5 ${beat.m === "X" ? "text-saffron-500" : "text-indigo-800"}`}
              >
                {beat.b}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SectionHead({ n, title }) {
  return (
    <>
      <p className="font-display text-sm tracking-wide text-saffron-500">{n}</p>
      <h2 className="mt-1 font-display text-2xl text-indigo-900 sm:text-3xl md:text-4xl">{title}</h2>
      <div className="gold-rule mt-3 max-w-[120px]" />
    </>
  );
}

export default function LearnPage() {
  return (
    <div className="relative">
      {/* top bar */}
      <header className="sticky top-0 z-50 border-b border-cream-200 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-indigo-500 transition hover:text-saffron-600"
          >
            <ArrowLeft size={16} /> Ajinkya Ranade Tabla School
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl bg-saffron-400 px-4 py-2 text-sm font-semibold text-onaccent transition hover:bg-saffron-300 sm:inline-flex"
            >
              Enter the portal
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="bg-cream px-6 pt-16 pb-10">
        <Reveal className="mx-auto max-w-6xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-50">
            Free Resource · Self-Paced
          </p>
          <h1 className="max-w-[16ch] font-display text-4xl leading-tight text-indigo-900 sm:text-5xl md:text-6xl">
            The Language of the Tabla
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-indigo-600">
            A gentle, self-paced introduction to North Indian classical rhythm, the two
            drums, the spoken syllables, the cycles of time, and the compositions built from
            them. No account, no cost. Read it at your own pace.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-indigo-400">
            This is a primer you can explore on your own, separate from the portal’s
            interactive curriculum. When you’re ready to really learn, to be corrected,
            guided, and heard, nothing replaces a teacher.
          </p>
        </Reveal>
      </section>

      {/* body */}
      <section className="bg-cream px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_1fr]">
          {/* sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 border-l border-cream-200 pl-5">
              <p className="mb-4 text-[11px] uppercase tracking-widest text-indigo-300">On this page</p>
              <ol className="space-y-2.5">
                {TOC.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="group flex text-sm text-indigo-500 transition hover:text-saffron-600">
                      <span className="mr-2 font-display text-xs text-saffron-500">{String(i + 1).padStart(2, "0")}</span>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* article */}
          <div className="min-w-0 max-w-3xl">
            {/* 1, what is */}
            <Reveal as="section" id="what-is" className="scroll-mt-24 border-t border-cream-200 py-8 first:border-0 first:pt-0">
              <SectionHead n="01" title="What is the Tabla?" />
              <div className="mt-5 space-y-4 text-indigo-600">
                <p>
                  The <strong className="text-indigo-900">Tabla</strong> is the leading percussion instrument of North
                  Indian (Hindustani) classical music, a pair of hand drums that speak an astonishingly rich rhythmic
                  language. What sets it apart from drumming traditions around the world is its clear, bell-like tone, its
                  intricate phrasing, and the sensuous, pitch-bending inflection of its bass.
                </p>
                <p>
                  The Tabla lives in two roles. It <em>accompanies</em> singers, instrumentalists and dancers, holding
                  time and conversing with the melody, and it stands alone in a tradition of <em>solo</em> playing that is
                  unusual among the world’s drums. That repertoire is organised around rhythmic cycles called{" "}
                  <strong className="text-indigo-900">taals</strong>, built from a vocabulary of spoken strokes called{" "}
                  <strong className="text-indigo-900">bols</strong>, and shaped into forms like the kayda, rela, peshkar and tukra.
                </p>
              </div>
            </Reveal>

            {/* 2, history */}
            <Reveal as="section" id="history" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="02" title="A Brief History" />
              <div className="mt-5 space-y-4 text-indigo-600">
                <p>
                  Although Indian classical music is ancient, the Tabla itself is relatively young, most likely emerging in
                  South Asia between the late 1600s and the late 1700s. It is thought to have evolved from several sources,
                  including Persian-derived drums such as the <em>naqqara</em> and indigenous instruments like the{" "}
                  <em>pakhawaj</em>, <em>dholak</em> and <em>duggi</em>. The name may come from the Arabic <em>tabl</em>,
                  simply meaning “drum.”
                </p>
                <p>
                  A popular legend credits the 13th-century poet-musician Amir Khusro with splitting a pakhawaj into two
                  drums, though no historical evidence supports it. What is clearer is that the Tabla rose to prominence as
                  the chief accompaniment to <em>khyal</em>, the great vocal genre of the Mughal era, and that by the
                  1700s–1800s the tradition had organised itself into hereditary lineages: the{" "}
                  <strong className="text-indigo-900">gharanas</strong>.
                </p>
              </div>
            </Reveal>

            {/* 3, anatomy */}
            <Reveal as="section" id="anatomy" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="03" title="The Two Drums" />
              <p className="mt-5 text-indigo-600">
                A Tabla set is a pair. The <strong className="text-indigo-900">dāyā</strong> (right hand) is the smaller,
                wooden, higher-pitched drum; the <strong className="text-indigo-900">bāyā</strong> (left hand) is the larger
                metal bass drum, whose pitch you bend by pressing with the heel of the palm.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {parts.map((p) => (
                  <div key={p.name} className="surface p-4">
                    <p className="font-display text-lg text-indigo-900">
                      {p.name} <span className="text-xs font-normal tracking-wide text-saffron-500">{p.tag}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-indigo-500">{p.def}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-r-xl border-l-2 border-saffron-400 bg-saffron-50 px-4 py-3 text-sm leading-relaxed text-indigo-700">
                The dark circle at the centre, the <strong className="text-saffron-600">syāhī</strong>, is what gives the
                Tabla its singing, tuned tone. It’s the heart of the instrument’s voice.
              </p>
            </Reveal>

            {/* 4, bols */}
            <Reveal as="section" id="bols" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="04" title="Bols, The Spoken Language" />
              <div className="mt-5 space-y-4 text-indigo-600">
                <p>
                  <strong className="text-indigo-900">Bols</strong> are the onomatopoeic syllables of the Tabla, words like{" "}
                  <em>dhā, dhin, nā, tin</em> and <em>tirakiṭa</em>, each one naming a specific stroke and its sound. Spoken
                  in sequence, they mirror what the hands play. Bols are at once the Tabla’s oral language and its written notation.
                </p>
                <p>
                  A guiding idea runs through the whole tradition: <em>to play well, you must first learn to speak well.</em>{" "}
                  Students recite their compositions aloud, a practice called <strong className="text-indigo-900">padhant</strong>,                   and the accent and flow of that recitation directly shapes the quality of the playing.
                </p>
              </div>
              <div className="mt-5 space-y-4">
                {bolFamilies.map((fam) => (
                  <div key={fam.label}>
                    <p className="mb-2 text-sm font-semibold text-indigo-800">{fam.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {fam.bols.map((b) => (
                        <div key={b.name} className="surface min-w-[96px] px-3 py-2">
                          <p className="font-display text-base text-indigo-900">{b.name}</p>
                          <p className="text-[11px] leading-snug text-indigo-400">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* 5, taal */}
            <Reveal as="section" id="taal" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="05" title="Taal & Theka, Cycles of Time" />
              <p className="mt-5 text-indigo-600">
                A <strong className="text-indigo-900">taal</strong> is a rhythmic cycle; its{" "}
                <strong className="text-indigo-900">theka</strong> is the signature pattern of bols that identifies it. A
                cycle is measured in <strong className="text-indigo-900">matras</strong> (beats), grouped into sections
                marked by claps (<em>tali</em>) and an open wave (<em>khali</em>). The first beat, {" "}
                <strong className="text-indigo-900">sam</strong>, is the strongest, and the point most phrases resolve onto.
                Below, <span className="text-saffron-500">X</span> marks sam, the numerals mark the clapped sections, and{" "}
                <strong className="text-indigo-900">0</strong> marks the khali.
              </p>
              <div className="mt-6 space-y-8">
                {taals.map((t) => (
                  <div key={t.id} className="space-y-3">
                    <ThekaTable taal={t} />
                    <p className="text-sm text-indigo-500">{t.note}</p>
                    <div className="surface overflow-hidden">
                      <VideoEmbed video={t.video} title={`${t.name} theka`} />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* 6, forms */}
            <Reveal as="section" id="forms" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="06" title="The Compositions" />
              <p className="mt-5 text-indigo-600">
                Within a taal, the Tabla’s repertoire takes shape as a set of <strong className="text-indigo-900">forms</strong>.
                Some are theme-and-variation structures that grow and breathe; others are fixed cadences that build to a
                landing on sam. Here are the ones at the core of a solo, tap any card to hear it.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {forms.map((f) => (
                  <div key={f.name} className="surface flex flex-col overflow-hidden">
                    <VideoEmbed video={f.video} title={`${f.name}${f.artist ? `, ${f.artist}` : ", tabla"}`} />
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-display text-lg text-indigo-900">{f.name}</p>
                        <span className="rounded-full border border-saffron-300 px-2 py-0.5 text-[10px] uppercase tracking-wide text-saffron-600">
                          {f.tagline}
                        </span>
                      </div>
                      {f.artist && (
                        <p className="-mt-1 text-xs font-medium text-saffron-600">{f.artist}</p>
                      )}
                      <p className="text-sm leading-relaxed text-indigo-500">{f.desc}</p>
                      <a
                        href={f.video.id ? ytWatch(f.video.id) : ytSearch(f.video.search)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-saffron-600 hover:underline"
                      >
                        <Youtube size={15} /> Watch on YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-indigo-500">{moreForms}</p>
              <p className="mt-3 text-sm italic text-indigo-400">{formsNote}</p>
            </Reveal>

            {/* 7, gharanas */}
            <Reveal as="section" id="gharanas" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="07" title="The Six Gharanas" />
              <p className="mt-5 text-indigo-600">
                A <strong className="text-indigo-900">gharana</strong> is an oral lineage or “school”, from <em>ghar</em>,
                meaning house, that passes down its own compositions, playing style and stroke technique across
                generations, traditionally through the close relationship of <em>guru</em> and <em>shishya</em>. Six major
                gharanas are recognised.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {gharanas.map((g) => (
                  <div key={g.name} className="surface p-4">
                    <p className="font-display text-lg text-indigo-900">
                      {g.name} <span className="text-xs font-normal tracking-wide text-saffron-500">{g.when}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-indigo-500">{g.note}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* 8, baj */}
            <Reveal as="section" id="baj" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="08" title="Baj, Playing Styles" />
              <div className="mt-5 space-y-4 text-indigo-600">
                <p>
                  <strong className="text-indigo-900">Baj</strong> means “style.” It describes two broad approaches to
                  touch. <strong className="text-indigo-900">Dilli baj</strong> (the closed, two-finger style) plays the
                  primary strokes at the rim with individual fingers, lighter, more refined, prizing clarity and restraint.{" "}
                  <strong className="text-indigo-900">Purab baj</strong> (the eastern, open style) plays further inside the
                  head with the fingers together, fuller, bolder, more powerful, and richer in pakhawaj-derived material.
                </p>
                <p>
                  The word also describes the overall character of a gharana. Most players today study both, the refinement
                  of the one and the power of the other.
                </p>
              </div>
            </Reveal>

            {/* 9, notation */}
            <Reveal as="section" id="notation" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="09" title="Reading the Rhythm" />
              <div className="mt-5 space-y-4 text-indigo-600">
                <p>
                  Tabla is written through its bols, usually in a modified <strong className="text-indigo-900">Bhatkhande</strong>{" "}
                  system. Each matra holds a group of syllables, one syllable fills the whole beat, two syllables split it in
                  half, four divide it into quarters, and so on. A dash “–” marks a silence or a held sound lasting one
                  syllable’s worth of time.
                </p>
                <p>
                  Vibhags are marked with <strong className="text-indigo-900">X</strong> for sam, numerals for the clapped
                  sections, and <strong className="text-indigo-900">0</strong> for the khali. The transliteration uses long
                  vowels (ā, ī, ū) held a little longer than short ones, and dots beneath letters (ṭ, ḍ, ṛ) for the retroflex
                  strokes. No notation is ever exact, though, which is why listening always comes first.
                </p>
              </div>
            </Reveal>

            {/* 10, practice */}
            <Reveal as="section" id="practice" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="10" title="Practice on Your Own" />
              <p className="mt-5 text-indigo-600">
                You don’t need much to begin, just the drums, a few quiet minutes, and patience. Here’s a simple way to
                work with everything on this page.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  { t: "Speak before you play", d: "Pick a theka from the tables above and recite its bols out loud, clapping the tali and waving the khali. Learn to say it smoothly before your hands touch the drums." },
                  { t: "Play it slowly and cleanly", d: "Produce one clear, resonant sound for each bol at a slow, steady pulse. Clarity comes first, speed takes care of itself later." },
                  { t: "Loop the cycle", d: "Repeat the theka around and around until you feel the sam (beat 1) come back on its own. That internal sense of the cycle is the real goal." },
                  { t: "Then listen", d: "Put on one of the solos below and follow how a master opens slowly, builds, and keeps resolving onto the sam. Your ear learns as much as your hands." },
                ].map((step, i) => (
                  <li key={step.t} className="surface flex gap-4 p-4">
                    <span className="font-display text-2xl leading-none text-saffron-500">{i + 1}</span>
                    <div>
                      <p className="font-display text-lg text-indigo-900">{step.t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-indigo-500">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 rounded-r-xl border-l-2 border-saffron-400 bg-saffron-50 px-4 py-3 text-sm leading-relaxed text-indigo-700">
                Even <strong className="text-saffron-600">20–30 focused minutes a day</strong>, done consistently, will take
                you further than occasional long sessions. Inside the portal, the practice metronome and interactive taal
                trainers make this routine easier to keep.
              </p>
            </Reveal>

            {/* 11, listen */}
            <Reveal as="section" id="listen" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="11" title="Full Solos to Study" />
              <p className="mt-5 text-indigo-600">
                Finally, sit with a complete solo and listen for the journey, how it opens slowly, builds through kaydas and
                relas, and resolves again and again onto sam. This is the best way to train your ear.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {solos.map((s) => (
                  <div key={s.id} className="surface flex flex-col overflow-hidden">
                    <VideoEmbed video={{ id: s.id }} title={s.title} />
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="font-display text-lg text-indigo-900">{s.title}</p>
                      <p className="text-sm leading-relaxed text-indigo-500">{s.note}</p>
                      <a
                        href={ytWatch(s.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-saffron-600 hover:underline"
                      >
                        <Youtube size={15} /> Watch on YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* 12, learn from a master */}
            <Reveal as="section" id="masterclass" className="scroll-mt-24 border-t border-cream-200 py-8">
              <SectionHead n="12" title="Learn from a Master" />
              <p className="mt-5 text-indigo-600">{samsiIntro}</p>
              <div className="mt-6 space-y-8">
                {samsiSeries.map((group) => (
                  <div key={group.theme}>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-saffron-600">
                      {group.theme}
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {group.items.map((v) => (
                        <div key={v.id} className="surface flex flex-col overflow-hidden">
                          <VideoEmbed video={{ id: v.id }} title={v.title} />
                          <div className="flex flex-1 flex-col gap-2 p-4">
                            <p className="font-display text-base text-indigo-900">{v.title}</p>
                            <p className="text-sm leading-relaxed text-indigo-500">{v.note}</p>
                            <a
                              href={ytWatch(v.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-saffron-600 hover:underline"
                            >
                              <Youtube size={15} /> Watch on YouTube
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* closing CTA */}
      <section className="bg-cream px-6 pb-24">
        <Reveal className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-panel to-panel2 px-8 py-16 text-center text-cream-50 shadow-soft">
          <p className="mb-4 inline-block text-3xl text-saffron-400">ॐ</p>
          <h2 className="font-display text-3xl md:text-4xl">A guide can start you. A teacher takes you further.</h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            This page is yours to explore anytime. When you want real guidance, your hands corrected, your ear trained,
            your questions answered, the Ajinkya Ranade Tabla School offers interactive lessons, cycle trainers and 1:1
            classes inside the portal.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-saffron-400 px-6 py-3 font-semibold text-onaccent transition hover:bg-saffron-300"
            >
              Enter the portal <ArrowRight size={16} />
            </Link>
            <a
              href={PERSONAL_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-cream-50/30 px-6 py-3 font-semibold text-cream-50 transition hover:bg-card/10"
            >
              Request access <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-indigo-400">
          This primer is offered for general education on North Indian classical Tabla. Recordings linked here are hosted on
          YouTube by their respective artists and are shared for study and listening.
        </p>
        <Footer />
      </section>
    </div>
  );
}
