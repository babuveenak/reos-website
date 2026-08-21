"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReosProduct } from "../data/products";

type ProductAccess = ReosProduct & { accessHref: string };

export function PlatformProductMap({ products }: { products: ProductAccess[] }) {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug ?? "");
  const selected = products.find((product) => product.slug === selectedSlug) ?? products[0];

  return (
    <div className="platform-product-map" aria-label="REOS product platform">
      <div className="platform-market-row" aria-label="Commercial channels">
        <span>B2B</span><span>B2G</span><span>B2C</span>
      </div>
      <div className="platform-product-network">
        <i className="platform-product-orbit orbit-one" aria-hidden="true" />
        <i className="platform-product-orbit orbit-two" aria-hidden="true" />
        <div className="platform-product-core">
          <b>REOS</b>
          <span>PRODUCT PLATFORM</span>
          <small>LICENSED DIGITAL SERVICES</small>
        </div>
        {products.map((product, index) => (
          <button
            key={product.slug}
            type="button"
            className={`platform-product-node node-${index + 1} ${selected?.slug === product.slug ? "is-active" : ""}`}
            aria-pressed={selected?.slug === product.slug}
            onClick={() => setSelectedSlug(product.slug)}
          >
            <i>{String(product.number).padStart(2, "0")}</i>
            <span><b>{product.name}</b><small>{product.availability}</small></span>
          </button>
        ))}
        <div className="platform-product-node node-future" aria-label="More REOS products will be added">
          <i>+</i><span><b>More products</b><small>Catalogue expands here</small></span>
        </div>
      </div>
      {selected && (
        <div className="platform-product-preview" aria-live="polite">
          <small>{selected.status} · {selected.category}</small>
          <h2>{selected.name}</h2>
          <p>{selected.summary}</p>
          <div>
            {selected.markets.map((market) => <span key={market}>{market}</span>)}
            <Link href={selected.accessHref}>Open product sign-in <b>↗</b></Link>
          </div>
        </div>
      )}
    </div>
  );
}
