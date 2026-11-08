import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { usages } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";

export type Usage = (typeof usages)[number];

function ArchIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

export function IntegrationArchitecture() {
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
            <h3>Appareil</h3>
            <p>Capteurs et compteurs</p>
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
            <p>LoRaWAN, LTE-M ou NB-IoT</p>
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
            <h3>Plateforme</h3>
            <p>Collecte et sécurité des données</p>
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
            <h3>Application</h3>
            <p>Tableaux de bord et alertes</p>
          </div>
        </li>
      </ol>
    </section>
  );
}

export function UsageCard({ usage }: { usage: Usage }) {
  return (
    <article className="usage-card" id={usage.id}>
      <UsageMark id={usage.id} />
      <h3>{usage.name}</h3>
      <p>{usage.pitch}</p>
      <ul className="chips">
        {usage.networks.map((network) => (
          <li key={network}>{network}</li>
        ))}
      </ul>
      <div className="usage-card-actions">
        <Link className="text-link" to={`/usages/${usage.id}`}>
          Voir les équipements
        </Link>
        <Link className="btn btn-quiet" to={`/contact?sujet=${encodeURIComponent(usage.name)}`}>
          Demander un devis
        </Link>
      </div>
    </article>
  );
}

function UsageMark({ id }: { id: string }) {
  const icon =
    id === "energie" ? (
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    ) : id === "smart-city" ? (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V9l6-4 6 4v12" />
        <path d="M10 21v-5h4v5" />
      </>
    ) : id === "agriculture" ? (
      <>
        <path d="M12 22V10" />
        <path d="M12 10c-4 0-6-3-6-6 4 0 6 3 6 6zM12 12c4 0 6-2 6-5-4 0-6 2-6 5z" />
      </>
    ) : id === "eau-prepaye" ? (
      <>
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M3 11h18" />
      </>
    ) : (
      <>
        <path d="M12 2.5s6 6.2 6 10.2a6 6 0 0 1-12 0C6 8.7 12 2.5 12 2.5z" />
      </>
    );
  return (
    <span className="usage-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">{icon}</svg>
    </span>
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
          Cinq façons d’utiliser les équipements : l’eau après ou avant consommation, l’énergie, la ville et
          l’agriculture. L’architecture reste la même.
        </p>
      </header>
      <IntegrationArchitecture />
      <div className="usage-grid">
        {usages.map((usage) => (
          <UsageCard key={usage.id} usage={usage} />
        ))}
      </div>
    </div>
  );
}
