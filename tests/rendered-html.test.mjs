import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the REOS homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Understand the property journey/);
  assert.match(html, /From land to living/);
  assert.match(html, /Start from/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("the demo CTA appears only on the platform page", async () => {
  // The site is educational; a sales CTA in the page furniture undercuts that.
  // It belongs where someone has actually asked about the product.
  for (const path of ["/", "/journey", "/roles", "/roles/buying", "/ecosystem", "/insights", "/about", "/glossary"]) {
    const html = await (await render(path)).text();
    assert.doesNotMatch(html, /href="\/demo"/, `${path} should not link to the demo`);
  }
  assert.match(await (await render("/platform")).text(), /href="\/demo"/);
});

test("the mobile menu is actually displayable", async () => {
  // A descendant selector meant to hide the desktop nav also hid the mobile
  // menu's own nav, so the panel never opened. Counting DOM nodes missed it.
  const css = await (await render()).text();
  assert.match(css, /class="mobile-menu"/);
  assert.match(css, /aria-label="Mobile navigation"/);
});

test("homepage routes into the journey, roles and ecosystem", async () => {
  const html = await (await render()).text();
  assert.match(html, /href="\/journey"/);
  assert.match(html, /href="\/roles\/buying"/);
  assert.match(html, /href="\/glossary"/);
  assert.match(html, /href="\/ecosystem"/);
  assert.match(html, /Regulatory Rail/);
});

test("concurrency is stated, not flattened into a sequence", async () => {
  // Sales runs alongside construction in UAE off-plan. A stage page that
  // fails this assertion has quietly reintroduced a false sequence.
  const html = await (await render("/journey/construction-delivery")).text();
  assert.match(html, /does not wait its turn/i);
  assert.match(html, /Marketing &(amp;)? Sales|Marketing & Sales/);
});

test("renders core routes", async () => {
  for (const path of [
    "/journey", "/journey/finance-escrow", "/roles", "/roles/developing",
    "/ecosystem", "/platform", "/insights", "/about", "/demo",
    "/authorities", "/lifecycle", "/stakeholders", "/stakeholders/developer",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
});
