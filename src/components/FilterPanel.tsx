import type { ReactNode, RefObject } from "react";

export type FacetValues = {
  techno: string;
  marque: string;
  famille: string;
  cat: string;
  ip: string;
  dispo: string;
  pmin: string;
  pmax: string;
};

export type FacetOptions = {
  technos: string[];
  brands: string[];
  families: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  ips: string[];
  showFamily: boolean;
  showCategory: boolean;
};

const dispoOptions = [
  { id: "", label: "Toutes" },
  { id: "stock", label: "En stock" },
  { id: "limite", label: "Stock limité" },
  { id: "commande", label: "Sur commande" },
  { id: "devis", label: "Sur devis" },
];

export function FilterPanel({
  options,
  values,
  onChange,
  onClear,
  activeCount,
  mobileOpen,
  onClose,
  closeRef,
}: {
  options: FacetOptions;
  values: FacetValues;
  onChange: (key: keyof FacetValues, value: string) => void;
  onClear: () => void;
  activeCount: number;
  mobileOpen: boolean;
  onClose: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className={mobileOpen ? "filters-shell is-open" : "filters-shell"}>
      <button type="button" className="filters-backdrop" aria-label="Fermer les filtres" onClick={onClose} />
      <aside className="filters-panel" id="filtres" aria-label="Filtres du catalogue">
        <div className="filters-head">
          <h2>Filtres</h2>
          <button ref={closeRef} type="button" className="filters-close" aria-label="Fermer les filtres" onClick={onClose}>
            ×
          </button>
        </div>
        {options.technos.length > 0 && (
          <fieldset>
            <legend>Technologie</legend>
            <Pill on={values.techno === ""} onClick={() => onChange("techno", "")}>
              Toutes
            </Pill>
            {options.technos.map((item) => (
              <Pill key={item} on={values.techno === item} onClick={() => onChange("techno", values.techno === item ? "" : item)}>
                {item}
              </Pill>
            ))}
          </fieldset>
        )}
        {options.showFamily && options.families.length > 1 && (
          <fieldset>
            <legend>Famille</legend>
            <Pill on={values.famille === ""} onClick={() => onChange("famille", "")}>
              Toutes
            </Pill>
            {options.families.map((item) => (
              <Pill key={item.id} on={values.famille === item.id} onClick={() => onChange("famille", values.famille === item.id ? "" : item.id)}>
                {item.name}
              </Pill>
            ))}
          </fieldset>
        )}
        {options.showCategory && options.categories.length > 1 && (
          <fieldset>
            <legend>Catégorie</legend>
            <Pill on={values.cat === ""} onClick={() => onChange("cat", "")}>
              Toutes
            </Pill>
            {options.categories.map((item) => (
              <Pill key={item.id} on={values.cat === item.id} onClick={() => onChange("cat", values.cat === item.id ? "" : item.id)}>
                {item.name}
              </Pill>
            ))}
          </fieldset>
        )}
        {options.brands.length > 1 && (
          <label className="field">
            <span>Marque</span>
            <select value={values.marque} onChange={(event) => onChange("marque", event.target.value)}>
              <option value="">Toutes les marques</option>
              {options.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>
        )}
        {options.ips.length > 0 && (
          <fieldset>
            <legend>Indice IP</legend>
            <Pill on={values.ip === ""} onClick={() => onChange("ip", "")}>
              Tous
            </Pill>
            {options.ips.map((item) => (
              <Pill key={item} on={values.ip === item} onClick={() => onChange("ip", values.ip === item ? "" : item)}>
                {item}
              </Pill>
            ))}
          </fieldset>
        )}
        <fieldset>
          <legend>Disponibilité</legend>
          {dispoOptions.map((item) => (
            <Pill key={item.id || "toutes"} on={values.dispo === item.id} onClick={() => onChange("dispo", item.id)}>
              {item.label}
            </Pill>
          ))}
        </fieldset>
        <fieldset className="filters-price">
          <legend>Prix TTC (F CFA)</legend>
          <label>
            <span className="sr-only">Prix minimum</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Min"
              value={values.pmin}
              onChange={(event) => onChange("pmin", event.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">Prix maximum</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Max"
              value={values.pmax}
              onChange={(event) => onChange("pmax", event.target.value)}
            />
          </label>
        </fieldset>
        {activeCount > 0 && (
          <button type="button" className="text-btn" onClick={onClear}>
            Effacer les filtres
          </button>
        )}
      </aside>
    </div>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={on ? "pill on" : "pill"} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}
