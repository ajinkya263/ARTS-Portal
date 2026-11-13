-- ============================================================================
--  MIGRATION 010, New beginner lesson content
--
--  Adds (idempotently, safe to re-run):
--   • "Kaidas & Improvisation"      → Dha TirkitTakTirkit Kaida (Teentaal)
--   • "Teentaal: The 16-Beat Cycle" → Dhati Dhage TunaKena phrase, Microbeats
--   • NEW module "Light Taals: Dadra & Bhajani" → Dadra + Bhajani thekas,
--     paltas/variations, and interactive trainers (interactive:taal:dadra /
--     interactive:taal:bhajani).
--
--  Source: "Beginner Lesson, Teentaal Introduction" (© Zaxis Ventures LLC).
--  Run in Supabase → SQL Editor AFTER 003 (and do NOT re-run 003 after this,
--  since 003 wipes public.lessons).
-- ============================================================================

-- ── Dha TirkitTakTirkit Kaida → Kaidas & Improvisation ──────────────────────
insert into public.lessons (module_id, title, media_type, media_url, text_content, order_index)
select m.id, v.title, v.media_type::media_kind, v.media_url, v.text_content, v.order_index
from public.modules m
cross join (values
  ('Dha TirkitTakTirkit Kaida, Teentaal', 'text', null::text, $txt$A Teentaal kaida built on **Dha Tirkit TakTirkit**. Recite it first (padhant), then play slowly and cleanly before adding speed.

**Bhari (full)**
```
Dha Tirkit TakTirkit
Dha Tirkit TakTirkit
Dhati Dhage DhinaGina
DhatiDhage Dhati Dhage TunaKena
```

**Khali**
```
Ta Tirkit TakTirkit
Ta Tirkit TakTirkit
Dhati Dhage DhinaGina
DhatiDhage DhatiDhage DhinaGina
```$txt$, 20)
) as v(title, media_type, media_url, text_content, order_index)
where m.title = 'Kaidas & Improvisation'
  and not exists (select 1 from public.lessons lx where lx.title = v.title);


-- ── Dhati Dhage phrase + Microbeats → Teentaal module ───────────────────────
insert into public.lessons (module_id, title, media_type, media_url, text_content, order_index)
select m.id, v.title, v.media_type::media_kind, v.media_url, v.text_content, v.order_index
from public.modules m
cross join (values
  ('Dhati Dhage TunaKena, Practice Phrase', 'text', null::text, $txt$A phrase to lock in **Dhati Dhage** with **DhinaGina / TunaKena**. Played with alternating *ge*s, place every bol exactly.
```
Dhati Dhage Dhina Gina   Dhati Dhage Dhina Gina
Dhina Gina Dhati Dhage   Dhati Dhage Dhina Gina
```
• Played with alternating **ge**s
• Make sure to place all bols exactly$txt$, 20),

  ('Microbeats, Subtraction Exercise', 'text', null::text, $txt$A timing-and-subdivision drill. Only the **number of counts per bar** changes, the speed of each individual beat must stay perfectly steady.
```
1 2 3 4 5 6 7 8
  2 3 4 5 6 7 8
    3 4 5 6 7 8
      4 5 6 7 8
        5 6 7 8
          6 7 8
            7 8
              8
              8
            7 8
          6 7 8
        5 6 7 8
      4 5 6 7 8
    3 4 5 6 7 8
  2 3 4 5 6 7 8
1 2 3 4 5 6 7 8
```
**How it works**, subtract the first beat of each 8-count bar until a single count, then build back up.
• A single pass down from 8 to 1 = **36 beats** (fits nine 4/4 measures).
• Keep each beat's speed completely steady, never rush the shorter bars.

**Step by step**
• Set a metronome (60-80 BPM is ideal) or a simple 4/4 backing track.
• Count aloud 1 → 8 with a distinct action on each number (clap, step, or a single bol).
• Drop the "1" on the next cycle and start at 2, no pause, no empty beat.
• Remove the lowest number each pass (3-8, then 4-8 …) down to a single 8.
• Reverse back up (7-8, 6-7-8 … 1-2-3-4-5-6-7-8) to re-expand the phrase cleanly.$txt$, 21)
) as v(title, media_type, media_url, text_content, order_index)
where m.title = 'Teentaal: The 16-Beat Cycle'
  and not exists (select 1 from public.lessons lx where lx.title = v.title);


-- ── NEW MODULE: Light Taals: Dadra & Bhajani ────────────────────────────────
insert into public.modules (title, description, unlock_delay_days, order_index)
select 'Light Taals: Dadra & Bhajani',
       'Two essential light taals for accompaniment, the 6-beat Dadra and the 8-beat Bhajani, with thekas, paltas and interactive trainers.',
       0,
       coalesce((select max(order_index) from public.modules), 0) + 1
where not exists (select 1 from public.modules where title = 'Light Taals: Dadra & Bhajani');

insert into public.lessons (module_id, title, media_type, media_url, text_content, order_index)
select m.id, v.title, v.media_type::media_kind, v.media_url, v.text_content, v.order_index
from public.modules m
cross join (values
  ('Dadra, The 6-Beat Cycle', 'text', 'interactive:taal:dadra', $txt$**Dadra** is a 6-matra light taal, used mainly for accompaniment. Two vibhags of three, Sam (X) on matra 1, Khali (0) on matra 4.
```
x  Dha Dhin Na
o  Dha Tin  Na
```
Press play below, choose a laya, and recite along with the cycle.$txt$, 1),

  ('Dadra, Tekha Paltas', 'text', null::text, $txt$Variations (paltas) on the Dadra theka. Keep them even and clear.

**Palta #1**
```
DhaDha Dhin Na
DhaDha Tin  Na
```
**Palta #2**
```
Dhage Dhin Na
Dhage Tin  Na
```
**Palta #3**
```
Dhage DhinDhin Na
Dhage TinTin  Na
```
**Palta #4**
```
Dhage DhinDhin NaNa
Dhage TinTin  NaNa
```
**Palta #5**
```
Dha KadDhinDhin NaNa
Ta  KadDhinDhin NaNa
```$txt$, 2),

  ('Bhajani, The 8-Beat Cycle', 'text', 'interactive:taal:bhajani', $txt$**Bhajani** is an 8-matra light taal used for bhajans and kirtans. Sam (X) on matra 1, Khali (0) on matra 5.
```
x  Dhin  NaDhin  -Dhin  NaGe
o  Dhin  NaTin   -Tin   NaGe
```
Play it below, choose your laya, and recite along.$txt$, 3),

  ('Bhajani, Variations', 'text', null::text, $txt$Three variations on the Bhajani theka. Recite first, then play slowly.

**Variation #1**
```
DhinDhin NaDhin Dhin NaGe
TinTin   NaDhin Dhin Nage
```
**Variation #2**
```
DhinDhin NaDhinDhinDhin NaGe
TinTin   NaDhinDhinDhin Nage
```
**Variation #3**
```
Dhin KadDha DhinDhin Nage
Tin  KadTa  Tin  Dhin Nage
```$txt$, 4)
) as v(title, media_type, media_url, text_content, order_index)
where m.title = 'Light Taals: Dadra & Bhajani'
  and not exists (select 1 from public.lessons lx where lx.title = v.title);
