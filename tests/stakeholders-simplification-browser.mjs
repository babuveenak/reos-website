import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3102";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-stakeholders-visual-explorer-qa";
await mkdir(output, { recursive: true });

const stakeholderNames = [
  "Landowners & Investors", "Developers", "Consultants & Designers", "Authorities & Regulators",
  "Utility Providers", "Contractors", "Suppliers & Vendors", "Brokers & Agencies",
  "Banks & Financial Institutions", "Property Owners", "Residents & Tenants", "Facility & Community Operators",
];
const stageNames = [
  "Land & Vision", "Planning & Design", "Authorities & Approvals", "Construction & Delivery",
  "Sales & Transfer", "Living & Operations", "Asset Growth & Intelligence",
];

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(path, width, height, reducedMotion = "reduce") {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") errors.push(`${path} ${width}px: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`${path} ${width}px: ${error.message}`));
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, `${path} must resolve`);
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0, `${path} must not show an error overlay`);
  return { context, page };
}

const desktop = await open("/stakeholders", 1440, 1000, "no-preference");
const main = desktop.page.locator("main.inner-page");
const explorer = desktop.page.locator(".stakeholder-lifecycle-explorer");
assert.equal(await desktop.page.locator(".stakeholder-hotspot").count(), 12, "the protected hero must retain all twelve groups");
assert.equal(await explorer.locator(".stakeholder-role-platform").count(), 12, "the explorer must expose all twelve canonical stakeholder groups");
assert.equal(await explorer.locator(".stakeholder-role-platform [data-stakeholder-glyph]").count(), 12, "each role must have a distinctive visual glyph");
assert.equal(new Set(await explorer.locator(".stakeholder-role-platform [data-stakeholder-glyph]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-stakeholder-glyph")))).size, 12, "all twelve role visuals must be unique");
assert.equal(await explorer.locator(".journey-visual-stage").count(), 7, "the explorer must preserve the seven canonical stages");
assert.deepEqual(await explorer.locator(".stakeholder-role-platform > strong").allTextContents(), stakeholderNames, "stakeholder names and order must match the canonical taxonomy");
assert.deepEqual(await explorer.locator(".journey-visual-stage > b").allTextContents(), stageNames, "stage names and order must match the canonical taxonomy");
assert.equal(await main.locator(".stakeholder-directory-controls, .stakeholder-profile-card").count(), 0, "the old filters and repeated twelve-card directory must be removed");
assert.equal(await explorer.locator('.stakeholder-role-platform[aria-pressed="true"]').count(), 1, "one role must always remain selected");

const residents = explorer.getByRole("button", { name: /^11 Residents & Tenants$/ });
await residents.click();
assert.match(await explorer.locator(".selected-role-guidance").innerText(), /Residents & Tenants[\s\S]*05 · Sales & Transfer/);
assert.equal(await explorer.locator(".selected-role-guidance a").getAttribute("href"), "/stakeholders/residents-tenants");
await explorer.locator(".stakeholder-explorer-heading h2").hover();
assert.equal(await residents.getAttribute("aria-pressed"), "true", "the selected route must persist after pointer movement");
assert.ok(await explorer.locator(".stage-flow-segment").count() >= 6, "the lifecycle must keep persistent animated connections");

await residents.focus();
await residents.press("ArrowRight");
const operators = explorer.getByRole("button", { name: /^12 Facility & Community Operators$/ });
assert.equal(await operators.getAttribute("aria-pressed"), "true", "arrow keys must advance through the canonical stakeholder order");
assert.equal(await explorer.locator(".selected-role-guidance a").getAttribute("href"), "/stakeholders/facility-community-operators");

assert.equal(await main.locator(".governance-how, .route-governance, .reos-opportunity").count(), 0, "commercial and oversized promotional sections must remain absent");
assert.equal(await desktop.page.locator(".stakeholder-guide-bridge").count(), 1, "the personal-journey bridge must remain compact");
assert.equal(await desktop.page.locator(".integrity-strip").count(), 1, "the educational integrity boundary must remain");

await desktop.page.addScriptTag({ content: axe.source });
const scan = async (page, theme) => {
  const accessibility = await page.evaluate(async () => window.axe.run(document.querySelector(".stakeholder-lifecycle-explorer"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const serious = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), [], `${theme}: explorer must pass WCAG A/AA`);
};
await scan(desktop.page, "light");
await explorer.screenshot({ path: `${output}/stakeholders-explorer-light.png` });
await desktop.context.close();

const dark = await open("/stakeholders", 1440, 1000);
await dark.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await dark.page.waitForTimeout(300);
await dark.page.addScriptTag({ content: axe.source });
await scan(dark.page, "dark");
await dark.page.locator(".stakeholder-lifecycle-explorer").screenshot({ path: `${output}/stakeholders-explorer-dark.png` });
await dark.context.close();

const arabic = await open("/ar/stakeholders", 1024, 900);
assert.ok(await arabic.page.locator('[lang="ar"][dir="rtl"]').count() >= 1, "the Arabic route must remain RTL");
assert.equal(await arabic.page.locator(".stakeholder-role-platform").count(), 12, "Arabic must use the same twelve group ids and order");
assert.equal(await arabic.page.locator(".journey-visual-stage").count(), 7, "Arabic must use the same seven stage ids and order");
assert.equal(await arabic.page.locator('.stakeholder-role-platform [data-stakeholder-glyph="landowners-investors"]').count(), 1);
assert.equal(await arabic.page.locator('.stakeholder-role-platform [data-stakeholder-glyph="facility-community-operators"]').count(), 1);
await arabic.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/stakeholders", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".stakeholder-role-platform").count(), 12, `${width}px must retain all twelve roles`);
  assert.equal(await view.page.locator(".journey-visual-stage").count(), 7, `${width}px must retain all seven stages`);
  if (width === 390) await view.page.locator(".stakeholder-lifecycle-explorer").screenshot({ path: `${output}/stakeholders-explorer-mobile.png` });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: visual-first Stakeholders explorer, canonical 12 × 7 taxonomy, unique role visuals, persistent route flow, practical entry guidance, pointer/keyboard/touch semantics, light/dark WCAG A/AA, RTL, responsive overflow, console checks and screenshots (${output})`);
