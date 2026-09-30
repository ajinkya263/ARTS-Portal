"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, lessonScheduledEmail, lessonCancelledEmail } from "@/lib/email";

/** Throws unless the current session belongs to an admin. Returns the admin user. */
async function requireAdmin(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Admins only");
  return user;
}

/** Re-render the surfaces that read appointments. */
function revalidateSchedule() {
  revalidatePath("/admin/schedule");
  revalidatePath("/book");
}

/** Schedule a 1:1 lesson for a student. */
export async function createAppointment({
  studentId,
  startsAt,
  durationMin,
  note,
  mode,
  location,
}) {
  const supabase = createClient();
  const admin = await requireAdmin(supabase);

  const inPerson = mode === "in_person";
  const { error } = await supabase.from("appointments").insert({
    student_id: studentId,
    starts_at: startsAt,
    duration_min: Number(durationMin),
    note: note || null,
    mode: inPerson ? "in_person" : "online",
    location: inPerson ? location || null : null,
    created_by: admin.id,
  });
  if (error) return { ok: false, error: error.message };

  // Notify the student by email (best-effort — never blocks scheduling).
  try {
    const { data: student } = await supabase
      .from("users")
      .select("email, full_name")
      .eq("id", studentId)
      .single();
    if (student?.email) {
      const mail = lessonScheduledEmail({
        studentName: student.full_name,
        startsAt,
        durationMin,
        note,
        mode: inPerson ? "in_person" : "online",
        location,
      });
      await sendEmail({ to: student.email, ...mail });
    }
  } catch {
    // ignore email failures
  }

  revalidateSchedule();
  return { ok: true };
}

/** Cancel a previously scheduled lesson. */
export async function deleteAppointment(id) {
  const supabase = createClient();
  await requireAdmin(supabase);

  // Grab details before deleting so we can notify the student.
  const { data: appt } = await supabase
    .from("appointments")
    .select("starts_at, student:student_id ( email, full_name )")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  try {
    if (appt?.student?.email) {
      const mail = lessonCancelledEmail({
        studentName: appt.student.full_name,
        startsAt: appt.starts_at,
      });
      await sendEmail({ to: appt.student.email, ...mail });
    }
  } catch {
    // ignore email failures
  }

  revalidateSchedule();
  return { ok: true };
}
