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
  assert.match(html, /One connected journey/);
  assert.match(html, /Eight ecosystems/);
  assert.match(html, /Start my journey/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders core routes", async () => {
  for (const path of ["/lifecycle", "/stakeholders", "/authorities", "/reos", "/stakeholders/developer", "/lifecycle/handover"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
});
