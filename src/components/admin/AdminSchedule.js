"use client";

import { useState, useTransition } from "react";
import {
  CalendarPlus,
  CalendarDays,
  Clock,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  createAppointment,
  deleteAppointment,
} from "@/app/(app)/admin/schedule/actions";

const DURATIONS = [15, 30, 45, 60];

const inputCls =
  "w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-indigo-800 placeholder:text-indigo-300 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-400";
const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-indigo-400";

/**
 * Admin lesson scheduler.
 * Props:
 *   users        — [{ id, full_name, email }]
 *   appointments — [{ id, starts_at, duration_min, note, student: { full_name, email } }]
 */
export default function AdminSchedule({ users, appointments }) {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMin, setDurationMin] = useState(30);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);
  const [deletePending, startDeleteTransition] = useTransition();

  // Today's local date (YYYY-MM-DD) for the date input's `min`.
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentId) {
      setError("Please choose a student.");
      return;
    }
    if (!date || !time) {
      setError("Please choose a date and time.");
      return;
    }

    const when = new Date(`${date}T${time}`);
    if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
      setError("Please choose a date and time in the future.");
      return;
    }

    const startsAt = when.toISOString();

    startTransition(async () => {
      const res = await createAppointment({
        studentId,
        startsAt,
        durationMin,
        note,
      });
      if (res?.ok) {
        setSuccess("Lesson scheduled.");
        setStudentId("");
        setDate("");
        setTime("");
        setDurationMin(30);
        setNote("");
      } else {
        setError(res?.error || "Could not schedule the lesson.");
      }
    });
  }

  function handleDelete(id) {
    if (!window.confirm("Cancel this lesson? This can’t be undone.")) return;
    setDeletingId(id);
    startDeleteTransition(async () => {
      await deleteAppointment(id);
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-8">
      {/* Scheduling form */}
      <form onSubmit={handleSubmit} className="surface p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarPlus size={18} />
          </span>
          <h2 className="font-display text-xl text-indigo-900">Book a lesson</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Student */}
          <div className="sm:col-span-2">
            <label htmlFor="student" className={labelCls}>
              Student
            </label>
            <select
              id="student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>
                Choose a student…
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.email}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className={labelCls}>
              Date
            </label>
            <input
              id="date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className={labelCls}>
              Time
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Duration */}
          <div className="sm:col-span-2">
            <span className={labelCls}>Duration</span>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => {
                const selected = durationMin === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurationMin(d)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      selected
                        ? "bg-indigo-700 text-cream-50"
                        : "bg-cream-100 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    <Clock size={13} /> {d} min
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div className="sm:col-span-2">
            <label htmlFor="note" className={labelCls}>
              Note <span className="normal-case text-indigo-300">(optional)</span>
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Focus on alap in Raga Yaman"
              className={inputCls}
            />
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle size={15} /> {error}
          </p>
        )}
        {success && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">
            <CheckCircle2 size={15} /> {success}
          </p>
        )}

        <div className="mt-5">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CalendarPlus size={16} />
            )}
            Schedule lesson
          </button>
        </div>
      </form>

      {/* Upcoming lessons */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl text-indigo-900">
            <CalendarDays size={18} className="text-indigo-500" /> Upcoming lessons
          </h2>
          <span className="text-xs text-indigo-400">
            {appointments.length} lesson{appointments.length === 1 ? "" : "s"}
          </span>
        </div>

        {appointments.length === 0 ? (
          <p className="surface p-8 text-center text-indigo-400">
            No upcoming lessons scheduled yet.
          </p>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => {
              const isDeleting = deletingId === a.id && deletePending;
              const name = a.student?.full_name || a.student?.email || "—";
              return (
                <article
                  key={a.id}
                  className="surface flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-display text-indigo-700">
                      {(name || "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-indigo-900">{name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-indigo-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} />
                          {new Date(a.starts_at).toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-xs">
                          {a.duration_min} min
                        </span>
                      </div>
                      {a.note && (
                        <p className="mt-1 truncate text-sm text-indigo-400">
                          {a.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    disabled={isDeleting}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-cream-200 px-3 py-2 text-sm font-medium text-indigo-400 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    title="Cancel lesson"
                  >
                    {isDeleting ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
