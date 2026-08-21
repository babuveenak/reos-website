# REOS Platform product catalogue

## Commercial model

The public website follows a three-step commercial journey:

1. **Educate** — explain the UAE property journey, stakeholders, ecosystem and intelligence.
2. **Adopt** — establish REOS as the connected operating model used by the organization.
3. **Subscribe and operate** — license individual REOS digital products that automate specific workflows.

The `/platform` route is therefore a complete enterprise product-sales experience and access gateway, not a list of abstract platform modules. Its narrative is deliberately sequenced as:

**Hero → operating problem → REOS solution → workflow demonstration → role-based product experience → capabilities → business value → AI and automation → use cases → differentiation → catalogue → demo CTA.**

## Product experience contract

The public page must demonstrate the software with coded, interactive product UI rather than a decorative product image. The current experience includes:

- a switchable Title Deed / NOC case workspace in the hero;
- a before-REOS / with-REOS workflow comparison;
- interactive five-step product workflows;
- operations, reviewer and executive product views;
- expandable capabilities and a transparent AI-assisted readiness preview;
- repeated, contextual routes to request a demo or view a product access gateway.

All dashboards and case data on the public page are explicitly identified as illustrative product previews. They explain intended product behaviour and must not be presented as live customer data or measured performance.

## Product source of truth

`app/data/products.ts` is the shared catalogue. Adding a product there makes it available to the Platform product selector, catalogue, demo interest list and footer. A published product also receives an explicit access route built with the shared `ProductLoginView`, avoiding ambiguous gateway URLs.

The initial catalogue is:

1. Title Deed Automation — first product, licensing preview.
2. NOC Automation — next product, in development.

Each product declares its B2B, B2G and B2C markets, relevant stakeholder groups, scope, outcome and honest availability status.

## Access model

Every product has a distinct route:

- `/platform/products/title-deed-automation/login`
- `/platform/products/noc-automation/login`

The current pages are transparent website-preview gateways. They communicate the intended organization licence, product entitlement and role-based access model, but the sign-in button stays disabled until identity, tenancy, subscriptions and entitlements are implemented.

## Guardrails

- Never describe an in-development product as operational.
- Label public dashboards, case data, AI responses and workflow screens as illustrative product previews until production systems are connected.
- Do not publish invented customer metrics, performance claims or outcome percentages.
- Do not imply REOS replaces an authority or official registry as system of record.
- AI may propose checks, summaries and next actions, but authorized users retain decisions and accountability.
- Do not activate sign-in until authentication and licence entitlement checks are connected.
- New products must reuse the catalogue and shared product-gateway view rather than adding one-off page architecture.
