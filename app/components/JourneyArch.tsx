/* ------------------------------------------------------------------ *
 * THE INNER-HERO ARCH — drawn, not photographed.
 *
 * `.inner-hero::after` frames a photograph on eleven other pages
 * (/ecosystem, /stakeholders, /intelligence, /intelligence/guides,
 * /intelligence/definitions-and-glossary, /lifecycle, /platform, /reos,
 * /admin and its /gaps twin, and the 404 page) via a shared CSS rule.
 * /property-journey is the one page where that photo is being replaced by
 * this SVG, so nothing here touches the shared rule — a new class carries
 * the visual, and a modifier on the /property-journey section only turns
 * the photo off there.
 *
 * The brief behind it: REOS as a connected system, drawn rather than
 * photographed so it recolours between themes, mirrors correctly in
 * Arabic, and costs nothing to load. A loose skyline of faceted towers,
 * joined at street level by thin bronze circuit traces with a few
 * quietly pulsing junctions — "the city as a connected graph", echoing
 * the language the assistant and homepage visuals already use, without
 * repeating either one exactly.
 *
 * No text, by the same reasoning as the other two visuals: anything
 * legible here would need translating, would mirror wrongly, and would
 * turn an atmospheric panel into an infographic that competes with the
 * headline beside it.
 * ------------------------------------------------------------------ */

type Tower = { x: number; base: number; top: number; w: number; facets: number };

/** Six towers, irregular heights and widths — a skyline, not a bar chart. */
const TOWERS: Tower[] = [
  { x: 12, base: 92, top: 46, w: 9, facets: 1 },
  { x: 27, base: 92, top: 22, w: 11, facets: 2 },
  { x: 44, base: 92, top: 8, w: 10, facets: 2 },
  { x: 60, base: 92, top: 34, w: 12, facets: 1 },
  { x: 76, base: 92, top: 16, w: 9, facets: 2 },
  { x: 90, base: 92, top: 52, w: 8, facets: 1 },
];

/** A faceted crystal tower: a centre ridge line splits the face, echoing
 *  the site's existing tower glyph without being a copy of it. */
function TowerShape({ t, i }: { t: Tower; i: number }) {
  const halfW = t.w / 2;
  return (
    <g className="ja-tower" style={{ "--i": i } as React.CSSProperties}>
      <path
        className="ja-tower-body"
        d={`M ${t.x - halfW} ${t.base} L ${t.x - halfW} ${t.top + 4} L ${t.x} ${t.top} L ${t.x + halfW} ${t.top + 4} L ${t.x + halfW} ${t.base} Z`}
      />
      {t.facets > 1 && <path className="ja-tower-ridge" d={`M ${t.x} ${t.top} L ${t.x} ${t.base}`} />}
      <circle className="ja-tower-tip" cx={t.x} cy={t.top} r="0.9" />
    </g>
  );
}

/** One fixed dip for every trace: the viewBox stops at y=100, so this has
 *  to leave enough clearance below it for a pulsing junction dot (radius up
 *  to 1.5) without touching the edge — an earlier version varied the dip
 *  per segment and guessed the junction position separately, so the two
 *  disagreed and the dots clipped against the bottom of the frame. */
const TRACE_DIP = 4;

/** Circuit traces along the ground, joining each tower's base to the next —
 *  right angles rather than curves, so it reads as a trace, not a road. */
function groundTrace(a: Tower, b: Tower) {
  const midX = (a.x + b.x) / 2;
  const y = a.base + TRACE_DIP;
  return `M ${a.x} ${a.base} L ${a.x} ${y} L ${midX} ${y} L ${midX} ${b.base + TRACE_DIP} L ${b.x} ${b.base + TRACE_DIP} L ${b.x} ${b.base}`;
}

/** One junction per trace, sitting exactly on it — the midpoint of the
 *  horizontal dip segment the trace already draws. */
const JUNCTIONS = TOWERS.slice(0, -1).map((t, i) => ({
  x: (t.x + TOWERS[i + 1].x) / 2,
  y: t.base + TRACE_DIP,
}));

/** Decorative, like the photograph it replaces: a CSS background-image
 *  never enters the accessibility tree, so neither does this. */
export function JourneyArchVisual() {
  return (
    <figure className="inner-hero-arch" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="ja-glow">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ja-tower-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold-soft)" stopOpacity=".16" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity=".05" />
          </linearGradient>
        </defs>

        <circle className="ja-glow" cx="50" cy="55" r="46" fill="url(#ja-glow)" />

        {/* ground traces, revealed left to right on mount */}
        <g className="ja-traces" aria-hidden="true">
          {TOWERS.slice(0, -1).map((t, i) => (
            <path key={i} d={groundTrace(t, TOWERS[i + 1])} pathLength="100" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </g>

        {/* soft pulse at each junction */}
        <g aria-hidden="true">
          {JUNCTIONS.map((j, i) => (
            <circle key={i} className="ja-junction" cx={j.x} cy={j.y} r="1.1" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </g>

        {/* the skyline itself */}
        <g fill="url(#ja-tower-fill)">
          {TOWERS.map((t, i) => <TowerShape key={i} t={t} i={i} />)}
        </g>
      </svg>
    </figure>
  );
}
