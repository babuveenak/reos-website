import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("stakeholder participation has one guarded 12 × 7 source of truth", async () => {
  const source = await readFile(new URL("../app/data/stakeholderParticipation.ts", import.meta.url), "utf8");
  assert.match(source, /Expected 84 Journey × Stakeholder participation records/);
  assert.match(source, /Missing non-participation reason/);
  assert.match(source, /Missing participation role/);
  const journey = await readFile(new URL("../app/data/journey.ts", import.meta.url), "utf8");
  assert.equal((journey.match(/participatingStakeholderIds\(/g) ?? []).length, 7, "all seven stages must project participation from the shared matrix");
  const relationships = await readFile(new URL("../app/data/relationships.ts", import.meta.url), "utf8");
  assert.doesNotMatch(relationships, /const levelByStage/);
  assert.match(relationships, /participationFor\(stage\.id, stakeholderId\)/);
});

test("the preserved stakeholder hero leads into a richer twelve-group directory", async () => {
  const response = await render("/stakeholders");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /UAE property/);
  assert.match(html, /Choose your role/);
  assert.equal((html.match(/stakeholder-profile-card/g) ?? []).length, 12);
  assert.match(html, /Dubai reference/);
  assert.match(html, /Lifecycle structure/);
  assert.doesNotMatch(html, /From understanding to governed execution/);
  assert.doesNotMatch(html, /href="\/demo"/);
});

test("Dubai Landowners reference renders source-led steps and a stakeholder visual", async () => {
  const response = await render("/stakeholders/landowners-investors/dubai/track-neutral");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /stakeholder-landowners-investors-hero-v1\.png/);
  assert.match(html, /Sequenced blueprint/);
  assert.equal((html.match(/class="blueprint-step"/g) ?? []).length, 10);
  assert.match(html, /Official source/);
  assert.match(html, /Property Sale Registration/);
  assert.match(html, /Authority service estimates are not total commercial transaction durations/);
  assert.doesNotMatch(html, /class="status status-validated"/);
});

test("unmapped jurisdictions never fall back to Dubai transaction facts", async () => {
  const response = await render("/stakeholders/landowners-investors/abu-dhabi");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Not yet mapped/);
  assert.match(html, /Dubai facts are not shown/);
  assert.doesNotMatch(html, /AED 50|Property Sale Registration|Dubai Land Department — Detailed Property Report/);
});

test("Arabic stakeholder reference is RTL and flags source-language evidence", async () => {
  const response = await render("/ar/stakeholders/landowners-investors/dubai/track-neutral");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /dir="rtl"/);
  assert.match(html, /translation-notice/);
  assert.match(html, /تظل الأدلة التنظيمية/);
});

test("public footer displays REOS while temporary legal operator copy remains separate", async () => {
  const response = await render("/stakeholders");
  const html = await response.text();
  assert.match(html, /© 2026 REOS/);
  assert.doesNotMatch(html, /© 2026 RESO/);
});
