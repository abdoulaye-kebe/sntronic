import { site } from "../data/site.ts";

/** Prix absent ou nul : on n’affiche jamais « 0 F CFA ». */
export function isQuoted(product: { priceHt: number; quote?: boolean }): boolean {
  return Boolean(product.quote) || !(Number(product.priceHt) > 0);
}

export function formatXOF(value: number): string {
  const rounded = Math.round(value);
  if (!Number.isFinite(rounded) || rounded === 0) return "Sur devis";
  const amount = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.abs(rounded));
  const grouped = amount.replace(/[\u00A0\u202F\u2009\u2007 ]/g, "\u202F");
  return `${rounded < 0 ? "−" : ""}${grouped}\u202FF\u00A0CFA`;
}

/** Prix public d’une unité : achat converti, marge, transport, puis TVA. */
export function unitTtcXof(priceHt: number): number {
  const cost = priceHt * site.eurToXof;
  const withMargin = cost * (1 + site.marginRate);
  const withTransport = withMargin * (1 + site.transportRate);
  return Math.round(withTransport * (1 + site.vatRate));
}

export function lineTtcXof(priceHt: number, qty = 1): number {
  return unitTtcXof(priceHt) * qty;
}

export type Totals = {
  ht: number;
  vat: number;
  totalTtc: number;
};

export function cartTotals(lines: { priceHt: number; qty: number }[]): Totals {
  const totalTtc = lines.reduce((sum, line) => sum + lineTtcXof(line.priceHt, line.qty), 0);
  const ht = Math.round(totalTtc / (1 + site.vatRate));
  const vat = totalTtc - ht;
  return { ht, vat, totalTtc };
}
