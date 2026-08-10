# REOS — The Operating System for Property

Production website for REOS, translating the REOS/KETURAH investor-presentation design language into a responsive, explorable property-lifecycle experience.

## Experience

- cinematic, scroll-driven homepage
- interactive eight-ecosystem REOS map
- 24-stage Property Development Lifecycle Explorer
- dual entry by stakeholder role or lifecycle stage
- dynamic stakeholder journey pages
- authority and jurisdiction touchpoint map
- REOS Property Passport, Lifecycle State Engine, Integration Fabric and AI Journey Copilot narrative
- explicit content-integrity labels: Validated, To Be Validated, Illustrative and Future REOS Capability

## Extracted REOS design system

| Token | Value |
|---|---|
| Void | `#0A0A0F` |
| Deep | `#10101A` |
| Panel | `#14141F` |
| Gold | `#C8A45D` |
| Soft gold | `#E4CFA3` |
| Cyan | `#6FD4D4` |
| Ivory | `#F2EDE4` |
| Muted | `#8E8C97` |
| Display | Cormorant Garamond |
| Interface | Jost |

The visual vocabulary preserves architectural arches, thin gold threads, restrained glass, cinematic image overlays, serif editorial typography, generous negative space and soft 700–900 ms motion. Reduced-motion preferences are supported.

## Architecture

- App Router-compatible `app/` structure using vinext
- structured business content in `app/data/reos.ts`
- server-rendered route pages with client components only for interactive explorers
- stable IDs across ecosystems, stakeholders, authorities and lifecycle stages
- dynamic shareable routes for stakeholder and lifecycle pages
- sitemap and robots metadata
- Cloudflare Worker-compatible production output through the Sites vinext runtime

The current data model is intentionally file-backed and CMS-ready. A future content service can replace the module without redesigning the visual components.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run build
npm run lint
npm test
```

## Content integrity

Do not add regulatory processes, eligibility, fees, timelines, approvals, laws, or API availability without authoritative evidence. Update the `status` field on every relevant entity and preserve jurisdiction-specific distinctions.

## Deployment

The project is configured for Sites through `.openai/hosting.json`. Production deployment packages the validated vinext output and publishes the exact committed source state.

## Future enhancements

- claim-level source and effective-date metadata
- jurisdiction-specific process variants
- CMS or knowledge-graph backend
- textual diagram exports and richer dependency views
- verified Arabic content and terminology parity
- consented property-passport and account capabilities

