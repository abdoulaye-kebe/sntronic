import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export const services = [
  {
    title: "Vente d’équipements IoT",
    text: "Capteurs, objets connectés, passerelles, modules de communication et accessoires.",
  },
  {
    title: "Intégration de solutions IoT",
    text: "Conception et mise en place de solutions adaptées à vos besoins métiers.",
  },
  {
    title: "Déploiement de projets",
    text: "Installation, configuration, connectivité et mise en service des équipements.",
  },
  {
    title: "Conseil et consultance",
    text: "Accompagnement technique, études de faisabilité, choix technologiques, dimensionnement et architecture des solutions IoT.",
  },
  {
    title: "Exploitation et valorisation des données",
    text: "Collecte, traitement, visualisation et analyse des données grâce aux plateformes IoT, à l’intelligence artificielle et aux outils d’analyse avancée.",
  },
];

export function ServicesPage() {
  useTitle("Services");
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">SNTRONIC</p>
      <h1 className="section-title">Services</h1>
      <div className="prose">
        <p>Nous proposons une gamme complète de services, de l’équipement jusqu’à l’exploitation des données.</p>
        {services.map((service) => (
          <section key={service.title}>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </section>
        ))}
        <p>
          De la fourniture des équipements à l’exploitation intelligente de vos données, nous vous accompagnons tout au
          long du cycle de vie de vos projets IoT.
        </p>
        <p>
          <Link className="text-link" to="/contact">
            Demander un devis
          </Link>
        </p>
      </div>
    </div>
  );
}
