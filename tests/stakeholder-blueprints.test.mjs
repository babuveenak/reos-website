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
  assert.match(html, /One role/);
  assert.match(html, /One clear route/);
  assert.equal((html.match(/stakeholder-role-platform cluster-/g) ?? []).length, 12);
  assert.equal((html.match(/journey-visual-stage level-/g) ?? []).length, 7);
  assert.doesNotMatch(html, /From understanding to governed execution/);
  assert.doesNotMatch(html, /href="\/demo"/);
});

test("Dubai Landowners reference renders source-led steps and a stakeholder visual", async () => {
  const response = await render("/stakeholders/landowners-investors/dubai/track-neutral");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /stakeholder-landowners-investors-hero-v1\.png/);
  assert.match(html, /Direct stage walkthrough/);
  assert.match(html, /Where this stakeholder connects to the property lifecycle/);
  assert.equal((html.match(/class="process-stage-tab level-(?:lead|active)"/g) ?? []).length, 5);
  assert.ok((html.match(/isometric-authority-platform/g) ?? []).length >= 1);
  assert.match(html, /Official sources/);
  assert.match(html, /DLD — Property Status/);
  assert.match(html, /An authority service estimate is not the total transaction duration/);
  assert.doesNotMatch(html, /class="status status-validated"/);
});

test("Brokers journey consolidates the page into Emirate-first individual and agency routes", async () => {
  const response = await render("/stakeholders/brokers-agencies/dubai/dm-mainland");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/class="broker-agency-journey broker-operating-map"/g) ?? []).length, 1);
  assert.equal((html.match(/class="broker-route-icon"/g) ?? []).length, 2);
  assert.equal((html.match(/class="broker-stage-card/g) ?? []).length, 5, "Dubai individual route needs five ordered stages");
  assert.match(html, /A-01/);
  assert.match(html, /A-02/);
  assert.match(html, /Become an agent—or open an agency\?/);
  assert.match(html, /Become an agent/);
  assert.match(html, /Open an agency/);
  assert.match(html, /brokers-agencies-operating-map-v1\.png/);
  assert.match(html, /Show my agent path/);
  assert.match(html, /Show my agency path/);
  assert.match(html, /Become a real-estate agent/);
  assert.match(html, /Confirm eligibility and residency route/);
  assert.match(html, /Authority \/ responsible party/);
  assert.match(html, /Boundary — what this does not authorise/);
  assert.match(html, /04 · Official action pack/);
  assert.match(html, /Verify\. Then continue\./);
  assert.match(html, /Official actions for this task/);
  assert.doesNotMatch(html, /Four checks before you leave REOS|Source drawer/);
  assert.match(html, /Licensed Real Estate Brokers/);
  assert.match(html, /Verify a Dubai broker or office/);
  assert.match(html, /Guidance snapshot · not a live government feed/);
  assert.match(html, /seven-stage property lifecycle/);
  assert.match(html, /Official action pack/);
  assert.doesNotMatch(html, /Direct stage walkthrough|Path A · Individual|Path B · Company|Practical control points|Official registry/);
  assert.doesNotMatch(html, /stakeholder-lifecycle-map|stakeholder-process-map|stakeholder-entry-guidance/);
  assert.doesNotMatch(html, /sample broker|sample brokerage|fake broker record/i);

  const abuDhabi = await (await render("/stakeholders/brokers-agencies/abu-dhabi")).text();
  assert.match(abuDhabi, /Choose individual broker or broker employee/);
  assert.match(abuDhabi, /current DARI individual-broker service is for UAE nationals/);

  const sharjah = await (await render("/stakeholders/brokers-agencies/sharjah")).text();
  assert.match(sharjah, /This Emirate is not mapped yet/);
  const unmappedMarkup = sharjah.split('<div class="broker-unmapped">')[1]?.split("</section>")[0] ?? "";
  assert.doesNotMatch(unmappedMarkup, /Broker card: AED 500|AED 9,000|Dubai Land Department/);
});

test("all twelve stakeholder heroes use a role-specific 3D visual and no generic entry fallback", async () => {
  const stakeholders = [
    ["landowners-investors", "png"], ["developers", "jpg"], ["consultants-designers", "jpg"],
    ["authorities-regulators", "jpg"], ["utility-providers", "jpg"], ["contractors", "jpg"],
    ["suppliers-vendors", "jpg"], ["brokers-agencies", "jpg"], ["banks-financial", "jpg"],
    ["property-owners", "jpg"], ["residents-tenants", "jpg"], ["facility-community-operators", "jpg"],
  ];
  for (const [slug, extension] of stakeholders) {
    const response = await render(`/stakeholders/${slug}`);
    assert.equal(response.status, 200, `${slug} must resolve`);
    const html = await response.text();
    assert.match(html, new RegExp(`stakeholder-${slug}-hero-v1\\.${extension}`), `${slug} needs its own hero asset`);
    assert.match(html, /stakeholder-blueprint-visual/, `${slug} needs the interactive visual frame`);
    assert.doesNotMatch(html, /stakeholder-start|Where you start|Lifecycle coverage|نقطة البداية|تغطية دورة الحياة/);
    assert.doesNotMatch(html, /Start by confirming which lifecycle stage requires|transaction-level authority research for this stakeholder is not yet complete/);
  }
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
  assert.match(html, /النسخة العربية ترجمة عمل قيد المراجعة/);
});

test("public footer displays REOS while temporary legal operator copy remains separate", async () => {
  const response = await render("/stakeholders");
  const html = await response.text();
  assert.match(html, /© 2026 REOS/);
  assert.doesNotMatch(html, /© 2026 RESO/);
});
