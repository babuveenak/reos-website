import Link from "next/link";
import { HOW_REOS_WORKS, REOS_VALUE_PROPOSITION, productMaturityDefinitions, productsForContext } from "../data/governance";
import type { ProductMaturity, ReosProduct } from "../data/products";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { OperatingModelExplorer } from "./OperatingModelExplorer";

const copy = {
  en: {
    how: "HOW REOS WORKS", howTitle: "From understanding to governed execution.",
    bridge: "EDUCATE → ADOPT → EXECUTE", outcome: "BUSINESS OUTCOME", served: "WHO THIS SERVES",
    product: "RELEVANT REOS PRODUCT", next: "PRACTICAL NEXT ACTION", suite: "REOS product suite",
    explore: "Explore the Platform", maturity: "Product maturity", evidence: "Evidence status is shown separately from product maturity.",
  },
  ar: {
    how: "كيف تعمل REOS", howTitle: "من الفهم إلى التنفيذ المنضبط.",
    bridge: "التثقيف ← التبنّي ← التنفيذ", outcome: "النتيجة العملية", served: "لمن صُممت هذه الصفحة",
    product: "منتج REOS ذو الصلة", next: "الخطوة العملية التالية", suite: "مجموعة منتجات REOS",
    explore: "استكشف المنصة", maturity: "مرحلة نضج المنتج", evidence: "تُعرض حالة الأدلة بشكل منفصل عن نضج المنتج.",
  },
} as const;

export function ProductMaturityBadge({ maturity }: { maturity: ProductMaturity }) {
  return <span className={`product-maturity maturity-${maturity.toLowerCase().replaceAll(" ", "-")}`}>{maturity}</span>;
}

export function HowReosWorks({ locale = DEFAULT_LOCALE, compact = false, architecture = false }: { locale?: Locale; compact?: boolean; architecture?: boolean }) {
  const t = copy[locale];
  return <section className={`governance-how${compact ? " is-compact" : ""}${architecture ? " has-architecture" : ""}`} aria-label={t.how}>
    <div className="governance-how-intro">
      <span className="eyebrow">{t.how}</span>
      <h2>{t.howTitle}</h2>
      <p>{REOS_VALUE_PROPOSITION}</p>
      <small>{t.bridge}</small>
    </div>
    <ol className="governance-how-steps">
      {HOW_REOS_WORKS.map((step) => <li key={step.name}><span>{step.number}</span><div><b>{step.name}</b><p>{step.copy}</p></div></li>)}
    </ol>
    {architecture ? <OperatingModelExplorer /> : null}
  </section>;
}

type RouteGovernanceProps = {
  locale?: Locale;
  businessOutcome: string;
  audience: string;
  nextAction: string;
  stageIds?: string[];
  stakeholderIds?: string[];
  products?: ReosProduct[];
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function RouteGovernance({
  locale = DEFAULT_LOCALE, businessOutcome, audience, nextAction, stageIds, stakeholderIds,
  products, primaryLabel, primaryHref, secondaryLabel, secondaryHref,
}: RouteGovernanceProps) {
  const t = copy[locale];
  const relevant = products ?? productsForContext({ stageIds, stakeholderIds });
  const first = relevant[0];
  const defaultHref = first ? `/platform#${first.slug}` : "/platform";
  return <section className="route-governance" aria-label="REOS route outcome and next action">
    <div className="route-governance-grid">
      <article><small>{t.outcome}</small><p>{businessOutcome}</p></article>
      <article><small>{t.served}</small><p>{audience}</p></article>
      <article className="route-governance-products"><small>{t.product}</small><div>{relevant.map((product) => <span key={product.slug}><b>{product.name}</b><ProductMaturityBadge maturity={product.maturity} /></span>)}</div></article>
      <article><small>{t.next}</small><p>{nextAction}</p></article>
    </div>
    <div className="route-governance-actions">
      <Link className="button gold" href={localePath(locale, primaryHref ?? defaultHref)}>{primaryLabel ?? t.explore} <span>↗</span></Link>
      {secondaryHref && secondaryLabel && <Link className="button ghost" href={localePath(locale, secondaryHref)}>{secondaryLabel}</Link>}
      <small>{t.evidence}</small>
    </div>
  </section>;
}

export function ProductMaturityLegend() {
  return <details className="maturity-legend"><summary>How product maturity is defined <span>+</span></summary><div>{productMaturityDefinitions.map(([name, description]) => <p key={name}><ProductMaturityBadge maturity={name} /><span>{description}</span></p>)}</div></details>;
}

export function IntelligenceGovernance() {
  const chain = [
    ["01", "Official source", "Authority or regulated provider publication."],
    ["02", "Scoped claim", "The exact statement supported by that source."],
    ["03", "Jurisdiction", "Emirate, zone, regime and applicable conditions."],
    ["04", "Review state", "Validation status and last verification when known."],
    ["05", "Guidance or rule", "A cited answer or controlled workflow rule—not a replacement for authority."],
  ];
  return <section className="intelligence-governance">
    <div><span className="eyebrow">GOVERNED EVIDENCE LAYER</span><h2>Every useful answer should show<br /><em>why it can be trusted.</em></h2><p>REOS connects knowledge to its source, scope and review state before it becomes guidance or a product workflow rule.</p></div>
    <ol>{chain.map(([number, title, text]) => <li key={number}><span>{number}</span><div><b>{title}</b><p>{text}</p></div></li>)}</ol>
  </section>;
}

export function AssistantTrustContract() {
  return <section className="assistant-trust-contract">
    <div><span className="eyebrow">ASSISTANT TRUST CONTRACT</span><h2>Attributed answers.<br /><em>Visible limits.</em></h2><p>The current assistant is an illustrative preview. Its answer UI is designed for governed retrieval, not unsupported certainty.</p></div>
    <ul>
      <li><b>Sources attached</b><span>Authority, title and official link when available.</span></li>
      <li><b>Scope exposed</b><span>Jurisdiction, conditions and unresolved facts remain visible.</span></li>
      <li><b>Confidence labelled</b><span>Evidence state and answer confidence are not hidden.</span></li>
      <li><b>Refusal by design</b><span>Insufficient evidence, unresolved jurisdiction or regulated advice triggers a safe boundary.</span></li>
    </ul>
  </section>;
}
