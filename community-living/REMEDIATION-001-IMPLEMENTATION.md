# REMEDIATION-001 — Implementation Record

## §§25–40 execution

### §25 Homepage wireframe
Hero → Ask My Community → Common Issues → Structural Problem → Responsibility Ecosystem → Resolution Flow → Community Passport → Find Community → Rights & Responsibilities → Evidence → Who Benefits → Pilot → Neutrality → Final CTA.

### §26 Breakpoints
320, 375, 390, 430, tablet and desktop accounted for. Mobile uses compact issue grids, stakeholder list behavior and sticky Ask My Community CTA.

### §27 Accessibility
Semantic headings, skip link, visible focus, 44px targets, ARIA labels/live region, keyboard submission and `prefers-reduced-motion` support.

### §28 Architecture
Static, progressively enhanced HTML/CSS/JS prototype. Content routes separated for methodology, enterprise and investor narratives. No dependency on an unverified backend.

### §29 Performance
No framework runtime, no third-party UI library, no external image payload in this remediation prototype. CSS/JS kept local and lightweight. Field Core Web Vitals require post-deploy measurement and are not claimed pre-launch.

### §30 SEO
Unique title/description, OpenGraph metadata, WebSite structured data and semantic content hierarchy.

### §31 Analytics
Privacy-minimal event instrumentation queues interaction names in `window.dataLayer` without sending personal question text. Events include CTA clicks, issue category, community search presence and stakeholder views.

### §32 Evidence/provenance
Community data surfaces Source, Last Verified and Status. Unknown fields are explicitly `Information being verified`.

### §33 States
Ask demo identifies demo status; community search has empty and unavailable states; unverified profiles return a request path rather than fabricated content.

### §34 Safety
No fabricated AI/regulatory answers, partnerships, endorsements, complaint metrics, contract scope or ROI. Escalation remains community/jurisdiction specific until sourced.

### §35 Phase 1–12 acceptance
Resident-first proposition, immediate product utility, coherent story, product navigation, trust architecture, luxury editorial design, CTA hierarchy, mobile experience, enterprise separation and investor separation implemented.

### §36 QA
Static/DOM gate passes. Chromium visual QA was attempted in the execution container but blocked by the environment's browser process; production promotion remains gated on actual deployed visual verification.

### §37 Before/after
Baseline audit: 61/100. Target after full validated deployment: 85+/100. No final after-score is claimed until visual/browser and stakeholder validation complete.

### §38 Deployment gate
Preview first. Production only after preview READY, route checks, visual/mobile review and no critical errors. Previous production deployment remains rollback point.

### §39 GitHub + Vercel
Work isolated on `community-living-remediation-001`; do not merge to REOS `main` until approved. Independent Vercel deployment used for prototype.

### §40 Completion report
Report must distinguish implemented, verified, blocked and research-required items. Never report a gate as passed when it was not run successfully.
