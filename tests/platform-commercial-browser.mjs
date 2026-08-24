import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://localhost:3001";
const output = "output/evidence/platform-commercial-redesign";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const errors = [];

async function open(width, height = 900) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", message => { if (message.type() === "error") errors.push(`${width}px console: ${message.text()}`); });
  page.on("pageerror", error => errors.push(`${width}px page: ${error.message}`));
  const response = await page.goto(`${baseURL}/platform`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200);
  assert.ok((await page.locator("body").innerText()).length > 2000);
  assert.equal(await page.locator('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay').count(), 0);
  return { context, page };
}

const desktop = await open(1440, 1000);
const page = desktop.page;
assert.equal(await page.locator("h1").innerText(), "The Operating System\nfor Property Development.");
assert.equal(await page.locator("header nav[aria-label='Primary navigation'] a").count(), 5);
assert.equal(await page.locator(".sales-hero-proof > span").count(), 2);
assert.equal(await page.locator(".platform-lifecycle-flow > details").count(), 10);
assert.equal(await page.locator(".platform-suite-grid > article").count(), 6);
assert.equal(await page.locator(".platform-suite-grid > .is-planned").count(), 4);
assert.equal(await page.locator(".platform-suite-grid > .is-planned .maturity-coming-soon").count(), 4);
assert.equal(await page.locator(".platform-screen-tabs > button").count(), 6);
assert.equal(await page.locator(".platform-fragmentation article").count(), 8);
assert.equal(await page.locator(".platform-stakeholder-value article").count(), 10);
assert.equal(await page.locator(".platform-governance-grid article").count(), 7);
assert.equal(await page.locator(".platform-business-outcomes article").count(), 8);
assert.ok(await page.getByRole("link", { name: /Request a demo/i }).count() > 0);

await page.getByRole("tab", { name: "NOC Automation" }).first().click();
assert.equal(await page.locator('[data-product-demo="noc-automation"]').count(), 1);
await page.getByRole("tab", { name: "Unit Cancellation" }).click();
assert.match(await page.locator(".platform-screen-frame").innerText(), /Concept preview only/);
await page.getByRole("tab", { name: "Governance Monitoring" }).click();
assert.match(await page.locator(".platform-screen-frame").innerText(), /Operational control view/);
await page.getByRole("tab", { name: "With REOS" }).click();
assert.match(await page.locator(".sales-comparison").innerText(), /One case state/);

await page.locator(".sales-hero").screenshot({ path: `${output}/01-product-hero-desktop.png` });
await page.locator(".platform-lifecycle").screenshot({ path: `${output}/02-lifecycle-desktop.png` });
await page.locator(".platform-suite").screenshot({ path: `${output}/03-suite-desktop.png` });
await page.locator(".platform-screens").screenshot({ path: `${output}/04-product-screens-desktop.png` });
await page.screenshot({ path: `${output}/05-full-page-desktop.png`, fullPage: true });
await desktop.context.close();

for (const width of [320, 390, 768, 1024]) {
  const viewport = await open(width, width < 500 ? 844 : 900);
  const overflow = await viewport.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  if (width === 390) {
    await viewport.page.locator(".sales-hero").screenshot({ path: `${output}/06-product-hero-mobile.png` });
    await viewport.page.locator(".platform-suite").screenshot({ path: `${output}/07-suite-mobile.png` });
    await viewport.page.locator(".platform-screens").screenshot({ path: `${output}/08-product-screens-mobile.png` });
    await viewport.page.screenshot({ path: `${output}/09-full-page-mobile.png`, fullPage: true });
  }
  await viewport.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log("PASS: Platform commercial page, 10 lifecycle stages, 6 governed capabilities, screen interactions, console health and 4 responsive breakpoints");
