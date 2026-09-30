-- ============================================================================
--  MIGRATION 008 — In-person vs online lessons (run in Supabase → SQL Editor)
--  Adds a mode + location to appointments. Safe to re-run.
-- ============================================================================

alter table public.appointments
  add column if not exists mode text not null default 'online',
  add column if not exists location text;

do $$ begin
  alter table public.appointments
    add constraint appointments_mode_check check (mode in ('online', 'in_person'));
exception when duplicate_object then null; end $$;
