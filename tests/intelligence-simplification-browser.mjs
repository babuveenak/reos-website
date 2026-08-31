import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3101";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-intelligence-simplification-qa";
await mkdir(output, { recursive: true });

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

async function scan(page, label) {
  await page.addScriptTag({ content: axe.source });
  const accessibility = await page.evaluate(async () => window.axe.run(document.querySelector(".intelligence-workspaces"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const serious = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), [], `${label} must pass WCAG A/AA`);
}

const desktop = await open("/intelligence", 1440, 1000, "no-preference");
const main = desktop.page.locator("main.inner-page");
const hero = main.locator(".intelligence-hero");
assert.equal(await hero.count(), 1, "the existing Intelligence hero must remain");
assert.match(await hero.innerText(), /REOS\s+intelligence\.[\s\S]*What knowledge supports the UAE property ecosystem/);
assert.equal(await hero.locator(".intelligence-domain-node").count(), 6, "all six hero knowledge domains must remain");
assert.ok(await hero.locator(".intelligence-foundation-image").evaluate((image) => image.complete && image.naturalWidth >= 700), "the hero foundation image must remain loaded");

assert.equal(await main.locator(".governance-how, .intelligence-governance, .route-governance, #regulations, #processes, #authority-information, #knowledge-graph").count(), 0, "duplicate and promotional sections must be absent");
assert.equal(await main.getByText("RELEVANT REOS PRODUCT", { exact: true }).count(), 0);
assert.equal(await main.getByText("Title Deed Automation", { exact: true }).count(), 0);
assert.equal(await main.getByText("NOC Automation", { exact: true }).count(), 0);

const workspaces = main.locator(".intelligence-workspace");
assert.equal(await workspaces.count(), 4, "the page must contain exactly four visual knowledge workspaces");

const evidence = main.locator(".evidence-workspace");
assert.equal(await evidence.locator(".evidence-rail button").count(), 5, "the trust pathway must contain five checkpoints");
assert.equal(await evidence.locator(".evidence-rail button").nth(1).isDisabled(), true, "future checkpoints must remain locked until the current checkpoint is reviewed");
assert.match(await evidence.locator('.evidence-focus a[target="_blank"]').getAttribute("href"), /^https:\/\/dubailand\.gov\.ae\//, "the example must expose its official primary source");
assert.deepEqual(await evidence.locator(".evidence-lifecycle a").evaluateAll((nodes) => nodes.map((node) => node.textContent?.replace(/\s+/g, " ").trim())), [
  "01Land & VisionEvidence applies here", "02Planning & Design", "03Authorities & Approvals", "04Construction & Delivery", "05Sales & Transfer", "06Living & Operations", "07Asset Growth & Intelligence",
], "the evidence record must retain the canonical seven-stage context");
assert.equal(await evidence.locator('.evidence-lifecycle a[aria-current="step"]').getAttribute("href"), "/property-journey/land-vision");
for (let index = 0; index < 5; index += 1) {
  await evidence.locator(".evidence-focus-actions button").click();
}
assert.match(await evidence.locator(".evidence-focus").innerText(), /Guidance[\s\S]*not an authority decision/i);
assert.match(await evidence.locator(".evidence-completion").innerText(), /Evidence pathway reviewed[\s\S]*authority remains the decision-maker/i);
assert.equal(await evidence.locator(".evidence-rail button:disabled").count(), 0, "all checkpoints must become available after the guided review");
await desktop.page.reload({ waitUntil: "networkidle" });
assert.match(await desktop.page.locator(".evidence-progress").getAttribute("aria-label"), /^5 \/ 5 Reviewed$/, "completed evidence progress must persist locally after reload");

const guide = main.locator(".guide-workspace");
assert.ok(await guide.locator(".guide-role-deck button").count() >= 8, "the role selector must expose the published guide roles");
await guide.locator(".guide-role-deck button").nth(1).click();
assert.equal(await guide.locator(".guide-focus a").count(), 1, "the selected role must have one contextual guide action");
assert.match(await guide.locator(".guide-focus a").getAttribute("href"), /^\/intelligence\/guides\//);

const authority = main.locator(".authority-workspace");
assert.ok(await authority.locator(".authority-node-field button").count() >= 8, "the authority selector must expose the published authority directory");
await authority.locator(".authority-node-field button").nth(2).click();
assert.match(await authority.locator(".authority-focus").innerText(), /jurisdiction|zone|Dubai/i);
assert.match(await authority.locator(".authority-focus a").getAttribute("href"), /^https:\/\//);

const glossary = main.locator(".glossary-workspace");
await glossary.locator('input[type="search"]').fill("escrow");
assert.ok(await glossary.locator(".glossary-term-cloud button").count() >= 1, "glossary search must return matching terms");
assert.match(await glossary.locator(".glossary-focus").innerText(), /escrow/i);
await glossary.locator('input[type="search"]').focus();
assert.equal(await glossary.locator('input[type="search"]').evaluate((element) => element.matches(":focus-visible")), true, "glossary search needs visible keyboard focus");

const processNode = hero.getByRole("button", { name: /03 Processes/ });
await processNode.click();
assert.equal(await hero.locator('.intelligence-hero-preview a[href="/property-journey"]').count(), 1, "Processes must route to Property Journey");
const graphNode = hero.getByRole("button", { name: /06 Knowledge Graph/ });
await graphNode.click();
assert.equal(await hero.locator(".intelligence-hero-preview a").count(), 0, "unpublished Knowledge Graph must not create a false destination");
assert.match(await hero.locator(".intelligence-hero-preview").innerText(), /No public explorer is published yet/i);

assert.equal(await main.locator(".integrity-strip").count(), 1, "the educational integrity boundary must remain");
await scan(desktop.page, "light Intelligence workspaces");
await desktop.page.screenshot({ path: `${output}/intelligence-light.png`, fullPage: true });
await desktop.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await desktop.page.waitForTimeout(350);
await scan(desktop.page, "dark Intelligence workspaces");
await desktop.page.screenshot({ path: `${output}/intelligence-dark.png`, fullPage: true });
await desktop.context.close();

const arabic = await open("/ar/intelligence", 1024, 900);
assert.ok(await arabic.page.locator('[lang="ar"][dir="rtl"]').count() >= 1, "the Arabic Intelligence route must remain RTL");
assert.equal(await arabic.page.locator(".intelligence-workspace").count(), 4, "the Arabic route must retain all four workspaces");
assert.match(await arabic.page.locator(".guide-workspace h2").innerText(), /اختر دورك/);
await arabic.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/intelligence", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".intelligence-workspace").count(), 4, `${width}px must retain the four workspaces`);
  assert.equal(await view.page.locator(".route-governance, .governance-how").count(), 0, `${width}px must not restore removed sections`);
  if (width === 390) await view.page.screenshot({ path: `${output}/intelligence-mobile.png`, fullPage: true });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: simplified Intelligence page, preserved interactive hero, four visual workspaces, honest domain routing, keyboard/touch semantics, light/dark WCAG A/AA, RTL, responsive overflow, console checks and screenshots (${output})`);
