-- ============================================================================
--  MIGRATION 012, Interactive quizzes as lessons
--
--  Adds matching-quiz lessons (interactive:quiz:<key>) to the relevant modules.
--  The quiz content itself lives in code (MatchingQuiz.js); these rows just
--  place a quiz at the end of each module. Idempotent, safe to re-run.
--
--  Run in Supabase → SQL Editor AFTER 003/010.
-- ============================================================================

insert into public.lessons (module_id, title, media_type, media_url, text_content, order_index)
select m.id, v.title, 'text'::media_kind, v.media_url, v.text_content, v.order_index
from public.modules m
cross join (values
  ('Foundations: Meeting the Tabla',    'Quiz: Anatomy of the Tabla', 'interactive:quiz:anatomy',   $txt$Match each part of the drum to what it is. Tap a term, then its pair.$txt$, 30),
  ('The Basic Bols',                    'Quiz: The Basic Bols',       'interactive:quiz:bols',      $txt$Match each bol to how it sounds or is played.$txt$, 30),
  ('Teentaal: The 16-Beat Cycle',       'Quiz: Teentaal',             'interactive:quiz:teentaal',  $txt$How well do you know the 16-beat cycle? Match each idea to its meaning.$txt$, 30),
  ('Light Taals: Dadra & Bhajani',      'Quiz: Taals & Beats',        'interactive:quiz:taals',     $txt$Match each taal to its number of beats.$txt$, 30)
) as v(module_title, title, media_url, text_content, order_index)
where m.title = v.module_title
  and not exists (select 1 from public.lessons lx where lx.title = v.title);
