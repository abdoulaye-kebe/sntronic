import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisles } from "../data/catalog.ts";
import { useTitle } from "../lib/useTitle.ts";

const slideSlugs = ["tektelic-vivid", "sensecap-s2120", "tektelic-breeze", "sensecap-m2"];
const slideTones = ["vitrine-pine", "vitrine-blue", "vitrine-clay", "vitrine-pine"];

const services = [
  {
    title: "Vente d’équipements",
    text: "Capteurs, objets connectés, passerelles, modules de communication et accessoires.",
  },
  {
    title: "Intégration",
    text: "Conception et mise en place de solutions adaptées à vos besoins métiers.",
  },
  {
    title: "Déploiement",
    text: "Installation, configuration, connectivité et mise en service des équipements.",
  },
  {
    title: "Conseil",
    text: "Études de faisabilité, choix techniques, dimensionnement et architecture.",
  },
  {
    title: "Données",
    text: "Collecte, traitement, visualisation et analyse sur les plateformes IoT.",
  },
];

export function HomePage() {
  useTitle("Accueil");
  const { products, getProduct } = useCatalog();
  const slides = slideSlugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
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
          <button
            type="button"
            className="vitrine-nav vitrine-prev"
            aria-label="Vitrine précédente"
            onClick={() => setIndex((value) => (value - 1 + count) % count)}
          >
            ‹
          </button>
          <div className="wrap vitrine-inner">
            <div>
              <p className="vitrine-kicker">
                <span>{String(safeIndex + 1).padStart(2, "0")}</span>
                {slide.line}
              </p>
              <h2>{slide.name}</h2>
              <p className="vitrine-text">{slide.summary}</p>
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
                  <strong>€ / F CFA</strong>
                  <span>prix affichés</span>
                </li>
              </ul>
            </div>
            <div className="vitrine-visual">
              <ProductPhoto product={slide} large alt={slide.name} />
            </div>
          </div>
          <button
            type="button"
            className="vitrine-nav vitrine-next"
            aria-label="Vitrine suivante"
            onClick={() => setIndex((value) => (value + 1) % count)}
          >
            ›
          </button>
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
          {services.map((service) => (
            <article key={service.title} className="offer-card">
              <h2>{service.title}</h2>
              <p>{service.text}</p>
            </article>
          ))}
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
