"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Drum, X, Send, ArrowUpRight, ThumbsUp, ThumbsDown, Mic, Square, Volume2, VolumeX } from "lucide-react";
import {
  findAnswer,
  greeting,
  suggestions,
  rememberHelpful,
  recordUnanswered,
} from "@/lib/assistant/knowledge";
import { probeLocalAI, localAIReady, askLocalAI } from "@/lib/assistant/localAI";
import {
  sttSupported,
  ttsSupported,
  createRecognizer,
  speak,
  cancelSpeech,
  warmUpSpeech,
} from "@/lib/assistant/voice";

let seq = 0;
const nextId = () => ++seq;

/** Lightweight renderer: ``` fenced blocks, **bold**, and line breaks. */
function MessageText({ text }) {
  const parts = text.split(/```/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre
            key={i}
            className="my-2 overflow-x-auto whitespace-pre rounded-lg bg-panel2/90 px-3 py-2 font-mono text-[12px] leading-relaxed text-cream-50"
          >
            {part.replace(/^\n|\n$/g, "")}
          </pre>
        ) : (
          <Inline key={i} text={part} />
        )
      )}
    </>
  );
}

function Inline({ text }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const segs = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
        return (
          <span key={i}>
            {segs.map((s, j) =>
              s.startsWith("**") && s.endsWith("**") ? (
                <strong key={j}>{s.slice(2, -2)}</strong>
              ) : s.startsWith("_") && s.endsWith("_") ? (
                <em key={j} className="text-indigo-400">{s.slice(1, -1)}</em>
              ) : (
                s
              )
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

export default function TablaAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: nextId(), from: "bot", text: greeting }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [voiceErr, setVoiceErr] = useState("");
  const [sttOk, setSttOk] = useState(false);
  const [ttsOk, setTtsOk] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognizerRef = useRef(null);
  const lastSpokenRef = useRef(0);

  // Probe (once) for an on-device model. If present, we can answer open-ended
  // questions the keyword engine misses — locally, at zero token cost.
  useEffect(() => {
    let alive = true;
    probeLocalAI().then(() => {
      if (alive) setAiReady(localAIReady());
    });
    return () => {
      alive = false;
    };
  }, []);

  // Detect voice capabilities once (feature detection only — nothing requested).
  useEffect(() => {
    setSttOk(sttSupported());
    setTtsOk(ttsSupported());
  }, []);

  // Speak the newest bot message aloud when voice output is enabled.
  useEffect(() => {
    if (!voiceOn) return;
    const last = messages[messages.length - 1];
    if (last && last.from === "bot" && last.id > lastSpokenRef.current) {
      lastSpokenRef.current = last.id;
      speak(last.text);
    }
  }, [messages, voiceOn]);

  // Stop any speech / listening when the panel closes.
  useEffect(() => {
    if (!open) {
      cancelSpeech();
      recognizerRef.current?.stop();
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 240);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = useCallback((raw) => {
    const text = raw.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { id: nextId(), from: "user", text }]);
    setThinking(true);

    const res = findAnswer(text);
    const pushKeyword = () =>
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          from: "bot",
          text: res.answer,
          actions: res.actions,
          related: res.related,
          entryId: res.id,
          forQuery: text,
          rated: null,
        },
      ]);

    // When the keyword engine isn't confident AND an on-device model is ready,
    // escalate to it for an open-ended answer (local, no tokens). Otherwise the
    // keyword answer stands.
    const weak = res.confidence === "low" || res.confidence === "none";
    if (weak && localAIReady()) {
      askLocalAI(text)
        .then((aiText) => {
          setThinking(false);
          if (aiText) {
            setMessages((m) => [
              ...m,
              { id: nextId(), from: "bot", text: aiText, forQuery: text, rated: null, viaAI: true },
            ]);
          } else {
            pushKeyword();
          }
        })
        .catch(() => {
          setThinking(false);
          pushKeyword();
        });
      return;
    }

    window.setTimeout(() => {
      setThinking(false);
      pushKeyword();
    }, 360);
  }, []);

  // Feedback teaches the local guide (and logs misses for Ajinkya to review).
  const rate = useCallback((msg, value) => {
    if (value === "up") rememberHelpful(msg.forQuery, msg.entryId);
    else recordUnanswered(msg.forQuery);
    setMessages((m) =>
      m.map((x) => (x.id === msg.id ? { ...x, rated: value } : x))
    );
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    ask(input);
  };

  // Voice input: open the mic on an explicit click; the browser handles
  // permission and transcription locally. Falls back to typing on any error.
  const toggleListening = useCallback(() => {
    setVoiceErr("");
    if (!recognizerRef.current) {
      recognizerRef.current = createRecognizer({
        onText: (t) => ask(t),
        onState: (on) => setListening(on),
        onError: (kind) => {
          setListening(false);
          setVoiceErr(
            kind === "denied"
              ? "Microphone blocked — you can still type."
              : kind === "no-speech"
              ? "Didn't catch that — try again."
              : "Voice input isn't available here — type instead."
          );
        },
      });
    }
    const rec = recognizerRef.current;
    if (!rec) {
      setSttOk(false);
      return;
    }
    if (listening) rec.stop();
    else {
      cancelSpeech();
      rec.start();
    }
  }, [listening, ask]);

  // Voice output: read the assistant's answers aloud.
  const toggleVoice = useCallback(() => {
    setVoiceOn((v) => {
      const next = !v;
      if (next) {
        warmUpSpeech(); // unlock speech within this user gesture (iOS etc.)
        lastSpokenRef.current = messages[messages.length - 1]?.id || 0;
      } else {
        cancelSpeech();
      }
      return next;
    });
  }, [messages]);

  return (
    <>
      {/* launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close tabla guide" : "Open tabla guide"}
        aria-expanded={open}
        className="animate-glow fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-saffron-300 to-saffron-500 text-onaccent shadow-soft transition hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <Drum size={24} />}
      </button>

      {/* panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Tabla guide"
          className="animate-fade-up fixed bottom-24 right-5 z-[60] flex h-[min(560px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-indigo-200 bg-card shadow-soft"
        >
          {/* header */}
          <div className="flex items-center gap-3 border-b border-cream-200 bg-gradient-to-r from-panel to-panel2 px-4 py-3 text-cream-50">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron-400 text-onaccent">
              <Drum size={18} />
            </span>
            <div className="flex-1">
              <p className="font-display text-base leading-tight">Tabla Guide</p>
              <p className="text-[11px] text-indigo-200">Bols, taals, technique &amp; the school</p>
            </div>
            {ttsOk && (
              <button
                type="button"
                onClick={toggleVoice}
                aria-label={voiceOn ? "Turn off spoken answers" : "Read answers aloud"}
                title={voiceOn ? "Voice answers: on" : "Voice answers: off"}
                className={`rounded-lg p-1.5 transition ${
                  voiceOn ? "text-saffron-300" : "text-indigo-200 hover:bg-card/10 hover:text-cream-50"
                }`}
              >
                {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            )}
            <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-indigo-200 transition hover:bg-card/10 hover:text-cream-50">
              <X size={18} />
            </button>
          </div>

          {/* transcript */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-md bg-panel text-cream-50"
                      : "rounded-bl-md border border-cream-200 bg-card text-indigo-800"
                  }`}
                >
                  <MessageText text={m.text} />
                  {m.viaAI && (
                    <p className="mt-1.5 text-[10px] italic text-indigo-300">
                      Answered on your device
                    </p>
                  )}
                  {m.actions?.length > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      {m.actions.map((a) => {
                        const internal = a.href.startsWith("/") || a.href.startsWith("#");
                        return (
                          <a
                            key={a.label}
                            href={a.href}
                            target={internal ? undefined : "_blank"}
                            rel={internal ? undefined : "noopener noreferrer"}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center justify-between gap-2 rounded-lg border border-saffron-300 bg-saffron-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:border-saffron-400 hover:bg-saffron-100"
                          >
                            {a.label}
                            <ArrowUpRight size={13} />
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Related follow-ups the guide can answer */}
                  {m.from === "bot" && m.related?.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.related.map((r) => (
                        <button
                          key={r}
                          onClick={() => ask(r)}
                          className="rounded-full border border-indigo-200 bg-card px-2.5 py-1 text-[11px] text-indigo-600 transition hover:border-saffron-400 hover:bg-saffron-50"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Was this helpful? teaches the local guide */}
                  {m.from === "bot" && m.forQuery && (
                    <div className="mt-2 flex items-center gap-1.5 text-indigo-300">
                      {m.rated ? (
                        <span className="text-[11px] text-indigo-400">
                          {m.rated === "up" ? "Thanks, noted." : "Thanks, flagged for Ajinkya."}
                        </span>
                      ) : (
                        <>
                          <span className="text-[11px]">Helpful?</span>
                          <button
                            onClick={() => rate(m, "up")}
                            aria-label="Helpful"
                            className="rounded p-1 transition hover:bg-saffron-50 hover:text-saffron-500"
                          >
                            <ThumbsUp size={13} />
                          </button>
                          <button
                            onClick={() => rate(m, "down")}
                            aria-label="Not helpful"
                            className="rounded p-1 transition hover:bg-saffron-50 hover:text-indigo-600"
                          >
                            <ThumbsDown size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md border border-cream-200 bg-card px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-50" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {messages.length <= 1 && !thinking && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-indigo-200 bg-card px-3 py-1.5 text-xs text-indigo-600 transition hover:border-saffron-400 hover:bg-saffron-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-cream-200 bg-card px-3 py-2.5">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any bol or taal…"
              aria-label="Ask the tabla guide"
              autoComplete="off"
              className="flex-1 bg-transparent text-sm text-indigo-900 outline-none placeholder:text-indigo-300"
            />
            {sttOk && (
              <button
                type="button"
                onClick={toggleListening}
                aria-label={listening ? "Stop listening" : "Speak your question"}
                className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
                  listening
                    ? "animate-pulse border-saffron-400 bg-saffron-100 text-saffron-600"
                    : "border-indigo-200 text-indigo-500 hover:border-saffron-400 hover:text-saffron-500"
                }`}
              >
                {listening ? <Square size={14} /> : <Mic size={16} />}
              </button>
            )}
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="grid h-9 w-9 place-items-center rounded-lg bg-saffron-400 text-onaccent transition hover:bg-saffron-300 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>

          <p className="flex items-center justify-center gap-1 bg-card pb-2 text-center text-[10px] text-indigo-300">
            {voiceErr
              ? voiceErr
              : listening
              ? "Listening… speak now"
              : aiReady
              ? "On-device AI · voice & text · runs locally"
              : sttOk || ttsOk
              ? "Voice & text · runs locally, no account"
              : "Instant answers · runs locally"}
          </p>
        </div>
      )}
    </>
  );
}
