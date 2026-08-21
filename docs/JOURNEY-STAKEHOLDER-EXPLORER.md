# Journey × Stakeholder Explorer

## Purpose

The explorer is the canonical bidirectional map between the seven-stage UAE property journey and the twelve stakeholder groups. It is implemented as interface code, not as a generated image. Its job is to answer three progressively deeper questions:

1. The map answers: **what is connected?**
2. The relationship panel answers: **how are they connected?**
3. The contextual detail page answers: **what happens, who is responsible, and which processes, documents, approvals, systems and dependencies are involved?**

## Canonical sources

- `app/data/journey.ts` owns the seven ordered stages and each stage's stakeholder participation list.
- `app/data/ecosystem.ts` owns the twelve stakeholder groups.
- `app/data/relationships.ts` owns the relationship level and contextual metadata for each valid intersection.

The relationship module derives its records from the stage-owned participation lists. It performs an import-time integrity check so a stage membership cannot silently exist without a corresponding relationship record.

## User views

The `/ecosystem` hero is the compact entry point to these views. Its orbital map places the twelve stakeholder groups around the seven journey stages and the REOS Core. The hero and detailed explorer share a single React interaction provider, URL state and canonical relationship dataset; selecting a dimension in the hero therefore carries that same selection into the detailed explorer below.

- **Journey View** is the default. Select a stage, then select one of its connected stakeholders.
- **Stakeholder View** reverses the interaction. Select a stakeholder, then select one of its connected stages.
- **Full Map** shows the complete 12 × 7 matrix. Only mapped intersections are interactive.

All three views read the same relationship records and open the same relationship panel. The selected view and dimensions are written to URL query parameters, and the selected mode is remembered for the browser session.

## Orbital hero visual contract

- `public/images/ecosystem-orbital-foundation-v1.jpg` is a subtle, text-free architectural foundation only.
- All stakeholder names, stage names, REOS Core text, paths, flow legend, focus states and previews are coded HTML/SVG, so text remains accessible and responsive.
- The six flow types — information, decision, document, approval, service and capital — are derived from the approved relationship record fields. They use line weight and dash patterns as well as labels; meaning never depends on color alone.
- Pointer hover and keyboard focus preview a node without changing the URL. Activation selects the same shared stage/stakeholder state used by the detailed explorer.
- On small screens the dense orbital arrangement becomes a REOS Core control plus seven stage controls and twelve stakeholder controls; the mobile experience never requires horizontal scrolling.

## Relationship levels

- **Lead** — owns or gates a central outcome.
- **Active** — performs material work or makes decisions.
- **Supporting** — provides a required input, service or control.
- **Informed** — receives the output or must remain aware of state.

Level is expressed through text, color and marker shape. Color is never the only signal.

## Routes and canonicalization

The canonical relationship route is:

`/property-journey/[stage]/stakeholders/[stakeholder]`

The stakeholder-first form:

`/stakeholders/[stakeholder]/journey/[stage]`

permanently redirects to the stage-first canonical URL to prevent duplicate content.

## Editorial safeguards

Only approved relationship records render publicly. Stage content and stakeholder-group membership are sourced from validated canonical records. Stakeholder-detail fields marked “To Be Validated” are not copied into public relationship metadata; those intersections use the already validated group responsibility and stage content instead.

## Responsive and accessibility behavior

- Guided views remain available at every viewport.
- The 84-cell matrix is not compressed on small screens; mobile users are directed to the two guided views carrying the same data.
- Controls use native buttons, inputs, checkboxes, tables and details elements.
- Selection state is exposed with `aria-pressed` / `aria-selected` and announced through a live region.
- The relationship panel receives keyboard focus when opened; Escape clears the active selection.
- Touch targets use a 44-pixel minimum where actions are compact.
- Reduced-motion preferences disable panel and marker animation.

## Regression contract

`tests/rendered-html.test.mjs` verifies:

- the three explorer modes and 30 canonical relationships;
- a canonical relationship detail page;
- the stakeholder-first permanent redirect;
- reciprocal navigation from stage and stakeholder pages;
- all seven participation states on a stakeholder profile.
