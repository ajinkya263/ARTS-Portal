// Server-only email sending via Resend's HTTP API.
// Uses RESEND_API_KEY (a SECRET server env var — never NEXT_PUBLIC, never in
// client code). Degrades gracefully: if the key is missing it just skips, so
// scheduling never breaks because of email.

import { MEET_URL, SITE_URL, TEACHER_NAME } from "@/lib/config";

const FROM = "Ajinkya Ranade Tabla School <noreply@ajinkyaranademusic.com>";

export async function sendEmail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return { ok: false, skipped: true };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function fmtWhen(startsAt) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(new Date(startsAt));
}

function shell(inner) {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#FBF5EA;padding:32px">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #F3E7D0">
      <div style="background:#2B1B5A;padding:20px 28px;color:#FBF5EA">
        <span style="font-size:20px;font-weight:700">ARTS</span>
        <span style="color:#F9BF3A;font-size:13px;display:block">Ajinkya Ranade Tabla School</span>
      </div>
      <div style="padding:28px;color:#2B1B5A">${inner}</div>
    </div>
  </div>`;
}

export function lessonScheduledEmail({ studentName, startsAt, durationMin, note }) {
  const when = fmtWhen(startsAt);
  const hi = studentName ? `Namaste ${studentName},` : "Namaste,";
  return {
    subject: "Your tabla lesson is scheduled 🎵",
    html: shell(`
      <p style="font-size:16px">${hi}</p>
      <p>${TEACHER_NAME} has scheduled a one-on-one tabla lesson for you:</p>
      <div style="background:#FBF5EA;border-radius:12px;padding:16px 18px;margin:16px 0">
        <div style="font-size:18px;font-weight:600">${when}</div>
        <div style="color:#4B31A0;margin-top:4px">${durationMin} minutes${
          note ? ` · Focus: ${note}` : ""
        }</div>
      </div>
      <p>
        <a href="${MEET_URL}" style="display:inline-block;background:#2B1B5A;color:#FBF5EA;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600">Join on Google Meet</a>
      </p>
      <p style="color:#684DBF;font-size:14px">See it any time (and add it to your calendar) in
        <a href="${SITE_URL}/book" style="color:#D98B00">My Lessons</a>.</p>
    `),
  };
}

export function lessonCancelledEmail({ studentName, startsAt }) {
  const when = fmtWhen(startsAt);
  const hi = studentName ? `Namaste ${studentName},` : "Namaste,";
  return {
    subject: "Your tabla lesson was cancelled",
    html: shell(`
      <p style="font-size:16px">${hi}</p>
      <p>Your tabla lesson on <b>${when}</b> has been cancelled. ${TEACHER_NAME} will be in touch about rescheduling.</p>
      <p style="color:#684DBF;font-size:14px">Questions? Just reply to this email.</p>
    `),
  };
}
