import { articles } from "./articles.ts";
import { aisles } from "./catalog.ts";

export const accessoryGroups = [
  { id: "alimentations", name: "Alimentations", pitch: "5 V isolé et 24 V rail DIN.", slugs: ["modulab-5v", "modulab-din"] },
  { id: "interfaces", name: "Interfaces", pitch: "RS485, 4-20 mA et driver de moteur.", slugs: ["modulab-rs485", "modulab-420", "modulab-drive"] },
  { id: "essais", name: "Cartes d’essais", pitch: "Pour brancher un capteur avant la carte finale.", slugs: ["modulab-proto"] },
] as const;

export const usages = [
  {
    id: "eau-postpaye",
    name: "Facturer l’eau après consommation",
    pitch: "On relève l’index à distance, puis la facture suit l’eau réellement utilisée.",
    problem: "Lire les compteurs à pied est lent, et la facture ne correspond pas toujours à l’eau utilisée.",
    solution:
      "Le compteur reste en place et envoie son index, même depuis un regard. Le service d’eau facture ensuite ce qui a été consommé. C’est le postpayé : le client paie après avoir utilisé l’eau.",
    allows: ["Relever l’index sans tournée à pied", "Facturer la consommation réelle", "Suivre une cuve ou un réservoir"],
    networks: ["LoRaWAN", "NB-IoT"],
    text: "Le compteur reste en place et envoie son index, même depuis un regard. Le service d’eau facture ensuite ce qui a été consommé. C’est le postpayé : le client paie après avoir utilisé l’eau.",
    slugs: ["cellspan-aqua", "fieldnode-pulse", "fieldnode-level"],
  },
  {
    id: "eau-prepaye",
    name: "Faire payer l’eau avant de la livrer",
    pitch: "Le crédit est payé d’avance. L’eau s’arrête quand il est fini, et revient après recharge.",
    problem: "Sans paiement d’avance, l’eau est livrée et le recouvrement arrive trop tard.",
    solution:
      "Le client paie un crédit avant de consommer. Quand le crédit est fini, une vanne coupe l’arrivée. Elle se rouvre après une recharge, par carte ou par un code. C’est le prépayé.",
    allows: ["Encaisser l’eau avant qu’elle soit consommée", "Couper l’arrivée quand le crédit est fini", "La rétablir après recharge"],
    networks: ["LoRaWAN", "NB-IoT"],
    text: "Le client paie un crédit avant de consommer. Quand le crédit est fini, une vanne coupe l’arrivée. Elle se rouvre après une recharge, par carte ou par un code. C’est le prépayé.",
    slugs: ["fieldnode-pulse", "fieldnode-io", "cellspan-aqua"],
  },
  {
    id: "energie",
    name: "Relever l’électricité et le gaz à distance",
    pitch: "Les compteurs déjà en place envoient leur index, sans être remplacés.",
    problem: "Relever chaque armoire à la main prend du temps, et les index arrivent en retard.",
    solution:
      "Un compteur d’électricité ou de gaz déjà posé envoie son index. En armoire, une passerelle interroge les compteurs qui communiquent déjà entre eux. Une mesure d’industrie peut aussi remonter vers le réseau.",
    allows: ["Relever un compteur déjà posé", "Interroger les compteurs d’une armoire", "Remonter une mesure industrielle"],
    networks: ["LoRaWAN", "LTE-M"],
    text: "Un compteur d’électricité ou de gaz déjà posé envoie son index. En armoire, une passerelle interroge les compteurs qui communiquent déjà entre eux.",
    slugs: ["fieldnode-pulse", "gatehouse-modbus", "cellspan-log", "modulab-420"],
  },
  {
    id: "smart-city",
    name: "Suivre la ville sans tirer de câble",
    pitch: "Air, stationnement, fuite ou niveau : chaque point remonte tout seul.",
    problem: "Tirer un câble jusqu’à chaque place, regard ou façade est un chantier trop lourd.",
    solution:
      "On pose un capteur. Il envoie la qualité de l’air, l’occupation d’une place, une alerte de fuite ou un niveau, sans travaux de voirie.",
    allows: ["Savoir si une place est occupée", "Être alerté d’une fuite", "Suivre l’air ou le niveau d’un réservoir"],
    networks: ["LoRaWAN", "NB-IoT"],
    text: "On pose un capteur. Il envoie la qualité de l’air, l’occupation d’une place, une alerte de fuite ou un niveau, sans travaux de voirie.",
    slugs: ["cellspan-city", "cellspan-park", "cellspan-leak", "fieldnode-level"],
  },
  {
    id: "agriculture",
    name: "Irriguer selon le champ",
    pitch: "Le sol, la météo et l’eau envoyée disent s’il faut irriguer.",
    problem: "Arroser à date fixe gaspille l’eau quand le sol est encore humide.",
    solution:
      "Des sondes disent si le sol a encore de l’eau. Une station ajoute le vent, la pluie et la lumière. Un compteur sur la conduite mesure l’eau réellement envoyée.",
    allows: ["Voir si le sol a encore de l’eau", "Suivre le vent, la pluie et la lumière", "Mesurer l’eau envoyée dans la conduite"],
    networks: ["LoRaWAN"],
    text: "Des sondes disent si le sol a encore de l’eau. Une station ajoute le vent, la pluie et la lumière. Un compteur sur la conduite mesure l’eau réellement envoyée.",
    slugs: ["fieldnode-soil", "sensecap-s2120", "sensecap-s2105", "sensecap-s2106", "sensecap-outdoor"],
  },
] as const;

export type MenuLink = { label: string; to: string };

export type MenuItem = {
  id: string;
  label: string;
  to?: string;
  children?: MenuLink[];
};

export const menu: MenuItem[] = [
  { id: "accueil", label: "Accueil", to: "/" },
  {
    id: "produits",
    label: "Produits",
    to: "/catalogue",
    children: [
      ...aisles.map((aisle) => ({ label: aisle.name, to: `/catalogue/${aisle.id}` })),
      { label: "Tout le catalogue", to: "/catalogue" },
      { label: "Guide de choix", to: "/guide" },
    ],
  },
  {
    id: "services",
    label: "Services",
    to: "/services",
    children: [
      { label: "Les services", to: "/services" },
      { label: "Formation et laboratoire", to: "/formation" },
    ],
  },
  {
    id: "accessoires",
    label: "Accessoires",
    to: "/catalogue?accessoire=alimentations",
    children: accessoryGroups.map((group) => ({ label: group.name, to: `/catalogue?accessoire=${group.id}` })),
  },
  {
    id: "usages",
    label: "Cas d’usage",
    to: "/usages",
    children: usages.map((usage) => ({ label: usage.name, to: `/usages/${usage.id}` })),
  },
  {
    id: "contact",
    label: "Prendre contact",
    to: "/contact",
    children: [
      { label: "Écrire", to: "/contact" },
      { label: "Demander un devis", to: "/contact" },
      { label: "À propos de nous", to: "/a-propos" },
      { label: "Livraison et retours", to: "/livraison" },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    to: "/blog",
    children: articles.map((article) => ({ label: article.title, to: `/blog/${article.slug}` })),
  },
];

export function getAccessory(id: string | null) {
  return accessoryGroups.find((group) => group.id === id);
}

export function getUsage(id: string | null) {
  return usages.find((usage) => usage.id === id);
}
