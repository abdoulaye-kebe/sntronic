import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductPhoto } from "../components/ProductPhoto.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import {
  categories,
  normalize,
  type ArtKind,
  type CategoryId,
  type Connectivity,
  type Environment,
  type Product,
} from "../data/catalog.ts";
import { readImageFile } from "../lib/imageFile.ts";
import { formatXOF, lineTtc, toXof } from "../lib/money.ts";
import { useTitle } from "../lib/useTitle.ts";
import { AdminLogin, useAdminAuth } from "./AdminPage.tsx";

const connectivities: Connectivity[] = ["LoRaWAN", "LTE-M", "NB-IoT", "Multi", "Radio", "Filaire"];
const environments: Environment[] = ["Intérieur", "Extérieur", "Embarqué", "Rail DIN", "Portable"];
const arts: ArtKind[] = ["node", "puck", "gateway", "pcb"];

const emptyProduct = (): Product => ({
  slug: "",
  ref: "",
  name: "",
  category: "lorawan",
  line: "",
  connectivity: "LoRaWAN",
  environment: "Extérieur",
  art: "node",
  summary: "",
  description: "",
  priceHt: 0,
  stock: 0,
  highlights: [],
  specs: [["Protocole", ""]],
});

export function AdminEditor() {
  const { slug } = useParams();
  const isNew = !slug;
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const { getProduct, saveProduct, deleteProduct } = useCatalog();
  const existing = isNew ? undefined : getProduct(slug);
  const [product, setProduct] = useState<Product>(existing ?? emptyProduct());
  const [highlights, setHighlights] = useState((existing?.highlights ?? []).join(", "));
  const [message, setMessage] = useState("");
  const [photoError, setPhotoError] = useState("");

  useTitle(isNew ? "Nouvelle référence" : "Modifier une référence");

  useEffect(() => {
    const found = isNew ? undefined : getProduct(slug);
    const next = found ?? emptyProduct();
    setProduct(next);
    setHighlights(next.highlights.join(", "));
  }, [getProduct, isNew, slug]);

  if (!auth.ok) return <AdminLogin onSuccess={auth.login} />;
  if (!isNew && !existing) {
    return (
      <div className="wrap page">
        <h1 className="section-title">Fiche introuvable</h1>
        <Link to="/admin">Retour à l’administration</Link>
      </div>
    );
  }

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((current) => ({ ...current, [key]: value }));
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setPhotoError("");
    try {
      update("image", await readImageFile(file));
    } catch {
      setPhotoError("Cette image n’a pas pu être lue.");
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const slugValue = (isNew ? slugify(product.slug || product.name) : product.slug).trim();
    const next: Product = {
      ...product,
      slug: slugValue,
      name: product.name.trim(),
      ref: product.ref.trim(),
      line: product.line.trim(),
      summary: product.summary.trim(),
      description: product.description.trim(),
      priceHt: Number(product.priceHt) || 0,
      stock: Math.max(0, Math.round(Number(product.stock) || 0)),
      highlights: highlights.split(",").map((item) => item.trim()).filter(Boolean),
      specs: product.specs.filter(([label, value]) => label.trim() && value.trim()) as [string, string][],
      image: product.image || undefined,
    };
    if (!next.name || !next.ref || !next.slug) {
      setMessage("Le nom, la référence et l’adresse de la fiche sont obligatoires.");
      return;
    }
    const error = saveProduct(next, isNew ? undefined : slug);
    if (error) {
      setMessage(error);
      return;
    }
    navigate("/admin");
  }

  const preview = { ...product, highlights: highlights.split(",").map((item) => item.trim()).filter(Boolean) };

  return (
    <div className="wrap page">
      <p className="eyebrow">Administration</p>
      <h1 className="section-title">{isNew ? "Nouvelle référence" : product.name}</h1>
      <form className="admin-editor" onSubmit={submit}>
        <div className="fields">
          <div className="photo-edit">
            <ProductPhoto product={preview.slug || preview.name ? { ...preview, slug: preview.slug || "apercu" } : { ...preview, slug: "apercu" }} alt="" />
            <label className="btn btn-ghost">
              Choisir une photo
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={(event) => onFile(event.target.files?.[0])}
              />
            </label>
            {product.image && (
              <button type="button" className="text-btn" onClick={() => update("image", undefined)}>
                Retirer la photo importée
              </button>
            )}
            {photoError && <p className="stock stock-out">{photoError}</p>}
          </div>
          <div className="fields-2">
            <Field label="Nom" value={product.name} onChange={(value) => update("name", value)} required />
            <Field label="Référence" value={product.ref} onChange={(value) => update("ref", value)} required />
          </div>
          <div className="fields-2">
            <Field
              label="Adresse de la fiche"
              value={product.slug}
              onChange={(value) => update("slug", slugify(value))}
              required
            />
            <Field label="Gamme" value={product.line} onChange={(value) => update("line", value)} />
          </div>
          <div className="fields-2">
            <label className="field">
              <span>Famille</span>
              <select value={product.category} onChange={(event) => update("category", event.target.value as CategoryId)}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Connectivité</span>
              <select value={product.connectivity} onChange={(event) => update("connectivity", event.target.value as Connectivity)}>
                {connectivities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="fields-2">
            <label className="field">
              <span>Usage</span>
              <select value={product.environment} onChange={(event) => update("environment", event.target.value as Environment)}>
                {environments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Visuel de repli</span>
              <select value={product.art} onChange={(event) => update("art", event.target.value as ArtKind)}>
                {arts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="fields-2">
            <label className="field">
              <span>Prix HT en euros</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={product.priceHt}
                onChange={(event) => update("priceHt", Number(event.target.value))}
              />
            </label>
            <label className="field">
              <span>Stock</span>
              <input
                type="number"
                min="0"
                step="1"
                value={product.stock}
                onChange={(event) => update("stock", Number(event.target.value))}
              />
            </label>
          </div>
          <p className="fine">
            Soit {formatXOF(toXof(lineTtc(Number(product.priceHt) || 0)))} TTC, au taux fixe 1 € = 655,957 F CFA, TVA française comprise.
          </p>
          <Field
            label="Délai si stock à zéro"
            value={product.lead ?? ""}
            onChange={(value) => update("lead", value)}
          />
          <label className="field">
            <span>Résumé</span>
            <textarea value={product.summary} onChange={(event) => update("summary", event.target.value)} />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea value={product.description} onChange={(event) => update("description", event.target.value)} />
          </label>
          <Field
            label="Pastilles, séparées par des virgules"
            value={highlights}
            onChange={setHighlights}
          />
          <fieldset className="spec-edit">
            <legend>Caractéristiques</legend>
            {product.specs.map(([label, value], index) => (
              <div className="fields-2" key={`${index}-${label}`}>
                <input
                  value={label}
                  aria-label="Intitulé"
                  onChange={(event) => updateSpec(index, event.target.value, value)}
                />
                <input
                  value={value}
                  aria-label="Valeur"
                  onChange={(event) => updateSpec(index, label, event.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-btn"
              onClick={() => update("specs", [...product.specs, ["", ""]])}
            >
              Ajouter une ligne
            </button>
          </fieldset>
          <label className="check">
            <input
              type="checkbox"
              checked={Boolean(product.featured)}
              onChange={(event) => update("featured", event.target.checked)}
            />
            <span>Mettre en avant sur l’accueil</span>
          </label>
          <label className="field">
            <span>Badge</span>
            <select
              value={product.badge ?? ""}
              onChange={(event) =>
                update("badge", event.target.value ? (event.target.value as Product["badge"]) : undefined)
              }
            >
              <option value="">Aucun</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Indispensable">Indispensable</option>
            </select>
          </label>
          {message && <p className="stock stock-out">{message}</p>}
          <div className="hero-actions">
            <button className="btn btn-clay" type="submit">
              Enregistrer
            </button>
            <Link className="btn btn-ghost" to="/admin">
              Annuler
            </Link>
            {!isNew && slug && (
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  if (window.confirm("Retirer cette référence du catalogue ?")) {
                    deleteProduct(slug);
                    navigate("/admin");
                  }
                }}
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );

  function updateSpec(index: number, label: string, value: string) {
    const specs = product.specs.map((row, rowIndex) => (rowIndex === index ? [label, value] as [string, string] : row));
    update("specs", specs);
  }
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function slugify(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
