import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { usages } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";

function ArchIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

function IntegrationArchitecture() {
  return (
    <section className="arch" aria-labelledby="arch-title">
      <h2 id="arch-title">Architecture d’intégration</h2>
      <ol className="arch-flow">
        <li>
          <span className="arch-node">
            <ArchIcon>
              <path d="M5.5 16.5a6.5 6.5 0 1 1 13 0" />
              <path d="M12 16.2 15.2 12" />
              <path d="M12 16.2h.01" />
            </ArchIcon>
          </span>
          <div>
            <h3>Device</h3>
            <p>Capteurs et compteurs connectés</p>
            <p>Mesure et envoi des données</p>
          </div>
        </li>
        <li>
          <span className="arch-node">
            <ArchIcon>
              <path d="M12 20.5v-5" />
              <path d="M9 18.2 12 15.2l3 3" />
              <path d="M7.2 13.8a6.2 6.2 0 0 1 9.6 0" />
              <path d="M9.2 11.6a3.6 3.6 0 0 1 5.6 0" />
              <circle cx="12" cy="8.2" r="1.05" fill="currentColor" stroke="none" />
            </ArchIcon>
          </span>
          <div>
            <h3>Réseau</h3>
            <p>LoRaWAN ou NB-IoT</p>
            <p>Couverture opérateur ou réseau dédié</p>
          </div>
        </li>
        <li>
          <span className="arch-node">
            <ArchIcon>
              <rect x="5" y="4.5" width="14" height="6" rx="1.4" />
              <rect x="5" y="13.5" width="14" height="6" rx="1.4" />
              <path d="M8 7.5h.01M8 16.5h.01" />
            </ArchIcon>
          </span>
          <div>
            <h3>Cœur de réseau IoT</h3>
            <p>Collecte et acheminement des données</p>
            <p>Gestion et sécurité des équipements</p>
          </div>
        </li>
        <li>
          <span className="arch-node arch-node-app">
            <ArchIcon>
              <rect x="3.5" y="4.5" width="17" height="12" rx="1.6" />
              <path d="M8 20h8" />
              <path d="M12 16.5V20" />
              <path d="M7.2 12.2 10 9.6l2.2 2.1 4.2-4.2" />
            </ArchIcon>
          </span>
          <div>
            <h3>Application métier</h3>
            <p className="arch-brand">Plateforme SNTRONIC</p>
            <p>Tableaux de bord et alertes</p>
            <p>Intégration au système du client</p>
          </div>
        </li>
      </ol>
    </section>
  );
}

export function UseCasesPage() {
  useTitle("Cas d’usage");

  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">SNTRONIC</p>
        <h1 className="section-title">Cas d’usage</h1>
        <p className="lede">
          Cinq façons d’utiliser les équipements : l’eau, l’énergie, la ville et l’agriculture. L’architecture
          d’intégration reste la même.
        </p>
      </header>
      <IntegrationArchitecture />
      <div className="usage-list">
        {usages.map((usage) => (
          <article key={usage.id} id={usage.id} className="usage-block">
            <h2>{usage.name}</h2>
            <p>{usage.text}</p>
          </article>
        ))}
      </div>
      <p className="usage-more">
        <Link className="text-link" to="/catalogue/devices">
          Voir les devices
        </Link>
      </p>
    </div>
  );
}
