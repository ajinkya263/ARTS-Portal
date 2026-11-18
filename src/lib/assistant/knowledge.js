/* =============================================================================
   TABLA ASSISTANT  .  Knowledge base + matcher  (100% local, zero tokens)
   -----------------------------------------------------------------------------
   Runs entirely in the browser: no API, no keys, no cost. It answers well over
   a thousand question phrasings about the tabla and the school by combining a
   large glossary, the gharanas, major artists, the taals, every bol, how-to and
   school help, a bank of FAQs, and simple "quiz me" / "practice drill" helpers.

   Source material: the Resonance Studios tabla knowledge base.
   To teach it more: add a GLOSSARY term, a PEOPLE entry, or a TOPICS entry.
   ========================================================================== */

import { TAALS } from "@/components/interactive/taals";
import { TEACHER_EMAIL, PERSONAL_SITE, BRAND_FULL, BRAND_SHORT } from "@/lib/config";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------------------------------------------------------- GLOSSARY */
// term : { def, aka? }. Each becomes a "what is X / define X / X meaning" entry.
const GLOSSARY = {
  // ---- the instrument
  tabla: { def: "The pair of hand drums at the heart of North Indian (Hindustani) classical music: a wooden treble drum (dayan) and a metal bass drum (bayan).", aka: ["tabla drums"] },
  dayan: { def: "The smaller wooden right-hand drum. It is tuned to a definite pitch and produces the clear, ringing melodic tones.", aka: ["daya", "dahina", "right drum"] },
  bayan: { def: "The larger metal left-hand bass drum. The heel of the palm presses and slides on it to bend the deep bass tone.", aka: ["baya", "dagga", "duggi", "left drum"] },
  syahi: { def: "The black weighted circle at the centre of each skin, built from layers of iron powder and paste. It loads the membrane so the drum rings with harmonic overtones and a clear pitch.", aka: ["gab", "shahi", "black circle", "the black dot"] },
  maidan: { def: "The open ring of bare skin between the black syahi and the outer rim, struck for open resonant tones like Tin.", aka: ["lav", "sur"] },
  kinar: { def: "The outermost rim of the drum head, struck for the high sharp edge tones like Na and Ta.", aka: ["chanti", "chat", "the rim"] },
  gajra: { def: "The braided ring of plaited leather around the edge of the head that binds the layers and is tapped with the hammer for fine tuning.", aka: ["gajara", "the braid"] },
  pudi: { def: "The composite drum head itself: layered goat-skin with the syahi and the gajra.", aka: ["puri", "the skin", "the head"] },
  gatta: { def: "The cylindrical wooden tuning blocks wedged under the straps of the dayan. Tap them down to raise pitch, up to lower it (coarse tuning).", aka: ["gatte", "tuning blocks", "dowels"] },
  baddi: { def: "The leather lacing that laces the head to the shell and holds its tension.", aka: ["baddhi", "lacing", "straps"] },
  hathodi: { def: "The small metal tuning hammer used to tap the gatta and the gajra when tuning the dayan.", aka: ["hammer", "tuning hammer"] },
  "tabla tarang": { def: "A melodic instrument made of a set of many dayans, each tuned to a note of a raga and played like a melodic percussion instrument.", aka: ["tarang"] },

  // ---- taal concepts
  taal: { def: "A repeating rhythmic cycle of a fixed number of beats: the rhythmic framework of a piece.", aka: ["tala", "rhythm cycle", "time cycle"] },
  matra: { def: "A single beat, the fundamental pulse of a taal. Teentaal has 16 matras.", aka: ["beat", "matras"] },
  laya: { def: "Tempo, the speed of the rhythm. The three broad layas are vilambit (slow), madhya (medium) and drut (fast).", aka: ["tempo", "speed"] },
  vilambit: { def: "Slow tempo: the spacious laya where clarity and tone are built.", aka: ["slow laya", "ati vilambit"] },
  madhya: { def: "Medium tempo, the middle laya.", aka: ["madhyalaya", "medium tempo"] },
  drut: { def: "Fast tempo: the quick laya, attempted only once a phrase is clean.", aka: ["fast laya"] },
  layakari: { def: "Rhythmic play: dividing the beat into different ratios against the pulse, such as dugun (2), tigun (3), chaugun (4), aad (3 in 2), kuaad (5 in 4).", aka: ["laykari", "rhythmic manipulation"] },
  dugun: { def: "Double speed: two bols per matra (2:1).", aka: [] },
  tigun: { def: "Triple speed: three bols per matra (3:1).", aka: [] },
  chaugun: { def: "Quadruple speed: four bols per matra (4:1).", aka: [] },
  aad: { def: "A layakari of three in the space of two (3:2), that is one and a half bols per matra.", aka: ["aad laya"] },
  jati: { def: "The quality of subdivision: tisra (3), chatusra (4), khanda (5), misra (7), sankirna (9).", aka: ["jaati", "chhand"] },
  sam: { def: "The first and most important beat of the cycle: the point of resolution that phrases and tihais land on. Marked X.", aka: ["sum", "first beat"] },
  taali: { def: "A clap: the accented beats that divide a taal into sections, marked 2, 3 and so on.", aka: ["tali", "clap"] },
  khali: { def: "The empty, unaccented section, marked 0 and shown by a wave of the hand. On the tabla the bass resonance lifts off here (matra 9 in Teentaal).", aka: ["empty beat", "wave"] },
  bhari: { def: "The full accented section that leans on the bayan for a heavier sound: the opposite of khali.", aka: ["bhar", "full"] },
  vibhag: { def: "A section or bar of a taal, grouping its matras. Teentaal is four vibhags of four.", aka: ["vibhaag", "ang", "section"] },
  avartan: { def: "One complete cycle of the taal, from one sam to the next.", aka: ["avartana", "one cycle"] },
  theka: { def: "The standard pattern of bols that defines and keeps a taal: the groove you return to when accompanying.", aka: ["theka pattern"] },
  grah: { def: "The point where a composition starts relative to sam: sam grah (on sam), anagat (before sam), atit (after sam).", aka: ["graha"] },
  anagat: { def: "A phrase that ends or starts just before sam, anticipating it.", aka: [] },
  atit: { def: "A phrase that ends or starts just after sam, beyond it.", aka: ["ateet"] },

  // ---- bols & technique
  bol: { def: "A spoken syllable naming a stroke, such as Dha, Dhin, Na, Tin or Tirakita. Tabla is a spoken language before it is played.", aka: ["bols", "syllable"] },
  padhant: { def: "Reciting the bols aloud while marking taali and khali with the hands. You master the recitation before you play.", aka: ["padant", "recitation"] },
  nikaas: { def: "Clarity and quality of bol production: clean, distinct strokes. The real goal, far above speed.", aka: ["nikas", "safai", "clarity"] },
  riyaz: { def: "Dedicated, regular practice: the discipline that builds a tabla player. Consistency beats intensity.", aka: ["riyaaz", "practice"] },
  tayari: { def: "Readiness and speed: fluent, fast execution built on years of riyaz.", aka: [] },
  ghissa: { def: "The pitch bend on the bayan, made by pressing and sliding the heel of the hand across the skin.", aka: ["gamak", "meend", "ghasit", "bass bend"] },
  tirakita: { def: "A fast four-stroke rolling group (ti ra ki ta), usually one matra, that drives speed. Practise it slow and even.", aka: ["tirkit", "terekete"] },

  // ---- compositional forms
  tihai: { def: "A phrase played three times so its final stroke lands exactly on sam: the main cadence of Hindustani rhythm. Bedam tihais have no gap; damdar tihais include a gap.", aka: ["tihaai", "tehai"] },
  kaida: { def: "A theme-and-variation form, the backbone of solo tabla. A fixed theme (mukh) is developed through structured variations (paltas) using only its bols, always returning home, and closed with a tihai.", aka: ["qaida", "kayda"] },
  palta: { def: "A variation that develops a kaida or theka while keeping its character and cadence.", aka: ["paltas", "palte", "variation", "vistaar"] },
  peshkar: { def: "The opening improvised exposition of a tabla solo, exploring tone, laya and variation at a slow to medium tempo.", aka: ["peshkaar"] },
  rela: { def: "A fast, rolling composition built on quick bol groups like DhiRaDhiRa and TiRaKiTa, developed like a kaida but prizing flow and speed.", aka: ["relaa"] },
  rau: { def: "A resonant, rela-like form from Lucknow and Benares, with open strokes that create a reverberating rumble.", aka: [] },
  tukda: { def: "A short fixed composition, usually a cycle or less, that ends with a tihai on sam. Common in kathak and solos.", aka: ["tukra", "tukde"] },
  mukhda: { def: "A short phrase that leads into and lands on sam, used as a flourish in solo and accompaniment.", aka: ["mukhra", "mukh"] },
  mohra: { def: "A short cadential composition ending on sam, often with a small tihai, used to mark transitions.", aka: ["mohraa"] },
  paran: { def: "A powerful fixed composition drawn from pakhawaj style, using bols like Dhatta, Kitataka and GadiGana, usually ending in a tihai. Favoured in Lucknow, Benares, Farukhabad and Punjab.", aka: ["parans"] },
  gat: { def: "A fixed, elegantly structured composition, often without a tihai, prized in Farukhabad, Lucknow and Benares. Types include dupalli, tipalli, chaupalli and fard.", aka: ["gath"] },
  chakradar: { def: "A composition containing a tihai that is itself repeated three times, so only the very last Dha lands on sam. Farmaishi and kamali chakradars are more elaborate variants.", aka: ["chakkardar"] },
  farmaishi: { def: "A chakradar built so that the first, second and third Dhas of the three inner tihais each fall on successive sams: a showpiece of calculation.", aka: ["farmaishi chakradar"] },
  kamali: { def: "An even more intricate chakradar whose inner tihai Dhas land on sam in an elaborate pattern across many cycles.", aka: ["kamali chakradar"] },
  uthan: { def: "A dramatic opening flourish, especially in Benares and Lucknow, that begins a solo and builds tension before resolving on sam.", aka: [] },
  laggi: { def: "A light, fast, playful filling pattern used in thumri, dadra and lighter forms, often at the climax of a piece.", aka: ["lagghi"] },
  ladi: { def: "A chain-like pattern repeated with variations in a continuous flow, often fast, used in solos and sitar-tabla exchanges.", aka: [] },
  chalan: { def: "A Farukhabad and Lucknow form with a distinctive rhythmic gait, developed with variations like a kaida.", aka: [] },
  bandish: { def: "A fixed composition (as opposed to a developed/improvised form).", aka: [] },
  kavitt: { def: "A rhythmic poem, often devotional, set to tabla or pakhawaj bols and used in kathak.", aka: ["kavitta"] },
  stuti: { def: "A praise composition with words (for example a Ganesh or Shiva paran) recited then played, associated with Benares.", aka: [] },
  bedam: { def: "A tihai played without any gap between its three repetitions.", aka: ["bedam tihai"] },
  damdar: { def: "A tihai played with a gap (dam) between its three repetitions.", aka: ["damdar tihai"] },
  "sawal jawab": { def: "Question and answer: the soloist plays a phrase and the tabla answers it, often shortening and accelerating.", aka: ["sawal-jawab", "question answer"] },
  jugalbandi: { def: "A duet, such as tabla with pakhawaj, sitar with tabla, or two tabla players trading improvisation.", aka: [] },
  lehra: { def: "The repeating melodic cycle (on sarangi, harmonium or sitar) that a tabla soloist plays over to keep the taal audible.", aka: ["lehara", "nagma", "nagama"] },
  sangat: { def: "Accompaniment: supporting a vocalist, instrumentalist or dancer on the tabla.", aka: ["accompaniment", "sangath"] },
  solo: { def: "Featured tabla playing where the drums lead, built from peshkar, kaidas, relas, tukdas, gats and chakradars over a lehra.", aka: ["tabla solo", "ekal vadan"] },
  masitkhani: { def: "The slow, vilambit gat style for sitar in Teentaal, named after Masit Khan.", aka: ["masitkhani gat"] },
  razakhani: { def: "The fast, drut gat style for sitar in Teentaal, named after Raza Khan.", aka: ["razakhani gat"] },

  // ---- lineage, learning, culture
  gharana: { def: "A stylistic lineage or school of tabla with its own technique and repertoire, passed from guru to disciple. The six are Delhi, Ajrada, Lucknow, Farukhabad, Benares and Punjab.", aka: ["gharanas", "school of tabla"] },
  "guru shishya": { def: "The teacher-disciple tradition of transmission, often lived out gurukul style through daily immersion and oral teaching.", aka: ["guru shishya parampara", "gurukul"] },
  "ganda bandhan": { def: "The ceremony where a thread is tied on a student's wrist to mark formal discipleship.", aka: ["shagird ceremony"] },
  taleem: { def: "Systematic instruction, transmitted seena-ba-seena (directly, chest to chest) from teacher to student.", aka: [] },
  chilla: { def: "An intense forty-day retreat of uninterrupted, focused practice.", aka: [] },
  ustad: { def: "An honorific title for a master, used in the Muslim tradition (the Hindu equivalent is Pandit).", aka: [] },
  pandit: { def: "An honorific title for a master, used in the Hindu tradition (the Muslim equivalent is Ustad).", aka: [] },

  // ---- physics, history, relatives
  "raman effect": { def: "The physicist C. V. Raman showed that the loaded tabla membrane vibrates with near-harmonic overtones, which is why the dayan sounds a clear musical pitch.", aka: ["harmonic overtones"] },
  pushkara: { def: "Ancient Indian drums described in the Natya Shastra, played as a set of three, an early ancestor of the paired-drum idea.", aka: ["puskara"] },
  pakhawaj: { def: "The barrel-shaped, two-headed horizontal drum of dhrupad, an ancestor and sibling of the tabla. Many tabla bols and the paran form derive from it.", aka: ["mridang"] },
  mridangam: { def: "The South Indian (Carnatic) double-headed barrel drum, the counterpart of the pakhawaj, with its own bols and tala system.", aka: ["mridang south"] },
  dholak: { def: "A folk barrel drum with two heads, used in qawwali, folk and film music, often alongside the tabla.", aka: [] },
  naqqara: { def: "A pair of kettle drums played with sticks, used ceremonially; a likely influence on the bowl shape of the bayan.", aka: ["nagara"] },
  "amir khusrau": { def: "The 13th to 14th century poet-musician often popularly credited with inventing the tabla. Scholars consider this a legend, with no supporting evidence from his time.", aka: ["khusrau"] },
  "siddhar khan": { def: "Ustad Siddhar Khan Dhadi, the 18th century Delhi master regarded as the founder of the first tabla gharana and the recorded tabla lineage.", aka: ["siddhar khan dhadi", "sidhar khan"] },

  // ---- playing style & a few more forms
  baj: { def: "The playing style, or touch, of the tabla. Dilli baj (the closed, two-finger style played at the rim) is light and refined; purab baj (the open, eastern style played further inside the head) is fuller, bolder and more powerful. The word also names the overall character of a gharana. Most players today study both.", aka: ["playing style", "dilli baj", "purab baj", "khula baj", "band baj", "open style", "closed style"] },
  bant: { def: "A Benares theme-and-variation form, developed like a kaida and often paired with a laggi section.", aka: [] },
  fard: { def: "A fixed cadential form of the Benares gharana using pakhawaj-derived phrases and asymmetric phrasing that builds tension to sam: a guarded specialty of the lineage.", aka: ["fard gat"] },
  nauhakka: { def: "An extended tihai of nine repetitions (nau means nine), usually grouped three-by-three, with the final Dha landing on sam.", aka: ["nauhakka tihai"] },
  "gat kayda": { def: "A hybrid form with a kayda's theme-and-variation structure but a gat's fixed, contrasting phrases, so it allows only limited variation.", aka: ["gat-kayda", "gatkayda"] },
  kundal: { def: "The rawhide ring at the base of the drum that the lacing is fastened to.", aka: [] },
  gidri: { def: "The ring-shaped cushion the drums rest on so they sit upright and stable while you play.", aka: ["gidari", "ring cushion"] },
  "dhere dhere": { def: "A smooth, rolling two-hand phrase (DhereDhere) used to build flowing relas; the bayan plays a big role in shaping it.", aka: ["dheradhera", "dhere"] },
  kitataka: { def: "A four-stroke compound phrase (Ki-Ta-Ta-Ka), a fast building block in relas and kaydas.", aka: ["kittaka"] },
  gadigana: { def: "A rolling, bass-led compound phrase (Ga-Di-Ga-Na) common in tukras and parans.", aka: ["gadi gana"] },
};

// ---- the six gharanas as their own entries
const GHARANAS = {
  "delhi gharana": "Delhi is the oldest gharana, founded by Ustad Siddhar Khan Dhadi. It is a closed (band) style using mainly two fingers near the rim, prized for crisp qaidas and classical peshkar.",
  "ajrada gharana": "Ajrada, founded by brothers Kallu Khan and Meeru Khan of Ajrara village, is a closed style with rich bayan work and a fondness for triplet (tisra) phrasing and intricate qaidas.",
  "lucknow gharana": "Lucknow, founded by brothers Modu Khan and Bakhshu Khan, is an open (khula) style shaped by kathak dance and the pakhawaj, strong in gats, parans and chakradars.",
  "farukhabad gharana": "Farukhabad, founded by Haji Vilayat Ali Khan, blends the open and closed styles and has the richest repertoire of gats, relas and chalans.",
  "benares gharana": "Benares, founded by Pandit Ram Sahai, is a powerful open style with strong pakhawaj influence, famous for uthans, stuti parans and dramatic solos.",
  "punjab gharana": "Punjab grew from the pakhawaj tradition (lineage of Lala Bhawani Das). It is open and powerful, with large compositions and sophisticated layakari. Ustad Alla Rakha and Ustad Zakir Hussain are of this gharana.",
};

// ---- major artists
const PEOPLE = {
  "zakir hussain": "Ustad Zakir Hussain (1951 to 2024) was the most celebrated tabla virtuoso of the modern era, of the Punjab gharana, son and disciple of Ustad Alla Rakha, and a global ambassador for the instrument with multiple Grammy awards.",
  "alla rakha": "Ustad Alla Rakha (1919 to 2000) was a legendary Punjab gharana maestro, famed for accompanying Pandit Ravi Shankar and for introducing the tabla to Western audiences, and the father and guru of Ustad Zakir Hussain.",
  "ahmed jan thirakwa": "Ustad Ahmed Jan Thirakwa (1892 to 1976) is regarded as one of the greatest tabla soloists of the 20th century, associated above all with the Farukhabad gharana.",
  "kishan maharaj": "Pandit Kishan Maharaj (1923 to 2008) was a towering Benares gharana soloist and accompanist, awarded the Padma Vibhushan.",
  "samta prasad": "Pandit Samta Prasad, known as Gudai Maharaj (1921 to 1994), was a famed Benares gharana master who also played for Indian cinema.",
  "anokhelal mishra": "Pandit Anokhelal Mishra (1914 to 1958) was a Benares master celebrated for the dazzling clarity and speed of his Na Dhin Dhin Na.",
  "kanthe maharaj": "Pandit Kanthe Maharaj (1880 to 1970) was a leading Benares gharana master and teacher.",
  "swapan chaudhuri": "Pandit Swapan Chaudhuri (born 1945) is a renowned Lucknow gharana soloist and accompanist and a long-time teacher at the Ali Akbar College of Music in California.",
  "anindo chatterjee": "Pandit Anindo Chatterjee (born 1954) is a celebrated Farukhabad gharana soloist and accompanist, a disciple of Pandit Jnan Prakash Ghosh.",
  "ravi shankar": "Pandit Ravi Shankar (1920 to 2012) was the sitar maestro whose world tours with Ustad Alla Rakha brought Hindustani music, and the tabla, to global audiences.",
  "yogesh samsi": "Pandit Yogesh Samsi (born 1968) is one of the foremost tabla maestros of his generation and a torch-bearer of the Punjab gharana, a disciple of Ustad Alla Rakha, and one of Ajinkya's gurus.",
  "surinder mann": "Ustad Surinder Mann is the teacher with whom Ajinkya began the tabla at age 6, in Sunnyvale, California.",
  "yashwant vaishnav": "Shri Yashwant Vaishnav is a tabla guru with whom Ajinkya undertook a month of intensive, gurukul-style study in Mumbai.",
  "ajinkya ranade": "Ajinkya Ranade is a versatile tabla artist and the founder of this school. He began the tabla at age 6 under Ustad Surinder Mann and trained under Pandit Yogesh Samsi and Shri Yashwant Vaishnav, with over 13 years in music.",
  "suresh talwalkar": "Pandit Suresh Talwalkar is a celebrated tabla soloist and accompanist known for his deep command of laya and his distinctive, powerful style, and a revered teacher of many fine players.",
  "subhankar banerjee": "Pandit Subhankar Banerjee (1966 to 2024) was a leading Farukhabad-influenced tabla soloist and accompanist, admired for his clarity, power and musicality on the concert stage.",
  "sandeep das": "Sandeep Das is a Grammy-winning tabla artist of the Benares gharana, a member of the Silk Road Ensemble, known for bringing the tabla to global audiences and for his clear teaching of the taals.",
  "pandurang pawar": "Pandurang Pawar is an accomplished Indian classical tabla player admired for his technical command and expressive, emotive playing in solo and jugalbandi.",
};

/* ------------------------------------------------------------- BOL DATA */
const BOLS = {
  na: { name: "Na (Ta)", hand: "right", sound: "a clear, ringing edge tone", tip: "Strike the kinar (rim) with the index finger and let it ring, the ring finger resting to shape the pitch." },
  tin: { name: "Tin", hand: "right", sound: "a rounder open ring", tip: "Played on the maidan near the syahi for a softer resonance than Na." },
  tete: { name: "TeTe", hand: "right", sound: "short, dry, closed taps", tip: "Two fingers alternating on the syahi, the engine of fast rolls." },
  tu: { name: "Tu (Tun)", hand: "right", sound: "a full open ring", tip: "One finger on the syahi, letting the whole head sing: the dayan's fundamental." },
  ge: { name: "Ge (Ga)", hand: "left", sound: "a deep, open, resonant bass", tip: "Open bass on the bayan with the fingers; slide the heel to bend the pitch." },
  ka: { name: "Ka (Kat)", hand: "left", sound: "a flat, closed, muted thud", tip: "The whole flat hand mutes the bayan: the closed counterpart of Ge." },
  dha: { name: "Dha", hand: "both", sound: "a powerful combined tone", tip: "Na (treble) and Ge (bass) struck together as one: the most important bol, and it marks sam in most thekas." },
  dhin: { name: "Dhin", hand: "both", sound: "a full, resonant tone", tip: "Tin (treble) joined with Ge (bass)." },
  tirakita: { name: "Tirakita", hand: "both", sound: "a quick four-stroke roll", tip: "ti ra ki ta: a rolling filler that drives speed. Practise it slowly and evenly." },
};

/* --------------------------------------------------------- TAAL THEKAS
   The signature bol pattern of each taal, with beats and clap/wave structure. */
const TAAL_THEKAS = {
  teentaal: { name: "Teentaal", beats: 16, vibhag: "4+4+4+4", marks: "sam on 1, claps on 5 and 13, khali (wave) on 9", theka: "Dha Dhin Dhin Dha, Dha Dhin Dhin Dha, Dha Tin Tin Ta, Ta Dhin Dhin Dha", alt: ["teental", "tintal", "trital", "teen taal"] },
  rupak: { name: "Rupak", beats: 7, vibhag: "3+2+2", marks: "it begins on the khali, so the first beat is an open, un-clapped sam", theka: "Tin Tin Na, Dhin Na, Dhin Na", alt: ["roopak", "rupak taal"] },
  jhaptaal: { name: "Jhaptaal", beats: 10, vibhag: "2+3+2+3", marks: "sam on 1, khali on 6", theka: "Dhin Na, Dhin Dhin Na, Tin Na, Dhin Dhin Na", alt: ["jhaptal", "jhap taal", "japtal"] },
  ektaal: { name: "Ektaal", beats: 12, vibhag: "2+2+2+2+2+2", marks: "sam on 1, used widely for slow khyal", theka: "Dhin Dhin, Dhage Tirakita, Tu Na, Kat Ta, Dhage Tirakita, Dhin Na", alt: ["ektal", "ek taal", "ektaal"] },
  "aada chautaal": { name: "Aada Chautaal", beats: 14, vibhag: "", marks: "a 14-beat cycle (also called Arachartal)", theka: "Dhin, Tirakita Dhi Na, Tu Na Kat Ta, Tirakita Dhi Na Dhi, Dhi Na", alt: ["arachartal", "aadha chautal", "ada chautal", "aada chautal"] },
  keherwa: { name: "Keherwa", beats: 8, vibhag: "4+4", marks: "sam on 1, khali on 5; no single 'standard' version exists", theka: "Dha Ge Na Ti, Na Ka Dhin Na", alt: ["kaharwa", "kehrwa", "kaherwa"] },
  dadra: { name: "Dadra", beats: 6, vibhag: "3+3", marks: "sam on 1, khali on 4", theka: "Dha Dhin Na, Dha Tin Na", alt: ["dadraa", "daadra"] },
};

/* ----------------------------------------------------------- TOPIC ENTRIES */
const TOPICS = [
  { id: "how-to-start", tags: ["how do i start", "how to begin", "where do i begin", "getting started", "first steps", "how to learn tabla", "begin learning"],
    answer: "Start with the language, not speed. Learn to recite the bols (padhant), then produce one clean, resonant sound for each. In this portal, begin with Foundations, then the Basic Bols, then Teentaal. Clarity (nikaas) comes first; speed follows.",
    actions: [{ label: "Open the lessons", href: "/dashboard" }] },
  { id: "how-long", tags: ["how long to learn", "how long does it take", "how many years", "time to learn", "how fast can i learn", "become good", "get good"],
    hint: ["learn", "take", "me", "beginner"],
    answer: "Tabla is a lifelong art, but you do not wait years to enjoy it. With steady riyaz, beginners play simple compositions within a couple of months. Consistency matters far more than talent." },
  { id: "is-it-hard", tags: ["is tabla hard", "is it difficult", "how hard is tabla", "is it easy", "difficulty"],
    answer: "It is deep but very learnable with good guidance. Early wins come quickly, and there is always another layer, which is what makes it such a rewarding lifelong instrument." },
  { id: "practice", tags: ["how to practice", "practice tips", "how much practice", "riyaz tips", "how do i improve", "get better", "daily practice"],
    answer: "Riyaz means regular, focused practice. Even 20 to 30 minutes a day, slow and clean, beats rare long sessions. Recite first, then play to a metronome, and raise the laya only once every bol is clear.",
    actions: [{ label: "Open the metronome", href: "/practice" }] },
  { id: "posture", tags: ["how to sit", "how do i sit", "sit", "posture", "how to hold", "sitting position", "how do you play", "hand position", "where to strike"],
    answer: "Sit cross-legged with a straight, relaxed spine. The dayan (right) tilts slightly away from you; the bayan (bass) sits parallel to the floor, close to your body. Relaxed hands are the foundation of clean sound." },
  { id: "bass-technique", tags: ["bayan technique", "bass sound", "how to bend the bass", "left hand", "modulate bass", "ge sound", "heel of the hand", "ghissa"],
    answer: "The bayan's magic is modulation. The open Ge rings, and pressing and sliding the heel of the palm across the skin bends the pitch (the talking bass). The closed Ka mutes it. Build the wrist slowly; it is all in the heel." },
  { id: "how-to-tune", tags: ["how to tune", "how do i tune", "tune", "tuning", "tune the tabla", "hammer", "pitch", "what note", "tune dayan"],
    answer: "Tune the dayan with the small hammer. Tap the gatta blocks or the braided gajra down to raise the pitch and up to lower it, until it matches your tonic (Sa). Tap at points around the head so every point sounds the same. It is a feel that develops with time." },
  { id: "buy-tabla", tags: ["buy a tabla", "which tabla", "what tabla to buy", "purchase", "recommend a tabla", "need my own", "where to buy", "cost of a tabla"],
    answer: "Quality varies a lot, and a poor set holds you back, so it is worth getting guidance before buying. Ajinkya helps students pick a good beginner set. You do not need your own to start the conversation, but you will want one to practise on.",
    actions: [{ label: "Ask Ajinkya", href: PERSONAL_SITE }] },
  { id: "care", tags: ["care", "maintenance", "look after", "store the tabla", "humidity", "crack", "take care of"],
    answer: "Keep the tabla out of direct heat, sun and damp. Loosen the tension a little if storing it for a long time or flying, dust the syahi gently, and never leave it in a hot car. The skins and syahi are sensitive to extremes." },
  { id: "notation", tags: ["notation", "how is tabla written", "read bols", "write bols", "sheet music", "bhatkhande"],
    answer: "Tabla is learned orally through its bols, often written across the beats of a taal with X for sam and 0 for khali. The Bhatkhande system puts this on paper, but reciting the bols stays at the heart of learning.",
    actions: [{ label: "See it in the free guide", href: "/learn" }] },
  { id: "improvise", tags: ["improvise", "improvisation", "how to improvise", "make my own", "create variations", "develop kaida"],
    answer: "Improvisation grows from the kaida. Take the theme and expand it systematically by rearranging, doubling, displacing and extending its bols through paltas, always resolving back to the theme and to sam. Structure first, freedom later." },
  { id: "count-teentaal", tags: ["how to count teentaal", "count the cycle", "where is sam", "clap pattern", "where to clap", "how to keep taal"],
    answer: "In Teentaal (16 beats) clap on 1 (sam), 5 and 13, and wave on 9 (khali). Recite Dha Dhin Dhin Dha while marking those with your hands until you feel the cycle turn. The interactive cycle trainer in the Teentaal module helps." },
  { id: "solo-structure", tags: ["tabla solo", "solo structure", "how is a solo", "solo order", "what is in a solo", "peshkar qaida rela"],
    answer: "A tabla solo is played over a repeating lehra melody. A common order is an opening theka or uthan, then peshkar, then kaidas building in complexity, then relas, then fixed pieces (tukdas, gats, parans, chakradars), closing with a grand tihai on sam.",
    actions: [{ label: "Hear full solos in the free guide", href: "/learn" }] },

  // ---- free self-paced guide (public, text-based reference page)
  { id: "free-guide", tags: ["free guide", "free resource", "free resources", "self study", "self-study", "self paced", "self-paced", "learn on my own", "learn by myself", "study on my own", "read about tabla", "reference", "learn tabla for free", "free lessons", "is there a guide", "learn page", "the guide", "listen to tabla", "watch tabla", "youtube", "performances to watch", "compositions to listen", "audio examples", "learn for free"],
    hint: ["free", "guide", "self", "own", "read", "reference", "listen", "watch", "youtube"],
    answer: "Yes. There is a free, self-paced Learn Tabla guide on this site: the two drums, the bols, taals and thekas, the compositional forms and the six gharanas, with real composition themes to practice and performances to listen to. It is separate from the portal's interactive lessons, so you can read it anytime, no account needed.",
    actions: [{ label: "Open the free guide", href: "/learn" }] },

  // ---- school / portal
  { id: "what-is-arts", tags: ["what is arts", "what is this", "what is resonance", "about the school", "what is this site", "tabla school"],
    answer: "This is ARTS, the Ajinkya Ranade Tabla School: a complete learning portal with interactive lessons, taal trainers, a practice metronome, 1 to 1 lesson booking and progress tracking, rooted in a real traditional curriculum." },
  { id: "join", tags: ["how do i join", "enroll", "sign up", "become a student", "how to enroll", "get access", "request access"],
    answer: "To become a student, reach out to Ajinkya to request access. He will set you up and guide your start, and then you sign in here to reach your lessons and book classes.",
    actions: [{ label: "Request access", href: PERSONAL_SITE }, { label: "Sign in", href: "/login" }] },
  { id: "book-lesson", tags: ["book a lesson", "schedule a lesson", "how to book", "1 to 1 lesson", "private lesson", "my lessons", "appointment"],
    answer: "Head to My Lessons to see your scheduled classes. Lessons are booked by Ajinkya, now with easy weekly recurring slots, and you receive a calendar invite and reminders.",
    actions: [{ label: "My Lessons", href: "/book" }] },
  { id: "metronome", tags: ["metronome", "practice page", "practice tool", "where is the metronome", "keep time tool"],
    answer: "The Metronome page gives you a clean click to practise steady laya, which is the core of good riyaz.",
    actions: [{ label: "Open the metronome", href: "/practice" }] },
  { id: "lessons-where", tags: ["where are the lessons", "find lessons", "my modules", "course", "curriculum", "dashboard"],
    answer: "Your lessons live on the Dashboard, grouped into modules that unlock as you progress: from Foundations and the Basic Bols through Teentaal, Kaidas, and the Light Taals.",
    actions: [{ label: "Go to Dashboard", href: "/dashboard" }] },
  { id: "progress", tags: ["progress", "unlock", "locked module", "when does it unlock", "mark complete", "how does progress work"],
    answer: "Modules open on a schedule as you grow, and completed lessons are tracked. Your teacher can also unlock a module early and keeps a running log of what you have covered." },
  { id: "cost", tags: ["cost", "price", "how much", "pricing", "fees", "tuition"],
    answer: "Pricing depends on format and frequency, so Ajinkya shares the details directly once he knows what you are looking for.",
    actions: [{ label: "Ask Ajinkya", href: PERSONAL_SITE }] },
  { id: "contact", tags: ["contact", "reach", "get in touch", "email", "talk to a human", "reach ajinkya", "phone"],
    answer: `You can reach Ajinkya by email at ${TEACHER_EMAIL}, or through ajinkyaranade.com.`,
    actions: [{ label: "Email", href: `mailto:${TEACHER_EMAIL}` }, { label: "ajinkyaranade.com", href: PERSONAL_SITE }] },
  { id: "who-ajinkya", tags: ["who is ajinkya", "about ajinkya", "about the teacher", "who teaches", "who is the teacher", "ajinkya ranade"],
    answer: PEOPLE["ajinkya ranade"],
    actions: [{ label: "Meet Ajinkya", href: PERSONAL_SITE }] },

  // ---- history / culture
  { id: "history", tags: ["history of tabla", "origin of tabla", "where did tabla come from", "who invented tabla", "how old is the tabla"],
    answer: "The tabla took its modern form in North India in the 18th century, growing out of older drumming traditions like the pakhawaj and the ancient pushkara drums. No single inventor is documented; the stories crediting Amir Khusrau are considered legends. Ustad Siddhar Khan Dhadi of Delhi is regarded as the founder of the first gharana." },
  { id: "famous", tags: ["famous tabla players", "best tabla player", "legends", "greatest tabla", "who is the best"],
    answer: "Modern icons include Ustad Zakir Hussain and his father Ustad Alla Rakha, alongside greats like Ahmed Jan Thirakwa, Kishan Maharaj and Samta Prasad. Ajinkya's own guru, Pandit Yogesh Samsi, is a leading maestro today." },
  { id: "gharanas-list", tags: ["gharanas", "six gharanas", "styles of tabla", "tabla schools", "list the gharanas", "how many gharanas"],
    answer: "The six tabla gharanas are Delhi, Ajrada, Lucknow, Farukhabad, Benares and Punjab. Each is a lineage with its own technique, repertoire and aesthetic. Through Pandit Yogesh Samsi, Ajinkya's playing connects to the Punjab gharana.",
    actions: [{ label: "Read about the gharanas", href: "/learn" }] },
];

/* ------------------------------------------------ extra FAQ-style entries */
const FAQS = [
  ["why does the tabla have a pitch|why is tabla tuned|does tabla have a note|pitched drum", "Because of the syahi, the black weighted patch at the centre of the skin. Its mass makes the head vibrate with near-harmonic overtones, so the dayan sounds a clear, tuned note (a property studied by the physicist C. V. Raman)."],
  ["difference between dayan and bayan|dayan vs bayan|which hand plays which drum", "The dayan is the smaller wooden drum, played with the right hand and tuned to the tonic. The bayan is the larger bass drum, played with the left hand, whose pitch you bend with the heel of the palm."],
  ["can left handed people play|left handed tabla|am i too left handed", "Yes. For a left-handed player the two drums are simply swapped, with the dayan played by the left hand."],
  ["most common taal|which taal is most common|commonest rhythm", "Teentaal (16 beats) is the most common taal in classical music, and Keherwa (8 beats) is the most common in light and popular music."],
  ["is tabla used in dhrupad|dhrupad drum|what drum for dhrupad", "Traditionally no. Dhrupad is accompanied by the pakhawaj, not the tabla."],
  ["what is the theka of teentaal|teentaal theka|teentaal pattern", "Dha Dhin Dhin Dha, Dha Dhin Dhin Dha, Dha Tin Tin Ta, Ta Dhin Dhin Dha. Sam on 1, claps on 1, 5 and 13, wave (khali) on 9."],
  ["why do players use powder|talcum|chalk on tabla", "Talcum powder reduces friction and absorbs sweat, which lets the fingers move fast and the heel glide smoothly on the bayan."],
  ["what is tabla made of|materials of tabla|what is the tabla made from", "The dayan is carved hardwood, often sheesham (rosewood); the bayan is copper, brass, steel or clay. Both heads are goatskin with a syahi of iron-powder paste, laced with leather straps and tuned with wooden gatta blocks."],
  ["which taal starts on khali|taal that begins on khali|rupak khali", "Rupak (7 beats) is the well-known taal whose very first beat is both sam and khali."],
  ["difference between qaida and rela|qaida vs rela", "Both are developed through variations, but a rela is built on fast rolling bol groups and prizes continuous flow and speed, while a qaida emphasises structure and clarity at a moderate to fast tempo."],
  ["what is a lehra|what is nagma|melody for tabla solo", "A lehra, also called nagma, is a short repeating melody spanning one cycle of the taal, played on sarangi or harmonium during a tabla solo so the cycle and the sam stay audible."],
  ["which taals for thumri|thumri taal|light classical taal", "Thumri and light classical forms use taals like Deepchandi, Jat, Addha, Keherwa, Dadra and Chanchar, often ending with a fast laggi section."],

  // ---- anatomy & construction
  ["what are the parts of the tabla|parts of the drum|anatomy of tabla|components of tabla|parts of a tabla", "The dayan (small wooden treble drum) and bayan (large bass drum), each with a goatskin head (pudi) carrying the black syahi, surrounded by the open maidan and the outer rim (kinar). A braided gajra binds the head, leather lacing (baddhi) sets the tension over wooden gatta blocks, and a small hammer (hathodi) tunes it."],
  ["what is the tabla made of|materials|what is tabla made from|wood metal tabla", "The dayan is carved hardwood, often sheesham (rosewood); the bayan is copper, brass, steel or clay. Both heads are goatskin with a syahi of iron-powder paste, laced with leather straps and tuned with wooden gatta blocks."],

  // ---- bols
  ["how many bols are there|list of bols|what are the main bols|all the bols", "Core bols include open treble strokes Na/Ta, Tin and Tun; closed strokes TeTe and Ka; the bass Ge; and the combined strokes Dha (Na+Ge) and Dhin (Tin+Ge). Compound phrases like TiRaKiTa, DhaGe, KiTaTaKa and GadiGana are built from these."],
  ["what are open bols|resonant bols|ringing strokes", "Resonant (open) bols ring and sustain: on the dayan, Na/Ta at the rim and Tin/Tun near the syahi; on the bayan, the open Ge. Dha and Dhin pair a treble ring with the Ge bass."],
  ["what are closed bols|muted bols|non resonant strokes|damped strokes", "Closed (muted) bols are dry and damped: TeTe and Tak on the dayan, and Ka (Kat) on the bayan, where the flat hand mutes the bass. They articulate fast phrases."],

  // ---- taals & thekas
  ["how many taals are there|common taals|which taals should i learn|important taals", "Common classical taals include Teentaal (16), Jhaptaal (10), Ektaal (12), Aada Chautaal (14) and Rupak (7), plus the lighter Keherwa (8) and Dadra (6). Teentaal is the usual first taal."],
  ["which taal begins on khali|taal that starts on khali|rupak sam khali", "Rupak (7 beats) is the well-known taal whose very first beat is both the sam and a khali, so it begins open and un-clapped."],

  // ---- forms
  ["what forms are there|types of compositions|list of forms|kinds of tabla compositions", "Theme-and-variation forms: peshkar, kayda, rela, gat, gat-kayda, bant and chalan. Fixed cadential forms: tukda, mukhda, mohra, chakradar, paran, uthan, fard, the tihai and its nine-fold cousin the nauhakka. Light forms: laggi and ladi."],
  ["difference between tukda and chakradar|tukda vs chakradar", "A tukda is a short fixed piece ending in one tihai on sam. A chakradar wraps a whole tukda (or tihai) and plays it three times, so only the very last Dha lands on sam."],
  ["difference between kayda and peshkar|kayda vs peshkar|peshkar vs kaida", "A peshkar is the slow, improvisatory opening that explores the taal and tone; a kayda is a stricter theme-and-variation form developed only from its own bols. A solo usually opens with peshkar, then moves into kaydas."],
  ["what is a bant|bant form", "A bant is a Benares theme-and-variation form, developed like a kayda and often paired with a laggi section."],

  // ---- baj & notation
  ["what is purab baj|what is dilli baj|open vs closed baj|baj styles|band baj khula baj", "Dilli (kinar) baj is the closed, two-finger style played at the rim — light and refined. Purab (khula) baj is the open eastern style played inside the head with fingers together — fuller, bolder and more powerful. Most players study both."],
  ["what do the notation symbols mean|what does X mean|what does 0 mean in tabla|sam symbol|khali symbol", "In tabla notation, X marks the sam (first beat), the numerals 2, 3, 4 mark the clapped sections (taali), and 0 marks the khali (the waved, empty section). A dash (–) marks a silence or a held sound."],

  // ---- technique & learning
  ["what is the role of the bayan|why is the bayan important|importance of left hand", "The bayan is the expressive heart of the sound: its open Ge rings, and the heel of the palm presses and slides to bend the pitch (the 'talking bass'). It drives relas and shapes nearly every phrase."],
  ["how do i get a clear sound|why does my tabla sound dull|clarity of sound|clean strokes", "Clarity (nikaas) comes from relaxed hands, correct strike zones and letting the open strokes ring. Practise slowly so every bol speaks cleanly before adding speed — clean and slow beats fast and muddy."],
  ["do i need a teacher|can i learn tabla alone|self taught tabla|learn without a guru", "You can start on your own with resources like our free guide, but tabla is an oral tradition: a teacher corrects your sound, hands and timing in ways videos cannot. The best path blends steady self-practice with real guidance."],
];

/* ---------------------------------------------- build the full entry list */
function buildEntries() {
  const entries = [...TOPICS];

  for (const [term, { def, aka = [] }] of Object.entries(GLOSSARY)) {
    entries.push({
      id: `def-${term}`,
      tags: [term, ...aka, `what is ${term}`, `what is a ${term}`, `what are ${term}`, `define ${term}`, `${term} meaning`, `explain ${term}`, `meaning of ${term}`],
      answer: `${cap(term)}: ${def}`,
    });
  }

  for (const [name, text] of Object.entries(GHARANAS)) {
    const short = name.replace(" gharana", "");
    entries.push({
      id: `gharana-${short}`,
      tags: [name, short, `${short} gharana`, `${short} style`, `tell me about ${short}`, `what is the ${name}`],
      answer: text,
    });
  }

  for (const [name, bio] of Object.entries(PEOPLE)) {
    entries.push({
      id: `who-${name.replace(/\s+/g, "-")}`,
      tags: [name, `who is ${name}`, `about ${name}`, `tell me about ${name}`],
      answer: bio,
    });
  }

  for (const [slug, b] of Object.entries(BOLS)) {
    const handTxt = b.hand === "both" ? "both hands together" : `the ${b.hand} hand`;
    entries.push({
      id: `bol-${slug}`,
      tags: [slug, b.name.toLowerCase(), `what is ${slug}`, `how to play ${slug}`, `how do you play ${slug}`, `${slug} bol`, `play ${slug}`],
      answer: `${b.name} is played with ${handTxt} for ${b.sound}. ${b.tip}`,
    });
  }

  // Theka patterns first, so a "<taal> theka" query returns the actual bols
  // (rather than the trainer blurb) when the two tie on score.
  for (const [key, t] of Object.entries(TAAL_THEKAS)) {
    entries.push({
      id: `theka-${key}`,
      tags: [`${t.name} theka`, `theka of ${t.name}`, `${t.name} bols`, `${t.name} pattern`, `how do i play ${t.name}`, `bols of ${t.name}`, `${t.name} ${t.beats} beats`, `${t.name} ${t.beats} matras`, ...(t.alt || []), ...(t.alt || []).map((a) => `${a} theka`)],
      answer: `${t.name} has ${t.beats} beats${t.vibhag ? ` (${t.vibhag})` : ""}. Its theka is: ${t.theka}.${t.marks ? ` Structure: ${t.marks}.` : ""}`,
      actions: [{ label: "Try the taal trainers", href: "/dashboard" }, { label: "See all thekas in the free guide", href: "/learn" }],
    });
  }

  for (const [key, t] of Object.entries(TAALS)) {
    entries.push({
      id: `taal-${key}`,
      tags: [key, t.name.toLowerCase(), `play ${t.name}`, `${t.name} trainer`, `how many beats in ${t.name}`, `${t.name} cycle`],
      answer: `${t.name} has ${t.beats} matras. You can play it with the interactive trainer in the lessons: a metronome, laya presets, and tap-to-hear on every matra.`,
      actions: [{ label: "Open the taal trainers", href: "/dashboard" }],
    });
  }

  for (const [tagStr, answer] of FAQS) {
    entries.push({ id: `faq-${tagStr.slice(0, 12)}`, tags: tagStr.split("|"), answer });
  }

  return entries;
}

export const KNOWLEDGE = buildEntries();

/* --------------------------------------------------- GENERATIVE: quiz / drill */
const QUIZ_BANK = [
  { q: "How many matras are in Teentaal?", a: "16, in four vibhags of four." },
  { q: "Which matra is the khali in Teentaal?", a: "Matra 9, marked by a wave." },
  { q: "What is the sam?", a: "The first beat of the cycle, where phrases resolve." },
  { q: "Which hand plays the bayan?", a: "The left hand (the bass drum)." },
  { q: "What is a kaida?", a: "A theme-and-variation form, the core of solo tabla." },
  { q: "What does the bol Dha combine?", a: "Na (treble) and Ge (bass), struck together." },
  { q: "What is the black circle on the skin called?", a: "The syahi." },
  { q: "How many beats are in Dadra?", a: "6 matras." },
  { q: "What is padhant?", a: "Reciting the bols aloud while marking the taal." },
  { q: "Name the six tabla gharanas.", a: "Delhi, Ajrada, Lucknow, Farukhabad, Benares and Punjab." },
  { q: "What is a tihai?", a: "A phrase played three times, landing on sam." },
  { q: "What does laya mean?", a: "Tempo: vilambit (slow), madhya (medium), drut (fast)." },
  { q: "Who was Ustad Alla Rakha?", a: "A Punjab gharana master and the guru and father of Zakir Hussain." },
  { q: "Which drum traditionally accompanies dhrupad?", a: "The pakhawaj, not the tabla." },
];

const DRILLS = [
  "Teentaal theka, slow and clean:\n```\nDha Dhin Dhin Dha | Dha Dhin Dhin Dha\nDha Tin Tin Ta | Ta Dhin Dhin Dha\n```\nRecite first, then play at Vilambit. Clap on 1, 5 and 13, wave on 9.",
  "Dha and Tete control drill:\n```\nDhaDha Tete DhaDha Tete\n```\nKeep every stroke even and raise the laya only when it is spotless.",
  "Tirakita roll:\n```\nTiRaKiTa TiRaKiTa TiRaKiTa TiRaKiTa\n```\nStart very slow. Clarity before speed, always.",
  "Dadra accompaniment:\n```\nx Dha Dhin Na | o Dha Tin Na\n```\nLoop it smoothly and feel the 6-beat lilt.",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ------------------------------------------------- ON-DEVICE AI GROUNDING
   Compact system prompt used ONLY when the visitor's browser has a local
   on-device model (Chrome's Prompt API / Gemini Nano). It grounds that model
   in the school's facts so open-ended answers stay accurate — at zero API /
   token cost, since the model runs entirely on the visitor's machine. The
   keyword engine above is always the fallback. */
export const ASSISTANT_SYSTEM_PROMPT = `You are the warm, knowledgeable tabla guide for ${BRAND_FULL} (${BRAND_SHORT}), the online tabla school of Ajinkya Ranade (ajinkyaranademusic.com).

You help visitors with two things: the tabla (the North Indian / Hindustani classical pair of hand drums) and this school.

About the school: it offers interactive lessons, taal (rhythm-cycle) trainers, a practice metronome, 1:1 lesson booking and progress tracking. New students request access through ${PERSONAL_SITE}; general contact is ${TEACHER_EMAIL}. There is a free, self-paced guide at /learn. Pricing and schedules are arranged directly with Ajinkya.

Reliable facts: the tabla is a pair of drums — the small wooden treble dayan (right hand) and the large metal bass bayan (left hand), whose pitch bends under the heel of the palm; the black circle on each head is the syahi, which gives the tuned tone. Rhythm is organised in cycles (taal) measured in beats (matra); the first, most important beat is the sam. Bols are spoken syllables (Dha, Dhin, Na, Tin, TiRaKiTa) that name strokes. Core forms include peshkar, kayda, rela, tukda, chakradar, paran and the tihai. The six gharanas are Delhi, Ajrada, Lucknow, Farrukhabad, Benares and Punjab. Teentaal has 16 beats. Ajinkya began tabla at age 6 and trained under Ustad Surinder Mann, Pandit Yogesh Samsi and Shri Yashwant Vaishnav.

Style: reply in 2-4 clear, warm sentences. Be accurate about tabla, music and rhythm. If asked for private school specifics you don't know (exact prices, schedules, a student's data), say so and suggest contacting Ajinkya. You may help with general questions, but gently keep the focus on tabla and learning. Never invent facts about real, named individuals.`;

/* ----------------------------------------------------------------- GREETING */
export const greeting =
  "Namaste. I am your tabla guide. Ask me about any bol, taal, term, gharana, artist or technique, or say 'quiz me' or 'give me a practice drill'.";

export const suggestions = [
  "What is a kaida?",
  "Is there a free guide?",
  "How do I play Dha?",
  "Quiz me",
  "What are the six gharanas?",
];

const fallback = {
  answer: `Good question. I do not have that one yet. For anything beyond the basics, Ajinkya is the best guide: ${TEACHER_EMAIL}.`,
  actions: [{ label: "Ask Ajinkya", href: PERSONAL_SITE }],
};

/* ================================================================== MATCHER */
const STOP = new Set(["the","a","an","is","are","do","does","did","i","to","of","for","in","on","and","or","can","could","would","how","what","where","when","with","about","please","tell","it","be","at","as","that","this","there","get","got","any","some","will","was","me","my","you","your"]);

// Common, correctly-spelled English words that must NEVER be "typo-corrected"
// into a tabla term (e.g. "there"->"dhere", "want"->..., "form"->...). The
// fuzzy corrector only fires on words outside STOP ∪ COMMON ∪ VOCAB.
const COMMON = new Set(["forms","form","want","wants","need","needs","know","learn","learning","play","playing","good","best","time","long","hard","easy","start","help","make","made","take","year","years","show","cost","price","free","name","read","list","type","types","part","parts","more","most","very","much","many","well","like","their","they","them","then","than","here","what","want","over","into","from","have","has","had","not","but","out","who","why","our","all","one","two","they","your","yours","should","really","kind","kinds","thing","things","different","people","online","near","first","last","next","week","days","area","call","email","site","page","book","music","song","songs","sound","world"]);

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const stemWord = (w) => (w.length <= 3 ? w : w.replace(/ing$/, "").replace(/ed$/, "").replace(/ies$/, "y").replace(/es$/, "").replace(/s$/, ""));
const stemText = (s) => normalize(s).split(" ").map(stemWord).join(" ");

/* ---------------------------------------------------- vocabulary (for typos)
   Every meaningful single word across all tags, stemmed. Query words that are
   not in here are corrected to the nearest vocabulary word (edit distance),
   so "gharna", "teental" or "tihi" still resolve. */
const VOCAB = (() => {
  const v = new Set();
  for (const entry of KNOWLEDGE) {
    for (const tag of entry.tags) {
      for (const w of stemText(tag).split(" ")) {
        if (w.length >= 3 && !STOP.has(w)) v.add(w);
      }
    }
  }
  return v;
})();

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 3; // early out, we never accept > 2
  const row = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return row[n];
}

/** Snap an unknown word to the closest vocabulary word, if close enough.
    Never touch stopwords / common English words — otherwise "what" snaps to
    "chat", "there" to "dhere", etc., corrupting the query. */
function fuzzyCorrect(word) {
  if (word.length < 4 || VOCAB.has(word) || STOP.has(word) || COMMON.has(word)) return word;
  const maxDist = word.length >= 7 ? 2 : 1;
  let best = word, bestD = maxDist + 1;
  for (const v of VOCAB) {
    if (Math.abs(v.length - word.length) > maxDist) continue;
    const d = levenshtein(word, v);
    if (d < bestD) { bestD = d; best = v; if (d === 1) break; }
  }
  return bestD <= maxDist ? best : word;
}

const correctText = (stext) => stext.split(" ").map(fuzzyCorrect).join(" ");

/** A human, clickable follow-up label for any knowledge entry. */
function labelFor(entry) {
  const id = entry.id || "";
  if (id.startsWith("def-")) return `What is ${id.slice(4)}?`;
  if (id.startsWith("who-")) return `Who is ${id.slice(4).replace(/-/g, " ")}?`;
  if (id.startsWith("gharana-")) return `Tell me about the ${id.slice(8)} gharana`;
  if (id.startsWith("bol-")) return `How do I play ${id.slice(4)}?`;
  if (id.startsWith("taal-")) return `What is ${id.slice(5)}?`;
  const t = entry.tags.find((x) => x.length > 8) || entry.tags[0] || "";
  return cap(t);
}

/* ----------------------------------------------------- LEARNING (local-only)
   Zero-token and offline, so "learning" means: (1) remember, per browser, which
   answer a visitor marked helpful for a given phrasing, so repeats improve; and
   (2) log questions it could not answer well into a queue Ajinkya can review and
   fold into the knowledge base. True cross-visitor learning needs a backend; a
   future version can POST these to Supabase. */
const LEARN_KEY = "tabla_assistant_learned_v1";
const UNANS_KEY = "tabla_assistant_unanswered_v1";
const entryById = new Map(KNOWLEDGE.map((e) => [e.id, e]));

function readLS(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

export function rememberHelpful(query, id) {
  if (typeof localStorage === "undefined" || !id) return;
  const key = normalize(query);
  if (!key) return;
  const m = readLS(LEARN_KEY);
  m[key] = id;
  writeLS(LEARN_KEY, m);
}

export function recordUnanswered(query) {
  if (typeof localStorage === "undefined") return;
  const key = normalize(query);
  if (!key) return;
  const m = readLS(UNANS_KEY);
  m[key] = (m[key] || 0) + 1;
  writeLS(UNANS_KEY, m);
}

/** For a future admin view: the questions people asked that stumped the guide. */
export function getUnanswered() {
  if (typeof localStorage === "undefined") return [];
  const m = readLS(UNANS_KEY);
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([q, n]) => ({ q, n }));
}

function learnedAnswer(query) {
  if (typeof localStorage === "undefined") return null;
  const id = readLS(LEARN_KEY)[normalize(query)];
  return id ? entryById.get(id) : null;
}

const asResult = (entry, related) => ({
  answer: entry.answer,
  actions: entry.actions,
  related: related || [],
  id: entry.id,
});

const GENERAL_RELATED = ["What is a kaida?", "What are the six gharanas?", "How do I play Dha?"];

export function findAnswer(rawInput) {
  const norm = normalize(rawInput);
  if (!norm) return fallback;

  if (/\b(quiz|test) (me|us)?\b|ask me|flashcard/.test(norm)) {
    const { q, a } = pick(QUIZ_BANK);
    return { answer: `Here is one.\n\n${q}\n\nAnswer: ${a}\n\nSay 'quiz me' again for another.`, actions: [{ label: "Full quizzes on the home page", href: "/" }] };
  }
  if (/\b(drill|exercise|practice phrase|practise phrase|give me.*practic|workout)\b/.test(norm)) {
    return { answer: `Try this.\n\n${pick(DRILLS)}`, actions: [{ label: "Open the metronome", href: "/practice" }] };
  }

  // 1) Anything a visitor previously taught it for this exact phrasing wins.
  const learned = learnedAnswer(rawInput);
  if (learned) return asResult(learned);

  // 2) Score every entry against the typo-corrected question, keep all hits.
  const stext = correctText(stemText(rawInput));
  const words = new Set(stext.split(" ").filter((w) => w && !STOP.has(w)));

  const scored = [];
  for (const entry of KNOWLEDGE) {
    let score = 0;
    for (const tag of entry.tags) {
      const t = stemText(tag);
      if (!t) continue;
      if (t.includes(" ")) {
        if (stext.includes(t)) score += 4 + t.split(" ").length;
      } else if (words.has(t)) score += 2.5;
      else if (t.length > 4 && stext.includes(t)) score += 1;
    }
    if (entry.hint) for (const h of entry.hint) if (words.has(stemWord(h))) score += 1.5;
    if (score > 0) scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score);

  const relatedTo = (entry) =>
    scored.filter((c) => c.entry !== entry && c.score >= 2).slice(0, 3).map((c) => labelFor(c.entry));

  const top = scored[0];
  const isCompare = /\b(difference|differ|vs|versus|compare|between)\b/.test(stext);

  // 3) Confident single answer. For "difference / vs" questions that clearly
  //    name two known things, answer about both.
  if (top && top.score >= 2.5) {
    if (isCompare && scored[1] && scored[1].score >= 2.5) {
      const [a, b] = [top.entry, scored[1].entry];
      return {
        answer: `${a.answer}\n\n${b.answer}`,
        actions: a.actions || b.actions,
        related: relatedTo(a).filter((l) => l !== labelFor(b)),
        id: a.id,
      };
    }
    return asResult(top.entry, relatedTo(top.entry));
  }

  // 4) Weak match, but it still recognised known tabla concepts: synthesise an
  //    answer from them instead of giving up.
  const concepts = scored.filter((c) => c.score >= 1).slice(0, 2);
  if (concepts.length) {
    recordUnanswered(rawInput);
    return {
      answer: `Here is what I can tell you about that.\n\n${concepts.map((c) => c.entry.answer).join("\n\n")}\n\nIf that is not quite what you meant, ask me in a different way, or reach Ajinkya directly.`,
      actions: concepts.flatMap((c) => c.entry.actions || []).slice(0, 2).concat(fallback.actions).slice(0, 2),
      related: relatedTo(concepts[0].entry),
      id: concepts[0].entry.id,
      confidence: "low",
    };
  }

  // 5) Nothing landed: stay helpful, offer directions, and log it to learn from.
  recordUnanswered(rawInput);
  return {
    answer: `I am still learning and do not have a solid answer for that yet. Try rephrasing, or pick one of these. For anything specific, Ajinkya is your best guide at ${TEACHER_EMAIL}.`,
    actions: fallback.actions,
    related: GENERAL_RELATED,
    confidence: "none",
  };
}
