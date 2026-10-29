import { formatEUR, formatXOF, lineTtc, round2, toXof } from "../lib/money.ts";

export function Price({
  ht,
  qty = 1,
  large = false,
}: {
  ht: number;
  qty?: number;
  large?: boolean;
}) {
  const ttc = lineTtc(ht, qty);
  const amountHt = round2(ht * qty);
  return (
    <p className={large ? "price price-lg" : "price"}>
      <span className="price-ttc">
        {formatEUR(ttc)} <span className="tax">TTC</span>
      </span>
      <span className="price-xof">{formatXOF(toXof(ttc))}</span>
      <span className="price-ht">
        {formatEUR(amountHt)} HT · {formatXOF(toXof(amountHt))} HT
      </span>
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
