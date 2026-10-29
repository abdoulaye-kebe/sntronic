import { site } from "../data/site.ts";

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function lineTtc(priceHt: number, qty = 1): number {
  return round2(priceHt * qty * (1 + site.vatRate));
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function toXof(eur: number): number {
  return Math.round(eur * site.eurToXof);
}

export function formatXOF(value: number): string {
  const amount = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value);
  return `${amount} F CFA`;
}

export function shippingFor(productsTtc: number, country = "France"): number | null {
  if (productsTtc <= 0) return 0;
  if (country !== "France") return null;
  if (productsTtc >= site.freeShippingFromTtc) return 0;
  return site.shippingTtc;
}

export type Totals = {
  ht: number;
  vat: number;
  productsTtc: number;
  shippingTtc: number | null;
  totalTtc: number;
};

export function cartTotals(
  lines: { priceHt: number; qty: number }[],
  country = "France",
): Totals {
  const ht = round2(lines.reduce((sum, line) => sum + line.priceHt * line.qty, 0));
  const productsTtc = round2(
    lines.reduce((sum, line) => sum + lineTtc(line.priceHt, line.qty), 0),
  );
  const vat = round2(productsTtc - ht);
  const shippingTtc = shippingFor(productsTtc, country);
  const totalTtc = round2(productsTtc + (shippingTtc ?? 0));
  return { ht, vat, productsTtc, shippingTtc, totalTtc };
}
