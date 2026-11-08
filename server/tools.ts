export type ShopCard = {
  slug: string;
  ref: string;
  name: string;
  category: string;
  categoryName: string;
  line: string;
  connectivity: string;
  environment: string;
  summary: string;
  highlights: string[];
  description: string;
  specs: [string, string][];
  priceTtc: string;
  priceHt: string;
  priceXof: string;
  priceHtXof: string;
  stock: number;
};

export type ChatTurn = { role: "user" | "model"; text: string };

const FAMILIES = [
  { id: "devices", name: "Devices" },
  { id: "gateways", name: "Gateways" },
  { id: "modules", name: "Modules électroniques" },
  { id: "domotique", name: "Domotique" },
];

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function sanitizeCatalog(input: unknown): ShopCard[] {
  if (!Array.isArray(input)) return [];
  const cards: ShopCard[] = [];
  for (const item of input.slice(0, 80)) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const slug = clip(row.slug, 80);
    const name = clip(row.name, 120);
    if (!/^[a-z0-9-]+$/.test(slug) || !name) continue;
    const highlights = Array.isArray(row.highlights)
      ? row.highlights.slice(0, 6).map((entry) => clip(entry, 40)).filter(Boolean)
      : [];
    const specs: [string, string][] = [];
    if (Array.isArray(row.specs)) {
      for (const spec of row.specs.slice(0, 12)) {
        if (!Array.isArray(spec) || spec.length < 2) continue;
        const label = clip(spec[0], 40);
        const value = clip(spec[1], 160);
        if (label && value) specs.push([label, value]);
      }
    }
    const stock = typeof row.stock === "number" && Number.isFinite(row.stock) ? Math.max(0, Math.round(row.stock)) : 0;
    cards.push({
      slug,
      ref: clip(row.ref, 40),
      name,
      category: clip(row.category, 40),
      categoryName: clip(row.categoryName, 80),
      line: clip(row.line, 40),
      connectivity: clip(row.connectivity, 40),
      environment: clip(row.environment, 40),
      summary: clip(row.summary, 240),
      highlights,
      description: clip(row.description, 500),
      specs,
      priceTtc: clip(row.priceTtc, 40),
      priceHt: clip(row.priceHt, 40),
      priceXof: clip(row.priceXof, 40),
      priceHtXof: clip(row.priceHtXof, 40),
      stock,
    });
  }
  return cards;
}

export function sanitizeMessages(input: unknown): ChatTurn[] {
  if (!Array.isArray(input)) return [];
  const turns: ChatTurn[] = [];
  for (const item of input.slice(-10)) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const role = row.role === "assistant" || row.role === "model" ? "model" : row.role === "user" ? "user" : null;
    const text = clip(row.text, 2000);
    if (!role || !text) continue;
    turns.push({ role, text });
  }
  return turns;
}

function brief(card: ShopCard) {
  return {
    nom: card.name,
    reference: card.ref,
    slug: card.slug,
    lien: `/produit/${card.slug}`,
    gamme: card.line,
    famille: card.categoryName,
    connectivite: card.connectivity,
    lieu: card.environment,
    resume: card.summary,
    prixTtc: card.priceTtc,
    prixHt: card.priceHt,
    prixTtcCfa: card.priceXof,
    prixHtCfa: card.priceHtXof,
    stock: card.stock > 0 ? `${card.stock} en stock` : "sur commande",
  };
}

function searchProducts(catalog: ShopCard[], args: Record<string, unknown>) {
  const query = clip(args.query, 80);
  const category = clip(args.category, 40);
  const connectivity = clip(args.connectivity, 40);
  const inStock = args.in_stock === true;
  const needle = normalize(query);
  const matches = catalog.filter((card) => {
    if (category && card.category !== category) return false;
    if (connectivity && normalize(card.connectivity) !== normalize(connectivity)) return false;
    if (inStock && card.stock <= 0) return false;
    if (!needle) return true;
    const haystack = normalize(
      [card.name, card.ref, card.line, card.summary, card.connectivity, card.environment, card.categoryName, card.highlights.join(" ")].join(" "),
    );
    return haystack.includes(needle);
  });
  return {
    total: matches.length,
    produits: matches.slice(0, 8).map(brief),
  };
}

function getProduct(catalog: ShopCard[], args: Record<string, unknown>) {
  const ref = normalize(clip(args.ref, 80));
  if (!ref) return { trouve: false };
  const card = catalog.find((item) => normalize(item.slug) === ref || normalize(item.ref) === ref || normalize(item.name) === ref);
  if (!card) return { trouve: false, message: "Aucune fiche pour cette référence." };
  return {
    trouve: true,
    ...brief(card),
    description: card.description,
    points: card.highlights,
    caracteristiques: Object.fromEntries(card.specs),
  };
}

function listCategories(catalog: ShopCard[]) {
  return {
    familles: FAMILIES.map((family) => ({
      id: family.id,
      nom: family.name,
      lien: `/catalogue/${family.id}`,
      nombre: catalog.filter((card) => card.category === family.id).length,
    })),
  };
}

function shopTerms() {
  return {
    tva: "18 %",
    transport: "inclus dans le prix affiché",
    retours: "14 jours",
    horaires: "Du lundi au vendredi, 9h–18h",
    email: "contact@sntronic.com",
    paiement: "La commande part par e-mail. Il n’y a pas de paiement en ligne.",
    prix: "Les prix sont en francs CFA, transport et TVA 18 % compris.",
  };
}

export function runShopTool(name: string, args: Record<string, unknown> | undefined, catalog: ShopCard[]) {
  const input = args ?? {};
  if (name === "search_products") return searchProducts(catalog, input);
  if (name === "get_product") return getProduct(catalog, input);
  if (name === "list_categories") return listCategories(catalog);
  if (name === "shop_terms") return shopTerms();
  return { erreur: "Fonction inconnue." };
}
