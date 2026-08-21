# REOS Intelligence interactive hero

## Purpose

The `/intelligence` hero explains the REOS knowledge layer through six canonical domains:

1. Guides
2. Regulations
3. Processes
4. Authority Information
5. Definitions & Glossary
6. Knowledge Graph

The central REOS Intelligence core connects those domains. The visual is an orientation layer for the page, not a second taxonomy.

## Implementation contract

- The architectural foundation is the text-free asset at `public/images/intelligence-knowledge-foundation-v1.jpg`.
- Domain names, numbers, links, status, descriptions, connection paths and the central REOS label are coded UI.
- Pointer hover and keyboard focus temporarily preview a domain.
- A click or keyboard activation selects the domain and opens its contextual panel.
- Escape clears the selection; the central core also returns to the six-domain overview.
- Each preview links to the relevant section or published Intelligence route.
- Mobile replaces the dense orbital overlay with six large coded controls and the same contextual panel.
- The generated foundation must not be replaced with an image containing baked-in labels.

## Visual system

The foundation uses warm ivory, soft cream, pearl white, champagne gold and antique bronze. Muted teal appears only on secondary information flows. The hero remains bright and architectural in both site themes; it does not use a dark globe, neon technology styling or a night scene.

## Regression coverage

`tests/rendered-html.test.mjs` asserts that the foundation is present, exactly six desktop domain controls are rendered, the canonical labels remain intact, and the published Guides and Glossary destinations remain connected.
