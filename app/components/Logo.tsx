/**
 * REOS mark — a Dubai skyline that builds itself.
 *
 * The animation is the point of the brand: each tower rises from the ground
 * in sequence, the way a project is actually delivered, finishing with the
 * spire topping out. It is a construction, not a zoom or a pan.
 *
 * Pure SVG and CSS so it costs no JavaScript, stays crisp at any size, and
 * inherits the theme through currentColor. Under prefers-reduced-motion the
 * skyline is simply present, fully built, with no motion at all.
 */
export function Logo() {
  // Left-to-right: low-rise, mid-rise, the tower, then falling away again.
  const towers = [
    { x: 2, w: 5.5, top: 27 },
    { x: 8.5, w: 4.5, top: 21 },
    { x: 14, w: 5, top: 29 },
    { x: 34, w: 4.5, top: 23 },
    { x: 40, w: 5.5, top: 28 },
    { x: 46.5, w: 5, top: 31.5 },
  ];

  return (
    <svg className="logo-mark" viewBox="0 0 54 44" role="img" aria-label="REOS">
      <title>REOS</title>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>

      <g fill="url(#logo-grad)">
        {towers.map((t, i) => (
          <rect
            key={t.x}
            className="logo-tower"
            style={{ ["--i" as string]: i < 3 ? i : i + 1 }}
            x={t.x}
            y={t.top}
            width={t.w}
            height={40 - t.top}
          />
        ))}

        {/* The tower: stepped setbacks tapering to a spire. */}
        <polygon
          className="logo-tower logo-burj"
          style={{ ["--i" as string]: 3 }}
          points="21,40 21,27 22.6,27 22.6,17 24.2,17 24.2,9 25.6,9 26.5,1.5 27.4,9 28.8,9 28.8,17 30.4,17 30.4,27 32,27 32,40"
        />
      </g>

      {/* Topping out: a single glint at the spire once the skyline is up. */}
      <circle className="logo-glint" cx="26.5" cy="2.5" r="1.6" fill="currentColor" />

      {/* Ground line, drawn first in reading order but painted last. */}
      <rect className="logo-ground" x="0" y="40" width="54" height="1" fill="currentColor" opacity=".35" />
    </svg>
  );
}
