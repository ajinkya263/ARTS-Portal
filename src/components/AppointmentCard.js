"use client";

import { useState } from "react";
import { CalendarPlus, Download, Video, Copy, Check, Clock } from "lucide-react";
import { MEET_URL, TEACHER_NAME, TEACHER_EMAIL } from "@/lib/config";

const toICSDate = (d) =>
  d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

/** One scheduled lesson (read-only for the student) with calendar-add + join. */
export default function AppointmentCard({ appt, studentEmail }) {
  const [copied, setCopied] = useState(false);

  const start = new Date(appt.starts_at);
  const end = new Date(start.getTime() + appt.duration_min * 60000);
  const title = "Tabla Lesson — ARTS";
  const details = `Your ${appt.duration_min}-minute tabla lesson with ${TEACHER_NAME}.${
    appt.note ? `\n\nFocus: ${appt.note}` : ""
  }\n\nJoin the Google Meet: ${MEET_URL}`;

  const gcalUrl = (() => {
    const u = new URL("https://calendar.google.com/calendar/render");
    u.searchParams.set("action", "TEMPLATE");
    u.searchParams.set("text", title);
    u.searchParams.set("dates", `${toICSDate(start)}/${toICSDate(end)}`);
    u.searchParams.set("details", details);
    u.searchParams.set("location", MEET_URL);
    return u.toString();
  })();

  function downloadICS() {
    const uid = `${appt.id}@ajinkyaranademusic.com`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ARTS//Lesson//EN",
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

  const dateStr = start.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeStr = `${start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })} – ${end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  return (
    <article className="surface card-hover overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl text-indigo-900">{dateStr}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-indigo-600">
            <Clock size={15} className="text-saffron-500" />
            {timeStr}
            <span className="text-indigo-300">·</span>
            {appt.duration_min} min
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          One-on-one
        </span>
      </div>

      {appt.note && (
        <p className="mt-3 rounded-xl bg-cream-100 px-4 py-2.5 text-sm text-indigo-700">
          <span className="font-medium">Focus:</span> {appt.note}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a href={MEET_URL} target="_blank" rel="noreferrer" className="btn-primary">
          <Video size={16} /> Join lesson
        </a>
        <a href={gcalUrl} target="_blank" rel="noreferrer" className="btn-outline">
          <CalendarPlus size={16} /> Add to Google Calendar
        </a>
        <button onClick={downloadICS} className="btn-outline">
          <Download size={16} /> .ics
        </button>
        <button
          onClick={copyMeet}
          className="ml-auto inline-flex items-center gap-1.5 text-sm text-indigo-500 transition hover:text-indigo-800"
        >
          {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
          Copy link
        </button>
      </div>
    </article>
  );
}
