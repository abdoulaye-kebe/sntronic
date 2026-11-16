import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/catalog.ts";
import { useCart } from "../context/CartContext.tsx";
import { formatXOF, isQuoted, lineTtcXof } from "../lib/money.ts";
import { Badge, TechChip } from "./Badge.tsx";
import { Button } from "./Button.tsx";
import { ProductPhoto } from "./ProductPhoto.tsx";
import { Price, Stock } from "./Price.tsx";
import { QtyStepper } from "./QtyStepper.tsx";

function networkOf(product: Product): string | null {
  if (product.connectivity === "LoRaWAN" || product.connectivity === "LTE-M" || product.connectivity === "NB-IoT") {
    return product.connectivity;
  }
  if (product.category === "lorawan") return "LoRaWAN";
  if (product.category === "lte-m") return "LTE-M";
  if (product.category === "nb-iot") return "NB-IoT";
  return null;
}

function traitsOf(product: Product, network: string | null) {
  return product.highlights.filter((item) => item !== "Sur devis" && item !== network).slice(0, 2);
}

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
  const [added, setAdded] = useState(false);
  const network = networkOf(product);
  const traits = traitsOf(product, network);
  const quoted = isQuoted(product);
  const summary = product.summary.trim() || "Fiche technique sur demande.";

  function addToCart(amount: number) {
    add(product.slug, amount);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  if (shelf) {
    const ttcLabel = quoted ? "Sur devis" : formatXOF(lineTtcXof(product.priceHt));
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
        {quoted ? (
          <Link className="shelf-buy shelf-wait" to={`/contact?produit=${product.slug}`}>
            Sur devis
          </Link>
        ) : product.stock > 0 ? (
          <div className="shelf-buy">
            <span>{product.stock <= 5 ? "Stock limité" : "En stock"}</span>
            <QtyStepper value={safeQty} max={product.stock} onChange={setQty} />
            <button type="button" aria-label={`Ajouter ${product.name} au panier`} onClick={() => addToCart(safeQty)}>
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
          {product.badge ? <Badge>{product.badge}</Badge> : null}
          <ProductPhoto product={product} alt="" />
        </div>
        <div className="card-body">
          <p className="card-line">
            {product.line} · {product.ref}
            {network ? <TechChip network={network} /> : null}
          </p>
          <h3>{product.name}</h3>
          <p className="card-summary">{summary}</p>
          {traits.length > 0 ? (
            <ul className="chips">
              {traits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </Link>
      <div className="card-foot">
        <div className="card-meta">
          <Price ht={product.priceHt} compact={compact} quote={quoted} />
          {quoted ? null : <Stock stock={product.stock} lead={compact ? undefined : product.lead} />}
        </div>
        <div className="card-actions">
          <span className="sr-only" aria-live="polite">
            {added ? `${product.name} ajouté au panier` : ""}
          </span>
          {quoted ? (
            <Button variant="ghost" size="sm" to={`/contact?produit=${product.slug}`} aria-label={`Demander un devis pour ${product.name}`}>
              Devis
            </Button>
          ) : product.stock > 0 ? (
            <Button variant="primary" size="sm" aria-label={`Ajouter ${product.name} au panier`} onClick={() => addToCart(1)}>
              {added ? "Ajouté" : "Ajouter"}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" to={`/contact?produit=${product.slug}&intention=delai`} aria-label={`Demander le délai pour ${product.name}`}>
              Délai
            </Button>
          )}
        </div>
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
