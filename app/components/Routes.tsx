"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { getOrientation, getRouteUi, getRoutes } from "../i18n/content";
import type { Route } from "../data/routes";

/**
 * The self-selection grid.
 *
 * Three tiers by frequency: two featured routes with their journey visible,
 * five core routes, and five specialist routes behind a collapsible band.
 * Route numbers are display order — the taxonomy group is never rendered.
 */

/** Journey steps as connected chips. Featured routes only. */
function JourneyStrip({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  // Visible by default. JS opts into the animation, so if the observer never
  // fires — or JS fails entirely — the steps are still readable rather than
  // permanently transparent.
  const [phase, setPhase] = useState<"static" | "armed" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No motion preference: reveal on the next frame rather than during the
    // effect, so React is not asked to re-render synchronously.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = requestAnimationFrame(() => setPhase("armed"));
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setPhase("shown"); io.disconnect(); } },
      { threshold: 0.2 },
    );
    io.observe(el);
    // Backstop: reveal regardless after a short delay, so a failed or
    // never-firing observer can never leave the steps permanently invisible.
    const failsafe = setTimeout(() => { setPhase("shown"); io.disconnect(); }, 2500);
    return () => { cancelAnimationFrame(id); clearTimeout(failsafe); io.disconnect(); };
  }, []);

  return (
    <ol ref={ref} className={`journey-strip ${phase === "armed" ? "is-armed" : ""} ${phase === "shown" ? "is-shown" : ""}`} aria-label="Journey steps">
      {steps.map((step, i) => (
        <li key={step} style={{ ["--i" as string]: i }}>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function RouteCard({ route, locale, featured = false }: { route: Route; locale: Locale; featured?: boolean }) {
  return (
    <Link
      href={localePath(locale, `/intelligence/guides/${route.slug}`)}
      className={`route-card ${featured ? "is-featured" : ""}`}
    >
      <span className="route-num">{String(route.order).padStart(2, "0")}</span>
      <h3>{route.title}</h3>
      <p>{route.sub}</p>
      {featured && <JourneyStrip steps={route.journey} />}
      <span className="route-cta">{route.ctaLabel} <i aria-hidden="true">→</i></span>
    </Link>
  );
}

export function RouteGrid({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const all = getRoutes(locale);
  const ui = getRouteUi(locale);
  const orient = getOrientation(locale);
  const featured = all.filter((r) => r.tier === 1);
  const core = all.filter((r) => r.tier === 2);
  const specialist = all.filter((r) => r.tier === 3);

  return (
    <div className="route-layout">
      {/* Orientation is a helper, not a stakeholder group — so it is never
          numbered and never sits inside the grid. */}
      <aside className="orientation-band">
        <div>
          <b>{orient.title}</b>
          <p>{orient.sub}</p>
        </div>
        <Link className="route-cta" href={localePath(locale, `/intelligence/guides/${orient.slug}`)}>
          {orient.ctaLabel} <i aria-hidden="true">→</i>
        </Link>
      </aside>

      <div className="route-featured">
        {featured.map((r) => <RouteCard key={r.slug} route={r} locale={locale} featured />)}
      </div>

      <p className="tier-rule"><b>{ui.coreLabel}</b><i aria-hidden="true" /></p>
      <div className="route-grid">
        {core.map((r) => <RouteCard key={r.slug} route={r} locale={locale} />)}
      </div>

      <details className="route-specialist">
        <summary>
          <b>{ui.specialistLabel}</b>
          <span>· {ui.more}</span>
        </summary>
        <div className="route-grid">
          {specialist.map((r) => <RouteCard key={r.slug} route={r} locale={locale} />)}
        </div>
      </details>
    </div>
  );
}
