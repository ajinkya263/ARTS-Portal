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

/** Re-render the surfaces that read appointments. */
function revalidateSchedule() {
  revalidatePath("/admin/schedule");
  revalidatePath("/book");
}

/** Schedule a 1:1 lesson for a student. */
export async function createAppointment({ studentId, startsAt, durationMin, note }) {
  const supabase = createClient();
  const admin = await requireAdmin(supabase);

  const { error } = await supabase.from("appointments").insert({
    student_id: studentId,
    starts_at: startsAt,
    duration_min: Number(durationMin),
    note: note || null,
    created_by: admin.id,
  });
  if (error) return { ok: false, error: error.message };

  revalidateSchedule();
  return { ok: true };
}

/** Cancel a previously scheduled lesson. */
export async function deleteAppointment(id) {
  const supabase = createClient();
  await requireAdmin(supabase);

  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateSchedule();
  return { ok: true };
}
