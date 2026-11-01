import { Link } from "react-router-dom";
import { usages } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";

type ArchStep = { title: string; detail: string; tone: string };

const architectures: Record<string, readonly ArchStep[]> = {
  "eau-postpaye": [
    { title: "Point d’eau", detail: "Compteur déjà posé · Cuve ou réservoir", tone: "field" },
    { title: "Émetteur", detail: "Impulsions et index · Niveau à ultrasons", tone: "lora" },
    { title: "Réseau", detail: "LoRaWAN ou NB-IoT, y compris depuis un regard", tone: "stack" },
    { title: "Plateforme SNTRONIC", detail: "Index · Historique · Alertes", tone: "platform" },
    { title: "Facturation", detail: "Consommation réelle, après relevé", tone: "irrig" },
  ],
  "eau-prepaye": [
    { title: "Point d’eau", detail: "Compteur déjà posé · Compteur prépayé à vanne", tone: "field" },
    { title: "Crédit", detail: "Rechargement · Jeton STS", tone: "lora" },
    { title: "Réseau", detail: "LoRaWAN ou NB-IoT", tone: "stack" },
    { title: "Plateforme SNTRONIC", detail: "Solde · Ordre de vanne · Historique", tone: "platform" },
    { title: "Arrivée d’eau", detail: "Coupure si le crédit est épuisé · Retour après rechargement", tone: "irrig" },
  ],
  energie: [
    { title: "Comptage", detail: "Compteur à impulsions · Armoire Modbus · Boucle 4-20 mA", tone: "field" },
    { title: "Interface", detail: "Émetteur · Passerelle Modbus · Enregistreur", tone: "lora" },
    { title: "Remontée", detail: "LoRaWAN · Ethernet · LTE\u2011M", tone: "stack" },
    { title: "Plateforme SNTRONIC", detail: "Index · Courants · Registres", tone: "platform" },
    { title: "Suivi", detail: "Consommation relevée à distance", tone: "irrig" },
  ],
  "smart-city": [
    { title: "Ville", detail: "Air · Place · Fuite · Réservoir ou regard", tone: "field" },
    { title: "Capteur", detail: "Qualité de l’air · Occupation · Présence d’eau · Niveau", tone: "lora" },
    { title: "Réseau", detail: "NB-IoT ou LoRaWAN, sans tirage de câble", tone: "stack" },
    { title: "Plateforme SNTRONIC", detail: "États · Alertes · Historique", tone: "platform" },
    { title: "Exploitation", detail: "Chaque point remonte seul", tone: "irrig" },
  ],
  agriculture: [
    { title: "Terrain agricole", detail: "Capteurs d’humidité · Station météo · Débitmètre", tone: "field" },
    { title: "Réseau LoRaWAN", detail: "Passerelle Milesight / Kerlink / autre", tone: "lora" },
    { title: "ChirpStack + MQTT", detail: "Réception, décodage et traitement des données", tone: "stack" },
    { title: "Plateforme SNTRONIC", detail: "Dashboard · Alertes · Historique · Règles d’automatisation", tone: "platform" },
    { title: "Smart Irrigation", detail: "Commande des vannes · Pilotage des pompes · Arrosage automatique", tone: "irrig" },
  ],
};

function UsageArchitecture({ steps }: { steps: readonly ArchStep[] }) {
  return (
    <div className="arch">
      <p className="arch-kicker">Architecture d’intégration</p>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title}>
            <div className={`arch-step arch-${step.tone}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
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
            {architectures[usage.id] ? <UsageArchitecture steps={architectures[usage.id]} /> : null}
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
