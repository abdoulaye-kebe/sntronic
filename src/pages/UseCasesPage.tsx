import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { usages } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";

export function UseCasesPage() {
  useTitle("Cas d’usage");
  const { getProduct } = useCatalog();

  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">SNTRONIC</p>
        <h1 className="section-title">Cas d’usage</h1>
        <p className="lede">
          Cinq façons d’utiliser les équipements du catalogue : l’eau, l’énergie, la ville et l’agriculture.
        </p>
      </header>
      <div className="usage-list">
        {usages.map((usage) => {
          const products = usage.slugs.flatMap((slug) => {
            const product = getProduct(slug);
            return product ? [product] : [];
          });
          return (
            <article key={usage.id} id={usage.id} className="usage-block">
              <h2>{usage.name}</h2>
              <p>{usage.text}</p>
              <div className="usage-products">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} compact />
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <p className="usage-more">
        <Link className="text-link" to="/contact">
          Décrire un site et demander un devis
        </Link>
      </p>
    </div>
  );
}
