import { createClient } from "@/lib/supabase/server";
import AppointmentCard from "@/components/AppointmentCard";
import Reveal from "@/components/Reveal";
import { MEET_URL } from "@/lib/config";
import { CalendarClock, Video } from "lucide-react";

export const metadata = { title: "My Lessons — ARTS" };

export default async function MyLessonsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cutoff = new Date(Date.now() - 3600000).toISOString(); // include one just-started
  const { data: appts = [] } = await supabase
    .from("appointments")
    .select("id, starts_at, duration_min, note")
    .eq("student_id", user?.id)
    .gte("starts_at", cutoff)
    .order("starts_at", { ascending: true });

  const lessons = appts ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-600">
          One-on-one lessons
        </p>
        <h1 className="font-display text-3xl text-indigo-900 md:text-4xl">My Lessons</h1>
        <p className="mt-2 text-indigo-500">
          Your scheduled lessons with your teacher. Add them to your calendar and
          join on the same Google Meet link.
        </p>
        <div className="gold-rule mt-3" />
      </div>

      {lessons.length === 0 ? (
        <div className="surface grid place-items-center gap-3 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-cream-200 text-indigo-400">
            <CalendarClock size={26} />
          </span>
          <p className="font-medium text-indigo-700">No lessons scheduled yet</p>
          <p className="max-w-sm text-sm text-indigo-500">
            Your teacher will schedule your lessons — they’ll appear here with a
            calendar-add option and your meeting link.
          </p>
          <a href={MEET_URL} target="_blank" rel="noreferrer" className="btn-outline mt-2">
            <Video size={16} /> Your lesson room
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((appt, i) => (
            <Reveal key={appt.id} delay={i * 60}>
              <AppointmentCard appt={appt} studentEmail={user?.email || ""} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
