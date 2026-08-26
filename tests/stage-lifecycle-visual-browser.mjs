import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3001";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-stage-lifecycle-visual-qa";
await mkdir(output, { recursive: true });

const stageIds = [
  "land-vision",
  "planning-design",
  "authorities-approvals",
  "construction-delivery",
  "sales-transfer",
  "living-operations",
  "asset-growth-intelligence",
];

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(path, width = 1440, height = 1000) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${path} ${width}px: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`${path} ${width}px: ${error.message}`));
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle", timeout: 60_000 });
  assert.equal(response?.status(), 200, `${path} must resolve`);
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0, `${path} must not show an error overlay`);
  return { context, page };
}

for (const stageId of stageIds) {
  const view = await open(`/property-journey/${stageId}`);
  assert.equal(await view.page.locator("h1").count(), 1, `${stageId} must keep one primary heading`);
  assert.equal(await view.page.locator(`.stage-hero-visual[data-stage="${stageId}"]`).count(), 1, `${stageId} needs its visual hero`);
  assert.equal(await view.page.locator(".stage-hero-art img").count(), 1, `${stageId} needs one optimized architectural hero image`);
  assert.equal(await view.page.locator(".stage-route-overview li").count(), 7, `${stageId} must retain the canonical seven-stage route`);
  assert.equal(await view.page.locator('.stage-route-overview [aria-current="step"]').count(), 1, `${stageId} needs one current route position`);
  assert.equal(await view.page.locator(".stage-process-flow details").count(), 4, `${stageId} needs four process moves`);
  assert.equal(await view.page.locator(".stage-evidence-map").count(), 1, `${stageId} needs the people and evidence map`);
  assert.equal(await view.page.locator(".stage-guardrail-map").count(), 1, `${stageId} needs the risk and authority boundary map`);
  assert.equal(await view.page.locator(".route-governance").count(), 0, `${stageId} must stay educational rather than commercial`);
  assert.equal(await view.page.getByText("RELEVANT REOS PRODUCT", { exact: true }).count(), 0, `${stageId} must not promote a product`);
  await view.page.addScriptTag({ content: axe.source });
  const accessibility = await view.page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const blockingViolations = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(
    blockingViolations.map(({ id }) => id),
    [],
    `${stageId} has serious accessibility violations: ${blockingViolations.flatMap(({ nodes }) => nodes.map(({ target }) => target.join(" "))).join(", ")}`,
  );
  assert.deepEqual(await view.page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  }), [], `${stageId} must not introduce duplicate ids`);

  const secondMove = view.page.locator(".stage-process-flow details").nth(1);
  await secondMove.locator("summary").focus();
  await secondMove.locator("summary").press("Enter");
  assert.equal(await secondMove.getAttribute("open"), "", `${stageId} process moves must work by keyboard`);
  await view.context.close();
}

const land = await open("/property-journey/land-vision");
assert.equal(await land.page.locator(".land-guide").count(), 1, "the approved Land & Vision guide must remain");
assert.match(await land.page.locator(".stage-route-overview").innerText(), /Developers, development investors, landowners/);
await land.page.screenshot({ path: `${output}/land-vision-desktop.png`, fullPage: true });
await land.context.close();

const sales = await open("/property-journey/sales-transfer", 390, 844);
assert.match(await sales.page.locator(".stage-route-overview").innerText(), /end customer or unit investor buying an apartment, villa or townhouse/i);
await sales.page.screenshot({ path: `${output}/sales-transfer-mobile.png`, fullPage: true });
await sales.context.close();

for (const [stageId, width, height] of [
  ["land-vision", 320, 844],
  ["construction-delivery", 768, 900],
  ["sales-transfer", 1024, 900],
  ["asset-growth-intelligence", 1440, 1000],
]) {
  const view = await open(`/property-journey/${stageId}`, width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${stageId} at ${width}px has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".stage-process-flow details").count(), 4);
  assert.ok(await view.page.locator(".stage-hero-art img").evaluate((image) => getComputedStyle(image).transitionDuration === "0.01ms" || parseFloat(getComputedStyle(image).transitionDuration) <= 0.01), "hero motion must respect reduced-motion preferences");
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: seven visual stage pages, educational boundary, process interactions, WCAG A/AA scan, Land & Vision preservation, entry-point guidance, responsive layouts, reduced motion, overflow, console and screenshots (${output})`);
