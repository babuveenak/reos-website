# REOS — The Operating System for Property

Production website for REOS, translating the REOS/KETURAH investor-presentation design language into a responsive, explorable property-lifecycle experience.

## Experience

Journey-first: the site explains the property journey, then helps you find
your place in it, then reveals the ecosystem behind it, and only then
introduces the platform.

- hero built around the twelve-stage journey from land to living
- eight persona routes (`/roles`) — each a filtered view of the same journey
- twelve canonical stages (`/journey`) with full stage pages
- ecosystem map: 12 stakeholder groups, 4 clusters, one regulatory rail
- knowledge hub, platform, about and demo pages
- explicit content-integrity labels: Validated, To Be Validated, Illustrative, Future REOS Capability

## One canonical lifecycle

`app/data/journey.ts` holds the single spine: twelve stages. Everything else
is a projection of it — the hero ribbon, the persona flows, and the 24
detailed stages in `reos.ts` which hang beneath the twelve via
`detailStageIds`. Do not introduce a second stage list.

Stages carry `runsWith` because order is not sequence. In UAE off-plan
development, marketing and sales run *during* construction — escrow exists
precisely because buyers pay while the building goes up. A test asserts this
is stated on the construction stage page.

## Written for a global reader

Local terms (escrow, off-plan, snagging, service charge, owners' association)
are explained where they first appear rather than assumed. Every stage carries
a `jurisdiction` note because requirements differ per emirate and zone.

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

## Configuration

Contact details and the canonical URL are environment variables, so they can be
changed without editing code.

| Variable | Default | Controls |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_EMAIL` | `aiworkingforme@gmail.com` | Where the demo form and every mailto link send enquiries |
| `NEXT_PUBLIC_SITE_URL` | `https://reos-website.vercel.app` | Canonical origin for metadata, Open Graph and the sitemap |
| `NEXT_PUBLIC_CONTACT_PHONE` | _(unset)_ | Shown next to the email on the demo page when set |
| `NEXT_PUBLIC_BOOKING_URL` | _(unset)_ | Adds a "pick a time" link to the demo form when set |
| `NEXT_PUBLIC_ENQUIRY_SUBJECT` | `REOS demo request` | Subject-line prefix on enquiry emails |

**To change one in production:** Vercel project → Settings → Environment
Variables → add or edit → then **Redeploy**. No commit needed.

**Locally:** copy `.env.example` to `.env.local` and edit.

The site is statically exported, so these are inlined at build time rather than
read at runtime — a change takes effect on the next deploy, not immediately.
All values are optional and fall back to the defaults above. Defaults and
fallbacks live in `app/data/site.ts`.

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

