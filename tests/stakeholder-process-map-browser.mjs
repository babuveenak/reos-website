import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-stakeholder-process-map-qa";
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
  const result = await page.evaluate(async () => window.axe.run(document.querySelector("main"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const serious = result.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), [], `${label} must pass WCAG A/AA`);
}

async function assertGuidedJourney(page, slug) {
  const lifecycle = page.locator(".stakeholder-lifecycle-map");
  assert.equal(await lifecycle.getByRole("tab").count(), 7, `${slug} lifecycle overview must retain all seven stages`);
  assert.equal(await page.locator(".stakeholder-blueprint-hero .stakeholder-scope-selector").count(), 0, `${slug} hero must not lead with route selectors`);
  assert.equal(await page.locator(".stakeholder-process-map .process-route-refinement .stakeholder-scope-selector").count(), 1, `${slug} route refinement must sit inside the direct process walkthrough`);
  assert.equal(await page.locator(".stakeholder-route-refinement").count(), 0, `${slug} must not gate lifecycle comprehension with a standalone route selector`);
  assert.ok(await page.locator(".stakeholder-entry-path").count() >= 1, `${slug} needs a role-specific entry path`);
  assert.ok(await page.locator(".stakeholder-challenge-card").count() >= 4, `${slug} needs role-specific control points`);
}

const desktop = await open("/stakeholders/developers/dubai/dm-mainland", 1440, 1000, "no-preference");
await assertGuidedJourney(desktop.page, "developers");
const heroVisual = desktop.page.locator(".stakeholder-blueprint-visual");
assert.equal(await heroVisual.count(), 1, "each stakeholder page needs one interactive 3D hero visual");
assert.match(await heroVisual.locator("img").getAttribute("src") ?? "", /stakeholder-developers-hero-v1\.jpg/);
await heroVisual.hover({ position: { x: 100, y: 100 } });
const heroTransform = await heroVisual.locator("img").evaluate((element) => getComputedStyle(element).transform);
assert.notEqual(heroTransform, "none", "pointer movement should produce subtle 3D depth");
await heroVisual.screenshot({ path: `${output}/developer-hero-light.png` });
const map = desktop.page.locator(".stakeholder-process-map");
assert.equal(await map.getByRole("tab").count(), 6, "the developer walkthrough must expose only Lead and Active stages");
assert.ok(await map.locator(".isometric-authority-platform").count() >= 1, "the selected intersection must expose interactive authority nodes");
assert.equal(await map.locator(".process-branch").count(), 3, "authority, people and official-source branches must remain visible");
assert.match(await map.innerText(), /Dubai Land Department.*Property Status Enquiry/);
assert.match(await map.innerText(), /How much|No fee published/i);
assert.doesNotMatch(await map.innerText(), /Request a demo|Title Deed Automation|NOC Automation/);

const tabs = map.getByRole("tab");
await tabs.nth(1).focus();
await tabs.nth(1).press("ArrowRight");
await desktop.page.waitForFunction(() => document.querySelectorAll('.stakeholder-process-map [role="tab"]')[2]?.getAttribute("aria-selected") === "true");
assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true", "arrow keys must move the active stage");
assert.ok(await tabs.nth(2).evaluate((element) => element.matches(":focus-visible")), "keyboard-selected stage needs visible focus");
assert.match(await map.locator(".process-role-card").innerText(), /Authorities & Approvals/);
assert.ok(await map.locator(".isometric-authority-platform").count() >= 1, "interaction must replace the process with stage-specific authority nodes");
assert.match(await map.innerText(), /New Building Permit|Final Building Permit/);

await map.getByRole("tab", { name: /05 Sales & Transfer/ }).click();
assert.match(await map.locator(".process-role-card").innerText(), /Registers the project and eligible sales/);
assert.match(await map.innerText(), /Property Sale Registration|Register Initial Sale/);

await scan(desktop.page, "light process map");
await map.screenshot({ path: `${output}/developer-dm-light.png` });
await desktop.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await desktop.page.waitForTimeout(350);
await scan(desktop.page, "dark process map");
await map.screenshot({ path: `${output}/developer-dm-dark.png` });
await desktop.context.close();

const brokers = await open("/stakeholders/brokers-agencies/dubai/dm-mainland", 1440, 1000, "no-preference");
await assertGuidedJourney(brokers.page, "brokers-agencies");
const brokersLifecycle = brokers.page.locator(".stakeholder-lifecycle-map");
assert.equal(await brokersLifecycle.locator(".lifecycle-tier-direct").count(), 3, "brokers need three visually dominant direct touchpoints");
assert.equal(await brokersLifecycle.locator(".lifecycle-tier-supporting").count(), 1, "brokers need one supporting stage");
assert.equal(await brokersLifecycle.locator(".lifecycle-tier-informed").count(), 3, "brokers need three informed-only stages");
assert.equal(await brokersLifecycle.locator(".stakeholder-lifecycle-legend li").count(), 3, "the lifecycle map needs a compact three-tier legend");
assert.match(await brokersLifecycle.locator(".stakeholder-lifecycle-narrative").innerText(), /lead Sales & Transfer and Asset Growth & Intelligence; are active in Living & Operations; support Land & Vision; are only kept informed through Planning & Design, Authorities & Approvals and Construction & Delivery/i);
for (const tier of ["direct", "supporting", "informed"]) {
  const node = brokersLifecycle.locator(`[data-tier='${tier}']`).first();
  assert.equal(await node.locator("svg").count(), 1, `${tier} nodes need a non-color icon cue`);
  assert.ok((await node.locator("em").innerText()).length > 4, `${tier} nodes need a readable badge`);
}
const [directHeight, supportingHeight, informedHeight] = await Promise.all([
  brokersLifecycle.locator(".lifecycle-tier-direct").first().evaluate((element) => element.getBoundingClientRect().height),
  brokersLifecycle.locator(".lifecycle-tier-supporting").first().evaluate((element) => element.getBoundingClientRect().height),
  brokersLifecycle.locator(".lifecycle-tier-informed").first().evaluate((element) => element.getBoundingClientRect().height),
]);
assert.ok(directHeight > supportingHeight && supportingHeight > informedHeight, "size must reinforce direct > supporting > informed hierarchy");
assert.notEqual(await brokersLifecycle.locator(".lifecycle-tier-direct .stakeholder-lifecycle-connector").first().evaluate((element) => getComputedStyle(element).animationName), "none", "direct connectors need a subtle animated signal");
assert.equal(await brokersLifecycle.locator(".lifecycle-tier-informed .stakeholder-lifecycle-connector").first().evaluate((element) => getComputedStyle(element).borderTopStyle), "dashed", "informed connectors need a dashed no-action signal");
assert.equal(await brokers.page.locator(".stakeholder-entry-path").count(), 2, "brokers must separate the individual and company routes");
assert.equal(await brokers.page.locator(".stakeholder-challenge-card").count(), 6, "brokers need the six researched control points");
assert.match(await brokers.page.locator(".stakeholder-entry-guidance").innerText(), /Path A · Individual[\s\S]*Path B · Company/i);
assert.match(await brokers.page.locator(".stakeholder-official-directory").innerText(), /Verify a broker or brokerage office/);
assert.match(await brokers.page.locator(".stakeholder-official-directory a").getAttribute("href") ?? "", /dubailand\.gov\.ae/);
assert.equal(await brokers.page.locator(".process-stage-tab[aria-selected='true']").getAttribute("data-stage-id"), "sales-transfer");
assert.deepEqual(await brokers.page.locator(".process-stage-tab").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-stage-id"))), ["sales-transfer", "living-operations", "asset-growth-intelligence"], "only direct broker stages may receive full process maps");
assert.equal(await brokers.page.locator(".process-stage-tab.level-informed").count(), 0, "informed stages must never expose a full process tab");
assert.equal(await brokers.page.locator(".stakeholder-supporting-summary [data-stage-id='land-vision']").count(), 1, "Land & Vision needs the reduced supporting card");
assert.match(await brokers.page.locator(".stakeholder-supporting-summary").innerText(), /market evidence, comparables and demand data; does not verify title or permitted use/i);
assert.equal(await brokers.page.locator(".stakeholder-informed-summary article").count(), 3, "Planning, approvals and construction must collapse into one informed strip");
assert.match(await brokers.page.locator(".stakeholder-informed-summary").innerText(), /Stages brokers & agencies monitor but don't act in/i);
const lifecycleOrder = await brokers.page.locator(".stakeholder-lifecycle-map").evaluate((element) => element.compareDocumentPosition(document.querySelector(".process-route-refinement")) & Node.DOCUMENT_POSITION_FOLLOWING);
assert.ok(lifecycleOrder, "the lifecycle connection map must appear before jurisdiction refinement");
for (const stageId of ["sales-transfer", "living-operations", "asset-growth-intelligence"]) {
  await brokers.page.locator(`.process-stage-tab[data-stage-id='${stageId}']`).click();
  assert.ok(await brokers.page.locator(".isometric-authority-platform").count() >= 1, `${stageId} needs an interactive authority process map`);
}
await brokers.page.locator(".stakeholder-lifecycle-node").nth(6).focus();
await brokers.page.locator(".stakeholder-lifecycle-node").nth(6).press("Home");
assert.equal(await brokers.page.locator(".stakeholder-lifecycle-node").nth(0).getAttribute("aria-selected"), "true", "lifecycle keyboard navigation must support Home");
await scan(brokers.page, "brokers guided journey light");
await brokers.page.locator(".stakeholder-lifecycle-map").screenshot({ path: `${output}/brokers-lifecycle-light.png` });
await brokers.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await brokers.page.waitForTimeout(250);
await scan(brokers.page, "brokers guided journey dark");
await brokers.page.locator(".stakeholder-lifecycle-map").screenshot({ path: `${output}/brokers-lifecycle-dark.png` });
await brokers.context.close();

for (const [path, stageId, sourcePattern] of [
  ["/stakeholders/landowners-investors", "land-vision", /Property Status Enquiry/],
  ["/stakeholders/consultants-designers/dubai/dda-tecom", "planning-design", /Preliminary Master Plan|Preliminary Design Approval/],
  ["/stakeholders/contractors/dubai/trakhees-pcfc", "construction-delivery", /Completion|Building Completion/],
]) {
  const view = await open(path, 1280, 900);
  assert.ok(await view.page.locator(".process-stage-tab").count() >= 1, `${path} must expose its direct stages`);
  await view.page.locator(`.process-stage-tab[data-stage-id='${stageId}']`).click();
  assert.ok(await view.page.locator(".isometric-authority-platform").count() >= 1, `${path} must expose interactive evidence nodes`);
  assert.match(await view.page.locator(".stakeholder-process-map").innerText(), sourcePattern, `${path} must expose its official route source`);
  await view.context.close();
}

const difc = await open("/stakeholders/property-owners/dubai/financial-free-zone", 1280, 900);
assert.equal(await difc.page.locator(".isometric-authority-platform").count(), 0, "DLD sources must not appear in the DIFC route without DIFC claim-level evidence");
assert.match(await difc.page.locator(".process-context-only").innerText(), /lifecycle context only/i);
assert.doesNotMatch(await difc.page.locator(".stakeholder-process-map").innerText(), /Dubai Land Department/);
await difc.context.close();

for (const slug of [
  "landowners-investors", "developers", "consultants-designers", "authorities-regulators",
  "utility-providers", "contractors", "suppliers-vendors", "brokers-agencies", "banks-financial",
  "property-owners", "residents-tenants", "facility-community-operators",
]) {
  const view = await open(`/stakeholders/${slug}`, 1024, 800);
  const visual = view.page.locator(".stakeholder-blueprint-visual");
  assert.equal(await visual.count(), 1, `${slug} needs one hero visual`);
  assert.ok(await visual.locator("img").evaluate((image) => image.complete && image.naturalWidth >= 800), `${slug} responsive hero asset must load at a suitable desktop width`);
  assert.equal(await view.page.locator(".stakeholder-start").count(), 0, `${slug} must not render the generic starting-point section`);
  await assertGuidedJourney(view.page, slug);
  assert.doesNotMatch(await view.page.locator("main").innerText(), /Start by confirming which lifecycle stage requires|transaction-level authority research for this stakeholder is not yet complete/);
  await view.context.close();
}

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/stakeholders/brokers-agencies/dubai/dm-mainland", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".process-stage-tab").count(), 3, `${width}px must retain the three direct broker stages`);
  assert.ok(await view.page.locator(".isometric-authority-platform").count() >= 1, `${width}px must retain the interactive evidence flow`);
  assert.equal(await view.page.locator(".stakeholder-lifecycle-node").count(), 7, `${width}px must retain the guided lifecycle overview`);
  await view.page.locator(".process-stage-tab").nth(2).click();
  assert.match(await view.page.locator(".process-role-card").innerText(), /Asset Growth & Intelligence/);
  if (width === 390) await view.page.screenshot({ path: `${output}/brokers-dm-mobile.png`, fullPage: true });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: 84-intersection stakeholder model, evidence-driven isometric interactions, keyboard tabs, light/dark WCAG A/AA, responsive overflow, console checks and screenshots (${output})`);
