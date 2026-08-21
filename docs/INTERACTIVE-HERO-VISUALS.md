# Interactive hero visual rules

The Property Journey and Stakeholders hero illustrations are text-free visual
foundations. Stage and stakeholder names, numbers, hotspots, detail panels and
links remain coded interface elements so they stay readable, accessible,
responsive and sourced from the canonical site data.

## Property Journey label placement

- A label must identify its own platform without covering an adjacent stage.
- Stage 01, Land & Vision, is anchored above the land platform so it does not
  cover Stage 02, Planning & Design.
- Stage 07, Asset Growth & Intelligence, is anchored above the investment
  platform so it does not cover Stage 06, Living & Operations.
- Stages 04 and 05 remain visually split to communicate that Construction &
  Delivery and Sales & Transfer run in parallel.
- Mobile layouts replace the overlaid labels with the seven-button coded list.

These placements are represented by `data-label-placement` on each desktop
hotspot and guarded by the rendered HTML test suite.

## Stakeholders ring order and label placement

- The outer ring runs clockwise from 01 through 12. The architectural
  environments follow the same order; labels must never be reassigned to an
  environment that represents a different stakeholder.
- Labels 01–05 and 12 sit above their platforms. Labels 06–10 sit below their
  platforms. Label 11 sits above-left of its platform.
- The central platform carries a coded `REOS` / `OPERATING SYSTEM` label to
  make clear that REOS connects all 12 stakeholder groups.
- The generated foundation remains free of baked-in words and numbers.

Ring position and label placement are exposed as `data-ring-position` and
`data-label-placement` attributes and guarded by the rendered HTML test suite.

## Shared REOS visual treatment

- Property Journey, Stakeholders, Ecosystem and Intelligence use the same warm
  visual temperature: ivory and cream foundations, pearl-white coded labels,
  champagne-gold connections and antique-bronze emphasis.
- Deep charcoal is reserved for readable interface text and structural detail.
  Muted teal is secondary and is used only to distinguish selected data flows.
- Ecosystem and Intelligence retain their own meaning and composition, but their
  right-side visual explorers remain bright in both site themes. Dark theme must
  not turn their maps, coded labels, previews or mobile selectors into dark-mode
  illustrations.
- Generated foundations remain text-free. Labels, numbers, hotspots, preview
  content and navigation remain coded so the layout can prevent collisions and
  stay accessible at every breakpoint.
