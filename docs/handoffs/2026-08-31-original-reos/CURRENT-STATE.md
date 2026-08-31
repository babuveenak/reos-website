# Current state

## Repository and production

| Item | Current state |
|---|---|
| Repository | `babuveenak/reos-website` |
| Recoverable production baseline | `backup/reos-website-production-2026-08-25` |
| Baseline commit | `66f8fe74e5fddc71947937a62d91e1304877c748` |
| Baseline tag | `reos-website-production-backup-2026-08-25` |
| Active worktree | `/Users/d.kethari/D_Drive/REOS Website/tmp/codex-worktrees/reos-website-improvements` |
| Active branch | `codex/reos-website-improvements` |
| Current production commit | `59604412a4fdad7486c02d668fdae801be3bad9f` |
| Vercel project | `reos-website` (`prj_JdYgduieHd2dCKg6RgemQSwJiq6e`) |
| Production deployment | `dpl_ApzatWPWeM6PkVLiNhzb1fg6puaf` |
| Stable domain | `https://reos-website.vercel.app` |

## Protected architecture

Preserve these decisions unless the owner explicitly changes them:

- Warm ivory and champagne-gold identity with premium UAE architectural visuals.
- Five primary navigation items: Property Journey, Stakeholders, Ecosystem, Intelligence, Platform.
- Seven Property Journey stages, with canonical names used everywhere:
  1. Land & Vision
  2. Planning & Design
  3. Authorities & Approvals
  4. Construction & Delivery
  5. Sales & Transfer
  6. Living & Operations
  7. Asset Growth & Intelligence
- Twelve canonical stakeholder groups:
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
- The guarded 12 × 7 participation model is the source for all 84 relationships.
- Educational routes explain the UAE property process; commercial conversion belongs primarily in Platform.
- REOS is an independent knowledge and navigation layer. It does not replace authorities, registries, regulated providers or authorized decision-makers.
- Evidence status and product maturity remain separate.
- English and Arabic route structures, responsive behavior and accessibility remain supported.

## Major work completed since the production baseline

- Removed duplicate landing-page journey/stakeholder sections and added the four public footer documents.
- Rebuilt “Why this is hard” as an interactive seven-stage and stakeholder flow.
- Corrected the homepage to consume the canonical stakeholder participation model.
- Kept direct/Lead/Active touchpoints visually stronger and contextual relationships lighter, with a legend.
- Added seven stage-specific visual cards and expanded stage education.
- Added twelve stakeholder hero dioramas and data-driven stakeholder lifecycle storytelling.
- Added jurisdiction-aware stakeholder routes and authority process maps.
- Added all 84 Journey × Stakeholder relationship routes.
- Simplified Ecosystem around the relationship explorer.
- Simplified Intelligence into four interactive workspaces.
- Upgraded the Intelligence evidence pathway from passive tabs to a sequential five-checkpoint review.
- Moved the homepage “Ask the Property Ecosystem” section directly after “Why this is hard.”
- Localized Arabic Intelligence content, evidence, authorities, lifecycle links and journey breadcrumbs.

## Current production release

The last release changed only the Arabic Intelligence and journey-navigation
experience:

- Arabic Intelligence metadata, hero, six-domain map, evidence record,
  authority directory and integrity copy are localized.
- Arabic stage names and URLs remain inside `/ar`.
- Arabic Property Journey breadcrumbs use `رحلة العقار` and localized ARIA text.
- Parallel-stage links no longer leak from Arabic routes to English routes.
- English behavior and approved imagery remain unchanged.

## Known limitations and remaining decisions

- Arabic carries a visible working-translation notice and needs native-speaker editorial review.
- Authority fees, timings and rules must be refreshed only from authoritative primary sources and scoped to the correct emirate/zone.
- Not every stakeholder/jurisdiction intersection has a fully verified transaction blueprint. Unmapped routes must remain explicitly labelled and must not inherit Dubai facts.
- The `build:sites` renderer remains part of the HTML test harness even though production deploys to Vercel. Always rebuild it before rendered-HTML tests.
- Do not claim executive approval, governance approval or a freeze without explicit owner instruction.
