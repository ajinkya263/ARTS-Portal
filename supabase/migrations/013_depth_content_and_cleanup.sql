-- ============================================================================
--  MIGRATION 013 , Depth content (history, gharanas, forms, masters) + cleanup
--
--  (a) Scrubs em/en dashes from existing lesson + module text already in the DB
--      (uses chr() so this file stays dash-free).
--  (b) Adds two reference modules with rich content drawn from the Resonance
--      Studios tabla knowledge base, including photos of two masters.
--
--  Photos must exist in the deployed app at /img/zakir-hussain.jpg and
--  /img/yogesh-samsi.jpg (added under public/img). Idempotent, safe to re-run.
--  Run in Supabase SQL Editor after 003/010/012.
-- ============================================================================

-- (a) ---- strip em dash (chr 8212) and en dash (chr 8211) from stored text ----
update public.lessons set text_content =
  replace(replace(replace(text_content, ' ' || chr(8212) || ' ', ', '), chr(8212), ', '), chr(8211), '-')
  where text_content like '%' || chr(8212) || '%' or text_content like '%' || chr(8211) || '%';

update public.lessons set title =
  replace(replace(title, ' ' || chr(8212) || ' ', ', '), chr(8212), ', ')
  where title like '%' || chr(8212) || '%';

update public.modules set description =
  replace(replace(replace(description, ' ' || chr(8212) || ' ', ', '), chr(8212), ', '), chr(8211), '-')
  where description like '%' || chr(8212) || '%' or description like '%' || chr(8211) || '%';

update public.modules set title =
  replace(replace(title, ' ' || chr(8212) || ' ', ', '), chr(8212), ', ')
  where title like '%' || chr(8212) || '%';


-- (b) ---- Module: History, Gharanas & Forms ---------------------------------
insert into public.modules (title, description, unlock_delay_days, order_index)
select 'History, Gharanas & Forms',
       'The story of the tabla: where it comes from, the six gharanas, and the compositional forms that make up its repertoire.',
       0,
       coalesce((select max(order_index) from public.modules), 0) + 1
where not exists (select 1 from public.modules where title = 'History, Gharanas & Forms');

insert into public.lessons (module_id, title, media_type, media_url, text_content, order_index)
select m.id, v.title, 'text'::media_kind, null::text, v.text_content, v.order_index
from public.modules m
cross join (values
  ('A Short History of the Tabla', $txt$The tabla took its modern form in North India in the 18th century, in the Mughal court at Delhi, as lighter vocal forms such as khayal rose alongside the older dhrupad. It grew out of older Indian drumming, above all the barrel-shaped pakhawaj and the ancient pushkara drums described in the Natya Shastra.

No single inventor is documented. The popular stories, that the poet Amir Khusrau invented it, or that a pakhawaj player split his drum in two so that it still spoke (tabla), are legends rather than history. The first recorded lineage is the Delhi gharana, traced to Ustad Siddhar Khan Dhadi.

Two things make the tabla unique. The **syahi**, the black weighted patch at the centre of each skin, makes the head ring with harmonic overtones and a clear pitch, a property studied by the physicist C. V. Raman. And the **bol**, the spoken syllable for every stroke, makes tabla a language as much as an instrument.$txt$, 1),

  ('The Six Gharanas', $txt$A gharana is a stylistic lineage, a house of playing passed from guru to disciple. The six tabla gharanas are:

**Delhi**: founded by Ustad Siddhar Khan Dhadi. A closed, delicate two-finger style near the rim, the home of the qaida and of classical peshkar.

**Ajrada**: founded by Kallu Khan and Meeru Khan. Closed like Delhi, but with rich bayan work and triplet (tisra) phrasing.

**Lucknow**: founded by Modu Khan and Bakhshu Khan. An open, resonant style shaped by kathak dance and the pakhawaj, strong in gats and parans.

**Farukhabad**: founded by Haji Vilayat Ali Khan. A synthesis of open and closed, with the richest store of gats, relas and chalans.

**Benares**: founded by Pandit Ram Sahai. A powerful open style, famous for uthans, stuti parans and dramatic solos.

**Punjab**: grown from the pakhawaj tradition of Lala Bhawani Das. Open, powerful and mathematically rich. Ustad Alla Rakha and Ustad Zakir Hussain belong to it, and through Pandit Yogesh Samsi, so does Ajinkya's own training.$txt$, 2),

  ('Compositional Forms', $txt$Tabla repertoire divides into forms you develop by improvising, and fixed compositions you play as composed.

**Peshkar**: the opening exposition of a solo, exploring tone and laya.
**Qaida**: a theme developed through strict variations (paltas) that use only its own bols, closed with a tihai.
**Rela**: a fast, rolling cousin of the qaida, built on groups like TiRaKiTa and DhiRaDhiRa.
**Tukda**: a short fixed piece ending in a tihai.
**Gat**: an elegant fixed composition, often without a tihai, a Farukhabad and Lucknow speciality.
**Paran**: a powerful composition drawn from the pakhawaj.
**Chakradar**: a composition whose tihai is itself repeated three times, so that only the very last stroke lands on sam.

Binding them all is the **tihai**: a phrase played three times to land exactly on sam, the great cadence of Indian rhythm.$txt$, 3),

  ('Taal, Laya and the Tihai', $txt$A **taal** is a cycle of a fixed number of beats (matras), grouped into sections (vibhags) marked by claps (tali) and a wave (khali). The first beat, **sam**, is the point of arrival that phrases resolve to.

**Laya** is tempo: vilambit (slow), madhya (medium), drut (fast). **Layakari** is playing against that pulse in ratios, dugun (2 per beat), tigun (3), chaugun (4), or odd groupings such as aad (3 in the space of 2).

A **tihai** repeats a phrase three times so that its last stroke falls on sam. If S units remain from your starting point up to and including sam, choose a phrase length P and a gap G so that 3P + 2G = S. A bedam tihai uses no gap, a damdar tihai includes one.$txt$, 4)
) as v(title, text_content, order_index)
where m.title = 'History, Gharanas & Forms'
  and not exists (select 1 from public.lessons lx where lx.title = v.title);


-- (b) ---- Module: Great Masters of the Tabla (with photos) ------------------
insert into public.modules (title, description, unlock_delay_days, order_index)
select 'Great Masters of the Tabla',
       'A short gallery of the artists who shaped the instrument, including two of the masters behind this school.',
       0,
       coalesce((select max(order_index) from public.modules), 0) + 1
where not exists (select 1 from public.modules where title = 'Great Masters of the Tabla');

insert into public.lessons (module_id, title, media_type, media_url, text_content, order_index)
select m.id, v.title, v.media_type::media_kind, v.media_url, v.text_content, v.order_index
from public.modules m
cross join (values
  ('Ustad Zakir Hussain', 'image', '/img/zakir-hussain.jpg', $txt$Ustad Zakir Hussain (1951 to 2024) was the most celebrated tabla player of the modern era. A son and disciple of Ustad Alla Rakha and a torch-bearer of the Punjab gharana, he carried the tabla to the world stage, winning multiple Grammy awards and playing across jazz, world and classical music. (Photograph by Jim McGuire.)$txt$, 1),

  ('Pandit Yogesh Samsi', 'image', '/img/yogesh-samsi.jpg', $txt$Pandit Yogesh Samsi (born 1968) is one of the foremost tabla maestros of his generation and a leading voice of the Punjab gharana, a disciple of Ustad Alla Rakha. He is one of Ajinkya's gurus, and his approach shapes the way the tabla is taught in this school.$txt$, 2),

  ('The Lineage of Masters', 'text', null, $txt$The tabla's story is carried by its masters. A few whose names every student should know:

**Ustad Alla Rakha** (1919 to 2000): the Punjab gharana giant who accompanied Pandit Ravi Shankar and opened the tabla to the world, and the father and guru of Zakir Hussain.
**Ustad Ahmed Jan Thirakwa** (1892 to 1976): widely held to be among the greatest soloists of the 20th century.
**Pandit Kishan Maharaj** (1923 to 2008) and **Pandit Samta Prasad** (1921 to 1994): towering voices of the Benares gharana.
**Pandit Anokhelal Mishra** (1914 to 1958): famed for the clarity and speed of his Na Dhin Dhin Na.
**Pandit Swapan Chaudhuri** and **Pandit Anindo Chatterjee**: two of the most admired performers and teachers of recent decades.$txt$, 3)
) as v(title, media_type, media_url, text_content, order_index)
where m.title = 'Great Masters of the Tabla'
  and not exists (select 1 from public.lessons lx where lx.title = v.title);
