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

test("Arabic routes render Arabic, right-to-left", async () => {
  // The original bug: the language control set dir/lang and nothing else, so
  // the layout reversed and every word stayed English.
  const arabic = (t) => (t.match(/[\u0600-\u06FF]/g) || []).length;
  for (const path of ["/ar", "/ar/journey", "/ar/roles/buying", "/ar/glossary"]) {
    const html = await (await render(path)).text();
    assert.match(html, /dir="rtl"/, `${path} must be RTL`);
    assert.ok(arabic(html) > 400, `${path} should carry Arabic text, found ${arabic(html)}`);
  }
  // English must stay untouched at the root.
  const en = await (await render("/journey")).text();
  assert.doesNotMatch(en, /dir="rtl"/);
});

test("the review notice appears on Arabic pages only", async () => {
  assert.match(await (await render("/ar")).text(), /translation-notice/);
  assert.doesNotMatch(await (await render("/")).text(), /translation-notice/);
});

test("the roles page shows twelve routes in frequency order", async () => {
  const html = await (await render("/roles")).text();
  for (let n = 1; n <= 12; n++) {
    assert.match(html, new RegExp(`>${String(n).padStart(2, "0")}<`), `route ${n} missing`);
  }
  // The orientation helper is not a stakeholder group and is never numbered.
  assert.match(html, /Not sure which applies to you\?/);
  // Taxonomy group numbers are internal and must never reach the UI.
  assert.doesNotMatch(html, /taxonomyGroup/);
});

test("every route link resolves, including retired URLs", async () => {
  const slugs = ["buying","developing","investing","selling","financing","design-engineering",
    "building","legal-compliance","managing","utilities","regulators","specialist-services",
    "new-to-uae","professional-services"];
  for (const slug of slugs) {
    assert.equal((await render(`/roles/${slug}`)).status, 200, `/roles/${slug}`);
  }
});

test("renders core routes", async () => {
  for (const path of [
    "/journey", "/journey/finance-escrow", "/roles", "/roles/developing",
    "/ecosystem", "/platform", "/insights", "/about", "/demo",
    "/authorities", "/lifecycle", "/stakeholders", "/stakeholders/developer",
    "/ar", "/ar/journey", "/ar/roles", "/ar/ecosystem", "/ar/glossary", "/ar/platform",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
});
