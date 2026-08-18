import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";

/* ------------------------------------------------------------------ *
 * THE ASSISTANT HERO VISUAL
 *
 * What it has to say in three seconds: a question goes in, REOS places
 * it in the property journey, pulls the connected knowledge around it,
 * and hands back a guided answer. Not "a chatbot" — an intelligence
 * layer over a lifecycle.
 *
 * Drawn rather than photographed, and inline rather than fetched:
 *   - it re-colours itself from the theme tokens, so the warm-ivory and
 *     the dark readings come from one source and cannot drift apart;
 *   - it mirrors in Arabic, which a raster cannot;
 *   - the twelve nodes are the site's own vocabulary, not an
 *     illustrator's approximation of it;
 *   - nothing to download, and it stays crisp at any density.
 *
 * Deliberately text-free. Every label would need translating, would
 * mirror wrongly, and would turn a calm visual into an infographic. The
 * figure carries one accessible description instead.
 * ------------------------------------------------------------------ */

/** Core sits right of centre, so the left of the frame stays quiet for the copy. */
const CORE = { x: 63, y: 40 };

/**
 * The knowledge graph: twelve nodes drawn from the lifecycle and the
 * ecosystem this site already models, arranged in two arcs around the core.
 * `g` selects the glyph; nothing here renders as text.
 */
const NODES: { x: number; y: number; g: Glyph; r: number }[] = [
  { x: 34, y: 20, g: "parcel",    r: 3.4 },
  { x: 47, y: 11, g: "masterplan", r: 3.1 },
  { x: 62, y: 8,  g: "tower",     r: 3.6 },
  { x: 77, y: 12, g: "coin",      r: 3.1 },
  { x: 88, y: 22, g: "tag",       r: 3.4 },
  { x: 93, y: 37, g: "deed",      r: 3.1 },
  { x: 90, y: 53, g: "key",       r: 3.4 },
  { x: 81, y: 66, g: "community", r: 3.1 },
  { x: 67, y: 72, g: "growth",    r: 3.6 },
  { x: 52, y: 69, g: "shield",    r: 3.1 },
  { x: 39, y: 60, g: "page",      r: 3.4 },
  { x: 31, y: 45, g: "people",    r: 3.1 },
];

type Glyph =
  | "parcel" | "masterplan" | "tower" | "coin" | "tag" | "deed"
  | "key" | "community" | "growth" | "shield" | "page" | "people";

/** Tiny geometric marks — abstract enough to stay elegant at 7px across. */
function GlyphMark({ g, x, y }: { g: Glyph; x: number; y: number }) {
  const t = `translate(${x} ${y}) scale(0.085)`;
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<Glyph, React.ReactNode> = {
    parcel:     <path d="M-18-12 18-18 18 12-18 18Z" {...common} />,
    masterplan: <><path d="M-18-18H18V18H-18Z" {...common} /><path d="M0-18V18M-18 0H18" {...common} /></>,
    tower:      <><path d="M-14 18V-8l14-10 14 10v26" {...common} /><path d="M-6 18V4h12v14" {...common} /></>,
    coin:       <><circle r="16" {...common} /><path d="M0-8v16M-5-3h10" {...common} /></>,
    tag:        <><path d="M-16-16h16l16 16-16 16-16-16Z" {...common} /><circle cx="-6" cy="-6" r="3" fill="currentColor" /></>,
    deed:       <><path d="M-13-18h20l8 8v28h-28Z" {...common} /><path d="M-6 0h14M-6 8h14" {...common} /></>,
    key:        <><circle cx="-8" cy="0" r="9" {...common} /><path d="M1 0h19M14 0v8" {...common} /></>,
    community:  <><path d="M-18 18V-2l10-8 10 8v20" {...common} /><path d="M2 18V4l8-6 8 6v14" {...common} /></>,
    growth:     <><path d="M-16 12 -4 0 4 8 16-12" {...common} /><path d="M6-12h10v10" {...common} /></>,
    shield:     <path d="M0-18 16-11v12C16 12 0 18 0 18S-16 12-16 1v-12Z" {...common} />,
    page:       <><path d="M-12-18h24v36h-24Z" {...common} /><path d="M-5-8h10M-5 0h10M-5 8h6" {...common} /></>,
    people:     <><circle cx="-8" cy="-6" r="6" {...common} /><circle cx="9" cy="-3" r="5" {...common} /><path d="M-18 16c2-8 16-8 18 0M2 16c1-6 12-7 15-1" {...common} /></>,
  };
  return <g transform={t}>{shapes[g]}</g>;
}

const spoke = (n: { x: number; y: number }) => `M ${CORE.x} ${CORE.y} L ${n.x} ${n.y}`;

/* The question arrives from the quiet side and reaches the core; the answer
   leaves it. Two curves, so the story reads even when the motion is off. */
const QUESTION_IN = "M 2 52 C 16 50, 24 46, 34 44 C 44 42, 52 41, 58 40";
const ANSWER_OUT = "M 68 40 C 78 40, 84 44, 88 50";

export function AssistantIntelligence({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const a = getDict(locale).assistant;
  return (
    <figure className="ai-visual">
      <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" role="img" aria-label={a.heroVisualAlt}>
        <defs>
          <radialGradient id="ai-core-fill">
            <stop offset="0%" stopColor="var(--gold-soft)" stopOpacity=".9" />
            <stop offset="55%" stopColor="var(--gold)" stopOpacity=".45" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ai-core-halo">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity=".3" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ai-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0" />
            <stop offset="60%" stopColor="var(--gold)" stopOpacity=".9" />
            <stop offset="100%" stopColor="var(--gold-soft)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* a city at the horizon, kept far back */}
        <g className="ai-skyline" aria-hidden="true">
          {[[30, 5], [35, 8], [39.5, 4], [44, 10], [49, 6], [54, 12], [59, 7],
            [64, 9], [69, 5], [74, 11], [79, 6], [84, 8], [89, 5], [94, 9]].map(([x, h], i) => (
            <rect key={i} x={x} y={80 - h} width={i % 3 === 0 ? 4 : 2.8} height={h} />
          ))}
        </g>

        {/* spokes first, so nodes and core sit above them */}
        <g className="ai-spokes" aria-hidden="true">
          {NODES.map((n, i) => (
            <path key={i} d={spoke(n)} pathLength="100" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </g>

        {/* neighbour arcs: without these the spokes alone read as a sunburst
            rather than a graph whose areas of knowledge relate to each other. */}
        <g className="ai-web" aria-hidden="true">
          {NODES.map((n, i) => {
            const m = NODES[(i + 1) % NODES.length];
            const cx = (n.x + m.x) / 2 + (CORE.x - (n.x + m.x) / 2) * 0.16;
            const cy = (n.y + m.y) / 2 + (CORE.y - (n.y + m.y) / 2) * 0.16;
            return <path key={i} d={`M ${n.x} ${n.y} Q ${cx} ${cy} ${m.x} ${m.y}`} pathLength="100"
                         style={{ "--i": i } as React.CSSProperties} />;
          })}
        </g>

        {/* the question entering, and the answer leaving */}
        <g aria-hidden="true">
          <path className="ai-flow-line" d={QUESTION_IN} pathLength="100" />
          <path className="ai-flow-line ai-flow-out" d={ANSWER_OUT} pathLength="100" />
          <path className="ai-pulse-in" d={QUESTION_IN} pathLength="100" />
          <path className="ai-pulse-out" d={ANSWER_OUT} pathLength="100" />
        </g>

        {/* the core */}
        <g aria-hidden="true">
          <circle className="ai-core-halo" cx={CORE.x} cy={CORE.y} r="22" fill="url(#ai-core-halo)" />
          <circle className="ai-core-ring ai-core-ring-1" cx={CORE.x} cy={CORE.y} r="11.5" />
          <circle className="ai-core-ring ai-core-ring-2" cx={CORE.x} cy={CORE.y} r="8" />
          <circle className="ai-core-disc" cx={CORE.x} cy={CORE.y} r="5.4" />
          <circle className="ai-core" cx={CORE.x} cy={CORE.y} r="6.2" fill="url(#ai-core-fill)" />
          <circle className="ai-core-seed" cx={CORE.x} cy={CORE.y} r="1.5" />
        </g>

        {/* the twelve, each a lifecycle or ecosystem idea */}
        <g className="ai-nodes" aria-hidden="true">
          {NODES.map((n, i) => (
            <g key={i} className="ai-node" style={{ "--i": i } as React.CSSProperties}>
              <circle className="ai-node-disc" cx={n.x} cy={n.y} r={n.r} />
              <g className="ai-node-glyph"><GlyphMark g={n.g} x={n.x} y={n.y} /></g>
            </g>
          ))}
        </g>
      </svg>
    </figure>
  );
}
