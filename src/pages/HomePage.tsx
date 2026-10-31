import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.tsx";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { categories } from "../data/catalog.ts";
import { useTitle } from "../lib/useTitle.ts";

const slideSlugs = ["tektelic-vivid", "sensecap-s2120", "tektelic-breeze", "sensecap-m2"];
const slideTones = ["vitrine-pine", "vitrine-blue", "vitrine-clay", "vitrine-pine"];
const pickSlugs = [
  "tektelic-vivid",
  "tektelic-aeris",
  "tektelic-breeze",
  "tektelic-comfort",
  "tektelic-harmony",
  "tektelic-tundra",
  "tektelic-chickadee",
  "tektelic-finch",
  "tektelic-robin",
  "tektelic-sparrow",
  "tektelic-pelican",
  "tektelic-stork",
  "tektelic-orca",
  "tektelic-seal",
];
const familyCovers: Record<(typeof categories)[number]["id"], string> = {
  lorawan: "tektelic-vivid",
  "lte-m": "cellspan-move",
  "nb-iot": "cellspan-aqua",
  "passerelles-lorawan": "sensecap-m2",
  "passerelles-iot": "gatehouse-fusion",
  modules: "modulab-rf",
};

const useCases = [
  { slug: "tektelic-breeze", title: "Air d’un bureau", text: "CO₂, occupation et ventilation d’une salle." },
  { slug: "tektelic-tundra", title: "Chambre froide", text: "Température suivie sans ouvrir la porte." },
  { slug: "cellspan-aqua", title: "Compteur d’eau", text: "L’index remonte, même depuis un regard." },
  { slug: "sensecap-outdoor", title: "Site isolé", text: "Une passerelle extérieure relie les capteurs." },
];

const sensecapSlugs = [
  "sensecap-s2101",
  "sensecap-s2102",
  "sensecap-s2103",
  "sensecap-s2104",
  "sensecap-s2105",
  "sensecap-s2106",
  "sensecap-s2107",
  "sensecap-s2108",
  "sensecap-s2120",
  "sensecap-t1000",
  "sensecap-m2",
  "sensecap-outdoor",
];

export function HomePage() {
  useTitle("Accueil");
  const { products, customized, getProduct } = useCatalog();
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

  const curated = pickSlugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
  const highlighted = products.filter((product) => product.featured || product.badge === "Nouveau").slice(0, 8);
  const base = customized && highlighted.length ? highlighted : curated;
  const nouveautes = [...base.filter((product) => product.badge === "Nouveau"), ...base.filter((product) => product.badge !== "Nouveau")];
  const sensecap = sensecapSlugs.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });

  const uses = useCases.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ ...item, product }] : [];
  });

  return (
    <>
      <section className="wrap home-lead">
        <p className="eyebrow">SNTRONIC</p>
        <h1>Le comptoir des sites qui doivent remonter une mesure.</h1>
        <p className="lede">
          Capteurs LoRaWAN, terminaux LTE-M et NB-IoT, passerelles et modules. Chaque fiche indique le réseau, le prix
          en euros et en francs CFA, et le stock. L’atelier répond avant la commande quand le site est à dimensionner.
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
          <h2>Choisir une famille</h2>
          <Link to="/catalogue">Tout le catalogue</Link>
        </div>
        <div className="family-grid">
          {categories.map((category) => {
            const cover = getProduct(familyCovers[category.id]);
            return (
              <Link key={category.id} className="family-card" to={`/catalogue/${category.id}`}>
                {cover ? <ProductPhoto product={cover} alt="" /> : <div className="photo photo-studio" />}
                <p>{category.pitch}</p>
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

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

      <section className="wrap section" id="nouveautes">
        <div className="shelf-head">
          <h2>Capteurs TEKTELIC</h2>
          <Link to="/catalogue/lorawan">Toute la famille LoRaWAN</Link>
        </div>
        <div className="shelf">
          {nouveautes.map((product) => (
            <ProductCard key={product.slug} product={product} shelf />
          ))}
        </div>
      </section>

      <section className="wrap section" id="sensecap">
        <div className="shelf-head">
          <h2>Capteurs et passerelles SenseCAP</h2>
          <Link to="/catalogue?q=SenseCAP">Toute la gamme</Link>
        </div>
        <div className="shelf">
          {sensecap.map((product) => (
            <ProductCard key={product.slug} product={product} shelf />
          ))}
        </div>
      </section>

      <section className="wrap section" id="usages">
        <div className="shelf-head">
          <h2>Quatre déploiements types</h2>
          <Link to="/guide">Choisir le réseau</Link>
        </div>
        <div className="use-grid">
          {uses.map((item) => (
            <Link key={item.slug} className="use-card" to={`/produit/${item.slug}`}>
              <ProductPhoto product={item.product} alt="" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <p className="eyebrow">Réseaux</p>
          <h2 className="section-title">Trois façons de faire revenir une mesure.</h2>
          <div className="trio">
            <article>
              <p className="kicker">01 — LoRaWAN</p>
              <h3>Vous tenez le réseau.</h3>
              <p>
                Une passerelle couvre un bâtiment, une exploitation ou un quartier. Les capteurs vivent longtemps sur
                pile. Il faut poser la passerelle, ou utiliser un réseau déjà là.
              </p>
            </article>
            <article>
              <p className="kicker">02 — LTE-M</p>
              <h3>L’objet bouge.</h3>
              <p>
                Le terminal parle directement à un opérateur. Pas de passerelle à installer. Une SIM, une couverture
                cellulaire, et assez de débit pour un traceur ou une alerte.
              </p>
            </article>
            <article>
              <p className="kicker">03 — NB-IoT</p>
              <h3>Le point est fixe.</h3>
              <p>
                Compteur, place, fuite, cave. Le NB-IoT vise l’autonomie et la couverture en profondeur, avec peu de
                données à chaque envoi.
              </p>
            </article>
          </div>
          <Link className="btn btn-paper" to="/guide">
            Lire le guide de choix
          </Link>
        </div>
      </section>

      <section className="wrap section reasons">
        <h2 className="section-title">Ce que le comptoir rend visible.</h2>
        <ol>
          <li>
            <span>01</span>
            <h3>Des fiches comparables</h3>
            <p>Réseau, alimentation, indice de protection et interface sont au même endroit sur chaque référence.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Un stock annoncé</h3>
            <p>En stock, dernières pièces, ou délai de commande. Le bouton suit l’état réel de la fiche.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Du capteur à la passerelle</h3>
            <p>Le même interlocuteur pour dimensionner le site, pas seulement pour expédier une ligne.</p>
          </li>
        </ol>
      </section>

      <section className="wrap">
        <div className="cta-panel">
          <div>
            <h2 className="section-title">Un lot, un site, une passerelle à dimensionner ?</h2>
            <p>Décrivez le déploiement. On répond avec une sélection et un délai, avant la commande.</p>
          </div>
          <Link className="btn btn-clay" to="/contact">
            Écrire à l’atelier
          </Link>
        </div>
      </section>
    </>
  );
}
