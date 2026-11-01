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

type MeterCard = { name: string; tag: string; points: string[]; caution?: string };

const waterMeters: Record<string, { kicker: string; note: string; items: MeterCard[] }> = {
  "eau-postpaye": {
    kicker: "Compteurs",
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
    kicker: "Offre prépayée LoRaWAN",
    note: "Fabricants avec une offre prépayée LoRaWAN documentée. Commande sur devis, hors tarif affiché du catalogue.",
    items: [
      {
        name: "Kaifeng Shengda — Chine",
        tag: "Prépayé LoRaWAN confirmé",
        points: [
          "Références LXS-S et STS Ultrasonic.",
          "DN15 à DN25 sur la gamme résidentielle.",
          "STS, jeton de 20 chiffres, vanne automatique.",
          "LoRaWAN, NB-IoT et 4G Cat1 selon la configuration.",
          "Modes prépayé et postpayé.",
        ],
      },
      {
        name: "Laison Technology — Chine",
        tag: "Prépayé LoRaWAN confirmé",
        points: [
          "Gamme PARISE / PARISE PRO.",
          "STS et recharge à distance.",
          "LoRaWAN EU863-870.",
          "Vanne intégrée.",
          "Solutions ultrasoniques, volumétriques et multijets.",
        ],
      },
      {
        name: "SECK Intelligent Technology — Chine",
        tag: "Prépayé LoRaWAN confirmé",
        points: [
          "Modèle CA568.",
          "STS IEC 62055. Recharge à distance.",
          "CIU avec clavier.",
          "DN15, DN20 et DN25.",
          "Jusqu’à 20 000 compteurs gérés par la base annoncée.",
        ],
      },
      {
        name: "Bove Intelligent Technology — Chine",
        tag: "Prépayé LoRaWAN référencé",
        points: [
          "Modèles B95 VPW / B97 VPW.",
          "Compteur ultrasonique, commande de vanne.",
          "Versions LoRaWAN EU863-870 référencées dans la base des équipements certifiés.",
        ],
      },
      {
        name: "Sindcon — Singapour",
        tag: "Offre documentée",
        points: [
          "Compteur résidentiel DN15 à DN25.",
          "LoRaWAN et Bluetooth.",
          "Vanne électrique intégrée.",
          "Gestion prépayée et commande marche / arrêt à distance.",
          "IP68. Autonomie annoncée jusqu’à 6 ans selon l’utilisation.",
        ],
      },
      {
        name: "Quill Energy",
        tag: "Offre documentée",
        points: [
          "Modèle QE-WL-XX. LoRaWAN bidirectionnel.",
          "STS. Prépayé et postpayé commutables.",
          "Vanne à distance et carte IC de secours.",
          "IP68. MID et OIML R49 annoncés.",
        ],
      },
      {
        name: "ADD Grup — Europe",
        tag: "À préciser",
        points: [
          "Gamme ADDRA WMP / WMV, compteur ultrasonique.",
          "STS, jetons de 20 chiffres.",
          "Vanne intégrée ou séparée.",
          "Transmission des jetons via LoRaWAN possible. Application mobile.",
        ],
        caution: "La recharge par Bluetooth est aussi proposée. Faire préciser la configuration LoRaWAN et le fonctionnement AMI complet.",
      },
      {
        name: "iSmart Meters — Chine",
        tag: "À préciser",
        points: [
          "Gamme ISW1598. Prépayé STS.",
          "Version avec clavier et CIU.",
          "Vanne pilotable. Recharge et consultation du crédit.",
          "Offre LoRaWAN annoncée.",
        ],
        caution: "Certaines versions indiquent une communication RF 433 MHz. Ce n’est pas du LoRaWAN.",
      },
      {
        name: "Shenzhen Xizhe Meter — Chine",
        tag: "Offre documentée",
        points: [
          "Modèle XZ588.",
          "STS, jetons de 20 chiffres, vanne électronique.",
          "CIU avec clavier.",
          "Communication LoRaWAN annoncée entre le compteur et l’interface.",
        ],
      },
      {
        name: "Xintai Water Meter — Chine",
        tag: "Offre documentée",
        points: [
          "Compteur ultrasonique R250 STS.",
          "Modes prépayé et postpayé.",
          "LoRaWAN, LoRa ou GPRS selon la configuration.",
          "Vanne automatique. Détection de fuite et de retour d’eau.",
          "Recharge par jeton et paiements mobiles possibles.",
        ],
      },
      {
        name: "LUNA Elektrik — Turquie",
        tag: "À préciser",
        points: [
          "Gamme NEW STAR. Prépayé et télérelève.",
          "LoRaWAN Class A, OTAA / ABP, EU863-870.",
          "IP68 et MID annoncés.",
        ],
        caution: "Le LoRaWAN est documenté. La transmission distante des jetons STS et la commande de vanne restent à valider sur la référence proposée.",
      },
    ],
  },
};

function MeterBoard({ usageId }: { usageId: string }) {
  const board = waterMeters[usageId];
  if (!board) return null;
  return (
    <div className="meter-board">
      <p className="meter-kicker">{board.kicker}</p>
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
            {meter.caution ? <p className="meter-caution">{meter.caution}</p> : null}
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
