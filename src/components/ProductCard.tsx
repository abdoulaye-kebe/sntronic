import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/catalog.ts";
import { useCart } from "../context/CartContext.tsx";
import { formatXOF, lineTtcXof } from "../lib/money.ts";
import { ProductPhoto } from "./ProductPhoto.tsx";
import { Price, Stock } from "./Price.tsx";
import { QtyStepper } from "./QtyStepper.tsx";

export function ProductCard({
  product,
  shelf = false,
  compact = false,
}: {
  product: Product;
  shelf?: boolean;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (shelf) {
    const ttcLabel = product.quote ? "Sur devis" : formatXOF(lineTtcXof(product.priceHt));
    const safeQty = Math.min(Math.max(qty, 1), Math.max(product.stock, 1));
    return (
      <article className="shelf-card">
        <Link className="shelf-main" to={`/produit/${product.slug}`}>
          {product.badge && <span className="shelf-badge">{product.badge === "Nouveau" ? "New" : product.badge}</span>}
          <ProductPhoto product={product} alt="" />
          <h3>{product.name}</h3>
          <p className="shelf-price">{ttcLabel}</p>
          <p className="shelf-code">Code : {product.ref}</p>
        </Link>
        {product.quote ? (
          <Link className="shelf-buy shelf-wait" to={`/contact?produit=${product.slug}`}>
            Sur devis
          </Link>
        ) : product.stock > 0 ? (
          <div className="shelf-buy">
            <span>{product.stock <= 5 ? `${product.stock} en stock` : "En stock"}</span>
            <QtyStepper value={safeQty} max={product.stock} onChange={setQty} />
            <button type="button" aria-label={`Ajouter ${product.name} au panier`} onClick={() => add(product.slug, safeQty)}>
              <BagIcon />
            </button>
          </div>
        ) : (
          <Link className="shelf-buy shelf-wait" to={`/contact?produit=${product.slug}&intention=delai`}>
            Sur commande
          </Link>
        )}
      </article>
    );
  }

  return (
    <article className={compact ? "card card-compact" : "card"}>
      <Link className="card-main" to={`/produit/${product.slug}`}>
        <div className="art-wrap">
          {product.badge && <span className="badge">{product.badge}</span>}
          <ProductPhoto product={product} alt="" />
        </div>
        <div className="card-body">
          <p className="card-line">
            {product.line} · {product.ref}
          </p>
          <h3>{product.name}</h3>
          {compact ? null : (
            <>
              <p className="card-summary">{product.summary}</p>
              <ul className="chips">
                {product.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          <Price ht={product.priceHt} compact={compact} quote={product.quote} />
          {product.quote ? <p className="stock stock-out">Sur devis</p> : <Stock stock={product.stock} lead={compact ? undefined : product.lead} />}
        </div>
      </Link>
      <div className="card-actions">
        {product.quote ? (
          <Link className="btn btn-clay btn-small" to={`/contact?produit=${product.slug}`}>
            Demander un devis
          </Link>
        ) : product.stock > 0 ? (
          <button type="button" className="btn btn-clay btn-small" onClick={() => add(product.slug, 1)}>
            Ajouter
          </button>
        ) : (
          <Link className="btn btn-ghost btn-small" to={`/contact?produit=${product.slug}&intention=delai`}>
            Demander le délai
          </Link>
        )}
      </div>
    </article>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6.5 8h11l-.8 12h-9.4L6.5 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}
