import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3001";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-home-fragmentation-qa";
await mkdir(output, { recursive: true });

const expected = {
  developers: ["land-vision", "planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations"],
  "consultants-designers": ["land-vision", "planning-design", "authorities-approvals", "construction-delivery"],
  "authorities-regulators": ["authorities-approvals", "sales-transfer"],
  contractors: ["construction-delivery"],
  "banks-financial": ["land-vision", "construction-delivery", "sales-transfer", "asset-growth-intelligence"],
  "property-owners": ["sales-transfer", "living-operations", "asset-growth-intelligence"],
};

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(width, height, path = "/") {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") errors.push(`${width}px: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`${width}px: ${error.message}`));
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, "the original REOS home page must resolve");
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0, "the home page must not show an error overlay");
  await page.locator(".fragmented-journey").scrollIntoViewIfNeeded();
  return { context, page };
}

const desktop = await open(1440, 1000);
const canvas = desktop.page.locator(".fragmented-journey-canvas");
const actorButtons = canvas.locator(".fragment-actor");
assert.equal(await actorButtons.count(), 6, "all six stakeholder cards must be interactive buttons");
assert.equal(await actorButtons.locator("svg[data-icon]").count(), 6, "every stakeholder needs a role-specific icon");
const icons = await actorButtons.locator("svg[data-icon]").evaluateAll((nodes) => nodes.map((node) => node.dataset.icon));
assert.equal(new Set(icons).size, 6, "stakeholders must not reuse one generic icon");
assert.equal(await canvas.locator(".fragment-route a").count(), 7, "all seven stage nodes must be navigable");
assert.equal(await canvas.locator(".fragment-stage-handoff").count(), 6, "the lifecycle must show all six stage-to-stage handoffs");
assert.equal(await canvas.locator(".fragment-stage-handoff > i").count(), 12, "each handoff needs visible forward and return data movement");
assert.match(await canvas.locator(".fragment-route-heading").innerText(), /Information, evidence and decisions move between stages.*some stages overlap/i);
assert.deepEqual((await canvas.locator(".fragment-route a > span").allInnerTexts()).map((label) => label.toLowerCase()), [
  "land & vision",
  "planning & design",
  "authorities & approvals",
  "construction & delivery",
  "sales & transfer",
  "living & operations",
  "asset growth & intelligence",
]);
const stageNodeSizes = await canvas.locator(".fragment-route [data-stage-anchor]").evaluateAll((nodes) => nodes.map((node) => {
  const bounds = node.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}));
for (const size of stageNodeSizes) assert.ok(size.width >= 54 && size.height >= 54, `stage node is still too small: ${JSON.stringify(size)}`);

for (const [actorId, stageIds] of Object.entries(expected)) {
  const actor = canvas.locator(`[data-actor-id="${actorId}"]`).filter({ has: desktop.page.locator("svg") });
  await actor.click();
  await desktop.page.waitForFunction(([id, count]) => document.querySelectorAll(`.fragment-connection-field path[data-actor-id="${id}"]`).length === count, [actorId, stageIds.length]);
  assert.equal(await actor.getAttribute("aria-pressed"), "true", `${actorId}: the selected state must be exposed`);
  assert.equal(await actorButtons.filter({ has: desktop.page.locator('[aria-pressed="true"]') }).count(), 0, "nested pressed controls are invalid");
  assert.equal(await actorButtons.evaluateAll((buttons) => buttons.filter((button) => button.getAttribute("aria-pressed") === "true").length), 1, "only one stakeholder may be active");
  const connected = await canvas.locator(".fragment-route li.is-connected [data-stage-anchor]").evaluateAll((nodes) => nodes.map((node) => node.dataset.stageAnchor));
  assert.deepEqual(connected, stageIds, `${actorId}: highlighted stages must match the approved relationship model`);
  assert.equal(await canvas.locator(".fragment-actor-lead").count(), 1, `${actorId}: one lead must connect the participant to its touchpoint rail`);
  assert.equal(await canvas.locator(".fragment-actor-rail").count(), 1, `${actorId}: one shared rail must replace overlapping participant curves`);
  const canonicalOrder = ["land-vision", "planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations", "asset-growth-intelligence"];
  const adjacentTouchpoints = canonicalOrder.slice(0, -1).filter((stageId, index) => stageIds.includes(stageId) && stageIds.includes(canonicalOrder[index + 1])).length;
  assert.equal(await canvas.locator(".fragment-stage-handoff.is-active-flow").count(), adjacentTouchpoints, `${actorId}: only adjacent selected-stage handoffs should be emphasized`);
  assert.match(await canvas.locator(".fragment-actor-summary").innerText(), new RegExp(`${stageIds.length} touchpoint`, "i"), `${actorId}: the selected touchpoint count must be visible`);
  const geometry = await canvas.evaluate((element, id) => {
    const bounds = element.getBoundingClientRect();
    return [...element.querySelectorAll(`.fragment-connection-field path[data-actor-id="${id}"]`)].map((path) => {
      const node = element.querySelector(`[data-stage-anchor="${path.dataset.stageId}"]`);
      const nodeBounds = node.getBoundingClientRect();
      return {
        stageId: path.dataset.stageId,
        deltaX: Math.abs(Number(path.dataset.endX) - (nodeBounds.left - bounds.left + nodeBounds.width / 2)),
        deltaY: Math.abs(Number(path.dataset.endY) - (nodeBounds.top - bounds.top + nodeBounds.height / 2)),
      };
    });
  }, actorId);
  for (const endpoint of geometry) {
    assert.ok(endpoint.deltaX <= 1 && endpoint.deltaY <= 1, `${actorId} → ${endpoint.stageId}: dotted line misses its stage node`);
  }
}

const buyer = canvas.locator('.fragment-actor[data-actor-id="property-owners"]');
await buyer.focus();
await desktop.page.keyboard.press("Tab");
await desktop.page.keyboard.press("Shift+Tab");
assert.equal(await buyer.getAttribute("aria-pressed"), "true", "keyboard focus must select a stakeholder");
assert.equal(await buyer.evaluate((element) => element.matches(":focus-visible")), true, "stakeholder focus must be visible");
assert.ok(await buyer.evaluate((element) => getComputedStyle(element).outlineStyle !== "none"), "stakeholder focus requires a visible outline");
assert.ok(await canvas.locator(".fragment-connection-field path").first().evaluate((element) => parseFloat(getComputedStyle(element).animationDuration) <= .01), "moving dots must respect reduced motion");

await desktop.page.addScriptTag({ content: axe.source });
const scan = async (page, theme) => {
  const accessibility = await page.evaluate(async () => window.axe.run(document.querySelector(".fragmented-journey"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const serious = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id }) => id), [], `${theme}: the journey visual must pass WCAG A/AA — ${JSON.stringify(serious.map(({ id, nodes }) => ({ id, nodes: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) })))}`);
};
await scan(desktop.page, "light");
await desktop.page.locator(".fragmented-journey").screenshot({ path: `${output}/fragmentation-light.png` });
await desktop.context.close();

const dark = await open(1440, 1000);
await dark.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await dark.page.waitForTimeout(400); // Let the intentional 250ms theme transition settle before measuring contrast.
await dark.page.addScriptTag({ content: axe.source });
await scan(dark.page, "dark");
await dark.page.locator(".fragmented-journey").screenshot({ path: `${output}/fragmentation-dark.png` });
await dark.context.close();

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open(width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".fragment-actor").count(), 6, `${width}px must retain all six participant controls`);
  assert.equal(await view.page.locator(".fragment-route a").count(), 7, `${width}px must retain all seven stage links`);
  if (width === 390) await view.page.locator(".fragmented-journey").screenshot({ path: `${output}/fragmentation-mobile.png` });
  await view.context.close();
}

const arabic = await open(1024, 900, "/ar");
assert.equal(await arabic.page.locator("html[dir=rtl]").count(), 1, "the Arabic lifecycle must remain RTL");
assert.equal(await arabic.page.locator(".fragment-stage-handoff").count(), 6, "Arabic must retain all six stage handoffs");
assert.match(await arabic.page.locator(".fragment-route-heading").innerText(), /المعلومات والأدلة والقرارات/);
await arabic.page.locator(".fragmented-journey").screenshot({ path: `${output}/fragmentation-arabic.png` });
await arabic.context.close();

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: canonical stakeholder mappings, exact line endpoints, six distinct icons, mouse/keyboard interaction, seven stage links, light/dark WCAG A/AA, reduced motion, four responsive widths, overflow, console and screenshots (${output})`);
