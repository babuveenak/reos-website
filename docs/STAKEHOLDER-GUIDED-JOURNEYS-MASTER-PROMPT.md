# REOS — QA-Controlled Stakeholder Guided Journeys Prompt

## Objective

Transform the shared stakeholder detail template into a guided, visual lifecycle experience. A first-time visitor must understand where the selected stakeholder leads, participates, supports or stays informed without choosing a stage first.

The reference implementation is Stakeholder 08, Brokers & Agencies. The shared lifecycle architecture must apply to all 12 canonical stakeholder routes.

## Canonical controls

- Preserve the exact 12 stakeholder names, IDs and ordering already held in the shared REOS data model.
- Preserve the exact seven lifecycle stages and ordering.
- Preserve the existing stakeholder hero artwork, route structure, English/Arabic support, theme controls, footer and authority boundaries.
- Do not copy from or modify Seven-Gateway source.
- Do not present REOS as an authority, registry, licensing body or decision-maker.

## Corrected architecture

1. Keep the existing stakeholder hero and trust badges, but remove jurisdiction selectors from the hero.
2. Add a zero-click, interactive lifecycle connection map immediately after the hero. All seven stages must be visible. Lead/Active stages are elevated; Supporting/Informed stages are recessed. Use shape, elevation, labels and badges in addition to colour.
3. Select the stakeholder's first Lead stage by default. If none exists, use the first Active stage, then Supporting.
4. Hover, focus, click and touch may inspect another stage, but meaningful journey information must already be present before interaction.
5. Place Emirate and Dubai authority-route controls after the educational overview and before official route-specific facts. These controls are evidence refinements, not entry gates.
6. Retain the sourced stage process map and official fact card. Rename its instruction so it explains rather than asks the visitor to discover the journey.
7. Add role-entry guidance and practical challenges only where the content is stakeholder-specific and evidence-safe.
8. For Brokers & Agencies, publish two source-led paths: professional practice card and brokerage company licensing. Use current DLD/Trakheesi service facts; never convert authority service time into an end-to-end licensing promise.
9. Use the official DLD licensed-broker registry as the directory. Do not seed or display invented agency records. If an authoritative directory is unavailable for another stakeholder, omit it and state no directory claim.

## Evidence rules

- Every numeric fee or duration must come from a primary authority source already registered by REOS or reviewed for this change.
- Clearly distinguish authority service time from the total end-to-end journey.
- If a fact is unpublished, say “Not published by the authority” or “Route-specific”; do not use a public `[VERIFY]` placeholder.
- Do not leak Dubai Municipality facts into DDA, Trakhees, DIFC or other jurisdiction routes.
- External links must go directly to official authority pages.

## Visual and interaction requirements

- Match REOS ivory, champagne-gold, teal, serif/sans typography and isometric depth.
- The lifecycle map must be code-native and interactive, not a static screenshot.
- Desktop: seven connected isometric stage platforms.
- Mobile: accessible horizontal/vertical guided route with no page-level overflow.
- Keyboard: roving tabs with Arrow keys, Home and End.
- Support touch, RTL and reduced motion.
- Maintain WCAG A/AA contrast in light and dark themes.

## QA gates

- TypeScript, lint, production build and automated tests.
- Browser verification of the Brokers & Agencies reference route plus representative routes from other stakeholders.
- Confirm zero-click default is a Lead stage for Brokers & Agencies.
- Confirm all 12 routes render the shared lifecycle map and all seven canonical stages.
- Confirm jurisdiction controls are outside the hero.
- Confirm official source links, fees and timings are route-safe.
- Verify keyboard, touch, RTL, reduced motion, light/dark contrast, responsive layouts, horizontal overflow, console and runtime errors.
- Confirm only original REOS files changed; push GitHub before deploying to the verified `reos-website` project and validate the stable alias.
