import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export const services: { short: string; title: string; text: string; to?: string }[] = [
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
  {
    short: "Formation",
    title: "Sessions de formation",
    text: "Sessions pratiques pour les écoles : LoRaWAN, LTE-M, NB-IoT et intégration de services. Un laboratoire peut rester dans l’école.",
    to: "/formation",
  },
];

function ServiceIcon({ index }: { index: number }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (index === 0) {
    return (
      <svg {...common}>
        <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z" />
        <path d="M12 12.2 3.5 7.5M12 12.2V20.5M12 12.2 20.5 7.5" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...common}>
        <circle cx="6" cy="7" r="2.1" />
        <circle cx="18" cy="7" r="2.1" />
        <circle cx="12" cy="17.2" r="2.1" />
        <path d="M8 8.2 10.5 15.2M16 8.2 13.5 15.2M8.1 7h7.8" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg {...common}>
        <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="m14.7 9.3-1.2 4.2-4.2 1.2 1.2-4.2z" />
      </svg>
    );
  }
  if (index === 4) {
    return (
      <svg {...common}>
        <path d="M4 19.5h16" />
        <path d="M7 16.5V11M12 16.5V6.5M17 16.5v-4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="m3 9 9-4.5L21 9l-9 4.5L3 9z" />
      <path d="M7 11.2V15c1.6 1.2 3.2 1.8 5 1.8s3.4-.6 5-1.8v-3.8" />
    </svg>
  );
}

export function ServicesPage() {
  useTitle("Services");
  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">SNTRONIC</p>
        <h1 className="section-title">Services</h1>
        <p className="lede">
          Une gamme complète, de l’équipement jusqu’à la formation des équipes.
        </p>
      </header>
      <div className="service-board">
        {services.map((service, index) => (
          <article key={service.title} className="service-card">
            <div className="service-mark">
              <span className="service-icon">
                <ServiceIcon index={index} />
              </span>
              <span className="service-num">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
            {service.to ? (
              <Link className="text-link" to={service.to}>
                Voir les sessions
              </Link>
            ) : null}
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
