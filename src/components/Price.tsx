import { formatXOF, lineTtcXof } from "../lib/money.ts";

export function Price({
  ht,
  qty = 1,
  large = false,
}: {
  ht: number;
  qty?: number;
  large?: boolean;
  compact?: boolean;
}) {
  return (
    <p className={large ? "price price-lg" : "price"}>
      <span className="price-ttc">{formatXOF(lineTtcXof(ht, qty))}</span>
    </p>
  );
}

export function Stock({ stock, lead }: { stock: number; lead?: string }) {
  if (stock <= 0) {
    return <p className="stock stock-out">Sur commande{lead ? ` · ${lead}` : ""}</p>;
  }
  if (stock <= 5) return <p className="stock stock-low">Plus que {stock} en stock</p>;
  return <p className="stock stock-ok">En stock</p>;
}
