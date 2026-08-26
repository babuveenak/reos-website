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
  assert.match(source, /Incomplete seven-stage mapping/);
  assert.match(source, /Missing participation role/);
  assert.doesNotMatch(source, /not-involved/, "no stakeholder-stage relationship may disappear from the public model");
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
  assert.equal((html.match(/5 Dubai routes/g) ?? []).length, 12);
  assert.doesNotMatch(html, /From understanding to governed execution/);
  assert.doesNotMatch(html, /href="\/demo"/);
});

test("Dubai Landowners reference renders source-led steps and a stakeholder visual", async () => {
  const response = await render("/stakeholders/landowners-investors/dubai/track-neutral");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /stakeholder-landowners-investors-hero-v1\.png/);
  assert.match(html, /Interactive process map/);
  assert.equal((html.match(/class="process-stage-tab level-(?:lead|active|supporting|informed)"/g) ?? []).length, 7);
  assert.equal((html.match(/class="process-step lane-(?:you|delivery|authority|evidence)"/g) ?? []).length, 4);
  assert.match(html, /Official sources/);
  assert.match(html, /DLD — Property Status/);
  assert.match(html, /An authority service estimate is not the total transaction duration/);
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
  assert.match(html, /تظل تفاصيل المصادر الرسمية/);
});

test("public footer displays REOS while temporary legal operator copy remains separate", async () => {
  const response = await render("/stakeholders");
  const html = await response.text();
  assert.match(html, /© 2026 REOS/);
  assert.doesNotMatch(html, /© 2026 RESO/);
});
