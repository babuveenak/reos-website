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
  assert.match(html, /The operating system/);
  assert.match(html, /for the UAE property journey/);
  assert.match(html, /Start my journey/);
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
  assert.match(platform, /REOS PROPERTY OPERATING SYSTEM/);
  assert.match(platform, /Request Title Deed Demo/);
  assert.match(platform, /ProductMaturityBadge/);
});

test("Platform commercial redesign sells governed products without overstating planned capabilities", async () => {
  const source = await readFile(new URL("../app/platform/page.tsx", import.meta.url), "utf8");
  const experience = await readFile(new URL("../app/components/PlatformProductExperience.tsx", import.meta.url), "utf8");
  const lifecycle = await readFile(new URL("../app/components/PlatformLifecycleExplorer.tsx", import.meta.url), "utf8");
  const productData = await readFile(new URL("../app/data/products.ts", import.meta.url), "utf8");
  assert.match(source, /The Operating System/);
  assert.match(source, /for Modern Property Development/);
  for (const stage of ["Plot", "Project", "Unit", "Sales", "Handover", "Title Deed", "NOC", "Resale", "Cancellation", "Operations"]) assert.match(lifecycle, new RegExp(`name: "${stage}"`));
  for (const product of ["Title Deed Automation", "NOC Automation"]) assert.match(productData, new RegExp(product));
  for (const product of ["Unit Cancellation", "Customer Handover", "AI Document Intelligence", "Enterprise Integration Layer"]) assert.match(source, new RegExp(product));
  assert.match(source, /Five planned capabilities/);
  assert.match(source, /Planned capability; scope, integrations and availability require validation/);
  assert.equal((source.match(/ProductMaturityBadge maturity="Coming Soon"/g) ?? []).length, 1, "one mapped planned-product template governs all four planned capabilities");
  assert.match(source, /BeforeAfterWorkflow/);
  assert.match(source, /PlatformScreenGallery/);
  assert.match(source, /GOVERNANCE ENGINE/);
  assert.match(source, /MEASURABLE BUSINESS VALUE/);
  assert.match(source, /FROM FRAGMENTATION TO CONTROL/);
  assert.match(source, /href=\{L\("\/trust-centre"\)\}/);
  assert.match(source, /href=\{L\("\/platform\/evaluation"\)\}/);
  assert.doesNotMatch(source, /TransformationOpportunity|HowReosWorks|EnterpriseAssurancePreview|ExecutiveSelfAssessment/);
  for (const screen of ["Title Deed", "NOC", "Unit Cancellation", "Workflow Approval", "Customer Journey", "Governance Monitoring"]) assert.match(experience, new RegExp(screen));
  assert.match(experience, /Concept Experience only\. Scope, integration and availability require validation/);
});

test("approved homepage simplification removes duplicated depth and uses canonical product evidence", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const fragmentation = await readFile(new URL("../app/components/FragmentedJourney.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  // Deep content belongs to the existing dedicated routes, not a second copy on Home.
  for (const duplicate of ["PersonaSelector", "EcosystemMap", "JourneyIntelligence", "RouteGovernance", "getLayers"]) {
    assert.doesNotMatch(source, new RegExp(duplicate), `${duplicate} must not be rendered on Home`);
  }
  for (const route of ["/property-journey", "/stakeholders", "/ecosystem", "/intelligence", "/platform"]) {
    assert.match(source, new RegExp(`"${route}"`), `${route} must remain a visual Home pathway`);
  }
  assert.match(source, /home-pathway-grid/);

  assert.match(source, /<Assistant .*variant="compact"/);
  assert.match(source, /Open the full Assistant/);
  for (const removed of ["JourneyStatsBar", "JourneyMoments", "PersonaQuickPick", "JourneyMap", "TrackLegend", "home-stakeholder-grid", "home-stakeholders", "getModules", "getOutcomes", "coverage-strip"]) {
    assert.doesNotMatch(source, new RegExp(removed), `${removed} must not remain on Home`);
  }
  assert.match(source, /home-canonical-scope/);
  assert.doesNotMatch(source, /home-product-grid|ILLUSTRATIVE PRODUCT PREVIEW|Request a Demo/);

  // Fragmentation is explained as a visual, people-centred journey—not a second text-card grid.
  assert.match(source, /<FragmentedJourney locale=\{locale\}/);
  assert.doesNotMatch(source, /fragment-cards|getFragments/);
  for (const message of ["No shared view", "Unclear next step", "Hidden dependencies", "Hard-to-find rules"]) {
    assert.match(fragmentation, new RegExp(message));
  }
  assert.match(fragmentation, /aria-pressed=\{active === issue\.id\}/);
  assert.match(fragmentation, /role="group" aria-label=\{content\.instruction\}/);
  assert.match(fragmentation, /aria-live="polite"/);
  assert.match(styles, /prefers-reduced-motion:reduce[^}]*fragment-/);
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
  assert.match(await (await render("/platform")).text(), /href="\/demo(?:\?|")/);
});

test("platform is a licensed product catalogue with separate access gateways", async () => {
  const html = await (await render("/platform")).text();
  assert.match(html, /Connect property workflows/);
  assert.match(html, /Title Deed Automation/);
  assert.match(html, /NOC Automation/);
  assert.match(html, /href="\/platform\/products\/title-deed-automation\/login"/);
  assert.doesNotMatch(html, /href="\/platform\/products\/noc-automation\/login"/, "Coming Soon capability must not expose login from Platform");
  assert.match(html, /Illustrative product preview/i);
  assert.match(html, /Before REOS/);
  assert.match(html, /With REOS/);
  assert.match(html, /AI-assisted/);
  assert.match(html, /Request Title Deed Demo/);
  assert.match(html, /official systems and authorized people retain authority/i);
  assert.doesNotMatch(html, /Eight modules/);

  for (const slug of ["title-deed-automation", "noc-automation"]) {
    const gateway = await render(`/platform/products/${slug}/login`);
    assert.equal(gateway.status, 200, `${slug} gateway must resolve`);
    const gatewayHtml = await gateway.text();
    assert.match(gatewayHtml, /PRODUCT ACCESS GATEWAY/);
    assert.match(gatewayHtml, /active licence/);
    assert.match(gatewayHtml, /Product authentication and subscription entitlements are not connected/);
    assert.match(gatewayHtml, /href="\/platform#product-suite"/);
  }
});

test("platform creates transformation urgency without changing the frozen operating architecture", async () => {
  const html = await (await render("/platform")).text();
  assert.match(html, /FROM FRAGMENTATION TO CONTROL/);
  for (const currentState of ["Scattered evidence", "Unclear ownership", "Late exceptions", "Fragmented history"]) assert.match(html, new RegExp(currentState, "i"));
  assert.match(html, /One Workflow/);
  assert.match(html, /One Truth/);
  assert.match(html, /Before REOS/);
  assert.match(html, /With REOS/);
  const visibleText = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleText, /\bROI\b|\b\d+%\b/i, "transformation value must not depend on unsupported ROI claims");
});

test("final Platform optimization closes the remaining executive findings", async () => {
  const html = await (await render("/platform")).text();
  assert.match(html, /The Operating System/);
  assert.match(html, /for Modern Property Development/);
  for (const product of ["Title Deed Automation", "NOC Automation", "Unit Cancellation", "Customer Handover", "AI Document Intelligence", "Enterprise Integration Layer"]) assert.match(html, new RegExp(product));
  assert.match(html, /PLATFORM EXPERIENCE/);
  assert.match(html, /GOVERNANCE ENGINE/);
  assert.match(html, /MEASURABLE BUSINESS VALUE/);
  assert.match(html, /href="\/demo(?:\?|")/);
});

test("homepage removes the requested promotional sections while Platform keeps the maturity vocabulary", async () => {
  const home = await (await render("/")).text();
  assert.doesNotMatch(home, /HOW REOS WORKS/);
  assert.doesNotMatch(home, /START ANYWHERE/);
  assert.doesNotMatch(home, /From understanding to governed execution/);

  const platform = await (await render("/platform")).text();
  assert.match(platform, /Early Access/);
  assert.match(platform, /Coming Soon/);
  assert.match(platform, /GOVERNANCE ENGINE/);
  assert.doesNotMatch(platform, /Licensing preview|First product|Next product/);

  for (const slug of ["title-deed-automation", "noc-automation"]) {
    const gateway = await (await render(`/platform/products/${slug}/login`)).text();
    assert.match(gateway, /Product maturity/);
    assert.match(gateway, /Request product access/);
  }
});

test("homepage places the property ecosystem assistant after the problem section", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const problemIndex = source.indexOf('id="problem"');
  const assistantIndex = source.indexOf('id="ask"');

  assert.notEqual(problemIndex, -1, "Home must render the problem section");
  assert.notEqual(assistantIndex, -1, "Home must render the assistant section");
  assert.ok(problemIndex < assistantIndex, "the shared English/Arabic Home view must place the assistant after the problem section");
});

test("compact footer exposes the four public website documents in both languages", async () => {
  const home = await (await render("/")).text();
  for (const [href, label] of [
    ["/privacy-policy", "Privacy Policy"],
    ["/cookie-policy", "Cookie Policy"],
    ["/terms", "Terms"],
    ["/sitemap", "Sitemap"],
  ]) {
    assert.match(home, new RegExp(`href="${href}"[^>]*>${label}<`));
  }
  assert.doesNotMatch(home, /class="footer-links"/);

  for (const path of ["/privacy-policy", "/cookie-policy", "/terms", "/sitemap"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
  const privacy = await (await render("/privacy-policy")).text();
  assert.match(privacy, /RESO/);
  assert.match(privacy, /Federal Decree-Law No. 45 of 2021/);
  const cookies = await (await render("/cookie-policy")).text();
  assert.match(cookies, /reos-theme/);
  assert.match(cookies, /does not intentionally set advertising or behavioural-analytics cookies/);

  for (const path of ["/ar/privacy-policy", "/ar/cookie-policy", "/ar/terms", "/ar/sitemap"]) {
    const html = await (await render(path)).text();
    assert.match(html, /dir="rtl"/, `${path} must be RTL`);
    assert.match(html, /سياسة|شروط|خريطة/, `${path} must contain Arabic public-document content`);
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
  assert.match(platform, /REOS PLATFORM SUITE/);
  assert.match(platform, /Capabilities/);
  assert.match(platform, /Planned capability/);
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

test("Intelligence keeps the visual index educational while deeper guides retain route governance", async () => {
  const intelligence = await (await render("/intelligence")).text();
  assert.match(intelligence, /Knowledge, connected to context\./);
  assert.match(intelligence, /Trust the answer\. See the evidence\./);
  assert.doesNotMatch(intelligence, /BUSINESS OUTCOME|RELEVANT REOS PRODUCT|href="\/demo"/, "the Intelligence index must remain educational");

  for (const path of [
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

  const stakeholder = await (await render("/stakeholders/developers")).text();
  assert.match(stakeholder, /Direct stage walkthrough/);
  assert.match(stakeholder, /Official sources · REOS role mapping/);
  assert.doesNotMatch(stakeholder, /RELEVANT REOS PRODUCT|PRACTICAL NEXT ACTION|href="\/demo"/, "stakeholder education must not become a product pitch");
});

test("intelligence and assistant state their evidence governance contracts", async () => {
  const intelligence = await (await render("/intelligence")).text();
  assert.match(intelligence, /Trust the answer\. See the evidence\./);
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
  assert.match(html, /href="\/stakeholders"/);
  assert.match(html, /href="\/intelligence"/);
  assert.match(html, /href="\/platform"/);
  assert.match(html, /href="\/ecosystem"/);
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

test("stakeholders stays educational and keeps only a compact personal-guide bridge", async () => {
  const source = await readFile(new URL("../app/stakeholders/page.tsx", import.meta.url), "utf8");
  const html = await (await render("/stakeholders")).text();
  const mainMarkup = html.match(/<main class="inner-page">.*?<\/main>/s)?.[0] ?? "";
  const main = mainMarkup.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");

  assert.doesNotMatch(source, /HowReosWorks|RouteGovernance/);
  assert.doesNotMatch(main, /HOW REOS WORKS|BUSINESS OUTCOME|WHO THIS SERVES|RELEVANT REOS PRODUCT|PRACTICAL NEXT ACTION|Title Deed Automation|NOC Automation/);
  assert.doesNotMatch(main, /class="reos-opportunity"|Start with a guide|See how they connect/);
  assert.equal((main.match(/class="stakeholder-role-platform cluster-/g) ?? []).length, 12, "the focused page must retain all twelve stakeholder profiles");
  assert.equal((main.match(/class="stakeholder-guide-bridge"/g) ?? []).length, 1, "the personal-journey distinction should remain compact and singular");
  assert.match(main, /Looking for a personal journey\?/);
  assert.match(main, /href="\/intelligence\/guides"/);
  assert.match(main, /Before you act on this/);
});

test("stakeholders hero exposes exactly 12 interactive architectural groups", async () => {
  const source = await readFile(new URL("../app/components/StakeholdersHero.tsx", import.meta.url), "utf8");
  const html = await (await render("/stakeholders")).text();
  assert.match(html, /stakeholders-connected-district-v2\.png/);
  assert.equal((html.match(/Select to view details\./g) ?? []).length, 12);
  assert.match(source, /<Link href=\{activeGroup\.href\}/, "the selected hero group must open its canonical stakeholder route");
  assert.doesNotMatch(html, /12\+ STAKEHOLDER GROUPS/);
  assert.equal((source.match(/\{ x: \d+, y: \d+, label: "(?:above|above-left|below|left|right)" \}/g) ?? []).length, 12, "the protected hero must retain exactly twelve visual positions");
  assert.match(source, /data-group=\{group\.id\}/);
  assert.match(source, /data-ring-position=\{index \+ 1\}/);
  assert.match(source, /onMouseEnter=\{\(\) => preview\(group\.id\)\}/);
  assert.match(source, /onFocus=\{\(\) => preview\(group\.id\)\}/);
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

test("property journey remains educational while its seven-stage index is visual", async () => {
  const source = await readFile(new URL("../app/property-journey/page.tsx", import.meta.url), "utf8");
  const html = await (await render("/property-journey")).text();

  assert.match(html, /The UAE property journey,[\s\S]*mapped end to end\./);
  assert.match(html, /Property does not move through one process\. It moves through seven connected stages/);
  assert.equal((html.match(/class="stage-index-card"/g) ?? []).length, 7, "the canonical lifecycle must retain exactly seven visual cards");
  assert.equal((html.match(/class="stage-index-visual"/g) ?? []).length, 7, "every lifecycle stage needs a visual panel");
  for (const id of ["land-vision", "planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations", "asset-growth-intelligence"]) {
    assert.match(html, new RegExp(`property-journey-stage-${id}-v1\\.jpg`), `${id} needs its own corresponding image`);
  }
  assert.equal((html.match(/>Open stage</g) ?? []).length, 7, "every visual stage needs a direct educational route");
  assert.doesNotMatch(source, /HowReosWorks|RouteGovernance/);
  assert.doesNotMatch(html, /HOW REOS WORKS|licensed REOS workflow|Select a journey stage|See the connected ecosystem/i);
  assert.match(html, /Before you act on this/);
});

test("all seven stage pages use the visual educational template without product promotion", async () => {
  const ids = [
    "land-vision",
    "planning-design",
    "authorities-approvals",
    "construction-delivery",
    "sales-transfer",
    "living-operations",
    "asset-growth-intelligence",
  ];

  for (const id of ids) {
    const html = await (await render(`/property-journey/${id}`)).text();
    assert.match(html, new RegExp(`class="stage-hero stage-hero-visual" data-stage="${id}"`));
    assert.match(html, /class="stage-route-overview"/);
    assert.equal((html.match(/aria-current="step"/g) ?? []).length, 1, `${id} must identify one current stage`);
    assert.equal((html.match(/class="stage-process-flow"/g) ?? []).length, 1, `${id} needs one visual process`);
    assert.equal((html.match(/<details/g) ?? []).length >= 4, true, `${id} needs four explorable process moves`);
    assert.match(html, /stage-evidence-map/);
    assert.match(html, /stage-guardrail-map/);
    assert.match(html, /Official authorities and authorized decision-makers retain registration, approval and legal authority/);
    assert.doesNotMatch(html, /RELEVANT REOS PRODUCT|Explore the relevant product|class="route-governance"/i);
  }

  const land = await (await render("/property-journey/land-vision")).text();
  assert.match(land, /Developers, development investors, landowners and anyone acquiring land/);
  assert.match(land, /land-guide/);
  const sales = await (await render("/property-journey/sales-transfer")).text();
  assert.match(sales, /end customer or unit investor buying an apartment, villa or townhouse/i);
});

test("Land & Vision adds a jurisdiction-first public guide without changing the journey landing page", async () => {
  const landingSource = await readFile(new URL("../app/property-journey/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(landingSource, /LandVisionGuide|land-guide/, "the approved landing page must remain untouched");

  const html = await (await render("/property-journey/land-vision")).text();
  assert.match(html, /From land opportunity to an evidence-backed decision/);
  assert.match(html, /Developers, development investors, landowners and any person or company acquiring land begin here/);
  assert.match(html, /An end customer or unit investor buying off-plan or completed property enters through Sales &amp; Transfer/);
  assert.match(html, /data-guide-current="define-opportunity"/);
  assert.match(html, /href="\/property-journey\/sales-transfer"/);
  assert.doesNotMatch(html, /href="\/lifecycle\/(?:land-opportunity|land-acquisition|developer-establishment|feasibility)"/, "thin lifecycle stubs must not remain the primary Land & Vision route");

  assert.match(html, /REOS explains the route; official authorities and authorized decision-makers retain registration, approval and legal authority/);
  const guideData = await readFile(new URL("../app/data/landVisionGuide.ts", import.meta.url), "utf8");
  assert.match(guideData, /Dubai Land Department — property status enquiry/);
  assert.match(guideData, /ADREC — property ownership framework/);
});

test("intelligence hero exposes six coded knowledge domains over a text-free foundation", async () => {
  const source = await readFile(new URL("../app/components/IntelligenceHeroMap.tsx", import.meta.url), "utf8");
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
    assert.match(html, new RegExp(label), `${label} knowledge domain missing`);
  }
  assert.match(html, /CONNECTED KNOWLEDGE LAYER/);
  assert.match(source, /<Link className="text-link" href=\{activeDomain\.href\}/, "the selected knowledge domain must open its canonical route");
  assert.match(await readFile(new URL("../app/intelligence/page.tsx", import.meta.url), "utf8"), /href: L\("\/intelligence\/guides"\)[\s\S]*href: L\("\/intelligence\/definitions-and-glossary"\)/);
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
  const source = await readFile(new URL("../app/ecosystem/page.tsx", import.meta.url), "utf8");
  const html = await (await render("/ecosystem")).text();
  const mainMarkup = html.match(/<main class="inner-page">.*?<\/main>/s)?.[0] ?? "";
  const main = mainMarkup.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");

  assert.doesNotMatch(source, /HowReosWorks|RouteGovernance/);
  assert.doesNotMatch(main, /HOW REOS WORKS|HOW REOS CONNECTS THEM|BUSINESS OUTCOME|WHO THIS SERVES|RELEVANT REOS PRODUCT|PRACTICAL NEXT ACTION|Title Deed Automation|NOC Automation/);
  assert.doesNotMatch(main, /class="reos-opportunity"/);
  assert.match(html, /Journey View/);
  assert.match(html, /Stakeholder View/);
  assert.match(html, /Full Map/);
  assert.match(html, /Seven stages\. Twelve groups/);
  assert.match(html, /Twelve stakeholder groups mapped against seven property journey stages/);
  assert.match(html, /data-mapped-relationships="84"/, "the explorer must expose all 12 × 7 canonical relationships");
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
  assert.match(html, /Official stage walkthrough/);
  assert.equal((html.match(/class="process-stage-tab level-(?:lead|active|supporting|informed)"/g) ?? []).length, 7);
  assert.match(html, /isometric-process-scene/);
  assert.match(html, /isometric-authority-platform/);
  assert.match(html, /Official sources/);
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
  assert.match(stakeholder, /Direct stage walkthrough/);
  assert.equal((stakeholder.match(/class="stakeholder-lifecycle-node lifecycle-(?:lead|active|supporting|informed) lifecycle-tier-(?:direct|supporting|informed)"/g) ?? []).length, 7, "stakeholder lifecycle map must keep all seven relationship levels");
  assert.equal((stakeholder.match(/class="process-stage-tab level-(?:lead|active)"/g) ?? []).length, 6, "full process maps must be limited to direct developer stages");
  assert.match(stakeholder, /Official sources · REOS role mapping/);
  assert.match(stakeholder, /view=stakeholder(&amp;|&)stakeholder=developers/);
});

test("all Dubai stakeholder authority routes weight process depth by involvement", async () => {
  const paths = [
    ["/stakeholders/landowners-investors", 5],
    ["/stakeholders/developers/dubai/dm-mainland", 6],
    ["/stakeholders/consultants-designers/dubai/dda-tecom", 3],
    ["/stakeholders/contractors/dubai/trakhees-pcfc", 2],
    ["/stakeholders/property-owners/dubai/financial-free-zone", 3],
  ];
  for (const [path, directCount] of paths) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /Follow the stages this stakeholder leads or actively works in\./, path);
    assert.equal((html.match(/class="process-stage-tab level-(?:lead|active)"/g) ?? []).length, directCount, `${path} must expose only Lead and Active process tabs`);
    assert.doesNotMatch(html, /class="process-stage-tab level-informed"/, `${path} must not render an Informed process tab`);
    assert.match(html, /isometric-process-scene/, `${path} must render the interactive visual process scene`);
    if (path.includes("financial-free-zone")) {
      assert.match(html, /process-context-only/, `${path} must state when no direct official route is published`);
      assert.equal((html.match(/isometric-authority-platform/g) ?? []).length, 0, `${path} must not invent authority actions`);
    } else {
      assert.ok((html.match(/isometric-authority-platform/g) ?? []).length >= 1, `${path} must expose at least one official authority touchpoint`);
      assert.match(html, /intersection-source-detail/, `${path} must expose the selected source facts`);
      assert.match(html, /Official sources/);
    }
  }
});

test("renders core routes", async () => {
  for (const path of [
    "/property-journey", "/property-journey/sales-transfer", "/stakeholders", "/stakeholders/developers",
    "/ecosystem", "/platform", "/intelligence", "/intelligence/guides", "/intelligence/definitions-and-glossary",
    "/about", "/demo", "/authorities", "/lifecycle", "/privacy-policy", "/cookie-policy", "/terms", "/sitemap",
    "/ar", "/ar/property-journey", "/ar/stakeholders", "/ar/ecosystem",
    "/ar/intelligence", "/ar/intelligence/definitions-and-glossary", "/ar/platform",
    "/ar/privacy-policy", "/ar/cookie-policy", "/ar/terms", "/ar/sitemap",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
});
