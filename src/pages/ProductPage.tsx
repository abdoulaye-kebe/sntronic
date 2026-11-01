import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb.tsx";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { Price, Stock } from "../components/Price.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { QtyStepper } from "../components/QtyStepper.tsx";
import { useCart } from "../context/CartContext.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisleOf, getAisle, relatedProducts } from "../data/catalog.ts";
import { useTitle } from "../lib/useTitle.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

export function ProductPage() {
  const { slug } = useParams();
  const { products, getProduct } = useCatalog();
  const product = getProduct(slug);
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [slug]);

  useTitle(product?.name ?? "Référence introuvable");

  if (!product) return <NotFoundPage />;

  const aisle = getAisle(aisleOf(product));
  const related = relatedProducts(product, 3, products);
  const safeQty = Math.min(Math.max(qty, 1), Math.max(product.stock, 1));

  return (
    <div className="wrap page">
      <Breadcrumb
        items={[
          { label: "Accueil", to: "/" },
          { label: "Catalogue", to: "/catalogue" },
          { label: aisle?.name ?? "Catalogue", to: aisle ? `/catalogue/${aisle.id}` : "/catalogue" },
          { label: product.name },
        ]}
      />
      <div className="product-layout">
        <div className="product-intro">
          <p className="eyebrow">{product.line}</p>
          <h1 className="section-title">{product.name}</h1>
          <p className="card-line">Réf. {product.ref}</p>
          <p className="lede">{product.summary}</p>
          <ul className="chips">
            {product.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ProductPhoto product={product} large alt={product.name} />
        </div>
        <aside className="buybox">
          <Price ht={product.priceHt} large />
          <Stock stock={product.stock} lead={product.lead} />
          {product.stock > 0 ? (
            <div className="buy-actions">
              <QtyStepper value={safeQty} max={product.stock} onChange={setQty} />
              <button type="button" className="btn btn-clay" onClick={() => add(product.slug, safeQty)}>
                Ajouter au panier
              </button>
            </div>
          ) : (
            <Link className="btn btn-clay" to={`/contact?produit=${product.slug}&intention=delai`}>
              Demander le délai
            </Link>
          )}
          <p className="fine">Prix TTC en francs CFA, transport et TVA 18 % compris.</p>
          <Link className="text-link" to={`/contact?produit=${product.slug}`}>
            Demander la fiche technique
          </Link>
        </aside>
        <div className="product-story">
          <h2>En clair</h2>
          <p>{product.description}</p>
          <h2>Caractéristiques</h2>
          <dl className="specs">
            {product.specs.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section">
          <h2 className="section-title">Dans la même famille</h2>
          <div className="grid-products">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
