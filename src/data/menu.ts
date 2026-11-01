import { aisles } from "./catalog.ts";

export const accessoryGroups = [
  { id: "alimentations", name: "Alimentations", pitch: "5 V isolé et 24 V rail DIN.", slugs: ["modulab-5v", "modulab-din"] },
  { id: "interfaces", name: "Interfaces", pitch: "RS485, 4-20 mA et driver de moteur.", slugs: ["modulab-rs485", "modulab-420", "modulab-drive"] },
  { id: "essais", name: "Cartes d’essais", pitch: "Pour brancher un capteur avant la carte finale.", slugs: ["modulab-proto"] },
] as const;

export const usages = [
  {
    id: "eau-postpaye",
    name: "Smart water metering — postpayé",
    pitch: "Relevé d’index sur les compteurs déjà posés, facturation après consommation.",
    text: "Le compteur d’eau reste en place. Un émetteur compte ses impulsions, garde l’index et l’envoie en LoRaWAN ou en NB-IoT, y compris depuis un regard. Le service d’eau facture ensuite la consommation réelle. Un capteur de niveau complète le relevé sur une cuve ou un réservoir.",
    slugs: ["cellspan-aqua", "fieldnode-pulse", "fieldnode-level"],
  },
  {
    id: "eau-prepaye",
    name: "Smart water metering — prépayé",
    pitch: "Le crédit commande l’eau : l’index est suivi, et un relais peut couper l’arrivée.",
    text: "Deux montages. Sur un compteur déjà posé, le relevé d’impulsions et un relais coupent l’arrivée quand le crédit est épuisé, puis la rétablissent après rechargement. Les compteurs prépayés listés plus bas intègrent la vanne : ils se commandent sur devis.",
    slugs: ["fieldnode-pulse", "fieldnode-io", "cellspan-aqua"],
  },
  {
    id: "energie",
    name: "Smart metering énergie",
    pitch: "Index, courants et registres des compteurs d’énergie déjà en armoire.",
    text: "Un compteur d’électricité ou de gaz qui sort des impulsions est relevé à distance, comme un compteur d’eau. En armoire, une passerelle interroge les compteurs Modbus déjà posés. Pour une boucle 4-20 mA ou plusieurs voies de mesure, le conditionneur et l’enregistreur ramènent la valeur vers le réseau.",
    slugs: ["fieldnode-pulse", "gatehouse-modbus", "cellspan-log", "modulab-420"],
  },
  {
    id: "smart-city",
    name: "Smart city",
    pitch: "Air, stationnement, fuites et niveaux, sans tirer un câble à chaque point.",
    text: "La ville suit quelques points fixes : qualité de l’air, occupation d’une place, fuite dans un local technique, niveau d’un réservoir ou d’un regard. Chaque point remonte tout seul, en NB-IoT ou en LoRaWAN. On pose le capteur, pas un chantier de génie civil.",
    slugs: ["cellspan-city", "cellspan-park", "cellspan-leak", "fieldnode-level"],
  },
  {
    id: "agriculture",
    name: "Smart agriculture",
    pitch: "Sol, météo et irrigation, du champ jusqu’à la passerelle.",
    text: "Les sondes de sol donnent l’humidité, la température et la conductivité pour décider d’irriguer. Une station météo ajoute le vent, la pluie et la lumière. Le pH suit une solution ou un bassin. Le débit d’irrigation se mesure avec un nœud LoRaWAN Dragino et un capteur de débit (2–100 L/min, filetage G 1″, DN25). La passerelle extérieure relie ces capteurs là où il n’y a pas de local technique.",
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
  { id: "services", label: "Services", to: "/services" },
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
    children: usages.map((usage) => ({ label: usage.name, to: `/usages#${usage.id}` })),
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
    children: [{ label: "Le journal", to: "/blog" }],
  },
];

export function getAccessory(id: string | null) {
  return accessoryGroups.find((group) => group.id === id);
}

export function getUsage(id: string | null) {
  return usages.find((usage) => usage.id === id);
}
