import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Drum,
  Repeat,
  Timer,
  CalendarClock,
  TrendingUp,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import HomeHero from "@/components/home/HomeHero";
import HomeQuiz from "@/components/home/HomeQuiz";
import Reveal from "@/components/Reveal";
import AnimatedNumber from "@/components/AnimatedNumber";
import TablaDiagram from "@/components/interactive/TablaDiagram";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ARTS, Ajinkya Ranade Tabla School",
  description:
    "Learn the tabla the right way, bols, taals and kaidas through interactive lessons, cycle trainers and 1:1 guidance. The student portal of Ajinkya Ranade.",
};

const FEATURES = [
  {
    icon: Drum,
    title: "Interactive bol lessons",
    body: "Every bol, Dha, Dhin, Na, Tin and beyond, with its hand, sound, strike zone and technique, one page at a time.",
  },
  {
    icon: Repeat,
    title: "Taal cycle trainers",
    body: "Play Teentaal, Dadra and Bhajani with a built-in metronome. Watch Sam, Taali and Khali light up as the cycle turns.",
  },
  {
    icon: Timer,
    title: "Practice metronome",
    body: "A clean, focused metronome to build steady laya and real riyaz, the heartbeat of every practice session.",
  },
  {
    icon: CalendarClock,
    title: "1:1 lessons, scheduled",
    body: "Book private lessons online or in person, with calendar invites and reminders, now with easy weekly recurring slots.",
  },
  {
    icon: TrendingUp,
    title: "Progress that unlocks",
    body: "Modules open as you grow, your completed lessons are tracked, and your teacher keeps a running log of your journey.",
  },
  {
    icon: BookOpen,
    title: "A real curriculum",
    body: "From your first resonant Dha to full kaidas and light taals, structured, traditional, and built to actually stick.",
  },
];

const STATS = [
  { value: 9, suffix: "", label: "Core bols" },
  { value: 3, suffix: "", label: "Interactive taal trainers" },
  { value: 5, suffix: "+", label: "Learning modules" },
  { value: 13, suffix: "+", label: "Years of lineage" },
];

const JOURNEY = [
  { n: "01", title: "Foundations", body: "Meet the tabla, taal, matra, laya, and a clear, resonant sound for every bol." },
  { n: "02", title: "The Basic Bols", body: "Ta, Tin, Ge, Ka, Dha, Dhin and more, one bol per page, hands and tone." },
  { n: "03", title: "Teentaal", body: "The 16-beat cycle: theka, paltas and the interactive cycle trainer." },
  { n: "04", title: "Kaidas & Improvisation", body: "Theme-and-variation, the heart of solo tabla, developed step by step." },
  { n: "05", title: "Light Taals", body: "Dadra and Bhajani for accompaniment, with their own playable trainers." },
];

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Returning, signed-in users go straight to their portal.
  if (user) redirect("/dashboard");

  return (
    <div className="relative">
      <HomeHero />

      {/* ── Intro: emerges from inside the syahi ───────────────────────── */}
      <section className="relative bg-panel2 px-6 pb-28 pt-24 text-cream-50">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-cream"
          aria-hidden
        />
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-block text-4xl text-saffron-400">ॐ</span>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
            Rhythm is a language.
            <br />
            <span className="text-saffron-300">We teach you to speak it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-indigo-100">
            The Ajinkya Ranade Tabla School is a complete learning portal, a
            curriculum rooted in tradition, delivered through interactive
            lessons, taal trainers and personal 1:1 guidance. You learn to
            recite, to feel the cycle, and to play with clarity.
          </p>
        </Reveal>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14 text-center">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-50"> Everything in one place
            </p>
            <h2 className="font-display text-3xl text-indigo-900 md:text-4xl">
              A whole school, in your pocket
            </h2>
            <div className="gold-rule mx-auto mt-3 max-w-[120px]" />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <article className="card-hover surface h-full p-6">
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <f.icon size={22} />
                  </span>
                  <h3 className="mb-2 font-display text-xl text-indigo-900">
                    {f.title}
                  </h3>
                  <p className="text-indigo-500">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────────────────────────── */}
      <section className="bg-panel px-6 py-16 text-cream-50">
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <p className="font-display text-5xl text-saffron-300">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm uppercase tracking-wide text-indigo-200">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Curriculum / journey ───────────────────────────────────────── */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-saffron-600">
              The path
            </p>
            <h2 className="font-display text-3xl text-indigo-900 md:text-4xl">
              From your first bol to full kaidas
            </h2>
            <div className="gold-rule mt-3 max-w-[120px]" />
            <ol className="mt-8 space-y-6">
              {JOURNEY.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="font-display text-2xl text-saffron-400">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-indigo-900">
                      {step.title}
                    </h3>
                    <p className="text-indigo-500">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120} className="flex justify-center">
            <div className="surface w-full max-w-md px-10 py-8">
              <TablaDiagram showLabels className="w-full overflow-visible" />
              <p className="mt-4 text-center text-sm text-indigo-400">
                Learn every zone of the drum, and the bol that lives there.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Try a quiz (public) ────────────────────────────────────────── */}
      <section className="bg-cream px-6 pb-8 pt-4">
        <div className="mx-auto max-w-2xl">
          <Reveal className="mb-8 text-center">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-saffron-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-onaccent"> Try it now
            </p>
            <h2 className="font-display text-3xl text-indigo-900 md:text-4xl">
              Test your tabla knowledge
            </h2>
            <p className="mt-2 text-indigo-500">
              A taste of the interactive learning inside, no account needed.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <HomeQuiz />
          </Reveal>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-cream px-6 pb-24">
        <Reveal className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-panel to-panel2 px-8 py-16 text-center text-cream-50 shadow-soft">
          <h2 className="font-display text-3xl md:text-4xl">
            Begin your tabla journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Already a student? Step into the portal. New here? Reach out to
            Ajinkya to request access and start learning.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-saffron-400 px-6 py-3 font-semibold text-onaccent transition hover:bg-saffron-300"
            >
              Enter the portal <ArrowRight size={16} />
            </Link>
            <a
              href="https://ajinkyaranade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-cream-50/30 px-6 py-3 font-semibold text-cream-50 transition hover:bg-card/10"
            >
              Request access
            </a>
          </div>
        </Reveal>
        <Footer />
      </section>
    </div>
  );
}
