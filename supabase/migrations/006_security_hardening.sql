-- ============================================================================
--  MIGRATION 006 — SECURITY HARDENING (run in Supabase → SQL Editor)
--  Safe to re-run.
-- ============================================================================

-- ── CRITICAL: stop self-service privilege escalation ────────────────────────
-- The "update own profile" RLS policy lets a user edit their own users row.
-- Without this, a student could set role='admin' or back-date enrollment_date
-- (bypassing time-gating) by calling the API directly. This trigger lets a user
-- change only their display name; admins may still change anything.
create or replace function public.protect_user_columns()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if public.is_admin() then
    return new;                         -- admins can manage roles etc.
  end if;
  if new.role            is distinct from old.role
     or new.enrollment_date is distinct from old.enrollment_date
     or new.email         is distinct from old.email
     or new.auth_provider is distinct from old.auth_provider
     or new.id            is distinct from old.id
     or new.created_at    is distinct from old.created_at then
    raise exception 'Not allowed: you can only edit your own name.';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_user_columns on public.users;
create trigger protect_user_columns
  before update on public.users
  for each row execute function public.protect_user_columns();

-- ── Defense in depth: the anonymous role never writes in this app ────────────
-- (RLS already blocks it; this removes the capability entirely.)
revoke insert, update, delete on all tables in schema public from anon;
alter default privileges in schema public
  revoke insert, update, delete on tables from anon;
