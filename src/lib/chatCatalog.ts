import { aisleOf, getAisle, type Product } from "../data/catalog.ts";
import { formatXOF, lineTtcXof } from "./money.ts";

export function catalogForChat(products: Product[]) {
  return products.map((product) => {
    const ttc = lineTtcXof(product.priceHt);
    return {
      slug: product.slug,
      ref: product.ref,
      name: product.name,
      category: aisleOf(product),
      categoryName: getAisle(aisleOf(product))?.name ?? product.category,
      line: product.line,
      connectivity: product.connectivity,
      environment: product.environment,
      summary: product.summary,
      highlights: product.highlights,
      description: product.description,
      specs: product.specs,
      priceTtc: formatXOF(ttc),
      stock: product.stock,
    };
  });
}

export type ReplyPart = { kind: "text"; value: string } | { kind: "link"; label: string; to: string };

export function replyParts(text: string): ReplyPart[] {
  const parts: ReplyPart[] = [];
  const pattern = /\[([^\]]+)\]\((\/produit\/[a-z0-9-]+)\)/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push({ kind: "text", value: text.slice(cursor, index) });
    parts.push({ kind: "link", label: match[1], to: match[2] });
    cursor = index + match[0].length;
  }
  if (cursor < text.length) parts.push({ kind: "text", value: text.slice(cursor) });
  return parts;
}
