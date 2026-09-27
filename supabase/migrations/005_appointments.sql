-- ============================================================================
--  MIGRATION 005 — Scheduled lessons (teacher schedules; students view)
--  Run in Supabase → SQL Editor. Safe to re-run.
-- ============================================================================

create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.users(id) on delete cascade,
  starts_at    timestamptz not null,
  duration_min integer not null default 30,
  note         text,
  created_by   uuid references public.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_appts_student on public.appointments(student_id, starts_at);
create index if not exists idx_appts_start on public.appointments(starts_at);

alter table public.appointments enable row level security;

-- Students may READ their own lessons; admins can do everything (schedule/cancel).
drop policy if exists "read own appointments" on public.appointments;
drop policy if exists "admin manage appointments" on public.appointments;

create policy "read own appointments" on public.appointments for select
  using (auth.uid() = student_id or public.is_admin());
create policy "admin manage appointments" on public.appointments for all
  using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.appointments to anon, authenticated;
