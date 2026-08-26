import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3001";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-stakeholders-simplification-qa";
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

const desktop = await open("/stakeholders", 1440, 1000);
const main = desktop.page.locator("main.inner-page");
assert.equal(await desktop.page.locator(".stakeholder-hotspot").count(), 12, "the interactive hero must retain all twelve groups");
assert.equal(await desktop.page.locator(".group-card").count(), 12, "the directory must retain all twelve stakeholder profiles");
assert.equal(await main.locator(".governance-how, .route-governance, .reos-opportunity").count(), 0, "commercial and oversized promotional sections must be absent");
assert.equal(await main.getByText("HOW REOS WORKS", { exact: true }).count(), 0);
assert.equal(await main.getByText("RELEVANT REOS PRODUCT", { exact: true }).count(), 0);
assert.equal(await main.getByText("Title Deed Automation", { exact: true }).count(), 0);
assert.equal(await main.getByText("NOC Automation", { exact: true }).count(), 0);

const bridge = desktop.page.locator(".stakeholder-guide-bridge");
assert.equal(await bridge.count(), 1, "the personal-journey bridge must be singular and compact");
assert.match(await bridge.innerText(), /Looking for a personal journey\?[\s\S]*buying, developing or investing/);
assert.equal(await bridge.locator("a").count(), 1, "the bridge must contain one contextual action only");
assert.equal(await bridge.locator("a").getAttribute("href"), "/intelligence/guides");
await bridge.locator("a").focus();
assert.equal(await bridge.locator("a").evaluate((element) => element.matches(":focus-visible")), true, "the guide link needs visible keyboard focus");
assert.equal(await desktop.page.locator(".integrity-strip").count(), 1, "the educational integrity boundary must remain");

await desktop.page.addScriptTag({ content: axe.source });
const scan = async (page, theme) => {
  const accessibility = await page.evaluate(async () => window.axe.run(document.querySelector(".group-detail-band"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const serious = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id, nodes }) => ({
    id,
    targets: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  })), [], `${theme}: the stakeholder directory must pass WCAG A/AA`);
};
await scan(desktop.page, "light");
await bridge.screenshot({ path: `${output}/guide-bridge-light.png` });
await desktop.page.screenshot({ path: `${output}/stakeholders-light.png`, fullPage: true });
await desktop.context.close();

const dark = await open("/stakeholders", 1440, 1000);
await dark.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await dark.page.waitForTimeout(400);
await dark.page.addScriptTag({ content: axe.source });
await scan(dark.page, "dark");
await dark.page.locator(".stakeholder-guide-bridge").screenshot({ path: `${output}/guide-bridge-dark.png` });
await dark.context.close();

const arabic = await open("/ar/stakeholders", 1024, 900);
const arabicBridge = arabic.page.locator(".stakeholder-guide-bridge");
assert.match(await arabicBridge.innerText(), /هل تبحث عن رحلة شخصية؟/);
assert.equal(await arabicBridge.locator("a").getAttribute("href"), "/ar/intelligence/guides", "the Arabic bridge must retain locale context");
assert.ok(await arabic.page.locator('[lang="ar"][dir="rtl"]').count() >= 1, "the Arabic route must remain RTL");
await arabic.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/stakeholders", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".group-card").count(), 12, `${width}px must retain all twelve profiles`);
  assert.equal(await view.page.locator(".stakeholder-guide-bridge a").count(), 1, `${width}px must retain one compact guide link`);
  if (width === 390) await view.page.locator(".stakeholder-guide-bridge").screenshot({ path: `${output}/guide-bridge-mobile.png` });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: focused educational Stakeholders route, 12-group preservation, commercial-section removal, compact localized guide bridge, light/dark WCAG A/AA, keyboard focus, four responsive widths, overflow, console and screenshots (${output})`);
