# REOS — Stakeholders Visual Explorer Master Prompt

## Define

Redesign only the Stakeholders landing-page directory beneath the protected hero. Replace the long twelve-card document view with one guided, visual-first explorer that helps a visitor answer three questions quickly: **Which stakeholder group am I? Where does that group participate? What should I open next?**

Do not change the approved Stakeholders hero copy, hero image, hero interaction, primary navigation, footer, brand palette, typography system, authority boundaries, English/Arabic route structure, or stable production domain.

Use the existing canonical data sources. Never invent, shorten, merge, split, reorder, or rename the taxonomy.

### Canonical stakeholder groups — exact order and names

1. Landowners & Investors
2. Developers
3. Consultants & Designers
4. Authorities & Regulators
5. Utility Providers
6. Contractors
7. Suppliers & Vendors
8. Brokers & Agencies
9. Banks & Financial Institutions
10. Property Owners
11. Residents & Tenants
12. Facility & Community Operators

### Canonical property journey stages — exact order and names

1. Land & Vision
2. Planning & Design
3. Authorities & Approvals
4. Construction & Delivery
5. Sales & Transfer
6. Living & Operations
7. Asset Growth & Intelligence

## Measure

The existing directory repeats twelve large cards and seven miniature stage cells per card. This creates 84 simultaneous visual decisions, small text, duplicated labels and an unnecessarily long page. Search and filtering add controls before the visitor understands the model.

Success means:

- all twelve stakeholder groups are available in one visual selector;
- the seven stages are always visible as one continuous lifecycle;
- selecting a group immediately highlights its Lead, Active, Supporting and Informed relationships;
- the selected group has a distinctive icon and isometric scene treatment;
- the visitor sees only one concise selected-role explanation at a time;
- the primary action opens the selected stakeholder’s existing lifecycle page;
- desktop, touch, keyboard and RTL interaction are equivalent;
- the page contains no long stack of twelve repeated cards;
- text remains large enough to understand without zooming;
- the page has no horizontal overflow at 320, 390, 768, 1024 or desktop widths.

## Analyse

The Stakeholders landing page is a selection and orientation surface, not the place to reproduce every lifecycle fact. Detailed documents, fees, timelines, authority routes and sources remain on the stakeholder and journey-intersection pages. The landing page must not claim that every stakeholder actively starts at Stage 1: distinguish context-only awareness from an actual Lead or Active entry point.

Static decoration is insufficient. Every visual change must communicate role, participation, sequence or the next action. Persistent subtle connections must remain visible after hover, click, keyboard focus and pointer movement. Respect `prefers-reduced-motion`.

## Improve

Build one `StakeholderLifecycleExplorer` client component using the canonical localized `groups`, `stages` and participation profiles already in the repository.

1. Present the twelve groups as distinctive isometric role platforms with unique, accessible glyphs.
2. Keep all seven canonical stages in a large continuous route.
3. On hover, focus, click or tap:
   - select the group;
   - illuminate its stage relationships using the existing evidence-aware participation model;
   - animate restrained gold/teal flow markers between relevant stages;
   - show the first Lead or Active stage as the practical entry point;
   - keep Informed-only stages visually quieter and never describe them as active entry points.
4. Show one concise guidance panel containing:
   - exact stakeholder name;
   - short role description;
   - practical entry stage;
   - number of Lead/Active touchpoints;
   - one localized link to the existing lifecycle page.
5. On mobile, use a horizontally scrollable role selector and a readable selected-role panel; do not shrink the entire desktop diagram.
6. Use semantic buttons, visible focus, arrow-key navigation, an ARIA live status, touch targets of at least 44px and reduced-motion fallbacks.
7. Preserve the compact personal-guide bridge and educational integrity notice.
8. Remove the old search, cluster filter, stage filter and twelve repeated profile cards from this landing page only.

## Control — QA/QC gates

- TypeScript, ESLint and production build pass.
- Automated tests prove exactly twelve canonical stakeholder names and exactly seven canonical stage names on English and Arabic landing pages.
- Existing English and Arabic stakeholder detail routes and all 84 journey × stakeholder intersections remain valid.
- Hero copy, twelve hero hotspots and protected hero interaction remain unchanged.
- Selection works with pointer, keyboard and touch.
- The connection flow remains visible after hover, click, focus changes and pointer movement.
- Light and dark modes pass automated WCAG A/AA checks for the changed surface.
- Arabic remains RTL and uses the same canonical ids/order with localized labels.
- 320, 390, 768, 1024 and desktop widths have no horizontal overflow.
- Console and runtime error collections are empty.
- Screenshots are inspected in desktop light, desktop dark and mobile.
- Git diff contains only the Stakeholders visual explorer, its styles, prompt and tests.
- GitHub contains the complete commit before deployment.
- Deploy only to the linked Vercel project `reos-website`, confirm the stable alias, then rerun the browser suite against `https://reos-website.vercel.app`.
