import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://localhost:3001";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-land-vision-guide-qa";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(path, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${path}: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`${path}: ${error.message}`));
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, `${path} must resolve`);
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0, `${path} must not show an error overlay`);
  return { context, page };
}

const landing = await open("/property-journey", 1440, 1000);
assert.equal(await landing.page.locator(".journey-hero-hotspots button").count(), 7, "the frozen interactive landing map must retain seven stages");
assert.equal(await landing.page.locator('.property-journey-hero img[src*="property-journey-interactive-foundation-v1.png"]').count(), 1, "the frozen hero image must remain");
assert.equal(await landing.page.locator(".land-guide").count(), 0, "the stage guide must not alter the landing page");
await landing.context.close();

const desktop = await open("/property-journey/land-vision", 1440, 1000);
assert.equal(await desktop.page.getByRole("tab").count(), 10, "all ten Land & Vision steps must be available");
assert.equal(await desktop.page.locator('[data-guide-current="define-opportunity"]').count(), 1);
assert.equal(await desktop.page.locator("h1").count(), 1, "the stage page must keep one primary heading");
assert.deepEqual(await desktop.page.evaluate(() => {
  const ids = [...document.querySelectorAll(".land-guide [id]")].map((element) => element.id);
  return ids.filter((id, index) => ids.indexOf(id) !== index);
}), [], "the stage guide must not introduce duplicate ids");
assert.equal(await desktop.page.getByRole("tab", { selected: true }).getAttribute("aria-controls"), "land-guide-panel");
assert.equal(await desktop.page.getByRole("tabpanel").getAttribute("aria-live"), "polite");
assert.match(await desktop.page.locator(".land-entry-map").innerText(), /STARTS AT STAGE 1[\s\S]*Land or a development opportunity/);
assert.match(await desktop.page.locator(".land-entry-map").innerText(), /STARTS AT STAGE 5[\s\S]*Apartment, villa or townhouse/);
assert.equal(await desktop.page.locator('.stage-aside a[href^="/lifecycle/"]').count(), 0, "Land & Vision must not send visitors to thin lifecycle stubs");

const firstTab = desktop.page.getByRole("tab").first();
await firstTab.focus();
await firstTab.press("ArrowDown");
assert.equal(await desktop.page.getByRole("tab").nth(1).getAttribute("aria-selected"), "true", "arrow keys must move and select the next step");
assert.match(desktop.page.url(), /step=select-jurisdiction/);

await desktop.page.getByRole("tab", { name: /Verify title & rights/ }).click();
assert.match(desktop.page.url(), /step=verify-title-rights/);
assert.equal(await desktop.page.locator('[data-guide-current="verify-title-rights"]').count(), 1);
assert.ok(await desktop.page.locator('.land-guide-sources a[href*="dubailand.gov.ae"]').count() > 0, "verified Dubai sources must be exposed");
await desktop.page.locator(".land-guide").screenshot({ path: `${output}/land-vision-guide-desktop.png` });
await desktop.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/property-journey/land-vision?step=confirm-eligibility", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator('[data-guide-current="confirm-eligibility"]').count(), 1, `${width}px must preserve the deep-linked step`);
  if (width <= 390) {
    assert.ok(await view.page.locator(".land-guide-select").isVisible(), `${width}px needs the mobile step selector`);
    await view.page.locator(".land-guide-select select").selectOption("contract-register-baseline");
    assert.match(view.page.url(), /step=contract-register-baseline/);
  }
  if (width === 390) await view.page.screenshot({ path: `${output}/land-vision-guide-mobile.png`, fullPage: true });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: frozen landing map, 10-step interaction, keyboard navigation, authority sources, deep links, 4 responsive breakpoints, overflow, console and screenshots (${output})`);
