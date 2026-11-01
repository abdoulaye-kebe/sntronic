import { Link } from "react-router-dom";
import { aisles } from "../data/catalog.ts";
import { site } from "../data/site.ts";
import { Logo } from "./Logo.tsx";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo light />
          <p>
            Vente, intégration et accompagnement de projets IoT : équipements, déploiement, conseil et exploitation
            des données.
          </p>
        </div>
        <div>
          <h2>Catalogue</h2>
          <ul>
            {aisles.map((aisle) => (
              <li key={aisle.id}>
                <Link to={`/catalogue/${aisle.id}`}>{aisle.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Atelier</h2>
          <ul>
            <li>
              <Link to="/guide">Choisir un réseau</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/a-propos">À propos de nous</Link>
            </li>
            <li>
              <Link to="/livraison">Livraison et retours</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/mentions">Mentions légales</Link>
            </li>
            <li>
              <Link to="/admin">Administration</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Écrire</h2>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
          </p>
          <p>{site.hours}</p>
          <p>{site.cityLine}</p>
        </div>
      </div>
      <div className="wrap footer-base">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p>
          Prix TTC en francs CFA, transport inclus, TVA {Math.round(site.vatRate * 100)} %.
        </p>
      </div>
    </footer>
  );
}
