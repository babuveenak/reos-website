# REOS Intelligence — Visual Revamp Master Prompt

## Define

Revamp only the original REOS `/intelligence` and `/ar/intelligence` landing pages. Preserve the existing hero copy, hero image, six-domain interactive map, five-item navigation, English/Arabic route structure, brand system, accessibility controls, footer and authority boundaries.

The page is an educational knowledge entry point. It must not promote REOS products, imply that REOS replaces an authority, or duplicate the complete Property Journey, Stakeholders, Authorities, Guides or Glossary directories.

## Measure — critical-to-quality requirements

1. Remove the compact “How REOS Works” section.
2. Remove the full seven-stage card index; the Processes hero domain links to Property Journey instead.
3. Remove the standalone Regulations placeholder; retain its honest “In development” state in the hero.
4. Remove the standalone Knowledge Graph placeholder; retain an honest “Coming Soon” state in the hero without a false destination.
5. Remove the Business Outcome / Audience / Product / Next Action conversion block.
6. Preserve one concise integrity notice explaining that educational guidance does not replace official sources or professional advice.
7. Replace static text grids with four purposeful interactive visual workspaces:
   - evidence pathway: official source → scoped claim → jurisdiction → review state → guidance;
   - role guide selector;
   - jurisdiction-aware authority selector;
   - searchable visual glossary.
8. Every interaction must work with pointer, keyboard and touch. State must be exposed with semantic controls and ARIA.
9. Provide useful fallbacks for reduced motion and narrow screens.
10. Do not invent fees, timelines, requirements, authority powers or publication status.

## Analyse — defects to prevent

- Do not reproduce the complete content already available on destination pages.
- Do not use decorative movement without an information relationship.
- Do not make static bitmap art look interactive.
- Do not hide provenance, jurisdiction or evidence limitations inside animation.
- Do not create dead links to unpublished Regulations or Knowledge Graph explorers.
- Do not add Platform products, lead-generation copy or unsupported “validated” claims.
- Do not alter Home, Property Journey, Stakeholders, Ecosystem or Seven-Gateway code.

## Improve — target experience

Keep the hero as the orientation layer. Below it, present a compact sequence:

1. **Trust an answer** — a selectable five-node 3D evidence pipeline. Selecting a node reveals only its purpose.
2. **Choose who you are** — a visual role deck. Selecting a role reveals its journey-stage coverage and opens the existing guide.
3. **Resolve who governs it** — a selectable authority constellation showing jurisdiction, role, evidence state and official source link.
4. **Decode a term** — a searchable term constellation with a short definition, jurisdiction-sensitive flag and one link to the complete glossary.
5. **Integrity boundary** — short, visible and non-promotional.

Use warm ivory, champagne gold, charcoal and restrained teal. Use perspective, layered elevation, connecting lines and state transitions to create an isometric/3D visual language. Motion must clarify selection and flow; it must stop under `prefers-reduced-motion`.

## Control — acceptance and QA gates

- Existing hero copy and hero foundation image remain unchanged.
- Six hero-domain controls remain available.
- Removed sections and product language are absent from the rendered page.
- Four new workspaces render once each and provide working state changes.
- Processes routes to Property Journey; Guides and Glossary route to their directories.
- Unpublished domains do not produce broken anchors or false experiences.
- English and Arabic pages return 200; Arabic remains RTL.
- Light and dark modes pass automated WCAG A/AA checks for the changed surface.
- Keyboard focus is visible and interactions work with Enter/Space.
- 320, 390, 768, 1024 and desktop widths have no horizontal overflow.
- Console and runtime error collections are empty.
- Production TypeScript, lint and build pass.
- Visual screenshots are inspected in desktop light, desktop dark and mobile.
- Git diff contains only Intelligence-related implementation, tests and this prompt.
