import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.tsx";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisles } from "../data/catalog.ts";
import { usages } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";
import { services } from "./ServicesPage.tsx";
import { UsageCard } from "./UseCasesPage.tsx";

const slideSlugs = ["shengda-lorawan", "tektelic-vivid", "sensecap-s2120", "tektelic-breeze"];
const meterSlugs = ["shengda-ultrasonic", "shengda-lorawan", "shengda-smart-card", "shengda-sts"];
const slideTones = ["vitrine-pine", "vitrine-night", "vitrine-pine", "vitrine-night"];

export function HomePage() {
  useTitle("Accueil");
  const { products, getProduct } = useCatalog();
  const slides = slideSlugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
  const tester = getProduct("adeunis-ftd");
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const safeIndex = count ? index % count : 0;
  const slide = slides[safeIndex];

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), 7000);
    return () => window.clearInterval(timer);
  }, [count]);

  return (
    <>
      {slide && (
        <section className={`vitrine ${slideTones[safeIndex] ?? "vitrine-pine"}`} aria-roledescription="carrousel">
          <div className="wrap vitrine-inner">
            <div className="vitrine-copy">
              <p className="vitrine-kicker">
                <span>{String(safeIndex + 1).padStart(2, "0")}</span>
                {slide.line}
              </p>
              <h2>{slide.name}</h2>
              <p className="vitrine-text">
                <span>Ce que ça permet</span>
                {slide.summary}
              </p>
              <Link className="btn btn-banner" to={`/produit/${slide.slug}`}>
                Découvrir
              </Link>
              <ul className="vitrine-facts">
                <li>
                  <strong>{products.length}</strong>
                  <span>références</span>
                </li>
                <li>
                  <strong>EU868</strong>
                  <span>LoRaWAN</span>
                </li>
                <li>
                  <strong>F CFA</strong>
                  <span>affichés ou sur devis</span>
                </li>
              </ul>
            </div>
            <div className="vitrine-stage">
              <button
                type="button"
                className="vitrine-nav vitrine-prev"
                aria-label="Vitrine précédente"
                onClick={() => setIndex((value) => (value - 1 + count) % count)}
              >
                ‹
              </button>
              <div className="vitrine-visual">
                <ProductPhoto product={slide} large alt={slide.name} />
              </div>
              <button
                type="button"
                className="vitrine-nav vitrine-next"
                aria-label="Vitrine suivante"
                onClick={() => setIndex((value) => (value + 1) % count)}
              >
                ›
              </button>
            </div>
          </div>
          <div className="vitrine-dots">
            {slides.map((item, dot) => (
              <button
                key={item.slug}
                type="button"
                aria-label={`Afficher ${item.name}`}
                className={dot === safeIndex ? "on" : undefined}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="wrap home-lead">
        <p className="eyebrow">SNTRONIC</p>
        <h1>Votre partenaire pour réussir vos projets IoT.</h1>
        <p className="lede">
          Une plateforme dédiée à la vente, à l’intégration et à l’accompagnement de projets IoT. De l’identification
          des besoins à la mise en œuvre et à l’exploitation.
        </p>
        <div className="offer-grid">
          {services.map((service) =>
            service.to ? (
              <Link key={service.title} className="offer-card" to={service.to}>
                <h2>{service.short}</h2>
                <p>{service.text}</p>
              </Link>
            ) : (
              <article key={service.title} className="offer-card">
                <h2>{service.short}</h2>
                <p>{service.text}</p>
              </article>
            ),
          )}
        </div>
        <p className="home-close">
          De la fourniture des équipements à l’exploitation de vos données, nous vous accompagnons tout au long du
          cycle de vie du projet.
        </p>
        <div className="home-actions">
          <Link className="btn btn-primary" to="/catalogue">
            Voir le catalogue
          </Link>
          <Link className="btn btn-clay" to="/contact">
            Demander un devis
          </Link>
        </div>
      </section>

      <section className="wrap section home-families" id="familles">
        <div className="shelf-head">
          <h2>Compteurs d’eau</h2>
          <Link to="/catalogue/devices">Voir les devices</Link>
        </div>
        <div className="catalog home-meters">
          <div className="grid-products">
            {meterSlugs.flatMap((slug) => {
              const product = getProduct(slug);
              return product ? [<ProductCard key={slug} product={product} compact />] : [];
            })}
          </div>
        </div>
        {tester && (
          <article className="home-tester">
            <ProductPhoto product={tester} alt={tester.name} />
            <div>
              <p className="eyebrow">Adeunis</p>
              <h2>Testeur de réseau</h2>
              <p>
                On le promène sur le site pour savoir si le réseau LoRaWAN ou Sigfox couvre l’endroit où les capteurs
                seront posés. L’écran affiche tout de suite la puissance et la qualité du signal, et le GPS retient
                chaque point de mesure.
              </p>
              <Link className="text-link" to={`/produit/${tester.slug}`}>
                Voir la fiche
              </Link>
            </div>
          </article>
        )}
        <div className="shelf-head">
          <h2>Cas d’usage</h2>
          <Link to="/usages">Tous les cas</Link>
        </div>
        <div className="usage-grid home-usages">
          {usages.map((usage) => (
            <UsageCard key={usage.id} usage={usage} />
          ))}
        </div>
        <h2 className="home-aisle-title">Les équipements</h2>
        <div className="family-grid">
          {aisles.map((aisle) => {
            const cover = getProduct(aisle.cover);
            return (
              <Link key={aisle.id} className="family-card" to={`/catalogue/${aisle.id}`}>
                {cover ? <ProductPhoto product={cover} alt="" /> : <div className="photo photo-studio" />}
                <p>{aisle.pitch}</p>
                <span>{aisle.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
