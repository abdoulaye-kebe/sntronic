import { aisles } from "./catalog.ts";

export const accessoryGroups = [
  { id: "alimentations", name: "Alimentations", pitch: "5 V isolé et 24 V rail DIN.", slugs: ["modulab-5v", "modulab-din"] },
  { id: "interfaces", name: "Interfaces", pitch: "RS485, 4-20 mA et driver de moteur.", slugs: ["modulab-rs485", "modulab-420", "modulab-drive"] },
  { id: "essais", name: "Cartes d’essais", pitch: "Pour brancher un capteur avant la carte finale.", slugs: ["modulab-proto"] },
] as const;

export const usages = [
  {
    id: "froid",
    name: "Froid",
    pitch: "Chambre froide et sonde de température.",
    slugs: ["tektelic-tundra", "cellspan-temp"],
  },
  {
    id: "meteo",
    name: "Météo et sol",
    pitch: "Station, météo compacte et sonde de sol.",
    slugs: ["sensecap-s2120", "fieldnode-meteo", "fieldnode-soil"],
  },
  {
    id: "suivi",
    name: "Suivi d’actifs",
    pitch: "Traceurs pour le matériel qui se déplace.",
    slugs: ["fieldnode-track", "cellspan-move", "sensecap-t1000"],
  },
  {
    id: "eau",
    name: "Eau et comptage",
    pitch: "Impulsions, compteur d’eau et niveau.",
    slugs: ["fieldnode-pulse", "cellspan-aqua", "fieldnode-level"],
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
    to: "/catalogue?usage=froid",
    children: [
      ...usages.map((usage) => ({ label: usage.name, to: `/catalogue?usage=${usage.id}` })),
      { label: "Air et pièce", to: "/catalogue/domotique" },
      { label: "Passerelles de site", to: "/catalogue/gateways" },
    ],
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
