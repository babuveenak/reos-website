import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

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

test("Home explains the journey while Platform owns the licensed-product proposition", async () => {
  const home = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const platform = await readFile(new URL("../app/platform/page.tsx", import.meta.url), "utf8");
  const dictionary = await readFile(new URL("../app/i18n/dictionary.ts", import.meta.url), "utf8");
  assert.match(dictionary, /The operating system/);
  assert.match(dictionary, /for the UAE property journey/);
  assert.match(dictionary, /governed, licensed REOS products/);
  assert.match(home, /REOS maps the UAE property journey/);
  assert.doesNotMatch(home, /Explore licensed REOS products|home-product-grid|ProductMaturityBadge|Request a Demo/);
  assert.doesNotMatch(home, /apply it through governed, licensed REOS products/);
  assert.match(platform, /REOS PRODUCT PLATFORM/);
  assert.match(platform, /sales-hero-proof/);
  assert.match(platform, /ProductMaturityBadge/);
});

test("approved homepage simplification removes duplicated depth and uses canonical product evidence", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  // Deep content belongs to the existing dedicated routes, not a second copy on Home.
  for (const duplicate of ["PersonaSelector", "EcosystemMap", "JourneyIntelligence", "RouteGovernance", "getLayers"]) {
    assert.doesNotMatch(source, new RegExp(duplicate), `${duplicate} must not be rendered on Home`);
  }
  for (const route of ["/property-journey", "/stakeholders", "/ecosystem", "/intelligence", "/platform"]) {
    assert.match(source, new RegExp(`"${route}"`), `${route} must remain a visual Home pathway`);
  }
  assert.match(source, /home-pathway-grid/);

  // Journey depth is the only explicitly deferred Home decision.
  assert.match(source, /<JourneyMap compact/);
  assert.match(source, /<Assistant .*variant="compact"/);
  assert.match(source, /Open the full Assistant/);
  for (const removed of ["JourneyStatsBar", "JourneyMoments", "PersonaQuickPick", "getModules", "getOutcomes", "coverage-strip"]) {
    assert.doesNotMatch(source, new RegExp(removed), `${removed} must not remain on Home`);
  }
  assert.match(source, /home-canonical-scope/);
  assert.match(source, /home-stakeholder-grid/);
  assert.doesNotMatch(source, /home-product-grid|ILLUSTRATIVE PRODUCT PREVIEW|Request a Demo/);
});

test("demo delivery contract confirms only acknowledged submissions", async () => {
  const form = await readFile(new URL("../app/components/DemoForm.tsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/demo/route.ts", import.meta.url), "utf8");
  assert.match(form, /name="email" type="email" required/);
  assert.match(form, /name="company" required/);
  assert.match(form, /Request not submitted/);
  assert.match(form, /REQUEST DELIVERED/);
  assert.match(form, /REOS product and evaluation owner/);
  assert.match(route, /delivery_not_configured/);
  assert.match(route, /delivery_failed/);
  assert.match(route, /response\.ok/);
  assert.match(route, /crypto\.randomUUID/);
});

test("product and evaluation routes preserve buyer context", async () => {
  const gateway = await readFile(new URL("../app/components/ProductLoginView.tsx", import.meta.url), "utf8");
  const evaluation = await readFile(new URL("../app/platform/evaluation/page.tsx", import.meta.url), "utf8");
  assert.match(gateway, /\?product=/);
  assert.match(gateway, /Evaluate this product/);
  assert.match(gateway, /Licensed-user support/);
  assert.match(evaluation, /Selected product:/);
  assert.match(evaluation, /Pilot planning/);
});

test("trust and assistant expose inspectable evidence states and verification paths", async () => {
  const trust = await readFile(new URL("../app/trust-centre/page.tsx", import.meta.url), "utf8");
  const assistant = await readFile(new URL("../app/components/Knowledge.tsx", import.meta.url), "utf8");
  assert.match(trust, /EVIDENCE REGISTER/);
  assert.match(trust, /OPERATIONAL ASSURANCE/);
  assert.match(trust, /Not production claims/);
  assert.match(assistant, /Illustrative preview/);
  assert.match(assistant, /Confidence describes evidence coverage/);
  assert.match(assistant, /Unresolved — confirm before acting/);
  assert.match(assistant, /ai-inline-citation/);
  assert.match(assistant, /Verify before acting/);
});

test("the homepage hero shows every canonical stage, once each", async () => {
  // Until 2026-08-19 the seven hero markers were an editorial view carved out
  // of a twelve-stage canon. The canon is seven stages now, so there is
  // nothing left to be a view OF — each marker IS one canonical stage, and
  // this asserts all seven are present and none has drifted from journey.ts's
  // own ids, which is what would happen if the page quietly grew a competing
  // lifecycle (the thing rule 1 forbids).
  const html = await (await render("/")).text();
  for (const id of ["land-vision", "planning-design", "authorities-approvals",
                    "construction-delivery", "sales-transfer", "living-operations",
                    "asset-growth-intelligence"]) {
    assert.match(html, new RegExp(`href="/property-journey/${id}"`), `marker for ${id} lost its canonical stage`);
  }
  // The same seven, in full, are also what /property-journey's own index
  // lists — the homepage and /property-journey must never show two
  // different-sized lifecycles.
  const index = await (await render("/property-journey")).text();
  for (const id of ["land-vision", "planning-design", "authorities-approvals",
                    "construction-delivery", "sales-transfer", "living-operations",
                    "asset-growth-intelligence"]) {
    assert.match(index, new RegExp(`href="/property-journey/${id}"`), `${id} missing from the stage index`);
  }
});

test("the homepage hero states concurrency instead of implying a queue", async () => {
  // Construction and Sales run together in UAE off-plan. The hero route
  // draws them on parallel strands and must say so in words too.
  const en = await (await render("/")).text();
  assert.match(en, /These run together/i);
  const ar = await (await render("/ar")).text();
  assert.match(ar, /يجري|بالتوازي/, "concurrency must be stated in Arabic too");
});

test("the demo CTA belongs to Platform while educational routes remain focused", async () => {
  for (const path of ["/", "/property-journey", "/stakeholders", "/stakeholders/developers",
                      "/ecosystem", "/intelligence", "/about", "/intelligence/definitions-and-glossary"]) {
    const html = await (await render(path)).text();
    assert.doesNotMatch(html, /href="\/demo"/, `${path} should not link to the demo`);
  }
  assert.match(await (await render("/platform")).text(), /href="\/demo"/);
});

test("platform is a licensed product catalogue with separate access gateways", async () => {
  const html = await (await render("/platform")).text();
  assert.match(html, /Automate property workflows/);
  assert.match(html, /Title Deed Automation/);
  assert.match(html, /NOC Automation/);
  assert.match(html, /B2B/);
  assert.match(html, /B2G/);
  assert.match(html, /B2C/);
  assert.match(html, /href="\/platform\/products\/title-deed-automation\/login"/);
  assert.match(html, /href="\/platform\/products\/noc-automation\/login"/);
  assert.match(html, /Illustrative product preview/i);
  assert.match(html, /Before REOS/);
  assert.match(html, /With REOS/);
  assert.match(html, /AI-assisted/);
  assert.match(html, /Request a demo/);
  assert.match(html, /Official systems remain authoritative/i);
  assert.doesNotMatch(html, /Eight modules/);

  for (const slug of ["title-deed-automation", "noc-automation"]) {
    const gateway = await render(`/platform/products/${slug}/login`);
    assert.equal(gateway.status, 200, `${slug} gateway must resolve`);
    const gatewayHtml = await gateway.text();
    assert.match(gatewayHtml, /PRODUCT ACCESS GATEWAY/);
    assert.match(gatewayHtml, /active licence/);
    assert.match(gatewayHtml, /Product authentication and subscription entitlements are not connected/);
    assert.match(gatewayHtml, /href="\/platform#product-catalogue"/);
  }
});

test("platform creates transformation urgency without changing the frozen operating architecture", async () => {
  const html = await (await render("/platform")).text();
  assert.match(html, /TRANSFORMATION OPPORTUNITY/);
  assert.match(html, /The problem isn(?:&#x27;|')t one approval/);
  assert.match(html, /It(?:&#x27;|')s the operating model around it/);
  for (const currentState of ["Different spreadsheets", "Email chains", "Disconnected handoffs", "Unknown ownership", "Missing evidence", "Late-stage surprises", "Status chasing", "Siloed stakeholders", "Passive documents", "Process knowledge trapped in people"]) {
    assert.match(html, new RegExp(currentState), `${currentState} must remain in the current-state comparison`);
  }
  for (const targetState of ["One operating model", "One case state", "One evidence chain", "One accountability path", "Connected stakeholders", "Connected workflow", "Earlier readiness insights", "Governed decisions", "Shared visibility", "Orchestrated lifecycle"]) {
    assert.match(html, new RegExp(targetState), `${targetState} must remain in the target-state comparison`);
  }
  for (const outcome of ["Clear Accountability", "Operational Transparency", "Earlier Readiness", "Governed Execution", "Shared Understanding", "Audit Confidence"]) {
    assert.match(html, new RegExp(outcome), `${outcome} must remain visible to executive buyers`);
  }
  for (const stakeholder of ["Landowners &amp; Investors", "Developers", "Consultants &amp; Designers", "Authorities &amp; Regulators", "Utility Providers", "Contractors", "Suppliers &amp; Vendors", "Brokers &amp; Agencies", "Banks &amp; Financial Institutions", "Property Owners", "Residents &amp; Tenants", "Facility &amp; Community Operators"]) {
    assert.match(html, new RegExp(`>${stakeholder}<`), `${stakeholder} needs a transformation value lens`);
  }
  assert.match(html, /The connective operating layer/);
  for (const step of ["Understand", "Map", "Prepare", "Operate", "Govern"]) assert.match(html, new RegExp(`>${step}<`));
  const visibleText = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleText, /\bROI\b|\b\d+%\b/i, "transformation value must not depend on unsupported ROI claims");
});

test("final Platform optimization closes the remaining executive findings", async () => {
  const html = await (await render("/platform")).text();
  assert.match(html, /REOS is the UAE real estate operating system/);
  assert.match(html, /licensed workflows are REOS products/);
  for (const layer of ["Property Journey", "Stakeholders", "Intelligence &amp; evidence", "Governed workflow &amp; orchestration", "Licensed REOS products", "Operational outcomes", "Official systems &amp; authorized decisions"]) assert.match(html, new RegExp(layer));
  assert.match(html, /REOS coordinates the operational work\. Authorized people and official systems retain their required authority/);
  assert.match(html, /How much of this operating model sounds familiar/);
  assert.match(html, /0(?:<!-- -->)? of (?:<!-- -->)?10(?:<!-- -->)? conditions selected/);
  assert.match(html, /Select the conditions that reflect the current operating environment/);
  assert.match(html, /href="\/demo"[^>]*>Request a scoped evaluation/);
  assert.match(html, /href="#reos-operating-model"[^>]*>See how REOS connects the work/);
  const unchecked = html.match(/type="checkbox"/g) ?? [];
  assert.equal(unchecked.length, 10, "the optional reflection must expose ten native checkboxes");
  assert.doesNotMatch(html, /type="checkbox"[^>]*checked/, "the self-reflection must start with no selections");
  for (const question of ["Who owns the next action, and why?", "What is the current case state across participating teams?", "What is likely to block the next critical gate?", "Which evidence and authority support this decision?", "Are all participants working from the same lifecycle context?", "Can the decision history and supporting evidence be reviewed?"]) assert.match(html, new RegExp(question.replace("?", "\\?")));
  assert.equal((html.match(/EXECUTIVE QUESTION ENABLED/g) ?? []).length, 12, "six visible outcome prompts are emitted in both the HTML and hydration payload");
  assert.equal((html.match(/Why this matters/g) ?? []).length, 12, "every canonical stakeholder retains its P2 business consequence in the accessible HTML");

  const assessmentSource = await readFile(new URL("../app/components/ExecutiveSelfAssessment.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(assessmentSource, /localStorage|sessionStorage|fetch\(|navigator\.sendBeacon|dataLayer|gtag|posthog/i, "assessment data must remain in page memory and must not be transmitted");
  assert.doesNotMatch(assessmentSource, /maturity|ROI|\d+%/i, "assessment language must remain non-diagnostic and claim-safe");
});

test("critical governance uses one operating model and one maturity vocabulary", async () => {
  const home = await (await render("/")).text();
  assert.match(home, /REOS connects the people, evidence, approvals and workflows/);
  assert.match(home, /HOW REOS WORKS/);
  for (const step of ["Understand", "Map", "Prepare", "Execute", "Govern"]) assert.match(home, new RegExp(`>${step}<`));

  const platform = await (await render("/platform")).text();
  assert.match(platform, /Early Access/);
  assert.match(platform, /Coming Soon/);
  assert.match(platform, /ENTERPRISE BUYING CONFIDENCE/);
  assert.doesNotMatch(platform, /Licensing preview|First product|Next product/);

  for (const slug of ["title-deed-automation", "noc-automation"]) {
    const gateway = await (await render(`/platform/products/${slug}/login`)).text();
    assert.match(gateway, /Product maturity/);
    assert.match(gateway, /Request product access/);
  }
});

test("P1 enterprise buying routes expose assurance, procurement and product proof without changing maturity", async () => {
  const trust = await (await render("/trust-centre")).text();
  assert.match(trust, /REOS ENTERPRISE TRUST CENTRE/);
  assert.match(trust, /Website evidence/);
  assert.match(trust, /Pilot requirement/);
  assert.match(trust, /Deployment-specific/);
  assert.match(trust, /No implied certification/);
  assert.match(trust, /AUTHORITATIVE SYSTEMS/);

  const evaluation = await (await render("/platform/evaluation")).text();
  for (const gate of ["Qualify", "Scope", "Pilot", "Accept", "Roll out"]) assert.match(evaluation, new RegExp(`>${gate}<`));
  for (const criterion of ["Workflow", "Access", "Evidence", "Audit", "Integration", "Operations", "Commercial"]) assert.match(evaluation, new RegExp(`>${criterion}<`));
  assert.match(evaluation, /Title Deed Automation/);
  assert.match(evaluation, /NOC Automation/);
  assert.match(evaluation, /Early Access/);
  assert.match(evaluation, /Coming Soon/);

  const platform = await (await render("/platform")).text();
  assert.match(platform, /PRODUCT COMPARISON/);
  assert.match(platform, /Workflow outcome/);
  assert.match(platform, /Primary buyer/);
  assert.match(platform, /Proof during evaluation/);
  assert.match(platform, /Authority boundary/);
  assert.match(platform, /href="\/trust-centre"/);
  assert.match(platform, /href="\/platform\/evaluation"/);
});

test("P1 conversion path qualifies the requested enterprise conversation", async () => {
  const demo = await (await render("/demo")).text();
  assert.match(demo, /Product walkthrough/);
  assert.match(demo, /Workflow assessment/);
  assert.match(demo, /Pilot planning/);
  assert.match(demo, /Decision timeline/);
  assert.match(demo, /Workflow outcome/);
  assert.match(demo, /href="\/trust-centre"/);
  assert.match(demo, /href="\/platform\/evaluation"/);

  const ecosystem = await (await render("/ecosystem")).text();
  assert.match(ecosystem, /Open Journey View/);
  assert.match(ecosystem, /Open Stakeholder View/);
});

test("education route families expose outcome, audience, product and next action", async () => {
  for (const path of [
    "/property-journey",
    "/property-journey/sales-transfer",
    "/stakeholders",
    "/stakeholders/developers",
    "/ecosystem",
    "/intelligence",
    "/intelligence/guides",
    "/intelligence/guides/buying",
    "/intelligence/definitions-and-glossary",
  ]) {
    const html = await (await render(path)).text();
    assert.match(html, /BUSINESS OUTCOME/, `${path} missing business outcome`);
    assert.match(html, /WHO THIS SERVES/, `${path} missing audience`);
    assert.match(html, /RELEVANT REOS PRODUCT/, `${path} missing product connection`);
    assert.match(html, /PRACTICAL NEXT ACTION/, `${path} missing next action`);
  }
});

test("intelligence and assistant state their evidence governance contracts", async () => {
  const intelligence = await (await render("/intelligence")).text();
  assert.match(intelligence, /GOVERNED EVIDENCE LAYER/);
  assert.match(intelligence, /Official source/);
  assert.match(intelligence, /Jurisdiction/);
  assert.match(intelligence, /Review state/);

  const assistant = await (await render("/assistant")).text();
  assert.match(assistant, /ASSISTANT TRUST CONTRACT/);
  assert.match(assistant, /Sources attached/);
  assert.match(assistant, /Confidence labelled/);
  assert.match(assistant, /Refusal by design/);
});

test("the mobile menu is actually displayable", async () => {
  // A descendant selector meant to hide the desktop nav also hid the mobile
  // menu's own nav, so the panel never opened. Counting DOM nodes missed it.
  const css = await (await render()).text();
  assert.match(css, /class="mobile-menu"/);
  assert.match(css, /aria-label="Mobile navigation"/);
});

test("the primary navigation is the five frozen items, in order", async () => {
  // REOS IA Freeze v1.0, 2026-08-19: exactly Property Journey, Stakeholders,
  // Ecosystem, Intelligence, Platform — no more, no fewer, no reordering.
  const html = await (await render()).text();
  const nav = html.match(/<nav aria-label="Primary navigation">.*?<\/nav>/s)?.[0] ?? "";
  const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ["/property-journey", "/stakeholders", "/ecosystem", "/intelligence", "/platform"]);
  assert.doesNotMatch(nav, />Roles</);
  assert.doesNotMatch(nav, />Insights</);
  assert.doesNotMatch(nav, />Glossary</);
});

test("homepage routes into the journey, stakeholders and ecosystem", async () => {
  const html = await (await render()).text();
  assert.match(html, /href="\/property-journey"/);
  assert.match(html, /href="\/intelligence\/guides\/buying"/);
  assert.match(html, /href="\/intelligence\/definitions-and-glossary"/);
  assert.match(html, /href="\/ecosystem"/);
  assert.match(html, /Regulatory Rail/);
});

test("concurrency is stated, not flattened into a sequence", async () => {
  // Sales runs alongside construction in UAE off-plan. A stage page that
  // fails this assertion has quietly reintroduced a false sequence.
  const html = await (await render("/property-journey/construction-delivery")).text();
  assert.match(html, /does not wait its turn/i);
  assert.match(html, /Sales &(amp;)? Transfer|Sales & Transfer/);
});

test("Arabic routes render Arabic, right-to-left", async () => {
  // The original bug: the language control set dir/lang and nothing else, so
  // the layout reversed and every word stayed English.
  const arabic = (t) => (t.match(/[؀-ۿ]/g) || []).length;
  for (const path of ["/ar", "/ar/property-journey", "/ar/intelligence/guides/buying", "/ar/intelligence/definitions-and-glossary"]) {
    const html = await (await render(path)).text();
    assert.match(html, /dir="rtl"/, `${path} must be RTL`);
    assert.ok(arabic(html) > 400, `${path} should carry Arabic text, found ${arabic(html)}`);
  }
  // English must stay untouched at the root.
  const en = await (await render("/property-journey")).text();
  assert.doesNotMatch(en, /dir="rtl"/);
});

test("the review notice appears on Arabic pages only", async () => {
  assert.match(await (await render("/ar")).text(), /translation-notice/);
  assert.doesNotMatch(await (await render("/")).text(), /translation-notice/);
});

test("stakeholders shows all 12 canonical groups in frequency order", async () => {
  const html = await (await render("/stakeholders")).text();
  for (let n = 1; n <= 12; n++) {
    assert.match(html, new RegExp(`>${String(n).padStart(2, "0")}<`), `group ${n} missing`);
  }
  assert.match(html, /Banks & Financial Institutions|Banks &amp; Financial Institutions/);
  assert.doesNotMatch(html, /Bankers & Financial|Bankers &amp; Financial/);
});

test("stakeholders hero exposes exactly 12 interactive architectural groups", async () => {
  const html = await (await render("/stakeholders")).text();
  assert.match(html, /stakeholders-connected-district-v2\.png/);
  assert.equal((html.match(/Select to view details\./g) ?? []).length, 12);
  assert.match(html, /href="\/stakeholders\/banks-financial"/);
  assert.doesNotMatch(html, /12\+ STAKEHOLDER GROUPS/);

  const ring = html.match(/<div class="stakeholder-hotspots".*?<\/div><\/div>/s)?.[0] ?? "";
  const groups = [...ring.matchAll(/data-group="([^"]+)" data-ring-position="(\d+)" data-label-placement="([^"]+)"/g)]
    .map(([, id, position, placement]) => ({ id, position: Number(position), placement }));
  assert.deepEqual(groups, [
    { id: "landowners-investors", position: 1, placement: "above" },
    { id: "developers", position: 2, placement: "above" },
    { id: "consultants-designers", position: 3, placement: "above" },
    { id: "authorities-regulators", position: 4, placement: "above" },
    { id: "utility-providers", position: 5, placement: "above" },
    { id: "contractors", position: 6, placement: "below" },
    { id: "suppliers-vendors", position: 7, placement: "below" },
    { id: "brokers-agencies", position: 8, placement: "below" },
    { id: "banks-financial", position: 9, placement: "below" },
    { id: "property-owners", position: 10, placement: "below" },
    { id: "residents-tenants", position: 11, placement: "above-left" },
    { id: "facility-community-operators", position: 12, placement: "above" },
  ]);
  assert.match(html, /REOS<\/b><span>OPERATING SYSTEM<\/span>/);
});

test("property journey hero exposes exactly seven interactive architectural stages", async () => {
  const html = await (await render("/property-journey")).text();
  assert.match(html, /property-journey-interactive-foundation-v1\.png/);
  assert.equal((html.match(/Select to view stage details\./g) ?? []).length, 7);
  assert.match(html, /href="\/property-journey\/construction-delivery"/);
  assert.match(html, /Construction and sales run in parallel/);
  assert.doesNotMatch(html, /property-journey-lifecycle-v2\.png/);
  assert.match(html, /data-stage="land-vision" data-label-placement="above"/);
  assert.match(html, /data-stage="asset-growth-intelligence" data-label-placement="above"/);
});

test("intelligence hero exposes six coded knowledge domains over a text-free foundation", async () => {
  const html = await (await render("/intelligence")).text();
  assert.match(html, /intelligence-knowledge-foundation-v1\.jpg/);
  assert.match(html, /REOS Intelligence knowledge map/);
  assert.equal((html.match(/Select to preview intelligence domain\./g) ?? []).length, 6);
  for (const label of [
    "Guides",
    "Regulations",
    "Processes",
    "Authority Information",
    "Definitions &amp; Glossary",
    "Knowledge Graph",
  ]) {
    assert.match(html, new RegExp(`>${label}<`), `${label} knowledge domain missing`);
  }
  assert.match(html, /CONNECTED KNOWLEDGE LAYER/);
  assert.match(html, /href="\/intelligence\/guides"/);
  assert.match(html, /href="\/intelligence\/definitions-and-glossary"/);
});

test("stage 6 is Living & Operations everywhere it appears", async () => {
  const home = await (await render("/")).text();
  assert.match(home, /Living & Operations|Living &amp; Operations/);
  assert.doesNotMatch(home, /Handover & Operations|Handover &amp; Operations/);
  const journey = await (await render("/property-journey")).text();
  assert.match(journey, /Living & Operations|Living &amp; Operations/);
});

test("the guides page (former /roles) shows every guide in frequency order", async () => {
  const html = await (await render("/intelligence/guides")).text();
  for (let n = 1; n <= 12; n++) {
    assert.match(html, new RegExp(`>${String(n).padStart(2, "0")}<`), `route ${n} missing`);
  }
  // The orientation helper is not a stakeholder group and is never numbered.
  assert.match(html, /Not sure which applies to you\?/);
  // Taxonomy group numbers are internal and must never reach the UI.
  assert.doesNotMatch(html, /taxonomyGroup/);
});

test("every guide link resolves", async () => {
  const slugs = ["buying","developing","investing","selling","financing","design-engineering",
    "building","legal-compliance","managing","utilities","regulators","specialist-services",
    "new-to-uae"];
  for (const slug of slugs) {
    assert.equal((await render(`/intelligence/guides/${slug}`)).status, 200, `/intelligence/guides/${slug}`);
  }
});

test("detail pages provide a clear contextual back link", async () => {
  const stakeholder = await (await render("/stakeholders/developers")).text();
  assert.match(stakeholder, /href="\/stakeholders"[^>]*>.*Back to all stakeholders/s);

  const guide = await (await render("/intelligence/guides/buying")).text();
  assert.match(guide, /href="\/intelligence\/guides"[^>]*>.*Back to all guides/s);

  const arabic = await (await render("/ar/intelligence/guides/buying")).text();
  assert.match(arabic, /href="\/ar\/intelligence\/guides"/);
  assert.match(arabic, /العودة إلى جميع الأدلة/);
});

test("unfinished guides expose useful published context without claiming validation", async () => {
  const html = await (await render("/intelligence/guides/utilities")).text();
  assert.match(html, /To Be Validated/i);
  assert.match(html, /AVAILABLE NOW/);
  assert.match(html, /href="\/stakeholders\/utility-providers"/);
  assert.match(html, /href="\/property-journey\/authorities-approvals"/);
});

test("retired guide aliases redirect to their canonical route", async () => {
  const response = await render("/intelligence/guides/professional-services");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "/intelligence/guides/design-engineering");
});

test("retired routes redirect forward instead of 404ing", async () => {
  // REOS IA Freeze v1.0: /journey, /roles, /insights, /glossary and the old
  // stakeholder ids all moved. Every historical URL must still resolve.
  //
  // The /journey/:stage cases use the REAL 12-stage ids this repo shipped
  // with before this session (confirmed against `git show HEAD:app/data/
  // journey.ts`), not the transient in-session ids — a redirect keyed to an
  // id that was never actually committed protects nobody's bookmark.
  const cases = [
    ["/journey", "/property-journey"],
    ["/journey/land-ownership", "/property-journey/land-vision"],
    ["/journey/project-formation", "/property-journey/land-vision"],
    ["/journey/planning-feasibility", "/property-journey/land-vision"],
    ["/journey/design-approvals", "/property-journey/planning-design"],
    ["/journey/finance-escrow", "/property-journey/sales-transfer"],
    ["/journey/marketing-sales", "/property-journey/sales-transfer"],
    ["/journey/registration-compliance", "/property-journey/sales-transfer"],
    ["/journey/handover-snagging", "/property-journey/living-operations"],
    ["/journey/occupancy-community", "/property-journey/living-operations"],
    ["/journey/property-management", "/property-journey/asset-growth-intelligence"],
    ["/journey/investment-resale", "/property-journey/asset-growth-intelligence"],
    // construction-delivery's id never changed — this exercises the general
    // wildcard fallback rather than a specific mapping.
    ["/journey/construction-delivery", "/property-journey/construction-delivery"],
    ["/roles", "/intelligence/guides"],
    ["/roles/buying", "/intelligence/guides/buying"],
    ["/insights", "/intelligence"],
    ["/glossary", "/intelligence/definitions-and-glossary"],
    ["/stakeholders/government-authority", "/stakeholders/authorities-regulators"],
    ["/stakeholders/master-developer", "/stakeholders/developers"],
    ["/stakeholders/developer", "/stakeholders/developers"],
    ["/stakeholders/consultant", "/stakeholders/consultants-designers"],
    ["/stakeholders/bank", "/stakeholders/banks-financial"],
    ["/stakeholders/broker", "/stakeholders/brokers-agencies"],
    ["/stakeholders/investor", "/stakeholders/landowners-investors"],
    ["/stakeholders/property-owner", "/stakeholders/property-owners"],
  ];
  for (const [from, to] of cases) {
    const response = await render(from);
    assert.equal(response.status, 308, `${from} should redirect (308), got ${response.status}`);
    assert.equal(response.headers.get("location"), to, `${from} should redirect to ${to}`);
  }
});

test("every canonical stakeholder group page resolves", async () => {
  const slugs = ["landowners-investors", "developers", "consultants-designers", "authorities-regulators",
    "utility-providers", "contractors", "suppliers-vendors", "brokers-agencies", "banks-financial",
    "property-owners", "residents-tenants", "facility-community-operators"];
  for (const slug of slugs) {
    assert.equal((await render(`/stakeholders/${slug}`)).status, 200, `/stakeholders/${slug}`);
  }
});

test("Journey × Stakeholder Explorer exposes all three shared-data views", async () => {
  const html = await (await render("/ecosystem")).text();
  assert.match(html, /Journey View/);
  assert.match(html, /Stakeholder View/);
  assert.match(html, /Full Map/);
  assert.match(html, /Seven stages\. Twelve groups/);
  assert.match(html, /Twelve stakeholder groups mapped against seven property journey stages/);
  assert.match(html, /data-mapped-relationships="30"/, "the explorer must expose the 30 canonical relationships");
  assert.match(html, /Filter relationship level/);
  assert.match(html, /Share view/);
  assert.match(html, /Reset view/);
});

test("ecosystem hero is a coded orbital map over a text-free foundation", async () => {
  const html = await (await render("/ecosystem")).text();
  assert.match(html, /ecosystem-orbital-foundation-v1\.jpg/);
  assert.match(html, /REOS Ecosystem Orbital Map/);
  assert.match(html, /REOS Core/);
  assert.equal((html.match(/Select to explore stakeholder\./g) ?? []).length, 12);
  assert.equal((html.match(/Select to explore stage\./g) ?? []).length, 7);
  for (const flow of ["Information", "Decisions", "Documents", "Approvals", "Services", "Capital"]) {
    assert.match(html, new RegExp(`>${flow}<`), `${flow} flow missing from the coded legend`);
  }
  assert.match(html, /id="ecosystem-detailed-map"/);
  assert.doesNotMatch(html, /12 STAKEHOLDER GROUPS[\s\S]*7 PROPERTY JOURNEY STAGES[\s\S]*REOS CORE[\s\S]*Information • Documents/);
});

test("canonical relationship pages explain the selected intersection", async () => {
  const path = "/property-journey/authorities-approvals/stakeholders/authorities-regulators";
  const response = await render(path);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Authorities &(amp;)? Regulators/);
  assert.match(html, /in Authorities &(amp;)? Approvals/);
  assert.match(html, /ROLE IN THIS STAGE/);
  assert.match(html, /RESPONSIBILITIES/);
  assert.match(html, /PROCESSES/);
  assert.match(html, /DOCUMENTS/);
  assert.match(html, /Open in interactive map/);
  assert.match(html, /view=journey(&amp;|&)stage=authorities-approvals/);
});

test("stakeholder-first relationship routes redirect to the canonical stage-first URL", async () => {
  const response = await render("/stakeholders/authorities-regulators/journey/authorities-approvals");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "/property-journey/authorities-approvals/stakeholders/authorities-regulators");
});

test("stage and stakeholder pages expose reciprocal relationship navigation", async () => {
  const stage = await (await render("/property-journey/construction-delivery")).text();
  assert.match(stage, /Stakeholders[\s\S]*in this stage/);
  assert.match(stage, /href="\/property-journey\/construction-delivery\/stakeholders\/contractors"/);
  assert.match(stage, /view=journey(&amp;|&)stage=construction-delivery/);

  const stakeholder = await (await render("/stakeholders/developers")).text();
  assert.match(stakeholder, /JOURNEY PARTICIPATION/);
  assert.equal((stakeholder.match(/class="is-(?:linked|unlinked)"/g) ?? []).length, 7, "stakeholder participation must always show all seven stages");
  assert.match(stakeholder, /href="\/property-journey\/planning-design\/stakeholders\/developers"/);
  assert.match(stakeholder, /view=stakeholder(&amp;|&)stakeholder=developers/);
});

test("renders core routes", async () => {
  for (const path of [
    "/property-journey", "/property-journey/sales-transfer", "/stakeholders", "/stakeholders/developers",
    "/ecosystem", "/platform", "/intelligence", "/intelligence/guides", "/intelligence/definitions-and-glossary",
    "/about", "/demo", "/authorities", "/lifecycle",
    "/ar", "/ar/property-journey", "/ar/stakeholders", "/ar/ecosystem",
    "/ar/intelligence", "/ar/intelligence/definitions-and-glossary", "/ar/platform",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
});
