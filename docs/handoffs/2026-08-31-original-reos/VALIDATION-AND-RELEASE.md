# Validation and release record

## Latest verified release

| Item | Result |
|---|---|
| Branch | `codex/reos-website-improvements` |
| Commit | `59604412a4fdad7486c02d668fdae801be3bad9f` |
| Commit message | `Localize Arabic intelligence navigation` |
| GitHub push | Confirmed; local HEAD equals `origin/codex/reos-website-improvements` |
| Vercel project | `reos-website` |
| Deployment ID | `dpl_ApzatWPWeM6PkVLiNhzb1fg6puaf` |
| Deployment state | Ready |
| Stable alias | `https://reos-website.vercel.app` |
| Arabic verification URL | `https://reos-website.vercel.app/ar/intelligence` |

## QA results

- `npm run lint` — passed.
- `npx tsc --noEmit` — passed after clean Next route-type generation.
- `npm run build` — passed; TypeScript passed and 704 pages generated.
- `npm run build:sites` — passed.
- `node --test tests/rendered-html.test.mjs tests/stakeholder-blueprints.test.mjs` — 58/58 passed.
- `BASE_URL=http://127.0.0.1:3101 node tests/intelligence-simplification-browser.mjs` — passed.
- `BASE_URL=https://reos-website.vercel.app node tests/intelligence-simplification-browser.mjs` — passed.
- Light/dark contrast, keyboard/touch semantics, RTL, responsive layouts and horizontal overflow checks — passed.
- Arabic Intelligence → Land & Vision → browser Back — passed locally and on the stable domain.
- Arabic breadcrumb displayed `رحلة العقار`; no English breadcrumb leakage was found.
- Browser console warnings/errors — none during targeted local and production checks.
- Vercel production error-log scan after release — no errors found.
- Stable Arabic route returned HTTP 200.

## Exact validation sequence for the next release

```bash
cd "/Users/d.kethari/D_Drive/REOS Website/tmp/codex-worktrees/reos-website-improvements"

git status --short
cat .vercel/project.json
npm run lint
npx next typegen
npx tsc --noEmit
npm run build
npm run build:sites
node --test tests/rendered-html.test.mjs tests/stakeholder-blueprints.test.mjs
```

For browser suites, start the server in a separate terminal:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3101
```

Then run the relevant browser files using `BASE_URL=http://127.0.0.1:3101`.
For production handoff, rerun the relevant suite with
`BASE_URL=https://reos-website.vercel.app`.

## Generated-type caveat

Switching between `next build`, `next dev` and `vinext build` can leave stale
generated route types under `.next`. If standalone `tsc` reports missing
`AppRoutes`, `LayoutRoutes` or `ParamMap` exports while `next build` succeeds,
regenerate route types cleanly with `npx next typegen` and rerun TypeScript.
Do not commit a generated `next-env.d.ts` path-only change.

## Deployment gate

Before production deployment:

1. Confirm the exact commit is pushed to GitHub.
2. Confirm `.vercel/project.json` says `reos-website`.
3. Complete local production and browser validation.
4. Deploy from the linked worktree.
5. Inspect the deployment until it is Ready.
6. Confirm the stable alias is `https://reos-website.vercel.app`.
7. Run browser QA against the stable domain and scan production errors.
