/* =============================================================================
   ON-DEVICE AI  ·  Chrome Prompt API (Gemini Nano), 100% local, 0 tokens
   -----------------------------------------------------------------------------
   Progressive enhancement for the tabla guide. When a visitor's browser ships
   an on-device language model (Chrome's built-in Prompt API), we use it to
   answer open-ended questions the keyword engine can't, grounded in the
   school's facts. It runs ENTIRELY on the visitor's machine: no network, no
   API key, no tokens, no cost.

   If the API is absent (most browsers today), everything here no-ops and the
   assistant falls back to the local keyword engine. We only ever USE the model
   when it is already downloaded ("available"), so there is never a surprise
   multi-gigabyte download.
   ========================================================================== */

import { ASSISTANT_SYSTEM_PROMPT } from "./knowledge";

let availability = "unknown";
let sessionPromise = null;

/** The Prompt API has shipped under a couple of shapes; support both. */
function getAPI() {
  if (typeof window === "undefined") return null;
  return window.LanguageModel || window.ai?.languageModel || window.ai || null;
}

/** Probe (once) whether an on-device model is ready. Safe to call on mount. */
export async function probeLocalAI() {
  const api = getAPI();
  if (!api) {
    availability = "unsupported";
    return availability;
  }
  try {
    if (typeof api.availability === "function") {
      // Newer API: 'unavailable' | 'downloadable' | 'downloading' | 'available'
      availability = await api.availability();
    } else if (typeof api.capabilities === "function") {
      // Older API: { available: 'no' | 'after-download' | 'readily' }
      const caps = await api.capabilities();
      availability = caps?.available || "unavailable";
    } else {
      availability = "unsupported";
    }
  } catch {
    availability = "unsupported";
  }
  return availability;
}

/** True only when a model is already downloaded and usable right now. */
export function localAIReady() {
  return availability === "available" || availability === "readily";
}

async function createSession(api) {
  // Newer signature: initialPrompts with a system role.
  try {
    return await api.create({
      initialPrompts: [{ role: "system", content: ASSISTANT_SYSTEM_PROMPT }],
    });
  } catch {
    // Older signature: a plain systemPrompt string.
    return await api.create({ systemPrompt: ASSISTANT_SYSTEM_PROMPT });
  }
}

function getSession() {
  const api = getAPI();
  if (!api) return Promise.resolve(null);
  if (!sessionPromise) {
    sessionPromise = createSession(api).catch((e) => {
      sessionPromise = null; // allow a later retry
      throw e;
    });
  }
  return sessionPromise;
}

/**
 * Ask the on-device model. Returns a trimmed string, or null if unavailable or
 * anything goes wrong (caller should then use the keyword-engine answer).
 */
export async function askLocalAI(question) {
  if (!localAIReady()) return null;
  try {
    const session = await getSession();
    if (!session) return null;
    const text = await session.prompt(question);
    const out = (text || "").trim();
    return out || null;
  } catch {
    return null;
  }
}
