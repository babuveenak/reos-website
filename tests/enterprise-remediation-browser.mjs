import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://localhost:3001";
const output = "output/evidence/enterprise-remediation";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const errors = [];

async function open(path, width = 1440, height = 1000) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") errors.push(`${path}: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`${path}: ${error.message}`));
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, `${path} must resolve`);
  assert.equal(await page.locator("h1").count(), 1, `${path} needs one h1`);
  assert.equal(await page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay').count(), 0);
  return { page, context };
}

const home = await open("/");
assert.match(await home.page.locator("h1").innerText(), /operating system/i);
assert.equal(await home.page.locator("header nav[aria-label='Primary navigation'] a").count(), 5);
assert.equal(await home.page.locator(".home-product-proof a").count(), 2);
await home.page.locator(".hero-primary").screenshot({ path: `${output}/01-home-desktop.png` });
await home.context.close();

const demo = await open("/demo?product=title-deed-automation&intent=Pilot%20planning");
assert.equal(await demo.page.locator('select[name="interest"]').inputValue(), "Title Deed Automation");
assert.equal(await demo.page.locator('select[name="intent"]').inputValue(), "Pilot planning");
for (const selector of ['input[name="name"]', 'input[name="email"]', 'input[name="company"]']) assert.equal(await demo.page.locator(selector).getAttribute("required"), "", `${selector} must be required`);
await demo.page.locator('input[name="name"]').fill("Browser Evidence");
await demo.page.locator('input[name="email"]').fill("evidence@example.com");
await demo.page.locator('input[name="company"]').fill("REOS Evaluation");
await demo.page.getByRole("button", { name: /Request the right session/ }).click();
await demo.page.locator(".form-delivery-error[role='alert']").waitFor();
assert.match(await demo.page.locator(".form-delivery-error[role='alert']").innerText(), /Request not submitted/i);
assert.equal(await demo.page.locator(".demo-confirmation").count(), 0, "unconfirmed delivery must never show success");
await demo.page.screenshot({ path: `${output}/02-demo-delivery-contract.png`, fullPage: true });
await demo.context.close();

const assistant = await open("/assistant");
assert.ok(await assistant.page.locator(".ai-trust-state").count() > 0);
assert.match(await assistant.page.locator(".ai-trust-state").first().innerText(), /Illustrative preview/);
assert.ok(await assistant.page.locator(".ai-inline-citation").count() > 0);
await assistant.page.locator(".ai-answer").first().screenshot({ path: `${output}/03-assistant-trust-state.png` });
await assistant.context.close();

const trust = await open("/trust-centre");
assert.equal(await trust.page.locator(".trust-evidence-row:not(.trust-evidence-head)").count(), 5);
assert.equal(await trust.page.locator(".operational-assurance-grid article").count(), 5);
await trust.page.locator("#evidence-register").screenshot({ path: `${output}/04-trust-evidence-register.png` });
await trust.context.close();

const gateway = await open("/platform/products/title-deed-automation/login");
assert.match(await gateway.page.locator('.product-login-actions a').first().getAttribute("href"), /product=title-deed-automation/);
assert.ok(await gateway.page.getByRole("link", { name: /Licensed-user support/ }).getAttribute("href"));
await gateway.context.close();

for (const width of [320, 390, 768, 1024]) {
  const mobile = await open("/demo?product=noc-automation&intent=Product%20walkthrough", width, width < 500 ? 844 : 900);
  const overflow = await mobile.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px demo viewport has ${overflow}px horizontal overflow`);
  if (width === 390) await mobile.page.screenshot({ path: `${output}/05-demo-mobile.png`, fullPage: true });
  await mobile.context.close();
}

const unexpectedErrors = errors.filter((error) => !error.includes("status of 503 (Service Unavailable)"));
assert.deepEqual(unexpectedErrors, [], unexpectedErrors.join("\n"));
await browser.close();
console.log("PASS: 6 routes, demo delivery failure contract, context continuity, semantic headings, 4 responsive breakpoints, reduced motion, and 5 screenshots");
