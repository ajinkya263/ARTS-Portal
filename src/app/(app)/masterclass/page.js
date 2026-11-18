import { Youtube, GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";
import VideoEmbed from "@/components/learn/VideoEmbed";
import { samsiIntro, samsiSeries, ytWatch } from "@/lib/learn/guide";

export const metadata = { title: "Learn from a Master, ARTS" };

/**
 * Curated Pandit Yogesh Samsi teaching videos, inside the portal for current
 * students. Mirrors the "Learn from a Master" section of the public /learn page.
 * Gated by the (app) layout, which redirects unauthenticated visitors to login.
 */
export default function MasterclassPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <section className="surface relative mb-8 overflow-hidden p-8 md:p-10">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-600">
          <GraduationCap size={14} /> From the masters
        </p>
        <h1 className="font-display text-3xl text-indigo-900 md:text-4xl">
          Learn from a Master
        </h1>
        <p className="mt-3 max-w-2xl text-indigo-500">{samsiIntro}</p>
      </section>

      {samsiSeries.map((group, gi) => (
        <section key={group.theme} className="mb-10">
          <h2 className="mb-1 font-display text-xl text-indigo-800">{group.theme}</h2>
          <div className="gold-rule mb-4" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((v, i) => (
              <Reveal key={v.id} delay={i * 60} className="h-full">
                <div className="surface flex h-full flex-col overflow-hidden">
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
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-2 text-xs leading-relaxed text-indigo-400">
        Videos are hosted on YouTube by their respective artists and are shared here for study and listening.
      </p>
    </div>
  );
}
