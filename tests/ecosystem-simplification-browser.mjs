import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-ecosystem-simplification-qa";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(path, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") errors.push(`${path} ${width}px: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`${path} ${width}px: ${error.message}`));
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, `${path} must resolve`);
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0, `${path} must not show an error overlay`);
  return { context, page };
}

async function scan(page, selector, label) {
  await page.addScriptTag({ content: axe.source });
  const accessibility = await page.evaluate(async (root) => window.axe.run(document.querySelector(root), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }), selector);
  const serious = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), [], `${label} must pass WCAG A/AA`);
}

const desktop = await open("/ecosystem", 1440, 1000);
const main = desktop.page.locator("main.inner-page");
const hero = main.locator(".ecosystem-hero");
assert.equal(await hero.count(), 1, "the existing Ecosystem hero must remain");
assert.match(await hero.innerText(), /The connected\s+property ecosystem/);
assert.equal(await hero.locator(".ecosystem-stakeholder-node").count(), 12, "the hero must retain all twelve stakeholder nodes");
assert.equal(await hero.locator(".ecosystem-stage-node").count(), 7, "the hero must retain all seven stage nodes");
assert.ok(await hero.locator(".ecosystem-foundation-image").evaluate((image) => image.complete && image.naturalWidth >= 700), "the hero foundation image must load at a suitable desktop width");

assert.equal(await main.locator(".governance-how, .reos-opportunity, .route-governance").count(), 0, "the three requested sections must be absent");
assert.equal(await main.getByText("HOW REOS WORKS", { exact: true }).count(), 0);
assert.equal(await main.getByText("HOW REOS CONNECTS THEM", { exact: true }).count(), 0);
assert.equal(await main.getByText("BUSINESS OUTCOME", { exact: true }).count(), 0);

const explorer = main.locator(".js-explorer");
assert.equal(await explorer.count(), 1, "the Journey × Stakeholder Explorer must remain the primary content");
assert.equal(await explorer.getByRole("tab").count(), 3, "the explorer must retain its three views");
assert.equal(await explorer.locator('[data-mapped-relationships="84"]').count(), 1, "all 84 relationships must remain mapped");
await explorer.getByRole("tab", { name: /Journey View/ }).click();
await explorer.locator(".explorer-stage-rail button").first().click();
const firstConnected = explorer.locator(".explorer-stakeholder-grid button:not(:disabled)").first();
await firstConnected.click();
assert.equal(await explorer.locator(".relationship-panel").count(), 1, "selecting an intersection must open its relationship preview");
assert.equal(await explorer.locator(".relationship-actions a").count(), 3, "the relationship preview must retain contextual routes");
await scan(desktop.page, ".ecosystem-detailed-map", "light Ecosystem explorer");
await desktop.page.screenshot({ path: `${output}/ecosystem-light.png`, fullPage: true });
await desktop.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await desktop.page.waitForTimeout(500);
await scan(desktop.page, ".ecosystem-detailed-map", "dark Ecosystem explorer");
await explorer.screenshot({ path: `${output}/ecosystem-explorer-dark.png` });
await desktop.context.close();

const arabic = await open("/ar/ecosystem", 1024, 900);
assert.ok(await arabic.page.locator('[lang="ar"][dir="rtl"]').count() >= 1, "the Arabic Ecosystem route must remain RTL");
assert.equal(await arabic.page.locator(".js-explorer").count(), 1, "the Arabic route must retain the shared explorer");
await arabic.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/ecosystem", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".js-explorer").count(), 1, `${width}px must retain the explorer`);
  assert.equal(await view.page.locator(".governance-how, .reos-opportunity, .route-governance").count(), 0, `${width}px must not restore removed sections`);
  if (width === 390) await view.page.screenshot({ path: `${output}/ecosystem-mobile.png`, fullPage: true });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: focused Ecosystem route, preserved interactive hero and 84-relationship explorer, removed duplicate/promotional sections, light/dark WCAG A/AA, RTL, responsive overflow and console checks (${output})`);
