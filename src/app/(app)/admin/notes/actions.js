"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

/** Add an entry to a student's running class-notes log. */
export async function addStudentNote({ studentId, body, appointmentId }) {
  const supabase = createClient();
  const admin = await requireAdmin(supabase);

  const text = (body || "").trim();
  if (!studentId) return { ok: false, error: "No student selected." };
  if (!text) return { ok: false, error: "Note is empty." };

  const { error } = await supabase.from("student_notes").insert({
    student_id: studentId,
    body: text,
    appointment_id: appointmentId || null,
    author_id: admin.id,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/notes");
  return { ok: true };
}

/** Edit an existing log entry. */
export async function updateStudentNote({ id, body }) {
  const supabase = createClient();
  await requireAdmin(supabase);

  const text = (body || "").trim();
  if (!text) return { ok: false, error: "Note is empty." };

  const { error } = await supabase
    .from("student_notes")
    .update({ body: text })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/notes");
  return { ok: true };
}

/** Delete a log entry. */
export async function deleteStudentNote(id) {
  const supabase = createClient();
  await requireAdmin(supabase);

  const { error } = await supabase.from("student_notes").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/notes");
  return { ok: true };
}
