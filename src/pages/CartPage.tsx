import { Link } from "react-router-dom";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { Price } from "../components/Price.tsx";
import { QtyStepper } from "../components/QtyStepper.tsx";
import { useCart } from "../context/CartContext.tsx";
import { site } from "../data/site.ts";
import { cartTotals, formatEUR, formatXOF, toXof } from "../lib/money.ts";
import { useTitle } from "../lib/useTitle.ts";

export function CartPage() {
  useTitle("Panier");
  const { lines, setQty, remove } = useCart();
  const totals = cartTotals(lines.map((line) => ({ priceHt: line.product.priceHt, qty: line.qty })));
  const remain = site.freeShippingFromTtc - totals.productsTtc;

  return (
    <div className="wrap page">
      <h1 className="section-title">Panier</h1>
      {lines.length === 0 ? (
        <div className="empty">
          <p>Aucune référence pour le moment.</p>
          <Link className="btn btn-primary" to="/catalogue">
            Retourner au catalogue
          </Link>
        </div>
      ) : (
        <div className="checkout">
          <ul className="lines lines-page">
            {lines.map((line) => (
              <li key={line.slug} className="line">
                <ProductPhoto product={line.product} small alt="" />
                <div>
                  <Link to={`/produit/${line.slug}`}>{line.product.name}</Link>
                  <p className="card-line">{line.product.ref}</p>
                  <QtyStepper value={line.qty} max={line.product.stock} onChange={(qty) => setQty(line.slug, qty)} />
                </div>
                <div className="line-end">
                  <Price ht={line.product.priceHt} qty={line.qty} />
                  <button type="button" className="text-btn" onClick={() => remove(line.slug)}>
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="summary">
            <h2>Récapitulatif</h2>
            <TotalsBlock
              ht={totals.ht}
              vat={totals.vat}
              shippingTtc={totals.shippingTtc}
              totalTtc={totals.totalTtc}
            />
            <p className="fine">
              {remain > 0
                ? `Plus que ${formatEUR(remain)} (${formatXOF(toXof(remain))}) pour la livraison offerte en France métropolitaine.`
                : "Livraison offerte en France métropolitaine."}
            </p>
            <Link className="btn btn-clay" to="/commande">
              Continuer la commande
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export function TotalsBlock({
  ht,
  vat,
  shippingTtc,
  totalTtc,
}: {
  ht: number;
  vat: number;
  shippingTtc: number | null;
  totalTtc: number;
}) {
  return (
    <dl className="totals">
      <div>
        <dt>Sous-total HT</dt>
        <dd>
          {formatEUR(ht)}
          <small className="price-xof">{formatXOF(toXof(ht))}</small>
        </dd>
      </div>
      <div>
        <dt>TVA {Math.round(site.vatRate * 100)} %</dt>
        <dd>
          {formatEUR(vat)}
          <small className="price-xof">{formatXOF(toXof(vat))}</small>
        </dd>
      </div>
      <div>
        <dt>Livraison</dt>
        <dd>
          {shippingTtc === null ? "Sur devis" : shippingTtc === 0 ? "Offerte" : formatEUR(shippingTtc)}
          {shippingTtc ? <small className="price-xof">{formatXOF(toXof(shippingTtc))}</small> : null}
        </dd>
      </div>
      <div className="totals-strong">
        <dt>{shippingTtc === null ? "Total produits TTC" : "Total TTC"}</dt>
        <dd>
          {formatEUR(totalTtc)}
          <small className="price-xof">{formatXOF(toXof(totalTtc))}</small>
        </dd>
      </div>
    </dl>
  );
}
