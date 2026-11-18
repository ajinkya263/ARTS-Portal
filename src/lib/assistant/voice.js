/* =============================================================================
   VOICE  ·  browser-native speech, 100% local, 0 cost, no API keys
   -----------------------------------------------------------------------------
   Speech-to-text uses the Web Speech API's SpeechRecognition (Chrome, Edge,
   Safari via webkit; absent on Firefox). Text-to-speech uses speechSynthesis
   (very broad support). Both are PROGRESSIVE ENHANCEMENTS: if the browser lacks
   them, or the visitor denies the microphone, the chat still works by text.

   Security / privacy: nothing is sent to our servers and nothing is stored. The
   microphone is only ever opened on an explicit user click, and transcription
   is handled entirely by the visitor's own browser. No third-party API, no key.
   ========================================================================== */

export function sttSupported() {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function ttsSupported() {
  if (typeof window === "undefined") return false;
  return typeof window.speechSynthesis !== "undefined";
}

/**
 * Build a one-shot speech recognizer. Returns { start, stop } or null.
 *   onText(transcript)  , called with the final recognized text
 *   onState(isListening), called when listening starts/stops
 *   onError(kind)       , 'denied' | 'no-speech' | 'error'
 */
export function createRecognizer({ onText, onState, onError }) {
  const Ctor =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!Ctor) return null;

  let rec;
  try {
    rec = new Ctor();
  } catch {
    return null;
  }
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  rec.onstart = () => onState?.(true);
  rec.onend = () => onState?.(false);
  rec.onerror = (e) => {
    const kind =
      e?.error === "not-allowed" || e?.error === "service-not-allowed"
        ? "denied"
        : e?.error === "no-speech"
        ? "no-speech"
        : "error";
    onError?.(kind);
    onState?.(false);
  };
  rec.onresult = (e) => {
    const text = e?.results?.[0]?.[0]?.transcript?.trim();
    if (text) onText?.(text);
  };

  return {
    start() {
      try {
        rec.start();
      } catch {
        /* calling start() twice throws; ignore */
      }
    },
    stop() {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    },
  };
}

/* --------------------------------------------------------- VOICE SELECTION
   Voices load asynchronously, so we cache them and keep the list fresh. We
   then score every voice and pick the most natural one the device offers:
   modern "Natural"/"Neural" online voices (Edge/Chrome), Apple
   "Premium"/"Enhanced" voices, well-known human-sounding voices (Samantha,
   Ava, Siri, Aria…), and Google voices rank highest; robotic/compact engines
   rank lowest. Quality ultimately depends on what the visitor has installed,    on Apple devices, downloading a Premium/Enhanced voice gives the best result. */
let cachedVoices = [];

function refreshVoices() {
  if (!ttsSupported()) return [];
  const v = window.speechSynthesis.getVoices?.() || [];
  if (v.length) cachedVoices = v;
  return cachedVoices;
}

if (typeof window !== "undefined" && ttsSupported()) {
  refreshVoices();
  try {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  } catch {
    /* ignore */
  }
}

function scoreVoice(v) {
  const n = (v.name || "").toLowerCase();
  const lang = (v.lang || "").toLowerCase();
  let s = 0;
  if (!/^en/.test(lang)) return -1000; // English only
  if (/en[-_]us/.test(lang)) s += 25;
  else if (/en[-_](gb|au|ie)/.test(lang)) s += 14;
  else if (/en[-_]in/.test(lang)) s += 16; // nice for Indian-English names
  else s += 6;
  if (/natural|neural/.test(n)) s += 140; // Edge/Chrome online neural voices
  if (/premium|enhanced/.test(n)) s += 110; // Apple downloadable HD voices
  if (/\b(samantha|ava|allison|evan|zoe|nathan|siri|aria|jenny|guy|libby|sonia|emma|michelle|serena|kate|daniel|rishi|neerja|prabhat)\b/.test(n))
    s += 70;
  if (/google/.test(n)) s += 55;
  if (/\b(female|woman)\b/.test(n)) s += 8;
  if (/compact|eloquence|espeak|robot|novelty|fred|albert|zarvox|bad news|bells|bahh|boing|bubbles|cellos|deranged|hysterical|pipe|trinoids|whisper|wobble|organ|good news/.test(n))
    s -= 120; // low-quality / novelty engines
  return s;
}

function pickVoice() {
  const voices = refreshVoices();
  if (!voices.length) return null;
  let best = null;
  let bestS = -Infinity;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestS) {
      bestS = s;
      best = v;
    }
  }
  return bestS > -500 ? best : null;
}

/** Strip the little markdown the assistant uses so speech sounds natural. */
function plainText(s) {
  return String(s || "")
    .replace(/```[\s\S]*?```/g, " (see the example on screen) ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

let warmedUp = false;

/** Some browsers (iOS Safari) only allow speech after a user gesture; call
    this from a click handler once to unlock, then speak() works thereafter. */
export function warmUpSpeech() {
  if (!ttsSupported() || warmedUp) return;
  try {
    refreshVoices();
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    window.speechSynthesis.speak(u);
    warmedUp = true;
  } catch {
    /* ignore */
  }
}

/** Speak text aloud with the most natural available voice. Cancels anything
    already speaking. Safe no-op if unsupported. */
export function speak(text) {
  if (!ttsSupported()) return;
  const msg = plainText(text);
  if (!msg) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    const voice = pickVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang || "en-US";
    } else {
      u.lang = "en-US";
    }
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function cancelSpeech() {
  if (!ttsSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
