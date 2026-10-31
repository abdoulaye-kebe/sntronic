import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisleOf, getAisle, getCategory, normalize, type Product } from "../data/catalog.ts";
import { useTitle } from "../lib/useTitle.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

export function CatalogPage() {
  const { category: categoryId } = useParams();
  const aisle = categoryId ? getAisle(categoryId) : undefined;
  const category = categoryId ? getCategory(categoryId) : undefined;
  const [params, setParams] = useSearchParams();
  const { products: allProducts } = useCatalog();

  const title = aisle?.name ?? category?.name ?? "Catalogue";
  useTitle(categoryId && !aisle && !category ? "Page introuvable" : title);

  const base = useMemo(() => {
    if (aisle) return allProducts.filter((product) => aisleOf(product) === aisle.id);
    if (category) return allProducts.filter((product) => product.category === category.id);
    return allProducts;
  }, [allProducts, aisle, category]);

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

  if (categoryId && !aisle && !category) return <NotFoundPage />;

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
          ...(aisle ? [{ label: aisle.name }] : category ? [{ label: category.name }] : []),
        ]}
      />
      <div className="catalog">
        <header className="section-head catalog-head">
          <div>
            <div className="catalog-title">
              <h1 className="section-title">{title}</h1>
              <p className="result-count">
                {list.length === 0 ? "Aucune référence" : `${list.length} référence${list.length > 1 ? "s" : ""}`}
                {query ? ` pour « ${query} »` : ""}
              </p>
            </div>
            <p>{aisle?.pitch ?? category?.text ?? "Devices, gateways, modules électroniques et domotique."}</p>
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
        <div className="catalog-bar">
          <fieldset>
            <legend>Réseau</legend>
            <button type="button" className={network === "" ? "pill on" : "pill"} onClick={() => setParam("reseau", "")}>
              Tous
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
            <legend>Lieu</legend>
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
            <legend>Stock</legend>
            <button
              type="button"
              className={availability === "stock" ? "pill on" : "pill"}
              onClick={() => setParam("dispo", availability === "stock" ? "" : "stock")}
            >
              En stock
            </button>
          </fieldset>
          {filtersOn && (
            <button type="button" className="text-btn" onClick={() => setParams(new URLSearchParams())}>
              Effacer
            </button>
          )}
        </div>
        {list.length === 0 ? (
          <div className="empty">
            <p>Aucune fiche ne correspond. Élargissez le réseau ou effacez la recherche.</p>
          </div>
        ) : (
          <div className="grid-products">
            {list.map((product) => (
              <ProductCard key={product.slug} product={product} compact />
            ))}
          </div>
        )}
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
