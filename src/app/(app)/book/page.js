import { createClient } from "@/lib/supabase/server";
import BookingForm from "@/components/BookingForm";
import { TEACHER_NAME } from "@/lib/config";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Book a Lesson — Resonance Studios" };

export default async function BookPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-600">
          One-on-one lessons
        </p>
        <h1 className="font-display text-3xl text-indigo-900 md:text-4xl">
          Book a Lesson with {TEACHER_NAME}
        </h1>
        <p className="mt-2 max-w-2xl text-indigo-500">
          Pick a length and a time. We’ll add it to your calendar with a
          reminder and invite your teacher — all on the same Google Meet link.
        </p>
        <div className="gold-rule mt-3" />
      </div>

      <Reveal>
        <BookingForm studentEmail={user?.email || ""} />
      </Reveal>
    </div>
  );
}
