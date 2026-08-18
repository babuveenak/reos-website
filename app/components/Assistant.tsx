"use client";

/**
 * THE AI ASSISTANT
 *
 * Provider-independent by construction: it talks to an `AIService` and a
 * `VoiceProvider`, both of which are mocks today (D‑5 is open). Swapping in a
 * real service is a change to the two `useMemo` lines below and nothing else.
 *
 * Knowledge arrives as a serialised `KnowledgeSnapshot` prop rather than by
 * importing the content files, which keeps the content out of the client bundle
 * and matches how the component will work once a real service answers.
 *
 * Two variants: `compact` for the homepage band, `full` for /assistant.
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnswerCard, NextQuestions, VisitorTurn } from "./Knowledge";
import { MockAIService } from "../assistant/mock-ai";
import { MockVoiceProvider } from "../assistant/mock-voice";
import { assistantSuggestions, homepageSuggestions } from "../assistant/suggestions";
import type { KnowledgeSnapshot } from "../assistant/snapshot";
import {
  newConversation,
  type ConversationMessage,
  type ConversationState,
  type VoiceState,
} from "../assistant/contracts";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { fill, getDict } from "../i18n/dictionary";

type Props = {
  snapshot: KnowledgeSnapshot;
  locale?: Locale;
  variant?: "compact" | "full" | "dock";
  /** Pre-seeds the journey context when embedded on a stage page. */
  initialStageId?: string | null;
};

/* Inline SVG throughout, matching the icon convention already used in
   PreferencesControls and Logo — no emoji font dependency, and they inherit
   currentColor so the theme tokens drive them. */

const svg = {
  width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": true as const,
  fill: "none", stroke: "currentColor", strokeWidth: 1.7,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

function MicIcon() {
  return (
    <svg className="mic-icon" {...svg}>
      <path d="M12 3.5a2.6 2.6 0 0 1 2.6 2.6v5.2a2.6 2.6 0 0 1-5.2 0V6.1A2.6 2.6 0 0 1 12 3.5Z" />
      <path d="M6.4 11a5.6 5.6 0 0 0 11.2 0M12 16.6v3.9" />
    </svg>
  );
}

/** Shown in place of the mic while listening — the same affordance WhatsApp and
 *  ChatGPT use, so the control that started recording also stops it. */
function StopIcon() {
  return (
    <svg {...svg} fill="currentColor" stroke="none">
      <rect x="6" y="6" width="12" height="12" rx="2.6" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg {...svg}>
      <path d="M17.2 7.5l-7.6 7.6a2.3 2.3 0 0 0 3.2 3.2l7.1-7.1a4.1 4.1 0 0 0-5.8-5.8l-7.4 7.4a5.9 5.9 0 0 0 8.4 8.4l4.2-4.2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg {...svg} strokeWidth={2}>
      <path d="M12 19.5V5.2M6.2 11l5.8-5.8 5.8 5.8" />
    </svg>
  );
}

/** Session-scoped only — no durable identifier, per the D‑4 privacy stance. */
function makeSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `s-${Math.random().toString(36).slice(2)}`;
}

let messageCounter = 0;
const nextMessageId = () => `m-${++messageCounter}`;

export function Assistant({ snapshot, locale = DEFAULT_LOCALE, variant = "compact", initialStageId = null }: Props) {
  const d = getDict(locale).assistant;
  const L = (path: string) => (locale === DEFAULT_LOCALE ? path : `/ar${path}`);

  // Swap these two lines for real implementations when D‑5 lands.
  const ai = useMemo(() => new MockAIService(snapshot), [snapshot]);
  const voice = useMemo(() => new MockVoiceProvider(), []);

  const [state, setState] = useState<ConversationState>(() => ({
    ...newConversation(locale, ""),
    lifecycleStage: initialStageId,
  }));
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [partial, setPartial] = useState("");
  const [pickingPersona, setPickingPersona] = useState(false);
  const [showAttachNote, setShowAttachNote] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const logId = useId();

  /* Mirrors of state that async callbacks read. The voice listener is
     subscribed once on mount, so anything it calls must not close over a
     render-scoped snapshot — that bug replaced the transcript on every voice
     turn. Refs keep `send` dependency-stable and its mount-time closure valid. */
  const stateRef = useRef(state);
  const pendingRef = useRef(false);
  useEffect(() => { stateRef.current = state; }, [state]);
  /* The full variant is the assistant's own page, where the opening set is the
     product's shop window; the inline variants stay on the derived set, which
     is tuned to the page they sit on. */
  const openingSuggestions = useMemo(
    () => (variant === "full" ? assistantSuggestions(snapshot) : homepageSuggestions(snapshot)),
    [snapshot, variant],
  );

  /* The session id is generated after mount so the server and client markup
     match — a value baked at render time would differ between the two. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => (prev.sessionId ? prev : { ...prev, sessionId: makeSessionId() }));
  }, []);

  const send = useCallback(async (question: string) => {
    const text = question.trim();
    if (!text || pendingRef.current) return;

    pendingRef.current = true;
    setPending(true);
    setError(null);
    setDraft("");
    setPartial("");

    const visitorTurn: ConversationMessage = { id: nextMessageId(), role: "visitor", text, at: Date.now() };
    // Functional update: appends to whatever the latest transcript is.
    setState((prev) => ({ ...prev, messages: [...prev.messages, visitorTurn] }));

    // The state the request is answered against, so the visitor never has to
    // repeat context they have already given.
    const asked: ConversationState = {
      ...stateRef.current,
      messages: [...stateRef.current.messages, visitorTurn],
    };

    try {
      const response = await ai.ask({ question: text, language: locale, state: asked });
      setState((prev) => ({
        ...prev,
        ...response.statePatch,
        messages: [
          ...prev.messages,
          { id: nextMessageId(), role: "assistant", text: response.answer, response, at: Date.now() },
        ],
      }));
    } catch {
      setError(d.error);
    } finally {
      pendingRef.current = false;
      setPending(false);
      inputRef.current?.focus();
    }
  }, [ai, d.error, locale]);

  /* Grow the field with its content up to a cap, then let it scroll — the
     behaviour every messaging composer has. `auto` first, so it shrinks back
     when text is deleted. */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    /* A `display:none` subtree — the dock panel while it is closed — reports
       scrollHeight 0. Writing that pins the field at 0px, and since this effect
       only re-runs on draft/partial nothing remeasures when the dock opens: the
       field arrives 16px tall with 39px of content, permanently overflowing, and
       `overflow-y:auto` draws a scrollbar thumb inside the composer until the
       first keystroke. Leave the rows={1} height alone until there is something
       real to measure — unstyled, it is already the correct single-row height. */
    if (el.scrollHeight === 0) { el.style.height = ""; return; }
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, [draft, partial]);

  /* Keep the newest turn in view inside the dock, whose panel scrolls on its
     own. Not done for the inline variants: there the page is the scroll
     container, and moving it under the reader on every turn is worse than
     leaving them where they are. `block: "nearest"` also means no movement at
     all when the turn is already visible. */
  useEffect(() => {
    if (variant !== "dock") return;
    logRef.current?.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state.messages.length, pending, variant]);

  /* ── voice ─────────────────────────────────────────────────────────────── */

  useEffect(() => {
    const unsubscribe = voice.subscribe((event) => {
      if (event.type === "state") setVoiceState(event.state);
      if (event.type === "partial") setPartial(event.transcript);
      if (event.type === "final") {
        setPartial("");
        void send(event.transcript);
      }
      if (event.type === "error") {
        setVoiceState("error");
        setError(event.message);
      }
    });
    return unsubscribe;
  }, [voice, send]);

  const listening = voiceState === "listening";
  /* The recogniser reports only what it is doing; "processing" is the
     conversation's state, so it is derived here rather than asked of the
     provider — which is what left the indicator stuck on "thinking". */
  const displayVoiceState: VoiceState = pending ? "processing" : voiceState;

  async function toggleVoice() {
    setError(null);
    if (listening) { await voice.stopListening(); return; }
    if (voiceState === "responding") { voice.stopSpeaking(); return; } // barge-in
    if (pendingRef.current) return; // an answer is already in flight
    if (!voice.supports(locale)) { setError(d.voiceUnsupported); return; }
    await voice.startListening(locale);
  }

  function reset() {
    voice.cancelListening();
    setState({ ...newConversation(locale, makeSessionId()), lifecycleStage: initialStageId });
    setDraft(""); setPartial(""); setError(null);
    inputRef.current?.focus();
  }

  /* ── persona ───────────────────────────────────────────────────────────── */

  const personaRoute = state.persona ? snapshot.routes.find((r) => r.slug === state.persona) : undefined;
  const selectable = snapshot.routes.filter((r) => r.hasContent);

  const hasConversation = state.messages.length > 0;
  /* Enabled whenever there is something visible to commit — the typed draft, or
     the live transcript while the mic is open. */
  const canSend = !pending && (listening ? partial.trim().length > 0 : draft.trim().length > 0);

  return (
    <div className={`assistant assistant-${variant}`} data-voice-state={displayVoiceState}>
      {/* Honest framing. The assistant is a preview running on mock answers. */}
      <p className="assistant-notice" role="note">{d.mockNotice}</p>

      {/* ── inferred persona, correctable ───────────────────────────────── */}
      {personaRoute && (
        <div className="assistant-persona">
          {/* ctaLabel, not title: the titles are first-person sentences.
              One interpolated string, so a label that already ends in
              "journey" cannot render "journey journey". */}
          <p>{fill(d.personaLine, { route: personaRoute.ctaLabel })}</p>
          <button type="button" className="ai-chip" onClick={() => setPickingPersona((v) => !v)} aria-expanded={pickingPersona}>
            {d.change}
          </button>
          {pickingPersona && (
            <div className="assistant-persona-pick">
              <label>
                <span>{d.changePrompt}</span>
                <select
                  value={state.persona ?? ""}
                  onChange={(event) => {
                    const slug = event.target.value || null;
                    setState((prev) => ({ ...prev, persona: slug, journey: slug }));
                    setPickingPersona(false);
                  }}
                >
                  {selectable.map((route) => (
                    <option key={route.slug} value={route.slug}>{route.ctaLabel}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      )}

      {/* ── transcript ──────────────────────────────────────────────────── */}
      <div
        ref={logRef}
        id={logId}
        className="assistant-log"
        role="log"
        aria-label={d.conversationLabel}
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={pending}
      >
        {state.messages.map((message) =>
          message.role === "visitor"
            ? <VisitorTurn key={message.id} text={message.text} locale={locale} />
            : message.response
              ? <AnswerCard key={message.id} response={message.response} locale={locale} onAsk={(q) => void send(q)} />
              : null,
        )}
        {pending && <p className="assistant-thinking">{d.thinking}</p>}
      </div>

      {error && <p className="assistant-error" role="alert">{error}</p>}

      {/* ── composer: one bar — attach · field · mic · send ─────────────── */}
      <form
        className="assistant-composer"
        onSubmit={(event) => {
          event.preventDefault();
          // While listening, committing means "stop hearing me and answer":
          // stopListening emits `final`, which is what actually sends.
          if (listening) { void voice.stopListening(); return; }
          void send(draft);
        }}
      >
        <div className="composer-bar">
          <button
            type="button"
            className={`composer-icon composer-attach${showAttachNote ? " is-active" : ""}`}
            onClick={() => setShowAttachNote((v) => !v)}
            aria-expanded={showAttachNote}
            aria-label={d.attach}
            title={d.attach}
          >
            <PaperclipIcon />
          </button>

          <label className="composer-field">
            <span className="visually-hidden">{d.inputLabel}</span>
            <textarea
              ref={inputRef}
              rows={1}
              value={listening && partial ? partial : draft}
              /* While listening the field mirrors the transcript, so it is
                 read-only rather than accepting keystrokes it would discard. */
              readOnly={listening}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends; Shift+Enter is a newline. Standard for a composer.
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
              placeholder={d.typePlaceholder}
              disabled={pending}
            />
          </label>

          <button
            type="button"
            className={`composer-icon assistant-mic${listening ? " is-listening" : ""}`}
            onClick={() => void toggleVoice()}
            aria-pressed={listening}
            aria-label={listening ? d.voiceStop : d.voiceCta}
            title={listening ? d.voiceStop : d.voiceCta}
          >
            {listening ? <StopIcon /> : <MicIcon />}
          </button>

          <button
            type="submit"
            className="composer-send"
            disabled={!canSend}
            aria-label={d.send}
            title={d.send}
          >
            <SendIcon />
          </button>
        </div>

        {showAttachNote && (
          <p className="composer-note" role="status">{d.attachNote}</p>
        )}

        {/* Voice state stays in the DOM so the live region is registered before
            it has anything to announce; it is only shown once there is something
            to say, which keeps the bar quiet at rest. */}
        <p className={`assistant-voice-state${displayVoiceState === "idle" ? " is-idle" : ""}`} role="status">
          <span className={`assistant-pulse assistant-pulse-${displayVoiceState}`} aria-hidden="true" />
          {d.voiceState[displayVoiceState]}
        </p>

        {(listening || hasConversation) && (
          <div className="assistant-controls">
            {listening && (
              <button type="button" className="ai-chip" onClick={() => voice.cancelListening()}>
                {d.voiceCancel}
              </button>
            )}
            {hasConversation && (
              <button type="button" className="ai-chip" onClick={reset}>{d.clear}</button>
            )}
          </div>
        )}
      </form>

      {/* ── openings ────────────────────────────────────────────────────── */}
      {!hasConversation && (
        <NextQuestions questions={openingSuggestions} locale={locale} onAsk={(q) => void send(q)} />
      )}

      {variant !== "full" && (
        <p className="assistant-more">
          <Link className="ai-chip is-action" href={L("/assistant")}>
            {d.openFull} <span aria-hidden="true">→</span>
          </Link>
        </p>
      )}
    </div>
  );
}
