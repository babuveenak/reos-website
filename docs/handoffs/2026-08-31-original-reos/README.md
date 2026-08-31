# Original REOS website — session handover package

Prepared: **31 August 2026**
Status: **Ready for the next session**

This is the authoritative restart package for the original REOS public
website. It replaces the project state described in the historical
`docs/SESSION-HANDOFF.md`.

## Read in this order

1. [CURRENT-STATE.md](CURRENT-STATE.md) — repository, production and architecture state.
2. [VALIDATION-AND-RELEASE.md](VALIDATION-AND-RELEASE.md) — exact QA and deployment evidence.
3. [FILE-MAP.md](FILE-MAP.md) — the current source-of-truth files and test suites.
4. [NEXT-SESSION-PROMPT.md](NEXT-SESSION-PROMPT.md) — a ready-to-paste startup prompt.

## Five facts to confirm before editing

| Item | Required value |
|---|---|
| Repository | `https://github.com/babuveenak/reos-website` |
| Worktree | `/Users/d.kethari/D_Drive/REOS Website/tmp/codex-worktrees/reos-website-improvements` |
| Working branch | `codex/reos-website-improvements` |
| Current production-code commit | `59604412a4fdad7486c02d668fdae801be3bad9f` |
| Vercel project | `reos-website` |

Production is [https://reos-website.vercel.app](https://reos-website.vercel.app)
and currently points to deployment `dpl_ApzatWPWeM6PkVLiNhzb1fg6puaf`.

## Isolation rule

This package covers only the original REOS website. Do not use
`reos-ia-freeze-v1`, and do not copy, merge, modify, deploy or redirect any
Seven-Gateway code, configuration or history. The separate site
[https://reos-seven-gateway.vercel.app](https://reos-seven-gateway.vercel.app)
is outside scope.

## Current readiness

- GitHub contains the complete production change at `5960441`; the branch may
  be ahead only by the documentation-only commit containing this package.
- The linked Vercel project is `reos-website`.
- Production and the stable alias are Ready.
- Local and production browser QA passed.
- The worktree was clean before this documentation package was created.
- Arabic remains visibly labelled as a working translation pending native-speaker review.
