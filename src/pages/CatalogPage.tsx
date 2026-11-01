import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisleOf, getAisle, getCategory, normalize, type Product } from "../data/catalog.ts";
import { getAccessory, getUsage } from "../data/menu.ts";
import { useTitle } from "../lib/useTitle.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

export function CatalogPage() {
  const { category: categoryId } = useParams();
  const aisle = categoryId ? getAisle(categoryId) : undefined;
  const category = categoryId ? getCategory(categoryId) : undefined;
  const [params, setParams] = useSearchParams();
  const { products: allProducts } = useCatalog();

  const usage = getUsage(params.get("usage"));
  const accessory = getAccessory(params.get("accessoire"));
  const title = accessory?.name ?? usage?.name ?? aisle?.name ?? category?.name ?? "Catalogue";
  useTitle(categoryId && !aisle && !category ? "Page introuvable" : title);

  const base = useMemo(() => {
    let list = allProducts;
    if (aisle) list = list.filter((product) => aisleOf(product) === aisle.id);
    else if (category) list = list.filter((product) => product.category === category.id);
    if (usage) list = list.filter((product) => (usage.slugs as readonly string[]).includes(product.slug));
    if (accessory) list = list.filter((product) => (accessory.slugs as readonly string[]).includes(product.slug));
    return list;
  }, [accessory, aisle, allProducts, category, usage]);

  const query = params.get("q") ?? "";
  const sort = params.get("tri") ?? "";

  const list = useMemo(() => {
    const needle = normalize(query);
    const filtered = base.filter((product) => {
      if (!needle) return true;
      const haystack = normalize(
        [product.name, product.ref, product.line, product.summary, product.highlights.join(" ")].join(" "),
      );
      return haystack.includes(needle);
    });
    return sortProducts(filtered, sort);
  }, [base, query, sort]);

  if (categoryId && !aisle && !category) return <NotFoundPage />;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  return (
    <div className="wrap page">
      <Breadcrumb
        items={[
          { label: "Accueil", to: "/" },
          { label: "Catalogue", to: "/catalogue" },
          ...(accessory
            ? [{ label: accessory.name }]
            : usage
              ? [{ label: usage.name }]
              : aisle
                  ? [{ label: aisle.name }]
                  : category
                    ? [{ label: category.name }]
                    : []),
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
            <p>
              {accessory?.pitch ??
                usage?.pitch ??
                aisle?.pitch ??
                category?.text ??
                "Devices, gateways, modules électroniques et domotique."}
            </p>
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
        {list.length === 0 ? (
          <div className="empty">
            <p>Aucune fiche ne correspond.</p>
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

function sortProducts(list: Product[], sort: string): Product[] {
  const copy = [...list];
  const quoteRank = (item: Product) => (item.quote ? 1 : 0);
  if (sort === "prix-asc") copy.sort((a, b) => quoteRank(a) - quoteRank(b) || a.priceHt - b.priceHt);
  else if (sort === "prix-desc") copy.sort((a, b) => quoteRank(a) - quoteRank(b) || b.priceHt - a.priceHt);
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
