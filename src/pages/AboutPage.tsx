import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export function AboutPage() {
  useTitle("À propos de nous");
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">SNTRONIC</p>
      <h1 className="section-title">À propos de nous</h1>
      <div className="prose">
        <p>
          Nous sommes une plateforme dédiée à la vente, à l’intégration et à l’accompagnement de projets IoT (Internet
          des objets).
        </p>
        <p>
          Nous accompagnons les entreprises à chaque étape de leur transformation connectée, de l’identification des
          besoins à la mise en œuvre et à l’exploitation des solutions.
        </p>
        <p>
          De la fourniture des équipements à l’exploitation intelligente de vos données, nous vous accompagnons tout au
          long du cycle de vie de vos projets IoT.
        </p>
        <p>
          <Link className="text-link" to="/services">
            Voir les services
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
