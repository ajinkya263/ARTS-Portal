-- ============================================================================
--  MIGRATION 009, Per-student class-notes log (admin)
--
--  A running log of notes the teacher keeps for each student: what was covered
--  / completed in each class. Admin writes & reads; a note can optionally be
--  tied to a specific lesson appointment.
--
--  Run in Supabase → SQL Editor AFTER 008.  Safe to re-run.
-- ============================================================================

create table if not exists public.student_notes (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.users(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  body           text not null,
  author_id      uuid references public.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_student_notes_student
  on public.student_notes (student_id, created_at desc);

-- keep updated_at fresh on edits
create or replace function public.touch_student_notes_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_student_notes_updated_at on public.student_notes;
create trigger trg_student_notes_updated_at
  before update on public.student_notes
  for each row execute function public.touch_student_notes_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.student_notes enable row level security;

-- Admins have full access. (These are the teacher's private records; students
-- do NOT read them by default, flip the select policy below if you ever want
-- students to see their own progress notes.)
drop policy if exists "admin manage student notes" on public.student_notes;
create policy "admin manage student notes" on public.student_notes
  for all using (public.is_admin()) with check (public.is_admin());

-- OPTIONAL, let students read their own notes (left disabled by default):
-- create policy "student reads own notes" on public.student_notes
--   for select using (auth.uid() = student_id);

grant select, insert, update, delete on public.student_notes to authenticated;
