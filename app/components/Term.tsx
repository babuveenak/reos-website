import Link from "next/link";
import { findTerm, terms } from "../data/glossary";

/**
 * Inline first-use explanation.
 *
 * Rendered as a <button> inside a <details>-free popover pattern would need
 * client JS; instead this uses the native title-plus-link approach so it works
 * without hydration, stays keyboard reachable, and degrades to a plain link to
 * the glossary. The definition is also exposed to assistive tech through
 * aria-describedby rather than title alone, which screen readers treat
 * inconsistently.
 */
/**
 * Annotates the first occurrence of each glossary term in a plain string.
 * Content stays as data; the linking happens at render, so adding a term to
 * the glossary lights it up everywhere without editing copy.
 */
export function withTerms(text: string) {
  const used = new Set<string>();
  const pattern = new RegExp(
    "\\b(" + terms
      .flatMap((t) => [t.term, ...(t.aka ?? [])])
      .sort((a, b) => b.length - a.length)
      .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|") + ")\\b",
    "gi",
  );
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const found = findTerm(m[0]);
    if (!found || used.has(found.id)) continue;
    used.add(found.id);
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push(<Term key={found.id + m.index} of={found.term}>{m[0]}</Term>);
    last = m.index! + m[0].length;
  }
  if (!out.length) return text;
  out.push(text.slice(last));
  return out;
}

export function Term({ children, of }: { children?: React.ReactNode; of: string }) {
  const term = findTerm(of);
  if (!term) return <>{children ?? of}</>;
  const describedById = `gloss-${term.id}`;

  return (
    <span className="term-wrap">
      <Link className="term" href={`/glossary#${term.id}`} aria-describedby={describedById}>
        {children ?? term.term}
      </Link>
      <span role="tooltip" id={describedById} className="term-tip">
        <b>{term.term}</b>
        {term.short}
        {term.jurisdictional && <i>Differs by emirate — confirm for your location.</i>}
      </span>
    </span>
  );
}
