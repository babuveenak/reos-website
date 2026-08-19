import Link from "next/link";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { getDict, fill } from "../i18n/dictionary";
import { getStages } from "../i18n/content";
import { stages as canonicalStages } from "../data/journey";
import { groups } from "../data/ecosystem";
import { StatusTag } from "./SiteShell";

/* ------------------------------------------------------------------ *
 * JOURNEY LANDING HERO — "Option C"
 *
 * A glowing route from land to living, with the seven moments an
 * executive recognises placed along it.
 *
 * THE SEVEN MARKERS ARE A PROJECTION, NOT A LIST. Each one resolves to
 * a stage id in data/journey.ts — the canonical twelve — so this page
 * cannot drift into being a competing lifecycle. The marker carries an
 * editorial label for the boardroom ("Title Deed") and, beneath it, the
 * canonical stage it belongs to, linked. Change journey.ts and this
 * follows; there is nothing here to keep in sync by hand.
 *
 * Order is not sequence. Construction and Sales genuinely run at the
 * same time in UAE off-plan — escrow exists because buyers pay while
 * the building goes up — so the route SPLITS into two parallel strands
 * there and rejoins. A single unbroken line would teach a queue that
 * does not exist.
 *
 * No JS: the reveal, the pulse and the travelling packets are all CSS,
 * matching the ribbonFlow idiom already in globals.css. Everything is
 * disabled under prefers-reduced-motion.
 * ------------------------------------------------------------------ */

/* THE SEVEN MARKERS ARE THE SEVEN CANONICAL STAGES, 1:1.
 *
 * Until 2026-08-19 this was a projection: seven editorial labels picked out
 * of a twelve-stage canon, so the hero could show a manageable number of
 * stops without becoming a thirteenth stage list. Now that journey.ts's own
 * canon IS seven stages, there is nothing left to project — every marker
 * below is one real stage, keyed by its own id. The "projection, not a
 * list" caution above is kept only because the next reader will otherwise
 * wonder why marker keys and stage ids look identical: they are, on
 * purpose, and there is no shorter list this is secretly standing in for. */
type MarkerKey = "land" | "design" | "approvals" | "build" | "sales" | "living" | "growth";

/** Marker → canonical stage id, plus its coordinates on the route (%). */
const MARKERS: { key: MarkerKey; stageId: string; x: number; y: number; side: "start" | "end" }[] = [
  { key: "land",      stageId: "land-vision",               x:  7, y: 88, side: "end" },
  { key: "design",     stageId: "planning-design",           x: 20, y: 74, side: "end" },
  { key: "approvals",  stageId: "authorities-approvals",     x: 24, y: 50, side: "end" },
  { key: "build",      stageId: "construction-delivery",     x: 52, y: 70, side: "end" },
  { key: "sales",      stageId: "sales-transfer",            x: 38, y: 39, side: "end" },
  { key: "living",     stageId: "living-operations",       x: 76, y: 42, side: "start" },
  { key: "growth",     stageId: "asset-growth-intelligence", x: 93, y: 15, side: "start" },
];

/** The two markers that run together, drawn as parallel strands. */
const CONCURRENT: MarkerKey[] = ["build", "sales"];

/* Route geometry, in the same 0–100 space as the markers so the line and the
   pods cannot disagree. Three stages lead in, the route parts at x=40 into
   two strands that bow apart and rejoin at x=62 — a narrow lens, not a
   detour — because Construction & Delivery and Sales & Transfer genuinely
   run together, then two stages lead out to close the journey. */
const SPINE_IN = "M 7 88 C 12 84, 16 78, 20 74 C 24 69, 28 63, 30 60 C 32 59, 34 58, 36 58";
const BRANCH_UPPER = "M 36 58 C 38 48, 38 43, 38 39 C 40 28, 58 22, 62 59";
const BRANCH_LOWER = "M 36 58 C 41 62, 47 68, 52 70 C 56 71, 59 66, 62 59";
const SPINE_OUT = "M 62 59 C 68 58, 72 50, 76 42 C 82 32, 88 22, 93 15";

/** Join a segment onto the previous one: its moveto becomes a lineto to the
 *  same point, which is a no-op geometrically and keeps the path valid. */
const asLine = (d: string) => d.replace(/^M/, "L");

function Skyline() {
  /* Depth without an image asset: a silhouette that reads as a city at the
     horizon. Heights are deliberately irregular. */
  const towers = [
    [1, 9, 3], [4.5, 14, 2], [7, 7, 3.4], [11, 12, 2.2], [13.6, 11, 3], [17, 6, 2.6],
    [20, 15, 2.4], [23, 13, 3.2], [26.6, 8, 2], [29, 11, 2.8], [32.4, 10, 2.2],
    [35, 17, 2.6], [38, 12, 3], [41.6, 7, 2.4], [44.5, 13, 2.8], [47.8, 9, 2.2],
    [50.5, 10, 3.2], [54, 6, 2.4], [57, 14, 2.6], [60, 11, 3], [63.5, 8, 2.2],
    [66, 11, 2.8], [69.3, 13, 2.4], [72.2, 16, 3], [75.6, 9, 2.2], [78.3, 10, 2.8],
    [81.5, 7, 2.4], [84.3, 12, 3.2], [87.8, 11, 2.2], [90.5, 14, 2.8], [93.8, 8, 2.4],
    [96.5, 11, 3],
  ];
  return (
    <g className="jl-skyline" aria-hidden="true">
      {towers.map(([x, h, w], i) => (
        <rect key={i} x={x} y={100 - h} width={w} height={h} />
      ))}
    </g>
  );
}

/* The flow visual. Lives in the homepage hero, where it replaces the earlier
   stage ribbon. Split out from the hero section itself so the homepage can
   compose it into its own existing two-column hero rather than bringing a
   second hero shell with it. */
export function JourneyFlow({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing;
  const byId = new Map(getStages(locale).map((s) => [s.id, s]));
  return (
      <figure className="jl-flow">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img" aria-label={t.heroAlt}>
          <defs>
            <linearGradient id="jl-route" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity=".2" />
              <stop offset="42%" stopColor="var(--gold)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--gold-soft)" stopOpacity=".85" />
            </linearGradient>
            <radialGradient id="jl-halo">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity=".3" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <Skyline />

          {/* soft glow behind the route */}
          <g className="jl-route-glow" aria-hidden="true">
            {[SPINE_IN, BRANCH_LOWER, BRANCH_UPPER, SPINE_OUT].map((p, i) => (
              <path key={i} d={p} pathLength="100" />
            ))}
          </g>

          {/* the route itself, revealed left to right */}
          <g className="jl-route" aria-hidden="true">
            <path className="jl-seg jl-seg-1" d={SPINE_IN} pathLength="100" />
            <path className="jl-seg jl-seg-2 jl-branch" d={BRANCH_LOWER} pathLength="100" />
            <path className="jl-seg jl-seg-2 jl-branch" d={BRANCH_UPPER} pathLength="100" />
            <path className="jl-seg jl-seg-3" d={SPINE_OUT} pathLength="100" />
          </g>

          {/* data packets: short dashes travelling the route */}
          <g className="jl-packets" aria-hidden="true">
            <path className="jl-packet" d={`${SPINE_IN} ${asLine(BRANCH_UPPER)} ${asLine(SPINE_OUT)}`} pathLength="100" />
            <path className="jl-packet jl-packet-2" d={`${SPINE_IN} ${asLine(BRANCH_LOWER)} ${asLine(SPINE_OUT)}`} pathLength="100" />
          </g>

          {/* halo behind each node */}
          <g aria-hidden="true">
            {MARKERS.map((m) => (
              <circle key={m.key} className="jl-halo" cx={m.x} cy={m.y} r="9" fill="url(#jl-halo)" />
            ))}
          </g>
        </svg>

        {/* Markers are HTML, not SVG, so they mirror in Arabic and stay
            selectable, focusable and translatable. */}
        <ol className="jl-markers">
          {MARKERS.map((m, i) => {
            const stage = byId.get(m.stageId);
            const copy = t.markers[m.key];
            return (
              <li
                key={m.key}
                className={`jl-marker jl-marker-${m.side}${CONCURRENT.includes(m.key) ? " is-concurrent" : ""}`}
                style={{ "--x": `${m.x}%`, "--y": `${m.y}%`, "--i": i } as React.CSSProperties}
              >
                <Link href={localePath(locale, `/property-journey/${m.stageId}`)}>
                  <span className="jl-badge" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="jl-marker-body">
                    <b>{copy.title}</b>
                    {stage && <small className="jl-marker-canon">{stage.name}</small>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* Concurrency, stated rather than implied. */}
        <p className="jl-concurrent-note" aria-hidden="true">
          <i />{t.concurrent}
        </p>

        <p className="jl-core">
          <b>{t.orchestration}</b>
          <small>{t.orchestrationSub}</small>
        </p>
      </figure>
  );
}

/** Scope figures, labelled. Separate from the flow so the hero can place it. */
export function JourneyStatsBar({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing;
  /* Derived, never eyeballed — the honest counts that sit beneath the
     aspirational scope figures. */
  const realCounts = {
    stages: canonicalStages.length,
    groups: groups.length,
    docs: canonicalStages.reduce((n, s) => n + s.documents.length, 0),
  };
  const statItems = [
    t.stats.items.groups, t.stats.items.processes,
    t.stats.items.documents, t.stats.items.ecosystem,
  ];
  return (
      <aside className="jl-stats" aria-label={t.stats.scopeLabel}>
        <header className="jl-stats-head">
          <span className="jl-stats-label">{t.stats.scopeLabel}</span>
          <StatusTag status="To Be Validated" locale={locale} />
        </header>
        <dl>
          {statItems.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd><b>{s.label}</b><small>{s.note}</small></dd>
            </div>
          ))}
        </dl>
        <p className="jl-stats-note">{fill(t.stats.scopeNote, realCounts)}</p>
      </aside>
  );
}

/** The seven moments in full, below the hero where there is room for the
 *  copy the route itself cannot carry without becoming an infographic. */
export function JourneyMoments({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing;
  const byId = new Map(getStages(locale).map((s) => [s.id, s]));
  return (
    <ol className="jl-moments">
      {MARKERS.map((m, i) => {
        const stage = byId.get(m.stageId);
        const copy = t.markers[m.key];
        return (
          <li key={m.key} style={{ "--i": i } as React.CSSProperties}>
            <Link href={localePath(locale, `/property-journey/${m.stageId}`)}>
              <span className="jl-badge" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <b>{copy.title}</b>
              <p>{copy.copy}</p>
              {stage && (
                <small>{fill(t.canonical, { n: stage.number })} · {stage.name}</small>
              )}
              {CONCURRENT.includes(m.key) && (
                <em className="jl-moment-concurrent">{t.concurrent}</em>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
