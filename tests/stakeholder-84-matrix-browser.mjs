import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const stages = ["land-vision", "planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations", "asset-growth-intelligence"];
const stakeholders = ["landowners-investors", "developers", "consultants-designers", "authorities-regulators", "utility-providers", "contractors", "suppliers-vendors", "brokers-agencies", "banks-financial", "property-owners", "residents-tenants", "facility-community-operators"];
const canonicalStageNames = ["Land & Vision", "Planning & Design", "Authorities & Approvals", "Construction & Delivery", "Sales & Transfer", "Living & Operations", "Asset Growth & Intelligence"];
const canonicalStakeholderNames = ["Landowners & Investors", "Developers", "Consultants & Designers", "Authorities & Regulators", "Utility Providers", "Contractors", "Suppliers & Vendors", "Brokers & Agencies", "Banks & Financial Institutions", "Property Owners", "Residents & Tenants", "Facility & Community Operators"];

const routes = stages.flatMap((stage) => stakeholders.flatMap((stakeholder) => [
  `/property-journey/${stage}/stakeholders/${stakeholder}`,
  `/ar/property-journey/${stage}/stakeholders/${stakeholder}`,
]));

const responses = await Promise.all(routes.map(async (route) => {
  const response = await fetch(`${baseURL}${route}`);
  return [route, response.status, await response.text()];
}));
for (const [route, status, html] of responses) {
  assert.equal(status, 200, `${route} must resolve`);
  assert.match(html, /isometric-process-scene/, `${route} must render the interactive process scene`);
  assert.equal((html.match(/class="process-stage-tab level-/g) ?? []).length, 7, `${route} must retain seven stages`);
  assert.doesNotMatch(html, /Title Deed Automation|NOC Automation|Request a demo/, `${route} must remain educational`);
  assert.match(html, /provisional|role context only|محتوى مؤقت|سياق الدور فقط/i, `${route} must expose publication/evidence state`);
  if (!route.startsWith("/ar/")) {
    const [, , stageId, , stakeholderId] = route.split("/");
    const text = html.replaceAll("&amp;", "&");
    assert.match(text, new RegExp(canonicalStageNames[stages.indexOf(stageId)].replace(/[&]/g, "\\&")), `${route} must use the canonical stage name`);
    assert.match(text, new RegExp(canonicalStakeholderNames[stakeholders.indexOf(stakeholderId)].replace(/[&]/g, "\\&")), `${route} must use the canonical stakeholder name`);
  }
}

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(`${baseURL}/property-journey/living-operations/stakeholders/residents-tenants`, { waitUntil: "networkidle" });
assert.equal(await page.getByRole("tab", { name: /06 Living & Operations/ }).getAttribute("aria-selected"), "true", "detail route must open at its requested intersection");
assert.ok(await page.locator(".isometric-authority-platform").count() >= 4, "resident living route must expose official process nodes");
await page.locator(".isometric-authority-platform").nth(1).click();
assert.match(await page.locator(".intersection-source-detail").innerText(), /How much|How long|Payment|Official output/i);

await page.goto(`${baseURL}/property-journey/land-vision/stakeholders/residents-tenants`, { waitUntil: "networkidle" });
assert.match(await page.locator(".intersection-applicability").innerText(), /not directly involved/i);
assert.equal(await page.locator(".isometric-authority-platform").count(), 0, "non-direct cells must not invent authority nodes");
assert.equal(await page.locator(".isometric-flow-line").count(), 0, "non-direct cells must not imply an operational data flow");
assert.equal(await page.locator(".process-branches").count(), 0, "non-direct cells must not render an authority route branch");

await page.goto(`${baseURL}/ar/property-journey/living-operations/stakeholders/residents-tenants`, { waitUntil: "networkidle" });
assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
assert.equal(await page.getByRole("tab").count(), 7);

assert.deepEqual(errors, [], errors.join("\n"));
await context.close();
await browser.close();
console.log("PASS: all 84 English and 84 Arabic intersection routes, initial stage state, non-direct guardrails, interactive official facts and runtime console checks");
