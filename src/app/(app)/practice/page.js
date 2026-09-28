import Metronome from "@/components/practice/Metronome";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Metronome — ARTS" };

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-600">
          Riyaz tool
        </p>
        <h1 className="font-display text-3xl text-indigo-900 md:text-4xl">Metronome</h1>
        <p className="mx-auto mt-2 max-w-xl text-indigo-500">
          Keep your laya steady. Set the tempo, choose your beats per cycle, and
          practice against a clean, accurate click with an accented sam.
        </p>
        <div className="gold-rule mx-auto mt-3" />
      </div>

      <Reveal>
        <Metronome />
      </Reveal>
    </div>
  );
}
