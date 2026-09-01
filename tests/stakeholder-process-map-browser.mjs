import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import axe from "axe-core";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.QA_OUTPUT ?? "/tmp/reos-stakeholder-process-map-qa";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const errors = [];

async function open(path, width = 1440, height = 1000, reducedMotion = "reduce") {
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
  const result = await page.evaluate(async () => window.axe.run(document.querySelector("main"), {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
  const serious = result.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
  assert.deepEqual(serious.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), [], `${label} must pass WCAG A/AA`);
}

async function assertGuidedJourney(page, slug) {
  if (slug === "developers") {
    assert.equal(await page.locator(".developer-lifecycle-ribbon button").count(), 7, "developers must retain all seven lifecycle stages in one journey");
    assert.equal(await page.locator(".developer-checklist-workspace > nav button").count(), 10, "developers need the ten-step central checklist");
    assert.equal(await page.locator(".developer-control-points details").count(), 6, "developers need six interactive control points");
    assert.equal(await page.locator(".developer-registry-guide").count(), 1, "developers need one integrated official-directory section");
    assert.equal(await page.locator(".stakeholder-process-map").count(), 0, "developers must not repeat the generic process walkthrough");
    assert.equal(await page.locator(".stakeholder-entry-guidance").count(), 0, "developers must not repeat the generic entry section");
    return;
  }
  if (slug === "brokers-agencies") {
    assert.equal(await page.locator(".broker-agency-journey").count(), 1, "brokers need one consolidated journey");
    assert.equal(await page.locator(".broker-route-control button").count(), 2, "brokers need individual and agency routes");
    assert.equal(await page.locator(".broker-route-visual img").count(), 1, "brokers need one visual two-route operating map");
    assert.equal(await page.locator(".broker-map-destination").count(), 2, "the 3D map needs two selectable legal destinations");
    assert.equal(await page.locator(".broker-map-checkpoint").count(), 5, "the active 3D branch needs five selectable stage checkpoints");
    assert.equal(await page.locator(".broker-stage-path button").count(), 5, "Dubai individual route needs five ordered stages");
    assert.equal(await page.locator(".broker-task-route > div > button").count(), 2, "the first agent stage needs its two connected tasks");
    assert.equal(await page.locator(".broker-detail-tabs button").count(), 4, "task facts must be grouped into four focused views");
    assert.equal(await page.locator(".broker-official-pack").count(), 1, "brokers need one compact official handoff");
    assert.match(await page.locator(".broker-pack-task").innerText(), /A-01[\s\S]*Confirm eligibility and residency route/);
    assert.doesNotMatch(await page.locator(".broker-verification").innerText(), /Four checks before you leave REOS|Source drawer/);
    assert.equal(await page.locator(".broker-lifecycle-crosswalk li").count(), 7, "the protected lifecycle needs one compact seven-stage crosswalk");
    assert.equal(await page.locator(".stakeholder-lifecycle-map, .stakeholder-process-map, .stakeholder-entry-guidance, .stakeholder-official-directory").count(), 0, "the five generic sections must not compete with the consolidated journey");
    return;
  }
  const lifecycle = page.locator(".stakeholder-lifecycle-map");
  assert.equal(await lifecycle.getByRole("tab").count(), 7, `${slug} lifecycle overview must retain all seven stages`);
  assert.equal(await page.locator(".stakeholder-blueprint-hero .stakeholder-scope-selector").count(), 0, `${slug} hero must not lead with route selectors`);
  assert.equal(await page.locator(".stakeholder-process-map .process-route-refinement .stakeholder-scope-selector").count(), 1, `${slug} route refinement must sit inside the direct process walkthrough`);
  assert.equal(await page.locator(".stakeholder-route-refinement").count(), 0, `${slug} must not gate lifecycle comprehension with a standalone route selector`);
  assert.ok(await page.locator(".stakeholder-entry-path").count() >= 1, `${slug} needs a role-specific entry path`);
  assert.ok(await page.locator(".stakeholder-challenge-card").count() >= 6, `${slug} needs at least six role-specific control points`);
  assert.equal(await page.locator(".stakeholder-official-directory").count(), 1, `${slug} needs one shared official-directory section`);
  assert.equal(await page.locator(".stakeholder-official-directory input[type='search']").count(), 1, `${slug} directory needs search`);
  assert.equal(await page.locator(".stakeholder-official-directory select").count(), 1, `${slug} directory needs an Emirate refinement`);
}

const desktop = await open("/stakeholders/developers/dubai/dm-mainland", 1440, 1000, "no-preference");
await assertGuidedJourney(desktop.page, "developers");
const heroVisual = desktop.page.locator(".stakeholder-blueprint-visual");
assert.equal(await heroVisual.count(), 1, "each stakeholder page needs one interactive 3D hero visual");
assert.match(await heroVisual.locator("img").getAttribute("src") ?? "", /stakeholder-developers-hero-v1\.jpg/);
await heroVisual.hover({ position: { x: 100, y: 100 } });
const heroTransform = await heroVisual.locator("img").evaluate((element) => getComputedStyle(element).transform);
assert.notEqual(heroTransform, "none", "pointer movement should produce subtle 3D depth");
await heroVisual.screenshot({ path: `${output}/developer-hero-light.png` });
const map = desktop.page.locator(".stakeholder-process-map");
assert.equal(await map.count(), 0, "the developer page must use its single integrated journey instead of a second process map");
const developerJourney = desktop.page.locator(".developer-dld-journey");
assert.equal(await developerJourney.locator(".developer-lifecycle-ribbon button").count(), 7);
assert.equal(await developerJourney.locator(".developer-checklist-workspace > nav button").count(), 10);
await developerJourney.locator(".developer-checklist-workspace > nav button").nth(4).focus();
assert.ok(await developerJourney.locator(".developer-checklist-workspace > nav button").nth(4).evaluate((element) => element.matches(":focus-visible")), "keyboard-focused checklist steps need visible focus");
await developerJourney.locator(".developer-checklist-workspace > nav button").nth(4).click();
assert.match(await developerJourney.locator(".developer-checklist-detail").innerText(), /Coordinate the master plan, design and NOCs[\s\S]*Authority \/ decision route/i);
assert.doesNotMatch(await developerJourney.innerText(), /Request a demo|Title Deed Automation|NOC Automation/);

await scan(desktop.page, "light process map");
await developerJourney.screenshot({ path: `${output}/developer-dm-light.png` });
await desktop.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await desktop.page.waitForTimeout(350);
await scan(desktop.page, "dark process map");
await developerJourney.screenshot({ path: `${output}/developer-dm-dark.png` });
await desktop.context.close();

const brokers = await open("/stakeholders/brokers-agencies/dubai/dm-mainland", 1440, 1000, "no-preference");
await assertGuidedJourney(brokers.page, "brokers-agencies");
const brokerJourney = brokers.page.locator(".broker-agency-journey");
assert.equal(await brokerJourney.locator(".broker-route-control button").count(), 2, "both legal route choices must remain visible");
await brokerJourney.locator(".broker-route-studio").scrollIntoViewIfNeeded();
const routeToggleScroll = await brokers.page.evaluate(() => window.scrollY);
await brokerJourney.locator(".broker-map-destination-agency").click();
await brokers.page.waitForTimeout(120);
assert.ok(Math.abs((await brokers.page.evaluate(() => window.scrollY)) - routeToggleScroll) <= 2, "switching Agent and Agency must not jump to the next section");
assert.match(await brokerJourney.locator(".broker-route-summary h4").innerText(), /Open a real-estate brokerage agency/);
assert.equal(await brokerJourney.locator(".broker-map-destination-agency").getAttribute("aria-pressed"), "true", "the selected image destination needs an accessible active state");
for (const index of [0, 1]) {
  const box = await brokerJourney.locator(".broker-map-checkpoint").nth(index).boundingBox();
  const visualBox = await brokerJourney.locator(".broker-route-visual").boundingBox();
  assert.ok(box && visualBox && box.y >= visualBox.y && box.y + box.height <= visualBox.y + visualBox.height, `image checkpoint ${index + 1} must be fully visible`);
  assert.ok(box && box.width >= 30 && box.height >= 30, `image checkpoint ${index + 1} must render as a complete control`);
}
await brokerJourney.locator(".broker-route-studio").screenshot({ path: `${output}/brokers-agency-map.png` });
assert.equal(await brokerJourney.locator(".broker-stage-path button").count(), 5, "Dubai agency route needs five ordered stages");
assert.match(await brokerJourney.locator(".broker-route-summary aside").innerText(), /B-00[\s\S]*Define the exact brokerage activities/, "the fixed journey beginning must not change with the selected task");
await brokerJourney.locator(".broker-map-checkpoint").nth(2).click();
assert.equal(await brokerJourney.locator(".broker-stage-path button").nth(2).getAttribute("aria-current"), "step", "image checkpoints must open their matching journey stage");
await brokerJourney.locator(".broker-stage-path button").nth(3).click();
assert.equal(await brokerJourney.locator(".broker-task-route > div > button").count(), 3, "the agency control stage needs its three connected operational tasks");
await brokerJourney.locator(".broker-task-route > div > button").first().click();
assert.match(await brokerJourney.locator(".broker-step-detail").innerText(), /AML\/CFT[\s\S]*goAML[\s\S]*Ministry of Economy/);
assert.match(await brokerJourney.locator(".broker-current-task-label").innerText(), /Currently viewing[\s\S]*B-09/i);
await brokerJourney.locator(".broker-detail-tabs button").nth(1).click();
assert.match(await brokerJourney.locator(".broker-detail-panel").innerText(), /Prerequisites and evidence[\s\S]*Boundary/i);
await brokerJourney.locator(".broker-detail-tabs button").nth(2).click();
assert.match(await brokerJourney.locator(".broker-detail-panel").innerText(), /Fee[\s\S]*Authority duration[\s\S]*Validity/i);
await brokerJourney.locator(".broker-detail-tabs button").nth(3).click();
assert.ok(await brokerJourney.locator(".broker-detail-actions-focused a").count() >= 1, "the selected task needs an exact official action inside its focused view");
assert.match(await brokerJourney.locator(".broker-pack-task").innerText(), /B-09[\s\S]*AML\/CFT/);
assert.ok(await brokerJourney.locator(".broker-pack-actions>div>a").count() >= 1, "the selected task needs visible official actions");
await brokerJourney.locator(".broker-emirate-control select").selectOption("abu-dhabi");
assert.match(await brokerJourney.locator(".broker-step-detail").innerText(), /Choose Abu Dhabi company or branch/);
assert.equal(await brokerJourney.locator(".broker-directory-note").count(), 1, "Abu Dhabi must not pretend the coming-soon directory is a live broker search");
await brokerJourney.locator(".broker-route-control button").nth(0).click();
assert.match(await brokerJourney.locator(".broker-step-detail").innerText(), /Choose individual broker or broker employee/);
assert.equal(await brokerJourney.locator(".broker-stage-path button").count(), 5, "Abu Dhabi individual route needs five stages");
await brokerJourney.locator(".broker-emirate-control select").selectOption("sharjah");
assert.match(await brokerJourney.locator(".broker-unmapped").innerText(), /not mapped yet/i);
assert.equal(await brokerJourney.locator(".broker-path-section").count(), 0, "an unmapped Emirate must never inherit a mapped process");
assert.doesNotMatch(await brokerJourney.innerText(), /AED 500|AED 9,000/);
await brokerJourney.locator(".broker-emirate-control select").selectOption("dubai");
await scan(brokers.page, "brokers guided journey light");
await brokerJourney.screenshot({ path: `${output}/brokers-journey-light.png` });
await brokers.page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
await brokers.page.waitForTimeout(250);
await scan(brokers.page, "brokers guided journey dark");
await brokerJourney.screenshot({ path: `${output}/brokers-journey-dark.png` });
await brokers.context.close();

for (const [path, stageId, sourcePattern] of [
  ["/stakeholders/landowners-investors", "land-vision", /Property Status Enquiry/],
  ["/stakeholders/consultants-designers/dubai/dda-tecom", "planning-design", /Preliminary Master Plan|Preliminary Design Approval/],
  ["/stakeholders/contractors/dubai/trakhees-pcfc", "construction-delivery", /Completion|Building Completion/],
]) {
  const view = await open(path, 1280, 900);
  assert.ok(await view.page.locator(".process-stage-tab").count() >= 1, `${path} must expose its direct stages`);
  await view.page.locator(`.process-stage-tab[data-stage-id='${stageId}']`).click();
  assert.ok(await view.page.locator(".isometric-authority-platform").count() >= 1, `${path} must expose interactive evidence nodes`);
  assert.match(await view.page.locator(".stakeholder-process-map").innerText(), sourcePattern, `${path} must expose its official route source`);
  await view.context.close();
}

const difc = await open("/stakeholders/property-owners/dubai/financial-free-zone", 1280, 900);
assert.equal(await difc.page.locator(".isometric-authority-platform").count(), 0, "DLD sources must not appear in the DIFC route without DIFC claim-level evidence");
assert.match(await difc.page.locator(".process-context-only").innerText(), /lifecycle context only/i);
assert.doesNotMatch(await difc.page.locator(".stakeholder-process-map").innerText(), /Dubai Land Department/);
await difc.context.close();

for (const slug of [
  "landowners-investors", "developers", "consultants-designers", "authorities-regulators",
  "utility-providers", "contractors", "suppliers-vendors", "brokers-agencies", "banks-financial",
  "property-owners", "residents-tenants", "facility-community-operators",
]) {
  const view = await open(`/stakeholders/${slug}`, 1024, 800);
  const visual = view.page.locator(".stakeholder-blueprint-visual");
  assert.equal(await visual.count(), 1, `${slug} needs one hero visual`);
  assert.ok(await visual.locator("img").evaluate((image) => image.complete && image.naturalWidth >= 800), `${slug} responsive hero asset must load at a suitable desktop width`);
  assert.equal(await view.page.locator(".stakeholder-start").count(), 0, `${slug} must not render the generic starting-point section`);
  await assertGuidedJourney(view.page, slug);
  assert.doesNotMatch(await view.page.locator("main").innerText(), /Start by confirming which lifecycle stage requires|transaction-level authority research for this stakeholder is not yet complete/);
  await view.context.close();
}

for (const [width, height] of [[320, 844], [390, 844], [768, 900], [1024, 900]]) {
  const view = await open("/stakeholders/brokers-agencies/dubai/dm-mainland", width, height);
  const overflow = await view.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  assert.equal(await view.page.locator(".broker-route-control button").count(), 2, `${width}px must retain both legal routes`);
  assert.equal(await view.page.locator(".broker-stage-path button").count(), 5, `${width}px must retain the five-stage Dubai individual journey`);
  assert.equal(await view.page.locator(".broker-lifecycle-crosswalk li").count(), 7, `${width}px must retain the lifecycle crosswalk`);
  await view.page.locator(".broker-stage-path button").nth(2).click();
  await view.page.locator(".broker-task-route > div > button").first().click();
  assert.match(await view.page.locator(".broker-step-detail").innerText(), /electronic practice card/i);
  if (width === 390) {
    await view.page.screenshot({ path: `${output}/brokers-dm-mobile.png`, fullPage: true });
  }
  await view.context.close();
}

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log(`PASS: 84-intersection stakeholder model, evidence-driven isometric interactions, keyboard tabs, light/dark WCAG A/AA, responsive overflow, console checks and screenshots (${output})`);
