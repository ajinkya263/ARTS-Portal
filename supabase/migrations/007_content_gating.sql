-- ============================================================================
--  MIGRATION 007 — Enforce module time-gating at the DATABASE (recommended)
--
--  Without this, any logged-in student can read locked lessons' content by
--  querying the API directly (the gate is only in the UI). This policy makes the
--  DB the source of truth: a student can read a lesson only if its module is
--  unlocked for them (enough days since enrollment) OR they have an override.
--  Admins see everything.
--
--  AFTER RUNNING: log in as a STUDENT and confirm unlocked lessons still open,
--  locked ones stay closed, and admins still see all content.
-- ============================================================================

drop policy if exists "read lessons" on public.lessons;

create policy "read lessons" on public.lessons for select using (
  public.is_admin()
  or exists (
    select 1
    from public.modules m
    join public.users u on u.id = auth.uid()
    where m.id = lessons.module_id
      and (
        (now() - u.enrollment_date) >= make_interval(days => m.unlock_delay_days)
        or exists (
          select 1 from public.user_overrides o
          where o.user_id = auth.uid() and o.module_id = m.id
        )
      )
  )
);
