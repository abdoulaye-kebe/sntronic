import { site } from "../data/site.ts";

export function formatXOF(value: number): string {
  const amount = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value);
  return `${amount} F CFA`;
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
