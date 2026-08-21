import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { PlatformProductMap } from "../components/PlatformProductMap";
import { Page, SectionIntro } from "../components/SiteShell";
import { products } from "../data/products";

export const metadata: Metadata = {
  title: "Licensed Digital Products for the Property Ecosystem | REOS Platform",
  description: "Explore REOS digital products for developers, authorities, agencies, owners and residents, beginning with Title Deed Automation and NOC Automation.",
};

const stakeholderGroups = [
  "Landowners & Investors", "Developers", "Consultants & Designers", "Authorities & Regulators",
  "Utility Providers", "Contractors", "Suppliers & Vendors", "Brokers & Agencies",
  "Banks & Financial Institutions", "Property Owners", "Residents & Tenants", "Facility & Community Operators",
];

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const productAccess = products.map((product) => ({
    ...product,
    accessHref: L(`/platform/products/${product.slug}/login`),
  }));

  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo platform-products-hero">
      <div className="platform-products-copy">
        <span className="eyebrow">REOS PRODUCT PLATFORM</span>
        <h1>Digital products<br /><em>for the property ecosystem.</em></h1>
        <p>Learn how UAE property works. Adopt the connected REOS operating model. Then subscribe to licensed digital products that automate real work for businesses, government entities and customers.</p>
        <div className="hero-actions">
          <Link className="button gold" href="#product-catalogue">Explore products <span>↓</span></Link>
          <Link className="button ghost" href={L("/demo")}>Book a product demo</Link>
        </div>
      </div>
      <PlatformProductMap products={productAccess} />
    </section>

    <section className="platform-commercial-path" aria-label="REOS commercial journey">
      <article><span>01</span><div><b>Educate</b><p>Make the property journey, stakeholders, rules and dependencies understandable.</p></div></article>
      <article><span>02</span><div><b>Adopt</b><p>Use the shared REOS model to align teams, responsibilities, documents and handoffs.</p></div></article>
      <article><span>03</span><div><b>Subscribe & operate</b><p>License the REOS products that automate the workflows your organization needs.</p></div></article>
    </section>

    <section className="section-pad platform-catalogue" id="product-catalogue">
      <SectionIntro
        label="PRODUCT CATALOGUE"
        title={<>One platform.<br /><em>A growing product suite.</em></>}
        copy="Each product solves a defined property workflow, serves the stakeholder groups involved in it and opens through its own licensed access gateway."
      />
      <div className="platform-product-grid">
        {productAccess.map((product) => (
          <article key={product.slug} id={product.slug}>
            <header>
              <span>{String(product.number).padStart(2, "0")}</span>
              <div><b>{product.status}</b><small>{product.availability}</small></div>
            </header>
            <small>{product.category}</small>
            <h3>{product.name}</h3>
            <p>{product.summary}</p>
            <blockquote>{product.outcome}</blockquote>
            <div className="platform-market-tags">{product.markets.map((market) => <span key={market}>{market}</span>)}</div>
            <dl>
              <div><dt>Built for</dt><dd>{product.stakeholders.join(" · ")}</dd></div>
              <div><dt>Product scope</dt><dd>{product.capabilities.join(" · ")}</dd></div>
            </dl>
            <Link className="platform-product-access" href={product.accessHref}>
              Open {product.name} sign-in <span>↗</span>
            </Link>
          </article>
        ))}
        <article className="platform-product-future">
          <header><span>+</span><div><b>Product roadmap</b><small>Designed to expand</small></div></header>
          <small>FUTURE PRODUCTS</small>
          <h3>More workflows will join the catalogue.</h3>
          <p>New REOS products can be added for any journey stage or stakeholder relationship without changing the access model.</p>
          <div className="platform-future-list"><span>Approvals</span><span>Handover</span><span>Leasing</span><span>Community operations</span><span>Customer services</span></div>
        </article>
      </div>
    </section>

    <section className="section-pad platform-audiences">
      <SectionIntro
        label="B2B · B2G · B2C"
        title={<>Products for all twelve<br /><em>property stakeholder groups.</em></>}
        copy="A product may serve one stakeholder, connect several organizations, or coordinate an end-to-end workflow across business, government and customer users."
      />
      <div className="platform-stakeholder-grid">
        {stakeholderGroups.map((group, index) => <span key={group}><i>{String(index + 1).padStart(2, "0")}</i>{group}</span>)}
      </div>
    </section>

    <section className="section-pad platform-licensing">
      <div>
        <span className="eyebrow">PRODUCT ACCESS & LICENSING</span>
        <h2>One REOS relationship.<br /><em>Product-specific access.</em></h2>
        <p>Each subscribed product has its own sign-in destination. Access is intended to be controlled by organization, product licence, user role and entitlement—so customers see only the services they have purchased.</p>
      </div>
      <ol>
        <li><span>01</span><div><b>Choose a product</b><p>Select the workflow that matches your operational need.</p></div></li>
        <li><span>02</span><div><b>Configure the licence</b><p>Define the subscribing organization, users, roles and product scope.</p></div></li>
        <li><span>03</span><div><b>Enter the product</b><p>Use the dedicated sign-in gateway for that licensed REOS service.</p></div></li>
      </ol>
    </section>

    <section className="reos-opportunity platform-sales-cta">
      <span className="eyebrow">START WITH A PRODUCT</span>
      <h2>See the workflow.<br /><em>Then discuss the licence.</em></h2>
      <p>Start with Title Deed Automation or review the NOC Automation roadmap. REOS can map the product to your organization, users and stakeholder relationships.</p>
      <div className="hero-actions">
        <Link className="button gold" href={L("/demo")}>Book a product demo <span>↗</span></Link>
        <Link className="button ghost" href={L("/ecosystem")}>Explore the ecosystem</Link>
      </div>
    </section>
  </Page>;
}

export default function PlatformPage() {
  return <View locale={DEFAULT_LOCALE} />;
}
