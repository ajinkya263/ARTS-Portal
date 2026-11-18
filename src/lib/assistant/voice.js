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
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    window.speechSynthesis.speak(u);
    warmedUp = true;
  } catch {
    /* ignore */
  }
}

/** Speak text aloud. Cancels anything already speaking. Safe no-op if unsupported. */
export function speak(text) {
  if (!ttsSupported()) return;
  const msg = plainText(text);
  if (!msg) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = "en-US";
    u.rate = 1;
    u.pitch = 1;
    // Prefer a natural English voice if one is available.
    const voices = window.speechSynthesis.getVoices?.() || [];
    const pref =
      voices.find((v) => /en[-_]?(US|GB|IN)/i.test(v.lang) && /female|samantha|google|natural/i.test(v.name)) ||
      voices.find((v) => /^en/i.test(v.lang));
    if (pref) u.voice = pref;
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
