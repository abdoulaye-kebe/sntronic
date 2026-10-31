import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export function AboutPage() {
  useTitle("À propos");
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">SNTRONIC</p>
      <h1 className="section-title">Votre partenaire pour réussir vos projets IoT.</h1>
      <div className="prose">
        <p>
          Nous sommes une plateforme dédiée à la vente, à l’intégration et à l’accompagnement de projets IoT (Internet
          des objets).
        </p>
        <p>
          Nous accompagnons les entreprises à chaque étape de leur transformation connectée, de l’identification des
          besoins à la mise en œuvre et à l’exploitation des solutions.
        </p>
        <h2>Vente d’équipements IoT</h2>
        <p>Capteurs, objets connectés, passerelles, modules de communication et accessoires.</p>
        <h2>Intégration de solutions IoT</h2>
        <p>Conception et mise en place de solutions adaptées à vos besoins métiers.</p>
        <h2>Déploiement de projets</h2>
        <p>Installation, configuration, connectivité et mise en service des équipements.</p>
        <h2>Conseil et consultance</h2>
        <p>
          Accompagnement technique, études de faisabilité, choix technologiques, dimensionnement et architecture des
          solutions IoT.
        </p>
        <h2>Exploitation et valorisation des données</h2>
        <p>
          Collecte, traitement, visualisation et analyse des données grâce aux plateformes IoT, à l’intelligence
          artificielle et aux outils d’analyse avancée.
        </p>
        <p>
          De la fourniture des équipements à l’exploitation intelligente de vos données, nous vous accompagnons tout au
          long du cycle de vie de vos projets IoT.
        </p>
        <p>
          <Link className="text-link" to="/catalogue">
            Voir le catalogue
          </Link>
          {" · "}
          <Link className="text-link" to="/contact">
            Demander un devis
          </Link>
        </p>
      </div>
    </div>
  );
}
