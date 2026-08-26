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
for (const preserved of [".fragmented-journey", ".assistant-band"]) {
  assert.ok(await desktop.page.locator(preserved).count() > 0, `${preserved} was a held conflict and must remain`);
}
assert.equal(await desktop.page.locator(".fragment-route a").count(), 7, "the current Home visual must retain all seven stage routes");
assert.equal(await desktop.page.locator(".fragment-actor").count(), 6, "the current Home visual must retain its six interactive representative stakeholders");
assert.equal(await desktop.page.locator(".fragment-stage-handoff").count(), 6, "the stage-to-stage lifecycle flow must remain continuous");
assert.equal(await desktop.page.locator(".home-canonical-scope > div").count(), 3);
assert.deepEqual(await desktop.page.locator(".home-canonical-scope dt").allInnerTexts(), ["7", "12", "7"]);
assert.equal(await desktop.page.locator(".home-product-card").count(), 0);
assert.ok(await desktop.page.getByRole("link", { name: /Open the full Assistant/ }).count() > 0);
assert.equal(await desktop.page.getByRole("link", { name: /Request a Demo/ }).count(), 0);
await desktop.page.locator(".home-pathways").screenshot({ path: `${output}/01-five-path-gateway-desktop.png` });
await desktop.page.locator(".hero-primary").screenshot({ path: `${output}/02-educational-hero-desktop.png` });
await desktop.page.screenshot({ path: `${output}/03-educational-home-full.png`, fullPage: true });
await desktop.context.close();

for (const width of [320, 390, 768, 1024]) {
  const mobile = await open(width, width < 500 ? 844 : 900);
  const overflow = await mobile.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  if (width === 390) await mobile.page.locator(".hero-primary").screenshot({ path: `${output}/05-educational-hero-mobile.png` });
  await mobile.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log("PASS: educational Home, 7/12/7 canonical scope, seven-stage interactive route, six representative stakeholder controls, Assistant access, console health and 4 responsive breakpoints");
