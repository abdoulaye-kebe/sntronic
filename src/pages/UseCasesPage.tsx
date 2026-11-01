import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
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

const waterMeters: Record<string, { note: string; items: { name: string; tag: string; points: string[] }[] }> = {
  "eau-postpaye": {
    note: "Ces compteurs se télérelèvent. Ils se commandent sur devis, hors tarif affiché du catalogue.",
    items: [
      {
        name: "Shengda — Chine",
        tag: "À consulter en priorité",
        points: [
          "Postpayé : LXSG.",
          "LoRaWAN : LXSY / LXSC. NB-IoT et 4G : LXSY.",
          "DN15 à DN300 selon les gammes.",
          "Télérelève, alertes, et option de commande de vanne.",
        ],
      },
      {
        name: "Diehl Metering — Allemagne",
        tag: "Premium industriel",
        points: [
          "HYDRUS 2.0, mesure ultrasonique.",
          "LoRaWAN 868 MHz. Variantes OMS et mioty.",
          "IP68. Batterie jusqu’à 16 ans.",
          "DN15 à DN50 pour la gamme domestique.",
          "Télérelève et détection de fuites. La coupure prépayée n’est pas à présumer sur ce modèle.",
        ],
      },
      {
        name: "Quill Energy",
        tag: "Prépayé et postpayé",
        points: [
          "Modèle QE-WL-XX.",
          "LoRaWAN bidirectionnel.",
          "Le même compteur couvre le prépayé et le postpayé, avec STS.",
          "Vanne à commande distante et carte IC de secours.",
          "IP68. Certification MID annoncée.",
        ],
      },
    ],
  },
  "eau-prepaye": {
    note: "Ces compteurs intègrent la vanne. Ils se commandent sur devis, hors tarif affiché du catalogue.",
    items: [
      {
        name: "Shengda — Chine",
        tag: "À consulter en priorité",
        points: [
          "Prépayé : LXSK / LXS-S.",
          "LoRaWAN : LXSY / LXSC. NB-IoT et 4G : LXSY.",
          "DN15 à DN300 selon les gammes.",
          "Commande de vanne, télérelève et alertes.",
        ],
      },
      {
        name: "Sindcon — Singapour",
        tag: "Prépayé LoRaWAN",
        points: [
          "Compteur prépayé LoRaWAN.",
          "DN15 à DN25.",
          "Vanne électrique intégrée.",
          "Communication LoRa et Bluetooth.",
          "Mesure mécanique à turbine.",
        ],
      },
      {
        name: "Bove — Chine",
        tag: "À qualifier en priorité",
        points: [
          "Modèle B97 VPW, compteur ultrasonique.",
          "Contrôle de vanne. Fonction prépayée annoncée.",
          "Module présent parmi les équipements LoRaWAN certifiés.",
          "La référence citée est en AU915-928 : demander une version EU868 pour le Sénégal.",
        ],
      },
      {
        name: "Quill Energy",
        tag: "Prépayé et postpayé",
        points: [
          "Modèle QE-WL-XX.",
          "LoRaWAN bidirectionnel.",
          "Prépayé ou postpayé, avec STS.",
          "Vanne à commande distante et carte IC de secours.",
          "IP68. Certification MID annoncée.",
        ],
      },
    ],
  },
};

function MeterBoard({ usageId }: { usageId: string }) {
  const board = waterMeters[usageId];
  if (!board) return null;
  return (
    <div className="meter-board">
      <p className="meter-kicker">Compteurs</p>
      <p className="meter-note">{board.note}</p>
      <ul>
        {board.items.map((meter) => (
          <li key={meter.name}>
            <span>{meter.tag}</span>
            <h3>{meter.name}</h3>
            <ul>
              {meter.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
  const { getProduct } = useCatalog();

  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">SNTRONIC</p>
        <h1 className="section-title">Cas d’usage</h1>
        <p className="lede">
          Cinq façons d’utiliser les équipements du catalogue : l’eau, l’énergie, la ville et l’agriculture.
        </p>
      </header>
      <div className="usage-list">
        {usages.map((usage) => {
          const products = usage.slugs.flatMap((slug) => {
            const product = getProduct(slug);
            return product ? [product] : [];
          });
          return (
            <article key={usage.id} id={usage.id} className="usage-block">
              <h2>{usage.name}</h2>
              <p>{usage.text}</p>
              <MeterBoard usageId={usage.id} />
              {usage.id === "agriculture" ? <AgricultureArchitecture /> : null}
              <div className="usage-products">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} compact />
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <p className="usage-more">
        <Link className="text-link" to="/contact">
          Décrire un site et demander un devis
        </Link>
      </p>
    </div>
  );
}
