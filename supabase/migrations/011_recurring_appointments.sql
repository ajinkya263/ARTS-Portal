-- ============================================================================
--  MIGRATION 011, Recurring (weekly) lessons
--
--  Adds an optional recurrence_id so a weekly series of lessons shares one id
--  (lets you recognise / manage them as a group). Each occurrence is still a
--  normal appointments row, so existing views keep working unchanged.
--
--  Run in Supabase → SQL Editor AFTER 008.  Safe to re-run.
-- ============================================================================

alter table public.appointments
  add column if not exists recurrence_id uuid;

create index if not exists idx_appts_recurrence
  on public.appointments (recurrence_id);
