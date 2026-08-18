/**
 * PHASE 1A — LIVE INTERACTION TESTS
 *
 * The rendered-HTML harness cannot reach client behaviour: typing, voice state
 * transitions, and whether a conversation accumulates or gets clobbered. Every
 * defect found in the Phase 1A QA pass lived in exactly that gap, so these are
 * regression tests for real bugs, not coverage for its own sake.
 *
 * Requires a dev server. Run:
 *
 *   npm run dev                                    # in one terminal
 *   node --test tests/assistant-interaction.test.mjs
 *
 * If no server is reachable the suite SKIPS LOUDLY rather than passing quietly —
 * a green run that tested nothing is worse than a skipped one.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright-core";

const BASE = process.env.REOS_TEST_URL ?? "http://localhost:3000";

const serverUp = await fetch(BASE, { signal: AbortSignal.timeout(2500) })
  .then((r) => r.ok)
  .catch(() => false);

if (!serverUp) {
  console.error(
    `\n  ⚠  SKIPPING live interaction tests: no dev server at ${BASE}\n` +
    `     Start one with \`npm run dev\` and re-run. These tests guard the\n` +
    `     voice and conversation-state regressions found in QA.\n`,
  );
}

/** One browser for the file; a page per test so state never leaks between them. */
let browser;
const withPage = async (path, fn) => {
  browser ??= await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1180, height: 900 } });
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    return await fn(page);
  } finally {
    await page.close();
  }
};

test.after(async () => { await browser?.close(); });

const opts = { skip: !serverUp };
const turns = (page) => page.evaluate(() => ({
  visitor: document.querySelectorAll(".assistant-full .assistant-log .ai-visitor").length,
  answers: document.querySelectorAll(".assistant-full .assistant-log .ai-answer").length,
}));
const voiceState = (page) => page.evaluate(() =>
  document.querySelector(".assistant-full,.assistant-compact").dataset.voiceState);

async function ask(page, scope, question) {
  await page.locator(`${scope} textarea`).fill(question);
  await page.locator(`${scope} button[type="submit"]`).click();
  await page.waitForFunction(
    (s) => document.querySelectorAll(`${s} .ai-answer`).length > 0
        && !document.querySelector(`${s} .assistant-thinking`),
    scope,
    { timeout: 8000 },
  );
}

/* ── conversation state ──────────────────────────────────────────────────── */

test("a voice turn appends to the transcript instead of replacing it", opts, async () => {
  // REGRESSION: the voice listener was subscribed once on mount and closed over
  // the initial state, so every voice turn reset the conversation to one turn.
  await withPage("/assistant", async (page) => {
    await ask(page, ".assistant-full", "How do I become a property developer?");
    assert.deepEqual(await turns(page), { visitor: 1, answers: 1 });

    await page.locator(".assistant-full .assistant-mic").click();
    await page.waitForFunction(
      () => document.querySelectorAll(".assistant-full .assistant-log .ai-answer").length === 2,
      null,
      { timeout: 10000 },
    );
    assert.deepEqual(await turns(page), { visitor: 2, answers: 2 });
  });
});

test("text turns accumulate", opts, async () => {
  await withPage("/assistant", async (page) => {
    await ask(page, ".assistant-full", "How do I become a property developer?");
    await ask(page, ".assistant-full", "Who are the stakeholders involved?");
    assert.deepEqual(await turns(page), { visitor: 2, answers: 2 });
  });
});

test("Start over clears the conversation", opts, async () => {
  await withPage("/assistant", async (page) => {
    await ask(page, ".assistant-full", "How do I become a property developer?");
    await page.getByRole("button", { name: "Start over" }).click();
    assert.deepEqual(await turns(page), { visitor: 0, answers: 0 });
  });
});

/* ── context carries forward ─────────────────────────────────────────────── */

test("an unrecognised follow-up declines but keeps its place in the journey", opts, async () => {
  // The honest middle: inherit CONTEXT, never the ANSWER. Replying about escrow
  // to a question about the weather would be a fabrication.
  await withPage("/assistant", async (page) => {
    await ask(page, ".assistant-full", "How do I become a property developer?");
    await ask(page, ".assistant-full", "And what about the weather tomorrow?");

    const last = await page.evaluate(() => {
      const answers = [...document.querySelectorAll(".assistant-full .assistant-log .ai-answer")];
      const el = answers[answers.length - 1];
      return {
        declines: /don't have enough verified information/.test(el.innerText),
        trail: el.querySelector(".ai-trail")?.innerText.replace(/\s+/g, " ") ?? "",
      };
    });
    assert.ok(last.declines, "an unrecognised question must not be answered anyway");
    assert.match(last.trail, /Developer journey/, "the established journey must persist");
  });
});

test("the inferred persona is displayed and correctable", opts, async () => {
  await withPage("/assistant", async (page) => {
    await ask(page, ".assistant-full", "I want to buy an apartment. Where do I start?");
    await assert.doesNotReject(
      page.getByText("You appear to be exploring the Buyer & owner journey.").waitFor({ timeout: 4000 }),
    );
    await page.getByRole("button", { name: "Change" }).click();
    /* Assert the rule, not the count: routes get published over time, and a
       hard-coded number would only ever record when it was last correct. */
    const labels = await page.locator(".assistant-persona-pick option").allTextContents();
    assert.ok(labels.includes("Developer journey"), "a published route must be offered");
    assert.ok(
      !labels.some((l) => /Broker & sales/.test(l)),
      "`selling` has no written journey, so it must not be offered as a persona",
    );
  });
});

/* Selectors in this file are scoped to `.assistant-full`. /assistant renders
   TWO assistants — the page's own and the dock panel's — so a bare
   `.assistant-mic` matches both and Playwright's strict mode rejects it. */

/* ── voice state machine ─────────────────────────────────────────────────── */

test("voice runs idle → listening → idle and produces an answer", opts, async () => {
  // REGRESSION: the recogniser reported "processing", a state it had no way to
  // exit, so the indicator stayed on "Thinking…" for the rest of the session.
  await withPage("/assistant", async (page) => {
    assert.equal(await voiceState(page), "idle");

    await page.locator(".assistant-full .assistant-mic").click();
    await page.waitForFunction(() =>
      document.querySelector(".assistant-full").dataset.voiceState === "listening");
    assert.equal(await page.locator(".assistant-full .assistant-mic").getAttribute("aria-pressed"), "true");

    await page.waitForFunction(
      () => document.querySelectorAll(".assistant-full .assistant-log .ai-answer").length === 1,
      null,
      { timeout: 10000 },
    );
    await page.waitForFunction(() =>
      document.querySelector(".assistant-full").dataset.voiceState === "idle", null, { timeout: 5000 });
    assert.equal(await page.locator(".assistant-full .assistant-mic").getAttribute("aria-pressed"), "false");
  });
});

test("the field is read-only while listening, so keystrokes are never silently lost", opts, async () => {
  // REGRESSION: the textarea displayed the transcript while onChange wrote to a
  // different piece of state, so anything typed during listening vanished.
  await withPage("/assistant", async (page) => {
    await page.locator(".assistant-full .assistant-mic").click();
    await page.waitForFunction(() =>
      document.querySelector(".assistant-full").dataset.voiceState === "listening");
    assert.equal(await page.locator(".assistant-full textarea").getAttribute("readonly"), "");
  });
});

test("two voice turns in a row both work", opts, async () => {
  // Guards the in-flight lock: a permanently-stuck lock would block turn two.
  await withPage("/assistant", async (page) => {
    for (const expected of [1, 2]) {
      await page.waitForFunction(() =>
        document.querySelector(".assistant-full").dataset.voiceState === "idle");
      await page.locator(".assistant-full .assistant-mic").click();
      await page.waitForFunction(
        (n) => document.querySelectorAll(".assistant-full .assistant-log .ai-answer").length === n,
        expected,
        { timeout: 10000 },
      );
    }
    assert.deepEqual(await turns(page), { visitor: 2, answers: 2 });
  });
});

/* ── on a journey stage page ─────────────────────────────────────────────── */

test("the stage page assistant is seeded with that stage", opts, async () => {
  await withPage("/journey/construction-delivery", async (page) => {
    assert.ok(await page.locator(".stage-assistant .assistant").count());
    await ask(page, ".stage-assistant", "What should I be watching here?");
    const trail = await page.evaluate(() =>
      document.querySelector(".stage-assistant .ai-trail")?.innerText.replace(/\s+/g, " ") ?? "");
    assert.match(trail, /Construction &? ?Delivery/, "the seeded stage must give the answer context");
  });
});

/* ── RTL is mirrored by logical properties, not by a second stylesheet ───── */

test("the answer's flat corner sits on the accent side in both directions", opts, async () => {
  // REGRESSION: the accent border was logical but the corner radius was
  // physical, so in Arabic the square edge sat opposite the accent.
  for (const [path, expected] of [["/assistant", "left"], ["/ar/assistant", "right"]]) {
    await withPage(path, async (page) => {
      const geometry = await page.evaluate(() => {
        const c = getComputedStyle(document.querySelector(".ai-answer"));
        return {
          flat: parseFloat(c.borderTopLeftRadius) === 0 ? "left" : "right",
          accent: parseFloat(c.borderLeftWidth) > parseFloat(c.borderRightWidth) ? "left" : "right",
        };
      });
      assert.equal(geometry.flat, expected, `${path}: flat corner on the wrong side`);
      assert.equal(geometry.accent, expected, `${path}: accent border on the wrong side`);
    });
  }
});

/* ── the assistant can answer its own suggestions ────────────────────────── */

test("every suggested question the site offers is answerable", opts, async () => {
  /* The rule suggestions.ts is built on: a suggested question the assistant
     cannot answer is worse than no suggestion. Two whole shapes of generated
     suggestion ("what happens during X", "what runs at the same time as X")
     once fell through to not-in-corpus, and a regex word boundary broke a
     third. Walking the real list is the only assertion that catches that. */
  for (const path of ["/assistant", "/ar/assistant"]) {
    await withPage(path, async (page) => {
      const scope = ".assistant-full";
      const offered = await page.locator(`${scope} .ai-next .ai-chip`).allTextContents();
      assert.ok(offered.length >= 3, `${path}: expected suggestions, found ${offered.length}`);

      for (const question of offered) {
        await page.locator(`${scope} .ai-next .ai-chip`, { hasText: question }).first().click();
        await page.waitForFunction(
          (s) => !document.querySelector(`${s} .assistant-thinking`)
              && document.querySelectorAll(`${s} .ai-answer`).length > 0,
          scope, { timeout: 8000 },
        );
        const declined = await page.evaluate((s) => {
          const last = [...document.querySelectorAll(`${s} .ai-answer`)].pop();
          return /don't have enough verified information|لا تتوفر لديّ معلومات/.test(last.innerText);
        }, scope);
        assert.equal(declined, false, `${path}: the assistant cannot answer its own suggestion — "${question}"`);
        await page.locator(`${scope} .assistant-controls .ai-chip`).last().click(); // Start over
      }
    });
  }
});

/* ── the composer bar behaves like a messaging composer ──────────────────── */

test("send activates only when there is something to commit", opts, async () => {
  await withPage("/assistant", async (page) => {
    const send = page.locator(".assistant-full .composer-send");
    assert.equal(await send.isDisabled(), true, "empty field: send must be inactive");
    await page.locator(".assistant-full textarea").fill("Who are the stakeholders involved?");
    assert.equal(await send.isDisabled(), false, "typed: send must activate");
    await page.locator(".assistant-full textarea").fill("   ");
    assert.equal(await send.isDisabled(), true, "whitespace only: send must stay inactive");
  });
});

test("the field grows with its content and stops at a cap", opts, async () => {
  await withPage("/assistant", async (page) => {
    const height = () => page.evaluate(() =>
      Math.round(document.querySelector(".assistant-full textarea").getBoundingClientRect().height));
    await page.locator(".assistant-full textarea").fill("one line");
    const one = await height();
    await page.locator(".assistant-full textarea").fill("a\nb\nc\nd");
    const four = await height();
    assert.ok(four > one, `expected growth, got ${one} → ${four}`);
    await page.locator(".assistant-full textarea").fill(Array.from({ length: 40 }, (_, i) => `line ${i}`).join("\n"));
    const many = await height();
    assert.ok(many <= 180, `the field must cap rather than grow forever, got ${many}`);
  });
});

test("the mic becomes a stop control while listening", opts, async () => {
  await withPage("/assistant", async (page) => {
    const mic = page.locator(".assistant-full .assistant-mic");
    assert.equal(await mic.locator("rect").count(), 0, "idle: should show a microphone");
    await mic.click();
    await page.waitForFunction(() =>
      document.querySelector(".assistant-full").dataset.voiceState === "listening");
    assert.equal(await mic.locator("rect").count(), 1, "listening: should show a stop square");
    assert.equal(await mic.getAttribute("aria-pressed"), "true");
    // Send acts on the live transcript rather than sitting inert.
    await page.waitForFunction(() =>
      !document.querySelector(".assistant-full .composer-send").disabled, null, { timeout: 5000 });
  });
});

test("Enter sends and Shift+Enter makes a newline", opts, async () => {
  await withPage("/assistant", async (page) => {
    const field = page.locator(".assistant-full textarea");
    await field.fill("first");
    await field.press("Shift+Enter");
    await field.type("second");
    assert.match(await field.inputValue(), /first\nsecond/, "Shift+Enter must not send");
    await field.fill("Who are the stakeholders involved?");
    await field.press("Enter");
    await page.waitForSelector(".assistant-full .assistant-log .ai-answer", { timeout: 8000 });
    assert.equal(await field.inputValue(), "", "sending clears the field");
  });
});

/* ── the REOS wordmark must never mirror ─────────────────────────────────── */

test("the dock wordmark reads REOS in both directions", opts, async () => {
  // REGRESSION: inside the RTL subtree the flex row reversed the letters to
  // "SOER". Everything else on this site mirrors; a Latin wordmark must not.
  for (const path of ["/", "/ar"]) {
    await withPage(path, async (page) => {
      const visual = await page.evaluate(() =>
        [...document.querySelectorAll(".dock-button .dock-mark span")]
          .map((el) => ({ ch: el.textContent, x: el.getBoundingClientRect().left }))
          .sort((a, b) => a.x - b.x)
          .map((o) => o.ch)
          .join(""));
      assert.equal(visual, "REOS", `${path}: wordmark renders as ${visual}`);
    });
  }
});

test("the dock sits in the bottom inline-end corner of each locale", opts, async () => {
  const corner = (path) => withPage(path, (page) => page.evaluate(() => {
    const r = document.querySelector(".dock-button").getBoundingClientRect();
    return { fromInlineEnd: Math.round(Math.min(r.left, window.innerWidth - r.right)),
             fromBottom: Math.round(window.innerHeight - r.bottom),
             onLeft: r.left < window.innerWidth / 2 };
  }));
  const en = await corner("/");
  const ar = await corner("/ar");
  assert.equal(en.onLeft, false, "English: the dock belongs bottom-right");
  assert.equal(ar.onLeft, true, "Arabic: the dock mirrors to bottom-left");
  for (const c of [en, ar]) {
    assert.ok(c.fromBottom > 0 && c.fromBottom < 60, `unexpected bottom offset ${c.fromBottom}`);
  }
});

test("the sticky composer actually covers the text scrolling under it", opts, async () => {
  // REGRESSION: `background: inherit` resolved to transparent, so answer text
  // showed through the Send and voice controls.
  await withPage("/", async (page) => {
    await page.locator(".dock-button").click();
    await ask(page, ".dock-panel", "How do I become a property developer?");
    const bg = await page.evaluate(() =>
      getComputedStyle(document.querySelector(".reos-dock .assistant-composer")).backgroundColor);
    assert.doesNotMatch(bg, /transparent|rgba\(0, 0, 0, 0\)/, "the sticky composer must be opaque");
  });
});

/* ── no layout overflow at any breakpoint, either direction ──────────────── */

test("no horizontal overflow on any breakpoint or locale", opts, async () => {
  browser ??= await chromium.launch({ channel: "chrome" });
  for (const [w, h] of [[1280, 900], [768, 1024], [390, 844]]) {
    for (const path of ["/", "/assistant", "/ar/assistant", "/journey/construction-delivery",
                        "/journey", "/ar/journey"]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      try {
        await page.goto(BASE + path, { waitUntil: "networkidle" });
        const overflows = await page.evaluate(() =>
          document.documentElement.scrollWidth > window.innerWidth + 1);
        assert.equal(overflows, false, `${path} overflows horizontally at ${w}px`);
      } finally {
        await page.close();
      }
    }
  }
});
