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
