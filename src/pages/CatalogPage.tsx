import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb.tsx";
import { Button } from "../components/Button.tsx";
import { FilterPanel, type FacetOptions, type FacetValues } from "../components/FilterPanel.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisleOf, aisles, categories, getAisle, getCategory, normalize, type Product } from "../data/catalog.ts";
import { getAccessory, getUsage } from "../data/menu.ts";
import { isQuoted, unitTtcXof } from "../lib/money.ts";
import { useTitle } from "../lib/useTitle.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

const PAGE = 12;
const FACETS = ["techno", "marque", "famille", "cat", "ip", "dispo", "pmin", "pmax"] as const;

export function ipCode(product: Product): string | null {
  const blob = [...product.specs.map(([, value]) => value), ...product.highlights].join(" ");
  const match = blob.match(/IP\s?\d{2}/i);
  return match ? match[0].replace(/\s+/g, "").toUpperCase() : null;
}

export function CatalogPage() {
  const { category: categoryId } = useParams();
  const aisle = categoryId ? getAisle(categoryId) : undefined;
  const category = categoryId ? getCategory(categoryId) : undefined;
  const [params, setParams] = useSearchParams();
  const { products: allProducts } = useCatalog();
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

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
  const values: FacetValues = {
    techno: params.get("techno") ?? "",
    marque: params.get("marque") ?? "",
    famille: params.get("famille") ?? "",
    cat: params.get("cat") ?? "",
    ip: params.get("ip") ?? "",
    dispo: params.get("dispo") ?? "",
    pmin: params.get("pmin") ?? "",
    pmax: params.get("pmax") ?? "",
  };

  const searched = useMemo(() => {
    const needle = normalize(query);
    return base.filter((product) => {
      if (!needle) return true;
      const haystack = normalize([product.name, product.ref, product.line, product.summary, product.highlights.join(" ")].join(" "));
      return haystack.includes(needle);
    });
  }, [base, query]);

  const options = useMemo(() => facetOptions(searched, !aisle && !category, !category), [category, aisle, searched]);

  const list = useMemo(() => sortProducts(searched.filter((product) => matchFacets(product, values)), sort, aisle?.id), [aisle, searched, sort, values]);

  const facetKey = FACETS.map((key) => values[key]).join("|");
  useEffect(() => {
    setShown(PAGE);
  }, [facetKey, query, sort, categoryId, usage?.id, accessory?.id]);

  useEffect(() => {
    if (!filtersOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  if (categoryId && !aisle && !category) return <NotFoundPage />;

  const visible = list.slice(0, shown);
  const activeCount = FACETS.filter((key) => values[key]).length;
  const description =
    accessory?.pitch ?? usage?.pitch ?? aisle?.pitch ?? category?.text ?? "Devices, gateways, modules électroniques et domotique.";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  function clearFacets() {
    const next = new URLSearchParams(params);
    for (const key of FACETS) next.delete(key);
    next.delete("q");
    setParams(next);
    setFiltersOpen(false);
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
      <header className="catalog-intro">
        <p className="eyebrow">Catalogue</p>
        <h1 className="section-title">{title}</h1>
        <p className="lede">{description}</p>
      </header>
      <div className="catalog-layout">
        <FilterPanel
          options={options}
          values={values}
          activeCount={activeCount}
          onChange={setParam}
          onClear={clearFacets}
          mobileOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          closeRef={closeRef}
        />
        <div className="catalog">
          <div className="catalog-toolbar">
            <p className="result-count">
              {list.length === 0 ? "Aucune référence" : `${list.length} référence${list.length > 1 ? "s" : ""}`}
              {query ? ` pour « ${query} »` : ""}
            </p>
            <button
              type="button"
              className="btn btn-ghost filters-toggle"
              aria-expanded={filtersOpen}
              aria-controls="filtres"
              onClick={() => setFiltersOpen(true)}
            >
              Filtres{activeCount ? ` (${activeCount})` : ""}
            </button>
            <label className="sort-label">
              <span className="sr-only">Trier</span>
              <select className="sort" value={sort} onChange={(event) => setParam("tri", event.target.value)}>
                <option value="">Mise en avant</option>
                <option value="nouveautes">Nouveautés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="nom">Nom</option>
              </select>
            </label>
          </div>
          {list.length === 0 ? (
            <div className="empty">
              <p>Aucune référence ne correspond à ces critères.</p>
              {activeCount > 0 || query ? (
                <Button variant="ghost" onClick={clearFacets}>
                  Effacer les filtres
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="grid-products">
                {visible.map((product) => (
                  <ProductCard key={product.slug} product={product} compact />
                ))}
              </div>
              {shown < list.length && (
                <div className="catalog-more">
                  <Button variant="ghost" onClick={() => setShown((count) => count + PAGE)}>
                    Charger plus ({list.length - shown})
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function matchFacets(product: Product, values: FacetValues): boolean {
  if (values.techno && product.connectivity !== values.techno) return false;
  if (values.marque && product.line !== values.marque) return false;
  if (values.famille && aisleOf(product) !== values.famille) return false;
  if (values.cat && product.category !== values.cat) return false;
  if (values.ip && ipCode(product) !== values.ip) return false;
  const quoted = isQuoted(product);
  if (values.dispo === "stock" && !(product.stock > 5 && !quoted)) return false;
  if (values.dispo === "limite" && !(product.stock > 0 && product.stock <= 5 && !quoted)) return false;
  if (values.dispo === "commande" && !(product.stock <= 0 && !quoted)) return false;
  if (values.dispo === "devis" && !quoted) return false;
  if (values.pmin || values.pmax) {
    if (quoted) return false;
    const price = unitTtcXof(product.priceHt);
    if (values.pmin && price < Number(values.pmin)) return false;
    if (values.pmax && price > Number(values.pmax)) return false;
  }
  return true;
}

function facetOptions(list: Product[], showFamily: boolean, showCategory: boolean): FacetOptions {
  const technos = unique(list.map((item) => item.connectivity)).filter((item) => item === "LoRaWAN" || item === "LTE-M" || item === "NB-IoT");
  const brands = unique(list.map((item) => item.line)).sort((a, b) => a.localeCompare(b, "fr"));
  const familyIds = new Set(list.map((item) => aisleOf(item)));
  const categoryIds = new Set(list.map((item) => item.category));
  const ips = unique(list.map((item) => ipCode(item) ?? "")).filter(Boolean).sort();
  return {
    technos,
    brands,
    families: aisles.filter((item) => familyIds.has(item.id)).map((item) => ({ id: item.id, name: item.name })),
    categories: categories.filter((item) => categoryIds.has(item.id)).map((item) => ({ id: item.id, name: item.short })),
    ips,
    showFamily,
    showCategory,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function sortProducts(list: Product[], sort: string, aisleId?: string): Product[] {
  const copy = [...list];
  const quoteRank = (item: Product) => (isQuoted(item) ? 1 : 0);
  if (sort === "prix-asc") copy.sort((a, b) => quoteRank(a) - quoteRank(b) || a.priceHt - b.priceHt);
  else if (sort === "prix-desc") copy.sort((a, b) => quoteRank(a) - quoteRank(b) || b.priceHt - a.priceHt);
  else if (sort === "nom") copy.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  else if (sort === "nouveautes") {
    copy.sort(
      (a, b) =>
        Number(b.badge === "Nouveau") - Number(a.badge === "Nouveau") ||
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        a.name.localeCompare(b.name, "fr"),
    );
  } else {
    const metersFirst = aisleId === "devices";
    copy.sort((a, b) => {
      if (metersFirst) {
        const meters = Number(b.line === "Shengda") - Number(a.line === "Shengda");
        if (meters) return meters;
      }
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(b.stock > 0) - Number(a.stock > 0) || a.name.localeCompare(b.name, "fr");
    });
  }
  return copy;
}
