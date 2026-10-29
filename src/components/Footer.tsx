import { Link } from "react-router-dom";
import { categories } from "../data/catalog.ts";
import { site } from "../data/site.ts";
import { Logo } from "./Logo.tsx";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo light />
          <p>
            Capteurs LoRaWAN, terminaux LTE-M et NB-IoT, passerelles et modules électroniques. Des fiches lisibles,
            un stock annoncé, un conseil avant la commande.
          </p>
        </div>
        <div>
          <h2>Catalogue</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/catalogue/${category.id}`}>{category.name}</Link>
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
              <Link to="/a-propos">À propos</Link>
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
          {site.phone && <p>{site.phone}</p>}
          <p>{site.hours}</p>
          <p>{site.cityLine}</p>
        </div>
      </div>
      <div className="wrap footer-base">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p>
          Prix TTC, TVA {Math.round(site.vatRate * 100)} %. Franc CFA au taux fixe 1 € = 655,957 F CFA.
        </p>
      </div>
    </footer>
  );
}
