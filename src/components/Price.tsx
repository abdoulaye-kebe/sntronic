import { formatXOF, lineTtcXof } from "../lib/money.ts";

export function Price({
  ht,
  qty = 1,
  large = false,
  quote = false,
}: {
  ht: number;
  qty?: number;
  large?: boolean;
  compact?: boolean;
  quote?: boolean;
}) {
  return (
    <p className={large ? "price price-lg" : "price"}>
      <span className="price-ttc">{quote || !(Number(ht) > 0) ? "Sur devis" : formatXOF(lineTtcXof(ht, qty))}</span>
    </p>
  );
}

export function Stock({ stock, lead }: { stock: number; lead?: string }) {
  if (stock <= 0) {
    return (
      <p className="stock stock-out">
        <span className="stock-dot" aria-hidden="true" />
        Sur commande{lead ? ` · ${lead}` : ""}
      </p>
    );
  }
  if (stock <= 5) {
    return (
      <p className="stock stock-low">
        <span className="stock-dot" aria-hidden="true" />
        Stock limité
      </p>
    );
  }
  return (
    <p className="stock stock-ok">
      <span className="stock-dot" aria-hidden="true" />
      En stock
    </p>
  );
}
