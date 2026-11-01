import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { getCategory } from "../data/catalog.ts";
import { site } from "../data/site.ts";
import { formatXOF, lineTtcXof } from "../lib/money.ts";
import { useTitle } from "../lib/useTitle.ts";

const AUTH_KEY = "sntronic-admin";

export function AdminPage() {
  useTitle("Administration");
  const auth = useAdminAuth();
  const { products, customized, resetCatalog } = useCatalog();
  const [query, setQuery] = useState("");

  if (!auth.ok) return <AdminLogin onSuccess={auth.login} />;

  const needle = query.trim().toLowerCase();
  const visible = products.filter((product) => {
    if (!needle) return true;
    return `${product.name} ${product.ref} ${product.line}`.toLowerCase().includes(needle);
  });

  return (
    <div className="wrap page">
      <div className="admin-top">
        <div>
          <p className="eyebrow">Atelier</p>
          <h1 className="section-title">Alimenter le catalogue</h1>
          <p className="lede">
            Les fiches enregistrées ici restent dans ce navigateur et s’affichent tout de suite sur la boutique.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="btn btn-clay" to="/admin/nouveau">
            Nouvelle référence
          </Link>
          <button type="button" className="btn btn-ghost" onClick={auth.logout}>
            Fermer la session
          </button>
        </div>
      </div>
      <div className="admin-tools">
        <input
          value={query}
          placeholder="Filtrer par nom ou référence"
          onChange={(event) => setQuery(event.target.value)}
        />
        {customized && (
          <button
            type="button"
            className="text-btn"
            onClick={() => {
              if (window.confirm("Revenir au catalogue d’origine ? Les fiches modifiées dans ce navigateur seront effacées.")) {
                resetCatalog();
              }
            }}
          >
            Revenir au catalogue d’origine
          </button>
        )}
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Référence</th>
              <th>Prix TTC</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.slug}>
                <td>
                  <ProductPhoto product={product} small />
                </td>
                <td>
                  <strong>{product.name}</strong>
                  <small>
                    {product.ref} · {getCategory(product.category)?.short}
                  </small>
                </td>
                <td>
                  {formatXOF(lineTtcXof(product.priceHt))}
                </td>
                <td>{product.stock > 0 ? product.stock : "Sur commande"}</td>
                <td>
                  <Link to={`/admin/${product.slug}`}>Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function useAdminAuth() {
  const [ok, setOk] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  return {
    ok,
    login: (pin: string) => {
      if (pin.trim() !== site.adminPin) return false;
      sessionStorage.setItem(AUTH_KEY, "1");
      setOk(true);
      return true;
    },
    logout: () => {
      sessionStorage.removeItem(AUTH_KEY);
      setOk(false);
    },
  };
}

export function AdminLogin({ onSuccess }: { onSuccess: (pin: string) => boolean }) {
  const [pin, setPin] = useState("");
  const [failed, setFailed] = useState(false);

  return (
    <div className="wrap page narrow">
      <p className="eyebrow">Atelier</p>
      <h1 className="section-title">Accès administration</h1>
      <p className="lede">Le code se change dans les réglages du site.</p>
      <form
        className="fields"
        onSubmit={(event) => {
          event.preventDefault();
          setFailed(!onSuccess(pin));
        }}
      >
        <label className="field">
          <span>Code</span>
          <input type="password" value={pin} autoFocus onChange={(event) => setPin(event.target.value)} />
        </label>
        {failed && <p className="stock stock-out">Code incorrect.</p>}
        <button className="btn btn-clay" type="submit">
          Entrer
        </button>
      </form>
    </div>
  );
}
