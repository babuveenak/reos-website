# Current file map

## Canonical data and governance

| File | Purpose |
|---|---|
| `app/data/journey.ts` | Canonical seven-stage lifecycle data |
| `app/data/stakeholderParticipation.ts` | Guarded twelve-stakeholder × seven-stage participation source |
| `app/data/relationships.ts` | Journey × Stakeholder relationship projection |
| `app/data/stakeholderBlueprints.ts` | Stakeholder-specific blueprint content |
| `app/data/stakeholderGuidance.ts` | Role-specific, non-generic stakeholder guidance |
| `app/data/authorityProcessMaps.ts` | Authority-aware stakeholder process maps |
| `app/data/officialSources.ts` | Primary-source records and review dates |
| `app/data/landVisionGuide.ts` | Land & Vision public education route |
| `app/data/publicDocuments.ts` | Privacy, cookies, terms and sitemap copy |

## Core interactive experiences

| File | Purpose |
|---|---|
| `app/components/FragmentedJourney.tsx` | Homepage stakeholder and lifecycle relationship visual |
| `app/components/StageVisualOverview.tsx` | Seven-stage visual index |
| `app/components/StakeholderDirectory.tsx` | Twelve-group stakeholder directory |
| `app/components/StakeholderLifecycleMap.tsx` | Data-driven involvement hierarchy |
| `app/components/StakeholderProcessMap.tsx` | Authority/process flow for applicable touchpoints |
| `app/components/StakeholderHeroVisual.tsx` | Stakeholder-specific hero imagery |
| `app/components/IntelligenceHeroMap.tsx` | Six-domain Intelligence visual |
| `app/components/IntelligenceWorkspaces.tsx` | Evidence, roles, authorities and glossary workspaces |
| `app/components/SiteShell.tsx` | Header, footer, five-item navigation and locale shell |

## Primary routes

| Route source | Purpose |
|---|---|
| `app/page.tsx` | Original REOS landing page |
| `app/property-journey/page.tsx` | Seven-stage journey index |
| `app/property-journey/[stage]/page.tsx` | Individual stage education |
| `app/property-journey/[stage]/stakeholders/[stakeholder]/page.tsx` | Canonical relationship page |
| `app/stakeholders/page.tsx` | Twelve stakeholder groups |
| `app/stakeholders/[slug]/page.tsx` | Stakeholder overview |
| `app/stakeholders/[slug]/[emirate]/[[...track]]/page.tsx` | Jurisdiction-aware stakeholder route |
| `app/ecosystem/page.tsx` | Journey × Stakeholder explorer |
| `app/intelligence/page.tsx` | Interactive Intelligence index |
| `app/platform/page.tsx` | Commercial products and maturity vocabulary |
| `app/ar/**` | Arabic twins of visitor-facing routes |

## Visual assets

- `public/images/property-journey-stage-*-v1.jpg` — seven stage-specific visuals.
- `public/images/stakeholder-*-hero-v1.jpg` and
  `stakeholder-landowners-investors-hero-v1.png` — twelve stakeholder visuals.
- Do not substitute the full lifecycle image for a stage-specific image.
- Keep generated/illustrative visuals clearly distinguished from official plans.

## High-value test suites

| Test | Coverage |
|---|---|
| `tests/rendered-html.test.mjs` | Routes, navigation, canonical names, education/commercial boundaries |
| `tests/stakeholder-blueprints.test.mjs` | Twelve-group participation and jurisdiction behavior |
| `tests/home-fragmentation-browser.mjs` | Homepage stakeholder connections and persistent flow |
| `tests/stakeholder-84-matrix-browser.mjs` | 84 relationship matrix |
| `tests/stakeholder-process-map-browser.mjs` | Involvement-weighted process experiences |
| `tests/property-journey-visual-browser.mjs` | Journey visual index |
| `tests/stage-lifecycle-visual-browser.mjs` | Individual stage visuals |
| `tests/ecosystem-simplification-browser.mjs` | Ecosystem explorer |
| `tests/intelligence-simplification-browser.mjs` | Intelligence interactions, RTL, accessibility and responsive QA |
