import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3101";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-dld-developer-journey-qa";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(path, width = 1440, height = 1000, reducedMotion = "reduce") {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") errors.push(`${path} ${width}px: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`${path} ${width}px: ${error.message}`));
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, `${path} must resolve`);
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0, `${path} must not show an error overlay`);
  return { context, page };
}

async function scan(page, label) {
  await page.addScriptTag({ content: axe.source });
  const accessibility = await page.evaluate(async () => window.axe.run(document.querySelector(".developer-dld-journey"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const serious = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), [], `${label} must pass WCAG A/AA`);
}

const desktop = await open("/stakeholders/developers/dubai/dm-mainland", 1440, 1000, "no-preference");
const journey = desktop.page.locator(".developer-dld-journey");
assert.equal(await journey.count(), 1, "Dubai developers need one DLD journey navigator");
assert.equal(await journey.locator(".developer-seven-stage button").count(), 7, "the connected journey must retain all seven protected REOS stages");
assert.match(await journey.locator(".developer-seven-stage").innerText(), /Stage 7 remains included|Asset Growth & Intelligence/i);
assert.equal(await journey.locator(".developer-checklist-workspace > nav button").count(), 10, "the primary developer checklist must contain ten connected steps");
assert.equal(await desktop.page.locator(".stakeholder-process-map").count(), 0, "the generic process map must not duplicate the developer journey");
assert.equal(await desktop.page.locator(".stakeholder-entry-guidance").count(), 0, "the generic role-entry section must not duplicate the developer checklist");
assert.equal(await journey.locator(".dld-map-node").count(), 5, "the overview needs pre, three development nodes and post");
assert.equal(await journey.locator(".dld-service-nodes > button").count(), 6, "pre-development must start with all six official services");
assert.match(await journey.locator(".dld-escrow-correction").innerText(), /Escrow opening sits in Development.*not in pre-development/i);

await journey.locator(".developer-checklist-workspace > nav button").nth(5).click();
assert.match(await journey.locator(".developer-checklist-detail").innerText(), /Register the project and open escrow[\s\S]*DLD \/ RERA[\s\S]*Linked official service records/i);
assert.match(await journey.locator(".developer-checklist-detail footer").innerText(), /150000|Listed fees/i);
await journey.locator(".developer-checklist-detail footer button").click();
assert.match(await journey.locator(".dld-service-detail").innerText(), /Opening Of An Escrow Account[\s\S]*Trustee Account System - TAS/i);

await journey.locator(".developer-seven-stage button").nth(6).click();
assert.match(await journey.locator(".developer-checklist-detail").innerText(), /Close out and support the operating asset[\s\S]*supporting role/i);

await journey.locator(".dld-phase-nav button").nth(0).click();
await journey.locator(".dld-service-nodes > button").filter({ hasText: "Trade Name Reservation" }).click();
assert.match(await journey.locator(".dld-service-detail").innerText(), /Trade Name Reservation[\s\S]*7 Minutes[\s\S]*620[\s\S]*Emirates ID/);

await journey.locator(".dld-phase-nav button").nth(1).click();
assert.equal(await journey.locator(".dld-development-controls fieldset button").count(), 3, "development must expose all three DLD sub-phases");
assert.equal(await journey.locator(".dld-development-controls select option").count(), 6, "each development sub-phase must expose six authority branches");
await journey.locator(".dld-development-controls fieldset button").nth(0).click();
assert.equal(await journey.locator(".dld-development-controls select").inputValue(), "dubai-municipality", "DM route should default to the Dubai Municipality branch");
assert.equal(await journey.locator(".dld-service-nodes > button").count(), 15, "DM master-plan branch must expose all 15 published records");

await journey.locator(".dld-development-controls select").selectOption("dubai-development-authority");
assert.equal(await journey.locator(".dld-service-nodes > button").count(), 16, "DDA master-plan branch must expose all 16 published records");
await journey.locator(".dld-development-controls fieldset button").nth(1).click();
assert.equal(await journey.locator(".dld-service-nodes > button").count(), 16, "DDA construction branch must expose all 16 published records");
await journey.locator(".dld-service-nodes > button").filter({ hasText: "Building Permit" }).click();
assert.match(await journey.locator(".dld-service-detail").innerText(), /Building Permit[\s\S]*DDA/i);

await journey.locator(".dld-development-controls fieldset button").nth(2).click();
assert.equal(await journey.locator(".dld-service-nodes > button").count(), 2, "off-plan stage must expose project escrow registration and initial unit loading");
const search = journey.locator(".dld-service-search input");
await search.fill("escrow");
assert.equal(await journey.locator(".dld-service-nodes > button").count(), 1, "search must isolate the escrow-opening service");
await journey.locator(".dld-service-nodes > button").click();
assert.match(await journey.locator(".dld-service-detail").innerText(), /Opening Of An Escrow Account[\s\S]*Trustee Account System - TAS[\s\S]*1 Day[\s\S]*150000/i);
await search.focus();
assert.equal(await search.evaluate((element) => element.matches(":focus-visible")), true, "service search needs a visible keyboard focus state");

await journey.locator(".dld-phase-nav button").nth(2).click();
assert.equal(await journey.locator(".dld-service-nodes > button").count(), 2, "post-development must expose both official closure records");
await journey.locator(".dld-service-nodes > button").filter({ hasText: "Final Loading" }).click();
assert.match(await journey.locator(".dld-service-detail").innerText(), /Project Units Loading - Final Loading[\s\S]*3-5 Day[\s\S]*270 UAE Dirhams per unit/);
assert.match(await journey.locator(".dld-crosswalk").innerText(), /protected REOS lifecycle[\s\S]*Land & Vision[\s\S]*Planning & Design[\s\S]*Living & Operations/i);
assert.equal(await journey.locator(".developer-control-points details").count(), 6, "control points must be interactive and use differentiated meanings");
await journey.locator(".developer-control-points details").nth(4).locator("summary").click();
assert.match(await journey.locator(".developer-control-points details").nth(4).innerText(), /Financial control[\s\S]*Why it happens[\s\S]*Recommended control/i);
assert.equal(await journey.locator(".developer-registry-guide input[type='search']").count(), 1, "the registry guide needs searchable official channels");
assert.match(await journey.locator(".developer-registry-guide").innerText(), /Project registration.*real-estate activity licensing.*different questions/is);
assert.doesNotMatch(await journey.innerText(), /Request a demo|Title Deed Automation|NOC Automation/);

await scan(desktop.page, "light DLD developer navigator");
await journey.screenshot({ path: `${output}/developer-dld-light.png` });
await desktop.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await desktop.page.waitForTimeout(250);
await scan(desktop.page, "dark DLD developer navigator");
await journey.screenshot({ path: `${output}/developer-dld-dark.png` });
await desktop.context.close();

const arabic = await open("/ar/stakeholders/developers/dubai/dm-mainland", 1024, 900);
assert.equal(await arabic.page.locator(".developer-dld-journey").count(), 1, "Arabic developer route must retain the DLD navigator");
assert.ok(await arabic.page.locator('[lang="ar"][dir="rtl"]').count() >= 1, "Arabic route must remain RTL");
assert.match(await arabic.page.locator(".developer-dld-journey").innerText(), /يقع فتح حساب الضمان ضمن التطوير/);
assert.match(await arabic.page.locator(".dld-source-warning").innerText(), /باللغة الإنجليزية/);
await arabic.context.close();

const difc = await open("/stakeholders/developers/dubai/financial-free-zone", 1024, 900);
assert.equal(await difc.page.locator(".developer-dld-journey").count(), 0, "DLD service-book facts must not leak into the DIFC property route");
await difc.context.close();

const broker = await open("/stakeholders/brokers-agencies/dubai/dm-mainland", 1024, 900);
assert.equal(await broker.page.locator(".developer-dld-journey").count(), 0, "the DLD developer book must remain developer-specific");
await broker.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/stakeholders/developers/dubai/dm-mainland", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".developer-dld-journey .dld-map-node").count(), 5, `${width}px must retain the graphical route`);
  assert.equal(await view.page.locator(".developer-dld-journey .developer-seven-stage button").count(), 7, `${width}px must retain all seven lifecycle stages`);
  assert.equal(await view.page.locator(".developer-dld-journey .developer-checklist-workspace > nav button").count(), 10, `${width}px must retain all ten checklist steps`);
  await view.page.locator(".developer-dld-journey .dld-phase-nav button").nth(1).click();
  await view.page.locator(".developer-dld-journey .dld-development-controls fieldset button").nth(2).click();
  assert.equal(await view.page.locator(".developer-dld-journey .dld-service-nodes > button").count(), 2, `${width}px must retain off-plan services`);
  if (width === 390) await view.page.locator(".developer-dld-journey").screenshot({ path: `${output}/developer-dld-mobile.png` });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: complete DLD developer flow, three phases, six authority branches, escrow correction, details, search, RTL, WCAG A/AA, responsive overflow and console checks (${output})`);
