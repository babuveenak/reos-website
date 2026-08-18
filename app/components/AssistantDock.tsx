"use client";

/**
 * THE REOS DOCK — the floating assistant entry point.
 *
 * A persistent button in the bottom inline-end corner of every visitor-facing
 * page, whose mark animates the four letters R · E · O · S in slow sequence.
 * Opening it slides up a panel containing the same `Assistant` component used
 * inline elsewhere, so text and voice both work here with no second engine.
 *
 * Deliberate choices worth knowing:
 *
 *  - **Inline-end, not `right`.** The site is built in logical properties, so
 *    the dock sits bottom-right in English and bottom-left in Arabic — the same
 *    mirroring every other element already does. Anchoring it to physical right
 *    would leave it colliding with RTL content.
 *  - **Non-modal.** The page stays scrollable and readable with the panel open,
 *    because the assistant's job is to explain what you are looking at. Escape
 *    closes it and focus returns to the button; a stray outside click does not,
 *    since that would discard a conversation someone is mid-way through.
 *  - **The letters are decorative.** They carry `aria-hidden`; the button's
 *    accessible name is a real sentence.
 */

import { useEffect, useId, useRef, useState } from "react";
import { Assistant } from "./Assistant";
import type { KnowledgeSnapshot } from "../assistant/snapshot";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";

/** R · E · O · S, lit in sequence. Animation lives in CSS so it runs before
 *  hydration and honours prefers-reduced-motion without a JS branch. */
function ReosMark() {
  return (
    <span className="dock-mark" aria-hidden="true">
      {["R", "E", "O", "S"].map((letter) => (
        <span key={letter}>{letter}</span>
      ))}
    </span>
  );
}

export function AssistantDock({
  snapshot,
  locale = DEFAULT_LOCALE,
}: {
  snapshot: KnowledgeSnapshot;
  locale?: Locale;
}) {
  const d = getDict(locale).assistant;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Escape closes and hands focus back to the button — otherwise focus is
     stranded inside a panel that is no longer on screen. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* Move focus to the composer on open, so a keyboard or screen-reader user
     lands where they can type rather than at the top of the document. */
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
  }, [open]);

  return (
    <div className={`reos-dock${open ? " is-open" : ""}`}>
      <div
        ref={panelRef}
        id={panelId}
        className="dock-panel"
        role="dialog"
        aria-label={d.dockPanelLabel}
        /* Kept in the DOM while closed so an in-progress conversation survives
           being dismissed; hidden from AT and from tab order meanwhile. */
        hidden={!open}
      >
        <header className="dock-head">
          <span className="dock-title">
            <ReosMark />
            <span className="visually-hidden">{d.dockTitle}</span>
            <b>{d.assistantName}</b>
          </span>
          <button
            type="button"
            className="dock-close"
            onClick={() => { setOpen(false); buttonRef.current?.focus(); }}
            aria-label={d.dockClose}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
              fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="dock-body">
          <Assistant snapshot={snapshot} locale={locale} variant="dock" />
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className="dock-button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? d.dockClose : d.dockOpen}
        title={open ? d.dockClose : d.dockOpen}
      >
        <ReosMark />
      </button>
    </div>
  );
}

/**
 * THE RETURN CONTROL — /assistant only.
 *
 * On its own page the assistant is the page, so the dock's panel would open a
 * SECOND conversation with its own transcript sitting on top of the first.
 * That is why the dock is withheld there. But withholding the button too meant
 * the floating REOS mark vanished on navigation and, once a visitor had
 * scrolled past the composer, nothing led back to it.
 *
 * So the mark stays, in the same corner, at the same size — and instead of
 * opening a duplicate it returns the visitor to the conversation already on
 * the page and puts the cursor in it. One assistant, one transcript, and the
 * anchor never disappears.
 */
export function AssistantReturn({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale).assistant;
  return (
    <div className="reos-dock">
      <button
        type="button"
        className="dock-jump"
        aria-label={d.dockReturn}
        title={d.dockReturn}
        onClick={() => {
          const field = document.querySelector<HTMLTextAreaElement>(".assistant-full textarea");
          if (!field) return;
          /* Scroll the whole control into view rather than the field alone, so
             the answers above it stay visible. `focus({preventScroll})` then
             places the cursor without fighting the smooth scroll. */
          field.closest(".assistant")?.scrollIntoView({ behavior: "smooth", block: "center" });
          field.focus({ preventScroll: true });
        }}
      >
        <ReosMark />
      </button>
    </div>
  );
}
