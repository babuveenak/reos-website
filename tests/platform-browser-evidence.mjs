import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3002";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const output = new URL("../output/pdf/reos-final-platform-evidence/screenshots/", import.meta.url);
await mkdir(output, { recursive: true });
const shot = (name) => fileURLToPath(new URL(name, output));

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const errors = [];

async function pageAt(width, height = 900, reducedMotion = "no-preference") {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
  const page = await context.newPage();
  page.on("console", message => { if (message.type() === "error") errors.push(`${width}px console: ${message.text()}`); });
  page.on("pageerror", error => errors.push(`${width}px page: ${error.message}`));
  const response = await page.goto(`${baseURL}/platform`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200);
  assert.ok((await page.locator("body").innerText()).length > 1000);
  assert.equal(await page.locator('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay').count(), 0);
  return { context, page };
}

const desktop = await pageAt(1440, 980);
const page = desktop.page;
assert.equal(await page.locator("header nav[aria-label='Primary navigation'] a").count(), 5);
assert.equal(await page.locator("h1").count(), 1);
await page.addStyleTag({ content: ".site-header{display:none!important}.reos-dock{display:none!important}" });
const checkboxes = page.locator('.executive-self-assessment input[type="checkbox"]');
assert.equal(await checkboxes.count(), 10);
assert.equal(await page.locator('.executive-self-assessment input[type="checkbox"]:checked').count(), 0);
await page.locator(".sales-hero").screenshot({ path: shot("01-platform-hero.png") });
await page.locator("#reos-operating-model").screenshot({ path: shot("02-operating-model-desktop.png") });
await page.locator(".executive-self-assessment").screenshot({ path: shot("04-assessment-default-desktop.png") });

await checkboxes.nth(0).check();
assert.match(await page.locator(".self-assessment-result").innerText(), /Some operating friction is visible/);
for (let i = 1; i < 4; i++) await checkboxes.nth(i).check();
assert.match(await page.locator(".self-assessment-result").innerText(), /affect multiple operating controls/);
for (let i = 4; i < 8; i++) await checkboxes.nth(i).check();
assert.match(await page.locator(".self-assessment-result").innerText(), /broad coordination challenge/);
await checkboxes.nth(7).uncheck();
assert.match(await page.locator(".self-assessment-result").innerText(), /affect multiple operating controls/);
await page.locator(".executive-self-assessment").screenshot({ path: shot("05-assessment-selected-desktop.png") });
assert.equal(await page.locator('.executive-self-assessment a[href="/demo"]').count(), 1);
assert.equal(await page.locator('.executive-self-assessment a[href="#reos-operating-model"]').count(), 1);
await page.getByRole("button", { name: /Reset selections/ }).click();
assert.equal(await page.locator('.executive-self-assessment input[type="checkbox"]:checked').count(), 0);
await checkboxes.first().focus();
await page.keyboard.press("Space");
assert.equal(await checkboxes.first().isChecked(), true);
await page.reload({ waitUntil: "networkidle" });
assert.equal(await page.locator('.executive-self-assessment input[type="checkbox"]:checked').count(), 0, "reflection must not persist after reload");

const productLayer = page.getByRole("button", { name: /Licensed REOS products/ });
await productLayer.focus();
await page.keyboard.press("Enter");
assert.equal(await productLayer.getAttribute("aria-pressed"), "true");
assert.match(await page.locator(".operating-model-detail").innerText(), /Licensed REOS products/);
const accordionButtons = page.locator(".transformation-stakeholder-grid article > button");
assert.equal(await accordionButtons.count(), 12);
await accordionButtons.nth(1).focus();
await page.keyboard.press("Enter");
assert.equal(await accordionButtons.nth(0).getAttribute("aria-expanded"), "false");
assert.equal(await accordionButtons.nth(1).getAttribute("aria-expanded"), "true");
await page.locator(".sales-outcomes").screenshot({ path: shot("07-outcomes-questions.png") });
await page.locator(".transformation-stakeholders").screenshot({ path: shot("08-stakeholder-value-desktop.png") });
await page.locator(".sales-final-cta").screenshot({ path: shot("11-final-cta.png") });
await page.screenshot({ path: shot("12-full-page-desktop.png"), fullPage: true });
await desktop.context.close();

for (const width of [320, 360, 390, 768, 1024]) {
  const viewport = await pageAt(width, width < 500 ? 844 : 900);
  const overflow = await viewport.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}px viewport has ${overflow}px horizontal overflow`);
  await viewport.context.close();
}

const mobile = await pageAt(390, 844);
await mobile.page.addStyleTag({ content: ".site-header{display:none!important}.reos-dock{display:none!important}" });
await mobile.page.locator("#reos-operating-model").screenshot({ path: shot("03-operating-model-mobile.png") });
const mobileChecks = mobile.page.locator('.executive-self-assessment input[type="checkbox"]');
for (let i = 0; i < 5; i++) await mobileChecks.nth(i).check();
await mobile.page.locator(".executive-self-assessment").screenshot({ path: shot("06-assessment-selected-mobile.png") });
const mobileAccordion = mobile.page.locator(".transformation-stakeholders");
await mobile.page.locator(".transformation-stakeholder-grid article > button").first().click();
await mobileAccordion.screenshot({ path: shot("09-stakeholder-mobile-closed.png") });
await mobile.page.locator(".transformation-stakeholder-grid article > button").nth(1).click();
await mobileAccordion.screenshot({ path: shot("10-stakeholder-mobile-open.png") });
await mobile.page.screenshot({ path: shot("13-full-page-mobile.png"), fullPage: true });
await mobile.context.close();

const reduced = await pageAt(390, 844, "reduce");
for (let i = 0; i < 7; i++) {
  const control = reduced.page.locator(".operating-model-layers button").nth(i);
  await control.focus();
  await reduced.page.keyboard.press("Enter");
  assert.equal(await control.getAttribute("aria-pressed"), "true");
}
assert.match(await reduced.page.locator(".operating-model-boundary").innerText(), /official systems retain their required authority/);
await reduced.context.close();

assert.deepEqual(errors, [], errors.join("\n"));
await browser.close();
console.log("PASS: interaction, keyboard, reduced-motion, privacy reset, six breakpoints, and 13 screenshot checks");
