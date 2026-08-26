import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://localhost:3001";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-property-journey-visual-qa";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${width}px: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`${width}px: ${error.message}`));
  const response = await page.goto(`${baseURL}/property-journey`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, "/property-journey must resolve");
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0, "the page must not show an error overlay");
  return { context, page };
}

const desktop = await open(1440, 1000);
const hero = desktop.page.locator(".property-journey-hero");
assert.match(await hero.innerText(), /THE PROPERTY JOURNEY[\s\S]*The UAE property journey,[\s\S]*mapped end to end\./);
assert.match(await hero.innerText(), /Property does not move through one process\. It moves through seven connected stages/);
assert.equal(await hero.locator(".journey-hero-hotspots button").count(), 7, "the approved hero must retain seven interactive hotspots");
assert.equal(await hero.locator('img[src*="property-journey-interactive-foundation-v1.png"]').count(), 1, "the approved hero image must remain");

const cards = desktop.page.locator(".stage-index-card");
const expectedStageVisuals = [
  "property-journey-stage-land-vision-v1.jpg",
  "property-journey-stage-planning-design-v1.jpg",
  "property-journey-stage-authorities-approvals-v1.jpg",
  "property-journey-stage-construction-delivery-v1.jpg",
  "property-journey-stage-sales-transfer-v1.jpg",
  "property-journey-stage-living-operations-v1.jpg",
  "property-journey-stage-asset-growth-intelligence-v1.jpg",
];
assert.equal(await cards.count(), 7, "the stage index must show all seven stages");
assert.equal(await desktop.page.locator(".stage-index-visual img").count(), 7, "every stage must have an architectural visual");
const stageSources = await desktop.page.locator(".stage-index-visual img").evaluateAll((images) => images.map((image) => image.getAttribute("src") ?? ""));
assert.equal(new Set(stageSources).size, 7, "every stage card must use a distinct image rather than a crop of the full journey");
expectedStageVisuals.forEach((filename, index) => assert.match(stageSources[index], new RegExp(filename.replaceAll(".", "\\.")), `stage ${index + 1} must use its corresponding image`));
assert.equal(await desktop.page.locator("h1").count(), 1, "the page must retain one primary heading");
assert.deepEqual(await desktop.page.evaluate(() => {
  const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
  return ids.filter((id, index) => ids.indexOf(id) !== index);
}), [], "the redesign must not introduce duplicate ids");
assert.equal(await cards.evaluateAll((links) => links.every((link) => link.textContent?.trim())), true, "every stage link must have an accessible text name");
assert.equal(await desktop.page.locator(".stage-index-visual img").evaluateAll((images) => images.every((image) => image.getAttribute("alt") === "")), true, "repeated stage crops must stay decorative rather than duplicating link text");
assert.equal(await desktop.page.locator(".how-reos-works, .route-governance").count(), 0, "product promotion and duplicate route chooser must be absent");
assert.equal(await desktop.page.locator(".integrity-strip").count(), 1, "the educational integrity notice must remain");
assert.equal((await cards.first().getAttribute("href")), "/property-journey/land-vision");
assert.equal((await cards.last().getAttribute("href")), "/property-journey/asset-growth-intelligence");

const columns = await desktop.page.locator(".stage-index").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
assert.equal(columns, 7, "desktop must form one continuous seven-stage visual route");
await cards.first().focus();
assert.equal(await cards.first().evaluate((element) => element.matches(":focus-visible")), true, "stage cards must expose keyboard focus");
assert.ok(await cards.first().evaluate((element) => getComputedStyle(element).outlineStyle !== "none"), "keyboard focus must be visible");
assert.ok(await desktop.page.locator(".stage-index-visual").first().evaluate((element) => {
  const pseudo = getComputedStyle(element, "::after");
  return parseFloat(pseudo.animationDuration) <= 0.01;
}), "the route pulse must respect reduced-motion preferences");
assert.ok(await desktop.page.locator(".stage-index-visual").first().evaluate((element) => {
  const pseudo = getComputedStyle(element, "::after");
  return parseFloat(pseudo.width) >= 10 && parseFloat(pseudo.opacity) === 1;
}), "the light-mode stage marker must remain clearly visible");
assert.ok(await desktop.page.locator(".stage-index-number").first().evaluate((element) => element.getBoundingClientRect().width >= 44), "stage numbers must use a prominent badge");
await desktop.page.addScriptTag({ content: axe.source });
const lightAccessibility = await desktop.page.evaluate(async () => window.axe.run(document.querySelector("#all-seven-stages"), {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
}));
assert.deepEqual(lightAccessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious").map(({ id }) => id), [], "the light-mode stage cards must pass WCAG A/AA");
await cards.first().evaluate((element) => element.blur());
await desktop.page.screenshot({ path: `${output}/property-journey-light.png`, fullPage: true });
await desktop.page.locator("#all-seven-stages").screenshot({ path: `${output}/stage-cards-light.png` });
await desktop.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
const darkAccessibility = await desktop.page.evaluate(async () => window.axe.run(document.querySelector("#all-seven-stages"), {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
}));
assert.deepEqual(darkAccessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious").map(({ id }) => id), [], "the dark-mode stage cards must pass WCAG A/AA");
await desktop.page.screenshot({ path: `${output}/property-journey-dark.png`, fullPage: true });
await desktop.page.locator("#all-seven-stages").screenshot({ path: `${output}/stage-cards-dark.png` });
await desktop.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open(width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".stage-index-card").count(), 7, `${width}px must retain all seven stages`);
  assert.equal(await view.page.locator(".stage-index-visual img").count(), 7, `${width}px must retain all seven visuals`);
  if (width === 1024) {
    const indexWidth = await view.page.locator(".stage-index").evaluate((element) => element.getBoundingClientRect().width);
    const lastWidth = await view.page.locator(".stage-index-card").last().evaluate((element) => element.getBoundingClientRect().width);
    assert.ok(lastWidth >= indexWidth - 2, "the seventh tablet card must span the route instead of leaving a blank grid cell");
  }
  if (width === 390) await view.page.screenshot({ path: `${output}/property-journey-mobile.png`, fullPage: true });
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: frozen hero, seven distinct stage images, visible number badges and markers, light/dark WCAG A/AA, educational scope, keyboard focus, reduced motion, responsive layout, overflow, console and screenshots (${output})`);
