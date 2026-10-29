import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { getCategory, normalize, type Product } from "../data/catalog.ts";
import { useTitle } from "../lib/useTitle.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

export function CatalogPage() {
  const { category: categoryId } = useParams();
  const category = categoryId ? getCategory(categoryId) : undefined;
  const [params, setParams] = useSearchParams();
  const { products: allProducts } = useCatalog();

  const title = category?.name ?? "Catalogue";
  useTitle(categoryId && !category ? "Page introuvable" : title);

  const base = useMemo(
    () => (category ? allProducts.filter((product) => product.category === category.id) : allProducts),
    [allProducts, category],
  );

  const query = params.get("q") ?? "";
  const network = params.get("reseau") ?? "";
  const place = params.get("lieu") ?? "";
  const availability = params.get("dispo") ?? "";
  const sort = params.get("tri") ?? "";

  const networks = unique(base.map((product) => product.connectivity));
  const places = unique(base.map((product) => product.environment));

  const list = useMemo(() => {
    const needle = normalize(query);
    const filtered = base.filter((product) => {
      if (needle) {
        const haystack = normalize(
          [product.name, product.ref, product.line, product.summary, product.highlights.join(" ")].join(" "),
        );
        if (!haystack.includes(needle)) return false;
      }
      if (network && product.connectivity !== network) return false;
      if (place && product.environment !== place) return false;
      if (availability === "stock" && product.stock <= 0) return false;
      return true;
    });
    return sortProducts(filtered, sort);
  }, [availability, base, network, place, query, sort]);

  if (categoryId && !category) return <NotFoundPage />;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  const filtersOn = Boolean(query || network || place || availability);

  return (
    <div className="wrap page">
      <Breadcrumb
        items={[
          { label: "Accueil", to: "/" },
          { label: "Catalogue", to: "/catalogue" },
          ...(category ? [{ label: category.name }] : []),
        ]}
      />
      <div className="catalog">
        <aside className="filters">
          <fieldset>
            <legend>Connectivité</legend>
            <button type="button" className={network === "" ? "pill on" : "pill"} onClick={() => setParam("reseau", "")}>
              Toutes
            </button>
            {networks.map((item) => (
              <button
                key={item}
                type="button"
                className={network === item ? "pill on" : "pill"}
                onClick={() => setParam("reseau", item)}
              >
                {item}
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>Usage</legend>
            <button type="button" className={place === "" ? "pill on" : "pill"} onClick={() => setParam("lieu", "")}>
              Tous
            </button>
            {places.map((item) => (
              <button
                key={item}
                type="button"
                className={place === item ? "pill on" : "pill"}
                onClick={() => setParam("lieu", item)}
              >
                {item}
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>Disponibilité</legend>
            <button
              type="button"
              className={availability === "stock" ? "pill on" : "pill"}
              onClick={() => setParam("dispo", availability === "stock" ? "" : "stock")}
            >
              En stock
            </button>
          </fieldset>
          {filtersOn && (
            <button
              type="button"
              className="text-btn"
              onClick={() => setParams(new URLSearchParams())}
            >
              Effacer les filtres
            </button>
          )}
        </aside>
        <div>
          <header className="section-head">
            <div>
              <h1 className="section-title">{title}</h1>
              <p>{category?.text ?? "Capteurs, terminaux cellulaires, passerelles et modules."}</p>
            </div>
            <label className="sort-label">
              <span className="sr-only">Trier</span>
              <select className="sort" value={sort} onChange={(event) => setParam("tri", event.target.value)}>
                <option value="">Mise en avant</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="nom">Nom</option>
              </select>
            </label>
          </header>
          <p className="result-count">
            {list.length === 0
              ? "Aucune référence"
              : `${list.length} référence${list.length > 1 ? "s" : ""}`}
            {query ? ` pour « ${query} »` : ""}
          </p>
          {list.length === 0 ? (
            <div className="empty">
              <p>Aucune fiche ne correspond. Élargissez la connectivité ou effacez la recherche.</p>
            </div>
          ) : (
            <div className="grid-products">
              {list.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function unique<T extends string>(values: T[]): T[] {
  return [...new Set(values)];
}

function sortProducts(list: Product[], sort: string): Product[] {
  const copy = [...list];
  if (sort === "prix-asc") copy.sort((a, b) => a.priceHt - b.priceHt);
  else if (sort === "prix-desc") copy.sort((a, b) => b.priceHt - a.priceHt);
  else if (sort === "nom") copy.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  else {
    copy.sort(
      (a, b) =>
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        Number(b.stock > 0) - Number(a.stock > 0) ||
        a.name.localeCompare(b.name, "fr"),
    );
  }
  return copy;
}
