import { Link } from "react-router-dom";
import { usages } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";

const agricultureStack = [
  {
    title: "Terrain agricole",
    detail: "Capteurs d’humidité · Station météo · Débitmètre",
    tone: "field",
  },
  {
    title: "Réseau LoRaWAN",
    detail: "Passerelle Milesight / Kerlink / autre",
    tone: "lora",
  },
  {
    title: "ChirpStack + MQTT",
    detail: "Réception, décodage et traitement des données",
    tone: "stack",
  },
  {
    title: "Plateforme SNTRONIC",
    detail: "Dashboard · Alertes · Historique · Règles d’automatisation",
    tone: "platform",
  },
  {
    title: "Smart Irrigation",
    detail: "Commande des vannes · Pilotage des pompes · Arrosage automatique",
    tone: "irrig",
  },
];

function AgricultureArchitecture() {
  return (
    <div className="arch">
      <p className="arch-kicker">Architecture d’intégration</p>
      <ol>
        {agricultureStack.map((step) => (
          <li key={step.title}>
            <div className={`arch-step arch-${step.tone}`}>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
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
          Cinq façons d’utiliser les équipements : l’eau, l’énergie, la ville et l’agriculture.
        </p>
      </header>
      <div className="usage-list">
        {usages.map((usage) => (
          <article key={usage.id} id={usage.id} className="usage-block">
            <h2>{usage.name}</h2>
            <p>{usage.text}</p>
            {usage.id === "agriculture" ? <AgricultureArchitecture /> : null}
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
