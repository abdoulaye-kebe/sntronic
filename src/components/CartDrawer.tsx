import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { site } from "../data/site.ts";
import { cartTotals, formatXOF } from "../lib/money.ts";
import { ProductPhoto } from "./ProductPhoto.tsx";
import { Price } from "./Price.tsx";
import { QtyStepper } from "./QtyStepper.tsx";

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove } = useCart();
  const totals = cartTotals(lines.map((line) => ({ priceHt: line.product.priceHt, qty: line.qty })));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <>
      <div className={open ? "overlay show" : "overlay"} onClick={() => setOpen(false)} />
      <aside className={open ? "drawer open" : "drawer"} aria-hidden={!open} inert={!open}>
        <div className="drawer-head">
          <h2>Panier</h2>
          <button type="button" className="icon-btn" onClick={() => setOpen(false)}>
            Fermer
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer-body">
            <p className="muted">Le panier est vide. Le catalogue a les capteurs, les passerelles et les modules.</p>
            <Link className="btn btn-primary" to="/catalogue" onClick={() => setOpen(false)}>
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <ul className="lines">
                {lines.map((line) => (
                  <li key={line.slug} className="line">
                    <ProductPhoto product={line.product} small alt="" />
                    <div>
                      <Link to={`/produit/${line.slug}`} onClick={() => setOpen(false)}>
                        {line.product.name}
                      </Link>
                      <p className="card-line">{line.product.ref}</p>
                      <QtyStepper
                        value={line.qty}
                        max={line.product.stock}
                        onChange={(qty) => setQty(line.slug, qty)}
                      />
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
            </div>
            <div className="drawer-foot">
              <p className="ship-note">Transport inclus. TVA 18 %. {site.delivery}</p>
              <p className="total-row">
                <span>Total</span>
                <strong>{formatXOF(totals.totalTtc)}</strong>
              </p>
              <Link className="btn btn-clay" to="/commande" onClick={() => setOpen(false)}>
                Passer commande
              </Link>
              <Link className="btn btn-ghost" to="/panier" onClick={() => setOpen(false)}>
                Voir le panier
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
