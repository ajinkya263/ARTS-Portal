"use client";

import { useMemo, useState } from "react";
import {
  CalendarPlus,
  Download,
  Video,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import { MEET_URL, TEACHER_NAME, TEACHER_EMAIL } from "@/lib/config";

const DURATIONS = [15, 30, 45, 60];

// today's date as yyyy-mm-dd (local)
function todayStr() {
  const d = new Date();
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}
// Date → 20260927T183000Z (UTC basic)
function toICSDate(d) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export default function BookingForm({ studentEmail }) {
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(30);
  const [copied, setCopied] = useState(false);

  const { start, end, valid } = useMemo(() => {
    if (!date || !time) return { valid: false };
    const s = new Date(`${date}T${time}`);
    if (isNaN(s.getTime())) return { valid: false };
    const e = new Date(s.getTime() + duration * 60000);
    return { start: s, end: e, valid: s.getTime() > Date.now() };
  }, [date, time, duration]);

  const title = "Tabla Lesson — Resonance Studios";
  const details = `Your ${duration}-minute tabla lesson with ${TEACHER_NAME}.\n\nJoin the Google Meet: ${MEET_URL}\n\nBooked via Resonance Studios.`;

  const gcalUrl = useMemo(() => {
    if (!valid) return "#";
    const u = new URL("https://calendar.google.com/calendar/render");
    u.searchParams.set("action", "TEMPLATE");
    u.searchParams.set("text", title);
    u.searchParams.set("dates", `${toICSDate(start)}/${toICSDate(end)}`);
    u.searchParams.set("details", details);
    u.searchParams.set("location", MEET_URL);
    u.searchParams.set("add", TEACHER_EMAIL);
    return u.toString();
  }, [valid, start, end, details]);

  function downloadICS() {
    if (!valid) return;
    const uid = `${toICSDate(start)}-${Math.random().toString(36).slice(2)}@ajinkyaranademusic.com`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Resonance Studios//Lesson//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${toICSDate(new Date())}`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details.replace(/\n/g, "\\n")}`,
      `LOCATION:${MEET_URL}`,
      `ORGANIZER;CN=${TEACHER_NAME}:mailto:${TEACHER_EMAIL}`,
      studentEmail ? `ATTENDEE;CN=${studentEmail}:mailto:${studentEmail}` : "",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Tabla lesson soon",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tabla-lesson.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyMeet() {
    try {
      await navigator.clipboard.writeText(MEET_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const summary = valid
    ? `${start.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })} · ${start.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })}–${end.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: the form */}
      <div className="surface p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-indigo-400">
          Choose a time
        </p>

        {/* Duration */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-indigo-600">Length</label>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  duration === d
                    ? "bg-indigo-700 text-cream-50"
                    : "bg-cream-100 text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Date + time */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm text-indigo-600">Date</span>
            <input
              type="date"
              min={todayStr()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2.5 text-indigo-800 focus:border-saffron-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-indigo-600">Start time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2.5 text-indigo-800 focus:border-saffron-400 focus:outline-none"
            />
          </label>
        </div>

        {/* Summary */}
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-cream-100 px-4 py-3 text-sm text-indigo-700">
          <Clock size={16} className="text-saffron-500" />
          {summary || "Pick a future date & time"}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!valid) e.preventDefault();
            }}
            className={`btn-primary w-full ${!valid ? "pointer-events-none opacity-50" : ""}`}
          >
            <CalendarPlus size={18} /> Add to Google Calendar
          </a>
          <button
            onClick={downloadICS}
            disabled={!valid}
            className="btn-outline w-full disabled:opacity-50"
          >
            <Download size={16} /> Download .ics (Apple / Outlook)
          </button>
        </div>

        <p className="mt-4 text-xs text-indigo-400">
          Saving the event invites {TEACHER_NAME} and adds a reminder to your
          calendar. You’ll both get the same Google Meet link below.
        </p>
      </div>

      {/* Right: the meet link */}
      <div className="surface flex flex-col p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-indigo-400">
          Your lesson room
        </p>
        <div className="mb-4 grid h-28 place-items-center rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-900 text-cream-50">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-saffron-400 text-indigo-900">
            <Video size={24} />
          </span>
        </div>
        <p className="mb-2 text-sm text-indigo-600">
          Every lesson happens at the same Google Meet link:
        </p>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-cream-200 bg-white px-3 py-2.5">
          <span className="flex-1 truncate text-sm text-indigo-800">{MEET_URL}</span>
          <button
            onClick={copyMeet}
            className="shrink-0 text-indigo-500 transition hover:text-indigo-800"
            aria-label="Copy link"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>
        </div>
        <a href={MEET_URL} target="_blank" rel="noreferrer" className="btn-outline">
          <Video size={16} /> Join now
        </a>
        <p className="mt-auto pt-4 text-xs text-indigo-400">
          Bookmark it — it never changes. Join at your scheduled time and your
          teacher will let you in.
        </p>
      </div>
    </div>
  );
}
