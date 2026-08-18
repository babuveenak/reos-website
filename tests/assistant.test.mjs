/**
 * PHASE 1A — AI ASSISTANT TESTS
 *
 * Same harness as rendered-html.test.mjs: the built worker is fetched and the
 * returned HTML asserted against. That means these tests cover everything the
 * server renders — the assistant shell, its ARIA wiring, the worked-example
 * transcript, citations, the admin skeletons and both locales.
 *
 * It does NOT cover live client interaction (typing, voice state transitions,
 * conversation accumulation). Those need a browser-driving rig; the worked
 * examples exist partly so the mock's *output* is still asserted here rather
 * than being untested until that rig exists. See PHASE-1A-IMPLEMENTATION.md.
 *
 * Run: npm run build:sites && node --test tests/
 */

import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const text = async (path) => (await render(path)).text();
const arabicCount = (t) => (t.match(/[؀-ۿ]/g) || []).length;

/* ── the assistant is reachable and present ──────────────────────────────── */

test("the homepage leads with the assistant", async () => {
  const html = await text("/");
  assert.match(html, /Ask about the property journey/i);
  assert.match(html, /id="ask"/, "the assistant band needs a stable anchor");
  assert.match(html, /class="assistant assistant-compact"/);
  // Both input modes are offered, as icon controls in one bar.
  assert.match(html, /placeholder="Ask anything…"/);
  assert.match(html, /aria-label="Ask by voice"/i);
  assert.match(html, /class="composer-bar"/);
});

test("the assistant has its own route, in both locales", async () => {
  for (const path of ["/assistant", "/ar/assistant"]) {
    assert.equal((await render(path)).status, 200, path);
  }
  const html = await text("/assistant");
  assert.match(html, /class="assistant assistant-full"/);
});

test("the assistant is honestly framed as a preview", async () => {
  // Removing this notice would make mock answers read as real guidance.
  const html = await text("/assistant");
  assert.match(html, /illustrative examples while its knowledge base is built/i);
  assert.match(html, /status-illustrative/, "answers must carry the Illustrative label");
});

/* ── accessibility ───────────────────────────────────────────────────────── */

test("the assistant is wired for assistive technology", async () => {
  const html = await text("/assistant");
  // The transcript is a live region, not a silent div.
  assert.match(html, /role="log"/);
  assert.match(html, /aria-live="polite"/);
  // Voice state is announced, not only animated.
  assert.match(html, /role="status"/);
  // The mic is a toggle and says so.
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /aria-label="Ask by voice"/i);
  // The textarea has a real label, hidden visually rather than absent.
  assert.match(html, /class="visually-hidden">Your question/);
});

test("voice exposes its state machine in the markup", async () => {
  const html = await text("/assistant");
  assert.match(html, /data-voice-state="idle"/, "the idle state must be observable");
  assert.match(html, /assistant-pulse assistant-pulse-idle/);
});

/* ── the mock's output — worked examples ─────────────────────────────────── */

test("four personas produce four different answers", async () => {
  const html = await text("/assistant");
  for (const question of [
    "I want to buy an apartment in Dubai",
    "How do I become a property developer",
    "where does my capital actually enter",
    "Where do I participate in the development lifecycle",
  ]) {
    assert.ok(html.includes(question), `missing worked example: ${question}`);
  }
  // Each thread carries a journey context block.
  const trails = html.match(/class="ai-journey"/g) || [];
  assert.ok(trails.length >= 4, `expected 4+ journey blocks, found ${trails.length}`);
});

test("answers locate the visitor in the canonical lifecycle", async () => {
  const html = await text("/assistant");
  // Phase and stage come from journey.ts, not from prose in the mock.
  assert.match(html, /Where you are/);
  assert.match(html, /Originate|Deliver|Own|Evolve/);
  assert.match(html, /Land &(amp;)? Ownership|Marketing &(amp;)? Sales|Finance &(amp;)? Escrow/);
});

test("concurrency is stated in answers, not flattened", async () => {
  // The guarded site-wide rule, enforced at the assistant layer too: the buyer
  // example sits on Marketing & Sales, which runs with construction and escrow.
  const html = await text("/assistant");
  assert.match(html, /Runs at the same time as:/);
  assert.match(html, /Construction &(amp;)? Delivery/);
});

test("answers offer a real next step into the site", async () => {
  const html = await text("/assistant");
  assert.match(html, /href="\/roles\/buying"/);
  assert.match(html, /href="\/journey\/[a-z-]+"/);
});

/* ── citations: real sources, no invented dates ──────────────────────────── */

test("citations name real authorities with their real URLs", async () => {
  const html = await text("/assistant");
  assert.match(html, /Dubai Land Department \/ RERA/);
  assert.match(html, /https:\/\/dubailand\.gov\.ae/);
  assert.match(html, /https:\/\/www\.dm\.gov\.ae/);
  assert.match(html, /Open source/);
});

test("no verification date is fabricated", async () => {
  // The single most damaging thing a mock could do is invent a "last verified"
  // date, because that is the platform's credibility signal.
  const html = await text("/assistant");
  const honest = (html.match(/Not yet verified/g) || []).length;
  assert.ok(honest >= 4, `expected 4+ honest gaps, found ${honest}`);
  // No ISO date should appear inside a source block.
  const sourceBlocks = html.match(/class="ai-sources"[\s\S]*?<\/section>/g) || [];
  assert.ok(sourceBlocks.length > 0, "no source blocks rendered");
  for (const block of sourceBlocks) {
    assert.doesNotMatch(block, /\d{4}-\d{2}-\d{2}/, "a source block carries a date it cannot justify");
  }
});

/* ── product discovery stays out of educational answers ──────────────────── */

test("worked examples never turn into a sales pitch", async () => {
  const html = await text("/assistant");
  // The guarded rule: /demo is linked from /platform only. A product action
  // rendered into an educational answer would break it.
  assert.doesNotMatch(html, /href="\/demo"/);
  assert.doesNotMatch(html, /class="ai-product"/);
});

test("the assistant does not add a demo link to any existing page", async () => {
  for (const path of ["/", "/journey", "/roles", "/ecosystem", "/assistant", "/admin"]) {
    assert.doesNotMatch(await text(path), /href="\/demo"/, `${path} must not link to the demo`);
  }
});

/* ── Arabic and RTL ──────────────────────────────────────────────────────── */

test("the Arabic assistant is Arabic, right-to-left", async () => {
  const html = await text("/ar/assistant");
  assert.match(html, /dir="rtl"/);
  assert.ok(arabicCount(html) > 800, `expected Arabic content, found ${arabicCount(html)} characters`);
  // Interface strings, not just content.
  assert.match(html, /اسأل عن أي شيء/, "the composer placeholder must be Arabic");
  assert.match(html, /اسأل بالصوت/, "the voice button must be Arabic");
  assert.match(html, /المصادر/, "the sources heading must be Arabic");
});

test("Arabic answers keep the same structure as English", async () => {
  const html = await text("/ar/assistant");
  assert.match(html, /class="ai-journey"/);
  assert.match(html, /class="ai-sources"/);
  assert.match(html, /يجري بالتوازي مع/, "concurrency must be stated in Arabic too");
  // Authority names stay in their published form; they are not translated.
  assert.match(html, /Dubai Land Department \/ RERA/);
});

test("the Arabic assistant carries the review notice", async () => {
  assert.match(await text("/ar/assistant"), /translation-notice/);
  assert.doesNotMatch(await text("/assistant"), /translation-notice/);
});

/* ── suggested questions are derived, not hard-coded ─────────────────────── */

test("suggested questions come from the content model", async () => {
  const html = await text("/");
  // Route titles are pulled from routes.ts, so a rename cannot orphan them.
  assert.match(html, /I am buying or I own property — where do I start\?/);
  // And one concurrency question, because that is what this site teaches.
  assert.match(html, /What runs at the same time as/);
});

test("only routes with published journeys are suggested", async () => {
  const html = await text("/");
  // `selling` has no persona entry yet; suggesting it would produce a question
  // the assistant cannot answer.
  assert.doesNotMatch(html, /I am selling or brokering property — where do I start\?/);
});

/* ── the composer bar ────────────────────────────────────────────────────── */

test("the composer is one bar: attach, field, mic, send", async () => {
  const html = await text("/assistant");
  const bar = html.slice(html.indexOf('class="composer-bar"'), html.indexOf("</form>"));
  assert.match(bar, /class="composer-icon composer-attach/, "missing the attachment control");
  assert.match(bar, /<textarea/, "missing the text field");
  assert.match(bar, /class="composer-icon assistant-mic/, "missing the mic");
  assert.match(bar, /class="composer-send"/, "missing the send control");
  // Icon-only: every control still carries a name for assistive technology.
  for (const label of ["Attach a document", "Ask by voice", "Send"]) {
    assert.ok(bar.includes(`aria-label="${label}"`), `control not labelled: ${label}`);
  }
});

test("send starts inactive and the field starts one row", async () => {
  const html = await text("/assistant");
  assert.match(html, /class="composer-send" disabled/, "send must be inactive with an empty field");
  assert.match(html, /rows="1"/, "the field should start at one row and grow");
});

test("the attachment control says what it is waiting for", async () => {
  // It cannot upload anything yet — no document repository. Better to say so
  // than to present a control that silently does nothing.
  const html = await text("/assistant");
  assert.match(html, /aria-expanded="false"[^>]*aria-label="Attach a document"|aria-label="Attach a document"/);
  const ar = await text("/ar/assistant");
  assert.match(ar, /aria-label="إرفاق مستند"/, "the attachment control must be labelled in Arabic");
});

/* ── the REOS dock ───────────────────────────────────────────────────────── */

test("the REOS dock is on every visitor-facing page", async () => {
  for (const path of ["/", "/journey", "/journey/construction-delivery", "/roles/buying",
                      "/ecosystem", "/glossary", "/ar", "/ar/journey"]) {
    const html = await text(path);
    assert.match(html, /class="dock-button"/, `${path} is missing the dock`);
    assert.match(html, /aria-expanded="false"[^>]*aria-controls|aria-controls="[^"]*"[^>]*aria-expanded="false"/,
      `${path}: the dock must be a labelled, collapsed disclosure`);
  }
});

test("the dock is absent where it would be redundant", async () => {
  // Its own page already IS the assistant; /admin is an internal tool.
  for (const path of ["/assistant", "/ar/assistant", "/admin", "/admin/gaps"]) {
    assert.doesNotMatch(await text(path), /class="dock-button"/, `${path} should not carry the dock`);
  }
});

test("the dock spells REOS in four separately animatable letters", async () => {
  const html = await text("/");
  // Four spans, not one string: the sequenced animation needs per-letter targets.
  assert.match(html, /class="dock-mark" aria-hidden="true"><span>R<\/span><span>E<\/span><span>O<\/span><span>S<\/span>/);
});

test("the dock offers both text and voice, and starts closed", async () => {
  const html = await text("/");
  assert.match(html, /class="dock-panel"[^>]*hidden/, "the panel must start closed");
  assert.match(html, /role="dialog"/);
  // Both input modes live inside the panel.
  const panel = html.slice(html.indexOf('class="dock-panel"'), html.indexOf('class="dock-button"'));
  assert.match(panel, /<textarea/, "the dock needs a text input");
  assert.match(panel, /assistant-mic/, "the dock needs a voice control");
});

test("the dock is labelled, not just an icon", async () => {
  const en = await text("/");
  assert.match(en, /aria-label="Ask REOS — the property assistant"/);
  const ar = await text("/ar");
  assert.match(ar, /aria-label="اسأل REOS — مساعد العقار"/, "the dock label must be Arabic on Arabic pages");
});

/* ── admin skeletons ─────────────────────────────────────────────────────── */

test("the admin skeletons render", async () => {
  for (const path of ["/admin", "/admin/gaps"]) {
    assert.equal((await render(path)).status, 200, path);
  }
});

test("the repository browser offers the documented filters", async () => {
  const html = await text("/admin");
  for (const label of ["Search", "Status", "Language", "Lifecycle stage", "Kind"]) {
    assert.ok(html.includes(`<span>${label}</span>`), `missing filter: ${label}`);
  }
  // Rows are real records from the content model, with honest verification gaps.
  assert.match(html, /Dubai Land Department \/ RERA/);
  assert.match(html, /not yet verified/);
});

test("the gap dashboard invents no occurrence counts", async () => {
  const html = await text("/admin/gaps");
  assert.match(html, /No gaps recorded yet/);
  assert.match(html, /status-illustrative/, "the shape example must be labelled");
  // The refusal taxonomy is explained, because not every refusal is a gap.
  assert.match(html, /regulated-advice/);
  assert.match(html, /this is the liability boundary working/i);
});

/* ── discovery surfaces ──────────────────────────────────────────────────── */

test("the assistant is in the sitemap and the admin is not", async () => {
  const xml = await text("/sitemap.xml");
  assert.match(xml, /\/assistant</);
  assert.match(xml, /\/ar\/assistant</);
  assert.doesNotMatch(xml, /\/admin/);
});

test("robots keeps the admin out and points at its own sitemap", async () => {
  const txt = await text("/robots.txt");
  assert.match(txt, /Disallow: \/admin/);
  // The sitemap URL and the URLs inside it must share an origin.
  const xml = await text("/sitemap.xml");
  const host = (txt.match(/Sitemap: (https?:\/\/[^/]+)/) || [])[1];
  assert.ok(host, "robots.txt must declare a sitemap");
  assert.ok(xml.includes(host), `sitemap URLs do not match the declared host ${host}`);
});
