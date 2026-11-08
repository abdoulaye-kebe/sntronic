import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { getUsage } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";
import { IntegrationArchitecture } from "./UseCasesPage.tsx";

export function UseCasePage() {
  const { id } = useParams();
  const usage = getUsage(id ?? null);
  const { getProduct } = useCatalog();
  useTitle(usage?.name ?? "Cas d’usage");

  if (!usage) return <NotFoundPage />;

  const products = usage.slugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });

  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">Cas d’usage</p>
        <h1 className="section-title">{usage.name}</h1>
        <p className="lede">{usage.pitch}</p>
        <ul className="chips">
          {usage.networks.map((network) => (
            <li key={network}>{network}</li>
          ))}
        </ul>
      </header>

      <section className="usage-detail">
        <article>
          <h2>Le problème</h2>
          <p>{usage.problem}</p>
        </article>
        <article>
          <h2>La solution</h2>
          <p>{usage.solution}</p>
          <ul>
            {usage.allows.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <IntegrationArchitecture />

      <section className="section">
        <h2 className="section-title">Les équipements</h2>
        <div className="grid-products">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="usage-quote">
        <div>
          <h2>Demander un devis</h2>
          <p>Le montant est confirmé avant commande, en francs CFA, transport et TVA compris.</p>
        </div>
        <Link className="btn btn-clay" to={`/contact?sujet=${encodeURIComponent(usage.name)}`}>
          Demander un devis
        </Link>
      </section>
    </div>
  );
}
