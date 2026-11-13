"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  NotebookPen,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  CalendarClock,
  User,
} from "lucide-react";
import {
  addStudentNote,
  updateStudentNote,
  deleteStudentNote,
} from "@/app/(app)/admin/notes/actions";

function fmtDate(iso, withTime = true) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}

export default function StudentNotes({
  students = [],
  selectedId = "",
  notes = [],
  appointments = [],
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [body, setBody] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState("");

  const selected = students.find((s) => s.id === selectedId);

  const apptById = useMemo(() => {
    const map = {};
    for (const a of appointments) map[a.id] = a;
    return map;
  }, [appointments]);

  const summary = useMemo(() => {
    if (!notes.length) return null;
    const dates = notes.map((n) => new Date(n.created_at).getTime());
    return {
      count: notes.length,
      first: new Date(Math.min(...dates)).toISOString(),
      last: new Date(Math.max(...dates)).toISOString(),
    };
  }, [notes]);

  function pickStudent(id) {
    setError("");
    setEditingId(null);
    router.push(id ? `/admin/notes?student=${id}` : "/admin/notes");
  }

  function add() {
    setError("");
    startTransition(async () => {
      const res = await addStudentNote({
        studentId: selectedId,
        body,
        appointmentId: appointmentId || null,
      });
      if (!res?.ok) return setError(res?.error || "Could not save note.");
      setBody("");
      setAppointmentId("");
      router.refresh();
    });
  }

  function saveEdit(id) {
    setError("");
    startTransition(async () => {
      const res = await updateStudentNote({ id, body: editBody });
      if (!res?.ok) return setError(res?.error || "Could not update note.");
      setEditingId(null);
      router.refresh();
    });
  }

  function remove(id) {
    if (!confirm("Delete this note? This cannot be undone.")) return;
    setError("");
    startTransition(async () => {
      const res = await deleteStudentNote(id);
      if (!res?.ok) return setError(res?.error || "Could not delete note.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Student picker */}
      <div className="surface p-5">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-indigo-500">
          <User size={13} className="mr-1 inline" /> Student
        </label>
        <select
          value={selectedId}
          onChange={(e) => pickStudent(e.target.value)}
          className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-indigo-900 outline-none transition focus:border-saffron-400"
        >
          <option value="">Select a student…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name || s.email}
            </option>
          ))}
        </select>
      </div>

      {!selectedId && (
        <div className="surface flex flex-col items-center gap-2 py-12 text-center text-indigo-400">
          <NotebookPen size={28} />
          <p>Choose a student to view and add class notes.</p>
        </div>
      )}

      {selectedId && (
        <>
          {/* Summary */}
          <div className="surface flex flex-wrap items-center gap-x-8 gap-y-3 p-5">
            <div>
              <p className="font-display text-2xl text-indigo-800">
                {summary?.count ?? 0}
              </p>
              <p className="text-xs uppercase tracking-wide text-indigo-400">
                Log entries
              </p>
            </div>
            {summary && (
              <>
                <div>
                  <p className="font-medium text-indigo-800">
                    {fmtDate(summary.first, false)}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-indigo-400">
                    First note
                  </p>
                </div>
                <div>
                  <p className="font-medium text-indigo-800">
                    {fmtDate(summary.last, false)}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-indigo-400">
                    Most recent
                  </p>
                </div>
              </>
            )}
            <div className="ml-auto text-right">
              <p className="font-medium text-indigo-800">
                {selected?.full_name || selected?.email}
              </p>
              <p className="text-xs text-indigo-400">{selected?.email}</p>
            </div>
          </div>

          {/* Composer */}
          <div className="surface p-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Add to log
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="What did you cover today? e.g. Reviewed Teentaal theka at Vilambit; started Dha TirkitTakTirkit kaida; assigned Microbeats drill."
              className="w-full resize-y rounded-xl border border-indigo-200 bg-white px-4 py-3 text-indigo-900 outline-none transition focus:border-saffron-400"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {appointments.length > 0 ? (
                <select
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-indigo-800 outline-none focus:border-saffron-400"
                >
                  <option value="">Link to a lesson (optional)…</option>
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {fmtDate(a.starts_at)}
                      {a.mode === "in_person" ? " · in person" : " · online"}
                    </option>
                  ))}
                </select>
              ) : (
                <span />
              )}
              <button
                onClick={add}
                disabled={pending || !body.trim()}
                className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={16} /> Add to log
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Log */}
          <div className="space-y-3">
            {notes.length === 0 && (
              <div className="surface py-10 text-center text-indigo-400">
                No notes yet for this student. Add the first one above.
              </div>
            )}

            {notes.map((n) => {
              const appt = n.appointment_id && apptById[n.appointment_id];
              const editing = editingId === n.id;
              return (
                <div key={n.id} className="surface p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-indigo-400">
                      <span className="font-medium text-indigo-600">
                        {fmtDate(n.created_at)}
                      </span>
                      {appt && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-500">
                          <CalendarClock size={11} /> lesson {fmtDate(appt.starts_at, false)}
                        </span>
                      )}
                      {n.updated_at && n.updated_at !== n.created_at && (
                        <span className="italic">edited</span>
                      )}
                    </div>
                    {!editing && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingId(n.id);
                            setEditBody(n.body);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg text-indigo-400 transition hover:bg-indigo-50 hover:text-indigo-700"
                          aria-label="Edit note"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => remove(n.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-indigo-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete note"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  {editing ? (
                    <div>
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={4}
                        className="w-full resize-y rounded-xl border border-indigo-200 bg-white px-4 py-3 text-indigo-900 outline-none focus:border-saffron-400"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => saveEdit(n.id)}
                          disabled={pending}
                          className="btn-primary !py-2"
                        >
                          <Check size={15} /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                        >
                          <X size={15} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-indigo-800">{n.body}</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
