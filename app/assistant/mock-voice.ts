/**
 * MOCK VOICE PROVIDER
 *
 * Implements the full VoiceProvider contract with no vendor behind it, so the
 * voice UI — states, partial transcripts, barge-in, error handling — can be
 * built and tested before an STT/TTS provider is chosen (D‑5, open).
 *
 * Deliberately NOT wired to the browser's built-in SpeechRecognition. That API
 * is available and free, and it is the obvious first real adapter, but adopting
 * it here would quietly make a provider decision: its Arabic support is
 * MSA-leaning, its availability is Chromium-shaped, and the architecture names
 * Gulf/Khaliji dialect coverage as a selection gate. A `WebSpeechVoiceProvider`
 * implementing this same interface is a ~60-line file when that decision lands.
 *
 * The mock replays a canned transcript progressively so the UI sees the same
 * event sequence a real streaming recogniser produces:
 *   state:listening → partial × n → final → state:idle
 *
 * Note it returns to `idle`, not `processing`. Recognition is finished at
 * `final`; whether an answer is being computed is the conversation's business,
 * and a recogniser that claimed `processing` had no way to learn when to stop.
 */

import { LOCALES, type Locale } from "../i18n/config";
import type { VoiceEvent, VoiceProvider, VoiceState } from "./contracts";

/** What the mock "hears". Real questions, so the mock AI can answer them. */
const CANNED: Record<Locale, string> = {
  en: "I want to buy an apartment in Dubai. Where do I start?",
  ar: "أريد شراء شقة في دبي، من أين أبدأ؟",
};

const PARTIAL_INTERVAL_MS = 180;
const SPEAK_MS_PER_WORD = 240;

export class MockVoiceProvider implements VoiceProvider {
  readonly name = "mock";
  readonly isRealProvider = false;

  #listeners = new Set<(event: VoiceEvent) => void>();
  #state: VoiceState = "idle";
  #transcript = "";
  #timers: ReturnType<typeof setTimeout>[] = [];
  #speaking = false;

  supports(language: Locale): boolean {
    // A real provider answers this per-vendor: Gulf Arabic coverage is the gate.
    return (LOCALES as readonly string[]).includes(language);
  }

  subscribe(listener: (event: VoiceEvent) => void): () => void {
    this.#listeners.add(listener);
    // Emit current state immediately so a late subscriber is not out of sync.
    listener({ type: "state", state: this.#state });
    return () => this.#listeners.delete(listener);
  }

  #emit(event: VoiceEvent) {
    for (const listener of this.#listeners) listener(event);
  }

  #setState(state: VoiceState) {
    this.#state = state;
    this.#emit({ type: "state", state });
  }

  #clearTimers() {
    for (const timer of this.#timers) clearTimeout(timer);
    this.#timers = [];
  }

  async startListening(language: Locale): Promise<void> {
    this.#clearTimers();
    this.#transcript = "";
    this.#setState("listening");

    const words = (CANNED[language] ?? CANNED.en).split(" ");
    words.forEach((_, index) => {
      const timer = setTimeout(() => {
        this.#transcript = words.slice(0, index + 1).join(" ");
        if (index < words.length - 1) {
          this.#emit({ type: "partial", transcript: this.#transcript });
        } else {
          this.#emit({ type: "final", transcript: this.#transcript });
          this.#setState("idle"); // recognition is done; the answer is not our state
        }
      }, PARTIAL_INTERVAL_MS * (index + 1));
      this.#timers.push(timer);
    });
  }

  /** Stop and keep what was heard — the visitor finished speaking. */
  async stopListening(): Promise<void> {
    this.#clearTimers();
    if (this.#state !== "listening") return;
    if (this.#transcript) {
      this.#emit({ type: "final", transcript: this.#transcript });
      this.#setState("idle");
    } else {
      this.#setState("idle");
    }
  }

  /** Stop and discard — the visitor cancelled. */
  cancelListening(): void {
    this.#clearTimers();
    this.#transcript = "";
    this.#setState("idle");
  }

  getTranscript(): string {
    return this.#transcript;
  }

  async speak(text: string, language: Locale): Promise<void> {
    this.#speaking = true;
    this.#setState("responding");
    const words = Math.max(1, text.trim().split(/\s+/).length);
    // Arabic renders fewer words for the same content, so per-word pacing
    // under-estimates its duration. Rough, but it keeps the mock honest.
    const perWord = language === "ar" ? SPEAK_MS_PER_WORD * 1.4 : SPEAK_MS_PER_WORD;
    // Cap it: a long answer should not lock the UI in `responding` in dev.
    const duration = Math.min(words * perWord, 4000);
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => resolve(), duration);
      this.#timers.push(timer);
    });
    if (this.#speaking) {
      this.#speaking = false;
      this.#setState("idle");
    }
  }

  /** Barge-in. A real provider must cancel in-flight synthesis here too. */
  stopSpeaking(): void {
    this.#clearTimers();
    this.#speaking = false;
    if (this.#state === "responding") this.#setState("idle");
  }
}
