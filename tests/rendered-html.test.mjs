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
  assert.match(html, /The operating system for/);
  assert.match(html, /Twelve stakeholder groups/);
  assert.match(html, /Book a demo/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("homepage reaches the lifecycle and ecosystem content", async () => {
  const html = await (await render()).text();
  // The 24-stage model must be reachable from the homepage, not orphaned.
  assert.match(html, /href="\/lifecycle"/);
  assert.match(html, /href="\/lifecycle\/land-opportunity"/);
  assert.match(html, /Regulatory Rail/);
});

test("renders core routes", async () => {
  for (const path of ["/lifecycle", "/stakeholders", "/authorities", "/reos", "/stakeholders/developer", "/lifecycle/handover"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
});
