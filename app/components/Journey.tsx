"use client";

import Link from "next/link";
import { useState } from "react";
import { type Stage } from "../data/journey";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { getDict, fill } from "../i18n/dictionary";
import { getStages, getTracks, getGroups, getRoutes } from "../i18n/content";

/* ------------------------------------------------------------------ *
 * HERO RIBBON
 * A single flowing path from land to living. Depth comes from scale and
 * opacity along the curve rather than from 3D assets, so it stays crisp
 * at any size and needs no external files.
 * ------------------------------------------------------------------ */

const W = 840;
const H = 470;

/**
 * Points along a steadily rising path. The ascent is the point: the journey
 * climbs from an empty plot at the lower left to an owned, occupied,
 * income-producing asset at the upper right.
 */
function nodePoints(stages: Stage[]) {
  return stages.map((stage, i) => {
    const t = i / (stages.length - 1);
    const x = 74 + t * (W - 148);
    const y = H - 96 - t * (H - 210) + Math.sin(t * Math.PI * 2.1) * 30;
    return { stage, x, y, t };
  });
}

function curvePath(pts: { x: number; y: number }[]) {
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${d} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");
}

export function JourneyRibbon({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const stages = getStages(locale);
  const pts = nodePoints(stages);
  const path = curvePath(pts);
  const [active, setActive] = useState<number | null>(null);
  const shown = active === null ? null : pts[active];

  return (
    <figure className="ribbon">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${d.home.h1} ${d.home.h1em}`}>
        <defs>
          <linearGradient id="ribbon-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity=".25" />
            <stop offset="45%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="ribbon-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity=".16" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Fill runs to the viewBox edges so its vertical sides fall outside
            the visible content rather than cutting a box into the page. */}
        <path
          d={`M 0 ${pts[0].y} L ${pts[0].x} ${pts[0].y} ${path.slice(path.indexOf("C") - 1)} L ${W} ${pts[pts.length - 1].y} L ${W} ${H} L 0 ${H} Z`}
          className="ribbon-fill"
          fill="url(#ribbon-body)"
        />
        <path d={path} className="ribbon-shadow" />
        <path d={path} className="ribbon-line" stroke="url(#ribbon-line)" />
        <path d={path} className="ribbon-pulse" />

        {pts.map(({ stage, x, y, t }, i) => (
          <g
            key={stage.id}
            className={`ribbon-node ${active === i ? "is-active" : ""}`}
            transform={`translate(${x} ${y})`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <circle r={13 - t * 1.5} className="node-halo" />
            <circle r={5.6 - t * 0.6} className="node-dot" />
            <text y={i % 2 === 0 ? -26 : 34} className="node-label">{stage.short}</text>
          </g>
        ))}
      </svg>

      <figcaption aria-live="polite">
        {shown
          ? <><b>{String(shown.stage.number).padStart(2, "0")} {shown.stage.name}</b><span>{shown.stage.summary}</span></>
          : <><b>{d.home.h1em}</b><span>{d.home.journeyCopy}</span></>}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 * PERSONA SELECTOR — "start from where you are"
 * ------------------------------------------------------------------ */

/** Featured plus the first core routes — the same list /intelligence/guides
 *  leads with, read from the single route source so the two pages cannot
 *  diverge. */
const PRIMARY = ["buying", "developing", "investing", "selling"];

function Tile({ slug, locale }: { slug: string; locale: Locale }) {
  const route = getRoutes(locale).find((r) => r.slug === slug)!;
  return (
    <Link href={localePath(locale, `/intelligence/guides/${route.slug}`)} className="persona-tile">
      <span className="tile-num">{String(route.order).padStart(2, "0")}</span>
      <b>{route.title}</b>
      <p>{route.sub}</p>
      <i>{route.ctaLabel} →</i>
    </Link>
  );
}

export function PersonaSelector({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const all = getRoutes(locale);
  const primary = all.filter((r) => PRIMARY.includes(r.slug));
  const secondary = all.filter((r) => !PRIMARY.includes(r.slug)).slice(0, 4);
  return (
    <>
      <div className="persona-select">
        {primary.map((r) => <Tile key={r.slug} slug={r.slug} locale={locale} />)}
      </div>

      {/* Desktop shows all eight at once; mobile collapses the professional
          routes so the first decision is reachable without a long scroll. */}
      <details className="persona-more" open={false} ref={(el) => {
        // Open by default on wide viewports, collapsed on narrow ones.
        if (el && !el.dataset.init) { el.dataset.init = "1"; el.open = window.innerWidth > 720; }
      }}>
        <summary>
          <b>{d.roles.professional}</b>
          <span>{fill(d.roles.more, { n: secondary.length })}</span>
        </summary>
        <div className="persona-select">
          {secondary.map((r) => <Tile key={r.slug} slug={r.slug} locale={locale} />)}
        </div>
      </details>
    </>
  );
}

/** Mobile-only quick pick, placed directly under the hero so the first
 *  personalised decision is one tap away rather than a screen down. */
export function PersonaQuickPick({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  return (
    <nav className="persona-quick" aria-label={d.journey.quickPick}>
      <b>{d.journey.quickPick}</b>
      <div>
        {PRIMARY.map((slug) => {
          const r = getRoutes(locale).find((x) => x.slug === slug)!;
          return <Link key={slug} href={localePath(locale, `/intelligence/guides/${slug}`)}>{r.ctaLabel.replace(/ journey$/i, "")}</Link>;
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * JOURNEY MAP — the lifecycle with concurrency made visible.
 * Stages that run at the same time are shown as such, because sequencing
 * them would teach a process that does not exist in off-plan development.
 * ------------------------------------------------------------------ */

export function JourneyMap({ compact = false, locale = DEFAULT_LOCALE }: { compact?: boolean; locale?: Locale }) {
  const d = getDict(locale);
  const stages = getStages(locale);
  const groups = getGroups(locale);
  const [active, setActive] = useState<Stage>(stages[0]);
  const parallel = active.runsWith.map((id) => stages.find((s) => s.id === id)).filter(Boolean) as Stage[];

  return (
    <div className={`journey-map ${compact ? "is-compact" : ""}`}>
      <p className="rail-cue" aria-hidden="true">
        <span>{fill(d.journey.swipeCue, { n: stages.length })}</span>
        <b>{String(active.number).padStart(2, "0")} / {stages.length}</b>
      </p>
      <ol className="map-rail-stages" aria-label={d.home.journeyTitle}>
        {stages.map((stage) => (
          <li key={stage.id}>
            <button
              type="button"
              className={`${active.id === stage.id ? "is-active" : ""} ${active.runsWith.includes(stage.id) ? "is-parallel" : ""}`}
              onClick={() => setActive(stage)}
              aria-pressed={active.id === stage.id}
            >
              <i>{String(stage.number).padStart(2, "0")}</i>
              <span>{stage.name}</span>
              <em>{getTracks(locale).find((t) => t.id === stage.track)?.label}</em>
            </button>
          </li>
        ))}
      </ol>

      <article className="map-stage-detail" aria-live="polite">
        <header>
          <span className="stage-eyebrow">{d.journey.stage} {String(active.number).padStart(2, "0")} · {getTracks(locale).find((t) => t.id === active.track)?.label}</span>
          <h3>{active.name}</h3>
          <p className="stage-summary">{active.summary}</p>
        </header>

        {parallel.length > 0 && (
          <p className="stage-parallel">
            <b>{d.journey.runsWith}</b>
            {parallel.map((s) => <span key={s.id}>{s.name}</span>)}
          </p>
        )}

        <div className="stage-cols">
          <div>
            <small>{d.journey.whatHappens}</small>
            <ul>{active.whatHappens.slice(0, compact ? 2 : 4).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <small>{d.journey.whoInvolved}</small>
            <div className="chip-row">{active.groupIds.map((id) => <span key={id}>{groups.find((g) => g.id === id)?.short}</span>)}</div>
            <small>{d.journey.documents}</small>
            <div className="chip-row">{active.documents.slice(0, 3).map((d) => <span key={d}>{d}</span>)}</div>
          </div>
        </div>

        <Link className="text-link" href={localePath(locale, `/property-journey/${active.id}`)}>{d.journey.openStage} <span>→</span></Link>
      </article>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * TRACK LEGEND — explains that the journey has concurrent lanes.
 * ------------------------------------------------------------------ */

export function TrackLegend({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <ul className="track-legend">
      {getTracks(locale).map((track) => (
        <li key={track.id} className={`track-${track.id.toLowerCase()}`}>
          <b>{track.label}</b>
          <span>{track.note}</span>
        </li>
      ))}
    </ul>
  );
}
