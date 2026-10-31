import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export const services = [
  {
    short: "Vente d’équipements",
    title: "Vente d’équipements IoT",
    text: "Capteurs, objets connectés, passerelles, modules de communication et accessoires.",
  },
  {
    short: "Intégration",
    title: "Intégration de solutions IoT",
    text: "Conception et mise en place de solutions adaptées à vos besoins métiers.",
  },
  {
    short: "Déploiement",
    title: "Déploiement de projets",
    text: "Installation, configuration, connectivité et mise en service des équipements.",
  },
  {
    short: "Conseil",
    title: "Conseil et consultance",
    text: "Accompagnement technique, études de faisabilité, choix technologiques, dimensionnement et architecture des solutions IoT.",
  },
  {
    short: "Données",
    title: "Exploitation et valorisation des données",
    text: "Collecte, traitement, visualisation et analyse des données grâce aux plateformes IoT, à l’intelligence artificielle et aux outils d’analyse avancée.",
  },
];

export function ServicesPage() {
  useTitle("Services");
  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">SNTRONIC</p>
        <h1 className="section-title">Services</h1>
        <p className="lede">
          Une gamme complète, de l’équipement jusqu’à l’exploitation des données.
        </p>
      </header>
      <div className="service-board">
        {services.map((service, index) => (
          <article key={service.title} className="service-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
      <div className="service-close">
        <p>
          De la fourniture des équipements à l’exploitation intelligente de vos données, nous vous accompagnons tout au
          long du cycle de vie de vos projets IoT.
        </p>
        <Link className="btn" to="/contact">
          Demander un devis
        </Link>
      </div>
    </div>
  );
}
