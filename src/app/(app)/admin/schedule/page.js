import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminSchedule from "@/components/admin/AdminSchedule";

export const metadata = { title: "Schedule — Resonance Studios" };

export default async function SchedulePage() {
  const supabase = createClient();

  // Guard: admins only.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") redirect("/dashboard");

  // Show sessions from the last hour onward (so an in-progress lesson stays visible).
  const cutoff = new Date(Date.now() - 3600000).toISOString();

  // Load students for the picker + upcoming lessons (RLS lets admins read all).
  const [{ data: users }, { data: appointments }] = await Promise.all([
    supabase.from("users").select("id, full_name, email").order("full_name"),
    supabase
      .from("appointments")
      .select(
        "id, starts_at, duration_min, note, student:student_id ( full_name, email )"
      )
      .gte("starts_at", cutoff)
      .order("starts_at", { ascending: true }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-indigo-500 transition hover:text-indigo-700"
        >
          <ArrowLeft size={15} /> Back to Admin Console
        </Link>
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-700 px-3 py-1 text-xs font-semibold text-cream-50">
          <CalendarClock size={13} /> Lesson Scheduling
        </p>
        <h1 className="font-display text-3xl text-indigo-900 md:text-4xl">
          Schedule Lessons
        </h1>
        <p className="mt-2 text-indigo-500">
          Book 1:1 lessons for students and manage upcoming sessions.
        </p>
        <div className="gold-rule mt-3" />
      </div>

      <AdminSchedule users={users ?? []} appointments={appointments ?? []} />
    </div>
  );
}
