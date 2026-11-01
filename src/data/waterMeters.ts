import type { Product } from "./catalog.ts";

const quote = { priceHt: 0, stock: 0, quote: true as const, environment: "Extérieur" as const, art: "node" as const };

export const waterMeterProducts: Product[] = [
  {
    slug: "shengda-ultrasonic",
    ref: "SD-ULTRA",
    name: "Compteur à ultrasons",
    category: "lorawan",
    line: "Shengda",
    connectivity: "Multi",
    ...quote,
    summary: "Compteur d’eau à ultrasons, DN15 à DN25, communication selon la configuration.",
    description:
      "Compteur Shengda sans pièce mobile de mesure. La gamme résidentielle va de DN15 à DN25. LoRaWAN, NB-IoT ou 4G Cat1 selon la configuration.",
    highlights: ["Ultrasons", "DN15–DN25", "Sur devis"],
    specs: [
      ["Marque", "Kaifeng Shengda"],
      ["Mesure", "Ultrasons"],
      ["Diamètre", "DN15 à DN25"],
      ["Communication", "LoRaWAN, NB-IoT ou 4G Cat1 selon configuration"],
    ],
    image: "/compteurs/shengda-ultrasonic.jpg",
  },
  {
    slug: "shengda-lorawan",
    ref: "SD-LXSY",
    name: "Compteur d’eau LoRaWAN",
    category: "lorawan",
    line: "Shengda",
    connectivity: "LoRaWAN",
    ...quote,
    summary: "Compteur d’eau à télérelève LoRaWAN.",
    description:
      "Compteur Shengda qui remonte l’index en LoRaWAN. La télérelève sert la facturation après consommation, et une vanne peut être prévue selon la référence.",
    highlights: ["LoRaWAN", "Télérelève", "Sur devis"],
    specs: [
      ["Marque", "Kaifeng Shengda"],
      ["Référence", "LXSY"],
      ["Communication", "LoRaWAN"],
    ],
    image: "/compteurs/shengda-lorawan.jpg",
  },
  {
    slug: "shengda-smart-card",
    ref: "SD-LXSK",
    name: "Compteur prépayé à carte",
    category: "lorawan",
    line: "Shengda",
    connectivity: "Radio",
    ...quote,
    summary: "Le crédit est chargé par carte, et la vanne suit le solde.",
    description:
      "Compteur prépayé Shengda à carte. Le crédit est écrit sur la carte, puis la vanne ouvre ou ferme selon le solde.",
    highlights: ["Carte", "Prépayé", "Sur devis"],
    specs: [
      ["Marque", "Kaifeng Shengda"],
      ["Référence", "LXSK"],
      ["Crédit", "Carte"],
      ["Vanne", "Automatique"],
    ],
    image: "/compteurs/shengda-smart-card.jpg",
  },
  {
    slug: "shengda-sts",
    ref: "SD-LXS-S",
    name: "Compteur prépayé STS",
    category: "lorawan",
    line: "Shengda",
    connectivity: "Multi",
    ...quote,
    summary: "Jeton STS de 20 chiffres, vanne automatique, DN15 à DN25.",
    description:
      "Compteur Shengda LXS-S et STS Ultrasonic. Jeton STS de 20 chiffres, vanne automatique, modes prépayé et postpayé. LoRaWAN, NB-IoT et 4G Cat1 selon la configuration. DN15 à DN25 sur la gamme résidentielle.",
    highlights: ["STS", "Vanne", "Sur devis"],
    specs: [
      ["Marque", "Kaifeng Shengda"],
      ["Références", "LXS-S, STS Ultrasonic"],
      ["Jeton", "STS, 20 chiffres"],
      ["Diamètre", "DN15 à DN25"],
      ["Modes", "Prépayé et postpayé"],
      ["Communication", "LoRaWAN, NB-IoT ou 4G Cat1 selon configuration"],
    ],
    image: "/compteurs/shengda-sts.jpg",
  },
];
