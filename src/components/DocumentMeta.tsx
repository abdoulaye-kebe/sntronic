import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext.tsx";
import { getArticle } from "../data/articles.ts";
import { getAisle, getCategory } from "../data/catalog.ts";
import { getAccessory, getUsage } from "../data/menu.ts";
import { site } from "../data/site.ts";

const HOME_TITLE = "SNTRONIC — IoT, passerelles et modules";

const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: HOME_TITLE,
    description:
      "SNTRONIC, à Dakar, vend et intègre des équipements IoT : compteurs d’eau, capteurs, passerelles et modules. Prix en francs CFA, livraison entre 3 jours et 1 semaine.",
  },
  "/catalogue": {
    title: "Catalogue",
    description:
      "Devices, gateways, modules électroniques et domotique. Prix TTC en francs CFA, transport et TVA compris. Les compteurs d’eau sont sur devis.",
  },
  "/services": {
    title: "Services",
    description:
      "Vente d’équipements, intégration, déploiement, conseil, exploitation des données et formation LoRaWAN pour les écoles.",
  },
  "/usages": {
    title: "Cas d’usage",
    description:
      "Eau postpayée ou prépayée, énergie, ville et agriculture : la même architecture, du capteur jusqu’à la plateforme SNTRONIC.",
  },
  "/guide": {
    title: "Choisir un réseau",
    description:
      "LoRaWAN, LTE-M ou NB-IoT : qui porte le réseau, l’objet bouge-t-il, et combien d’octets partent à chaque envoi.",
  },
  "/blog": {
    title: "Blog",
    description:
      "Compteur d’eau LoRaWAN, prépayé STS, test de couverture et choix entre LoRaWAN, LTE-M et NB-IoT.",
  },
  "/a-propos": {
    title: "À propos de nous",
    description:
      "SNTRONIC accompagne les projets IoT à Dakar, de la fourniture des équipements à l’exploitation des données.",
  },
  "/formation": {
    title: "Formation",
    description:
      "Sessions pratiques pour les écoles de formation : technologies LoRaWAN, intégration de services IoT, et laboratoire sur place. Demande par formulaire.",
  },
  "/contact": {
    title: "Contact",
    description:
      "Demander un devis à SNTRONIC : contact@sntronic.com, WhatsApp +221 78 100 07 34, Dakar, Golf sud.",
  },
  "/livraison": {
    title: "Livraison et retours",
    description:
      "Une commande est livrée entre 3 jours et 1 semaine. Pour une quantité importante, le délai est indiqué dans le devis.",
  },
  "/mentions": {
    title: "Mentions légales",
    description: "Mentions légales de SNTRONIC, Golf sud, villa 610, Dakar.",
  },
  "/panier": {
    title: "Panier",
    description: "Votre sélection d’équipements SNTRONIC, prix TTC en francs CFA.",
  },
  "/commande": {
    title: "Commande",
    description: "Envoyer une commande SNTRONIC. Le paiement ne se fait pas en ligne : la demande part par e-mail.",
  },
  "/commande/confirmation": {
    title: "Demande enregistrée",
    description: "La demande de commande SNTRONIC est prête à être envoyée.",
  },
};

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(href: string) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function DocumentMeta() {
  const { pathname, search } = useLocation();
  const { getProduct } = useCatalog();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const product = pathname.startsWith("/produit/") ? getProduct(pathname.slice("/produit/".length)) : undefined;
    const article = pathname.startsWith("/blog/") ? getArticle(pathname.slice("/blog/".length)) : undefined;
    const aisleId = pathname.startsWith("/catalogue/") ? pathname.slice("/catalogue/".length) : undefined;
    const aisle = getAisle(aisleId);
    const category = getCategory(aisleId);
    const params = new URLSearchParams(search);
    const accessory = pathname === "/catalogue" ? getAccessory(params.get("accessoire")) : undefined;
    const usage = pathname === "/catalogue" ? getUsage(params.get("usage")) : undefined;

    let title = HOME_TITLE;
    let description = pages["/"].description;

    if (product) {
      title = `${product.name} — SNTRONIC`;
      description = product.summary;
    } else if (article) {
      title = `${article.title} — SNTRONIC`;
      description = article.description;
    } else if (aisle) {
      title = `${aisle.name} — SNTRONIC`;
      description = aisle.pitch;
    } else if (category) {
      title = `${category.name} — SNTRONIC`;
      description = category.pitch;
    } else if (accessory) {
      title = `${accessory.name} — SNTRONIC`;
      description = accessory.pitch;
    } else if (usage) {
      title = `${usage.name} — SNTRONIC`;
      description = usage.pitch;
    } else if (pathname.startsWith("/catalogue/") && !aisle && !category) {
      title = "Page introuvable — SNTRONIC";
      description = "Cette page n’existe pas sur SNTRONIC.";
    } else if (pages[pathname]) {
      title = pages[pathname].title.includes("SNTRONIC") ? pages[pathname].title : `${pages[pathname].title} — SNTRONIC`;
      description = pages[pathname].description;
    } else if (pathname !== "/") {
      title = "Page introuvable — SNTRONIC";
      description = "Cette page n’existe pas sur SNTRONIC.";
    }

    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", article ? "article" : "website", "property");
    setMeta("og:url", `${site.url}${pathname}`, "property");
    setCanonical(`${site.url}${pathname}`);
  }, [getProduct, pathname, search]);

  return null;
}
