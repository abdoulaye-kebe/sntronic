import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.tsx";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { SectionTitle } from "../components/SectionTitle.tsx";
import { ServiceCard } from "../components/ServiceCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisles } from "../data/catalog.ts";
import { usages } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";
import { services } from "./ServicesPage.tsx";
import { UsageCard } from "./UseCasesPage.tsx";

const slideSlugs = ["shengda-lorawan", "tektelic-vivid", "sensecap-s2120", "tektelic-breeze"];
const meterSlugs = ["shengda-ultrasonic", "shengda-lorawan", "shengda-smart-card", "shengda-sts"];

export function HomePage() {
  useTitle("Accueil");
  const { products, getProduct } = useCatalog();
  const slides = slideSlugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
  const tester = getProduct("adeunis-ftd");
  const brands = [...new Set(products.map((item) => item.line))];
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
      <section className="marque">
        <div className="wrap marque-grid">
          <div className="marque-copy">
            <p className="marque-kicker">
              <span>SNTRONIC</span>
              Dakar
            </p>
            <h1>Votre partenaire pour réussir vos projets IoT.</h1>
            <p className="marque-lede">
              Une plateforme dédiée à la vente, à l’intégration et à l’accompagnement de projets IoT. De
              l’identification des besoins à la mise en œuvre et à l’exploitation.
            </p>
            <div className="home-actions">
              <Link className="btn btn-primary" to="/catalogue">
                Voir le catalogue
              </Link>
              <Link className="btn btn-clay" to="/contact">
                Demander un devis
              </Link>
            </div>
            <ul className="marque-facts">
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
            <p className="marque-brands">{brands.join(" · ")}</p>
          </div>
          {slide && (
            <aside className="marque-show" aria-roledescription="carrousel">
              <div className="marque-frame">
                <ProductPhoto product={slide} large alt={slide.name} />
                <button
                  type="button"
                  className="marque-nav marque-prev"
                  aria-label="Vitrine précédente"
                  onClick={() => setIndex((value) => (value - 1 + count) % count)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="marque-nav marque-next"
                  aria-label="Vitrine suivante"
                  onClick={() => setIndex((value) => (value + 1) % count)}
                >
                  ›
                </button>
              </div>
              <div className="marque-caption">
                <div>
                  <p>
                    {String(safeIndex + 1).padStart(2, "0")}
                    <span>{slide.line}</span>
                  </p>
                  <h2>{slide.name}</h2>
                </div>
                <Link className="btn btn-banner" to={`/produit/${slide.slug}`}>
                  Découvrir
                </Link>
              </div>
              <p className="marque-sum">{slide.summary}</p>
              <div className="marque-dots">
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
            </aside>
          )}
        </div>
      </section>

      <section className="wrap home-offers" aria-labelledby="services-title">
        <SectionTitle id="services-title" title="De l’équipement à l’exploitation" href="/services" linkLabel="Tous les services" />
        <div className="service-board">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} more />
          ))}
        </div>
      </section>

      <section className="home-brands" aria-labelledby="marques-title">
        <div className="wrap">
          <p className="eyebrow" id="marques-title">
            Marques au catalogue
          </p>
          <ul>
            {brands.map((brand) => (
              <li key={brand}>{brand}</li>
            ))}
          </ul>
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
        <SectionTitle title="Cas d’usage" href="/usages" linkLabel="Tous les cas" />
        <div className="usage-grid home-usages">
          {usages.map((usage) => {
            const cover = getProduct(usage.slugs[0]);
            return (
              <UsageCard
                key={usage.id}
                usage={usage}
                cover={cover ? <ProductPhoto product={cover} alt="" /> : undefined}
              />
            );
          })}
        </div>
        <div className="shelf-head">
          <h2>Les équipements</h2>
        </div>
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
        <div className="home-why">
          <SectionTitle title="Pourquoi SNTRONIC" href="/a-propos" linkLabel="À propos" />
          <ol className="reasons">
            <li>
              <span>01</span>
              <h3>Vente et intégration</h3>
              <p>Une plateforme dédiée à la vente, à l’intégration et à l’accompagnement de projets IoT.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Du besoin à l’exploitation</h3>
              <p>De l’identification des besoins à la mise en œuvre et à l’exploitation des solutions.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Équipements et données</h3>
              <p>De la fourniture des équipements à l’exploitation des données, sur tout le cycle de vie du projet.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="home-band">
        <div className="wrap home-band-inner">
          <h2>De la fourniture des équipements à l’exploitation de vos données.</h2>
          <p>Nous vous accompagnons tout au long du cycle de vie du projet.</p>
          <Link className="btn btn-banner" to="/contact">
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
