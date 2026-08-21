import Link from "next/link";
import { getProduct } from "../data/products";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { Page } from "./SiteShell";

export function ProductLoginView({ locale = DEFAULT_LOCALE, slug }: { locale?: Locale; slug: string }) {
  const product = getProduct(slug);
  if (!product) throw new Error(`Unknown REOS product: ${slug}`);
  const L = (path: string) => localePath(locale, path);

  return <Page className="product-login-page" locale={locale}>
    <section className="product-login-shell">
      <div className="product-login-context">
        <Link className="context-back-link" href={L("/platform#product-catalogue")}>← Back to REOS products</Link>
        <span className="eyebrow">REOS LICENSED PRODUCT {String(product.number).padStart(2, "0")}</span>
        <h1>{product.name}</h1>
        <p>{product.outcome}</p>
        <div className="platform-market-tags">{product.markets.map((market) => <span key={market}>{market}</span>)}</div>
        <dl>
          <div><dt>Product status</dt><dd>{product.availability}</dd></div>
          <div><dt>Access model</dt><dd>Organization licence · Product entitlement · Role-based user access</dd></div>
        </dl>
      </div>
      <div className="product-login-card">
        <small>PRODUCT ACCESS GATEWAY</small>
        <h2>Sign in to<br /><em>{product.name}</em></h2>
        <p>This gateway is reserved for organizations and users with an active licence for this REOS product.</p>
        <label>Work email<input type="email" placeholder="name@organization.com" autoComplete="email" /></label>
        <label>Password<input type="password" placeholder="Enter your password" autoComplete="current-password" /></label>
        <button type="button" disabled>Sign in with licensed account</button>
        <span className="product-login-notice">Product authentication and subscription entitlements are not connected in this website preview.</span>
        <div className="product-login-actions">
          <Link href={L("/demo")}>Request a product licence ↗</Link>
          <Link href={L("/platform")}>View all products</Link>
        </div>
      </div>
    </section>
  </Page>;
}
