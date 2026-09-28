/**
 * Public app configuration.
 *
 * These are NEXT_PUBLIC_* values — public by design (they ship in the browser
 * bundle; the Supabase anon key is safe to expose, your data is protected by
 * Row Level Security). We read the env var if present, but fall back to a
 * literal so the build NEVER depends on env-var delivery (Vercel dashboard,
 * .env files, etc.). `"" || fallback` also covers the case where a platform
 * injects an empty value.
 *
 * To point at a different Supabase project or domain, either set the matching
 * NEXT_PUBLIC_* env var, or edit the fallback literal here.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tytsqowlalzbntuvosqu.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dHNxb3dsYWx6Ym50dXZvc3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMDA5MjIsImV4cCI6MjEwNTc3NjkyMn0.QBcW4on20qYoetbX8bc3wfoEhfi6zacL1M-RuSDPtg4";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ajinkyaranademusic.com";

// ── Lesson booking ──────────────────────────────────────────────────────────
// The persistent Google Meet link students join for lessons. Get one at
// meet.google.com → "New meeting" → "Create a meeting for later" → copy the link
// (it's reusable). Replace the placeholder below (or set NEXT_PUBLIC_MEET_URL).
export const MEET_URL =
  process.env.NEXT_PUBLIC_MEET_URL || "https://meet.google.com/iek-xiaz-gsx";

// The teacher who gets invited to each booked lesson.
export const TEACHER_NAME =
  process.env.NEXT_PUBLIC_TEACHER_NAME || "Ajinkya Ranade";
export const TEACHER_EMAIL =
  process.env.NEXT_PUBLIC_TEACHER_EMAIL || "ar.resonancestudios@gmail.com";

// ── Brand ────────────────────────────────────────────────────────────────────
export const BRAND_SHORT = "ARTS";
export const BRAND_FULL = "Ajinkya Ranade Tabla School";
// Ajinkya's personal website, linked on the sign-in page.
export const PERSONAL_SITE = "https://ajinkyaranade.com";
