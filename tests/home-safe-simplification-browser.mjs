import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://localhost:3001";
const output = "output/evidence/home-safe-simplification";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const errors = [];

async function open(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200);
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0);
  return { page, context };
}

const desktop = await open(1440, 1000);
assert.equal(await desktop.page.locator("h1").count(), 1);
assert.equal(await desktop.page.locator("header nav[aria-label='Primary navigation'] a").count(), 5);
assert.equal(await desktop.page.locator(".home-pathway-grid > a").count(), 5);
assert.deepEqual(await desktop.page.locator(".home-pathway-grid > a").evaluateAll((links) => links.map((link) => link.getAttribute("href"))), [
  "/property-journey", "/stakeholders", "/ecosystem", "/intelligence", "/platform",
]);
for (const removed of [".persona-select", ".eco-map", ".layer-grid", ".route-governance", ".jl-stats", ".jl-moments", ".module-grid", ".outcome-grid", ".coverage-strip"]) {
  assert.equal(await desktop.page.locator(removed).count(), 0, `${removed} should not remain on Home`);
}
for (const preserved of [".journey-map", ".assistant-band"]) {
  assert.ok(await desktop.page.locator(preserved).count() > 0, `${preserved} was a held conflict and must remain`);
}
assert.equal(await desktop.page.locator(".home-canonical-scope > div").count(), 3);
assert.deepEqual(await desktop.page.locator(".home-canonical-scope dt").allInnerTexts(), ["7", "12", "7"]);
assert.equal(await desktop.page.locator(".home-product-card").count(), 0);
assert.equal(await desktop.page.locator(".home-stakeholder-grid > a").count(), 12);
assert.ok(await desktop.page.getByRole("link", { name: /Open the full Assistant/ }).count() > 0);
assert.equal(await desktop.page.getByRole("link", { name: /Request a Demo/ }).count(), 0);
await desktop.page.locator(".home-pathways").screenshot({ path: `${output}/01-five-path-gateway-desktop.png` });
await desktop.page.locator(".hero-primary").screenshot({ path: `${output}/02-educational-hero-desktop.png` });
await desktop.page.screenshot({ path: `${output}/03-educational-home-full.png`, fullPage: true });
await desktop.context.close();

const platformContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const platform = await platformContext.newPage();
const platformResponse = await platform.goto(`${baseURL}/platform`, { waitUntil: "networkidle" });
assert.equal(platformResponse?.status(), 200);
assert.equal(await platform.locator(".sales-hero-proof > span").count(), 2);
assert.ok(await platform.getByRole("link", { name: /Request a demo/i }).count() > 0);
await platform.locator(".sales-hero").screenshot({ path: `${output}/04-platform-product-ownership.png` });
await platformContext.close();

for (const width of [320, 390, 768, 1024]) {
  const mobile = await open(width, width < 500 ? 844 : 900);
  const overflow = await mobile.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  if (width === 390) await mobile.page.locator(".hero-primary").screenshot({ path: `${output}/05-educational-hero-mobile.png` });
  await mobile.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log("PASS: educational Home, 7/12/7 canonical scope, twelve stakeholder routes, Assistant variants, product ownership on Platform, console health and 4 responsive breakpoints");
