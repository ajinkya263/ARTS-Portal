import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, NotebookPen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import StudentNotes from "@/components/admin/StudentNotes";

export const metadata = { title: "Student Notes, ARTS" };

export default async function NotesPage({ searchParams }) {
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

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, email")
    .eq("role", "student")
    .order("full_name");

  const studentId = searchParams?.student || "";

  let notes = [];
  let appointments = [];
  if (studentId) {
    const [{ data: n }, { data: appts }] = await Promise.all([
      supabase
        .from("student_notes")
        .select("id, body, created_at, updated_at, appointment_id")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false }),
      supabase
        .from("appointments")
        .select("id, starts_at, mode")
        .eq("student_id", studentId)
        .order("starts_at", { ascending: false })
        .limit(40),
    ]);
    notes = n ?? [];
    appointments = appts ?? [];
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-indigo-500 transition hover:text-indigo-700"
        >
          <ArrowLeft size={15} /> Back to Admin Console
        </Link>
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1 text-xs font-semibold text-cream-50">
          <NotebookPen size={13} /> Class Notes
        </p>
        <h1 className="font-display text-3xl text-indigo-900 md:text-4xl">
          Student Notes
        </h1>
        <p className="mt-2 text-indigo-500">
          Keep a running log of what each student has covered and completed in class.
        </p>
        <div className="gold-rule mt-3" />
      </div>

      <StudentNotes
        students={users ?? []}
        selectedId={studentId}
        notes={notes}
        appointments={appointments}
      />
    </div>
  );
}
