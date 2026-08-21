# REOS Platform product catalogue

## Commercial model

The public website follows a three-step commercial journey:

1. **Educate** — explain the UAE property journey, stakeholders, ecosystem and intelligence.
2. **Adopt** — establish REOS as the connected operating model used by the organization.
3. **Subscribe and operate** — license individual REOS digital products that automate specific workflows.

The `/platform` route is therefore a commercial product catalogue and access gateway, not a list of abstract platform modules.

## Product source of truth

`app/data/products.ts` is the shared catalogue. Adding a product there makes it available to the Platform hero, product catalogue and footer. A published product also receives an explicit access route built with the shared `ProductLoginView`, avoiding ambiguous gateway URLs.

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
- Do not imply REOS replaces an authority or official registry as system of record.
- Do not activate sign-in until authentication and licence entitlement checks are connected.
- New products must reuse the catalogue and shared product-gateway view rather than adding one-off page architecture.
