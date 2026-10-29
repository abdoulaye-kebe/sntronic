import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext.tsx";
import { site } from "../data/site.ts";
import { useTitle } from "../lib/useTitle.ts";

export function ContactPage() {
  useTitle("Contact");
  const [params] = useSearchParams();
  const { getProduct } = useCatalog();
  const product = getProduct(params.get("produit") ?? undefined);
  const intention = params.get("intention");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!product) {
      setMessage("");
      return;
    }
    const lead =
      intention === "delai"
        ? `Merci de m’indiquer le délai pour ${product.name} (réf. ${product.ref}).`
        : `Je vous contacte au sujet de ${product.name} (réf. ${product.ref}).`;
    setMessage(`Bonjour,\n\n${lead}\n`);
  }, [intention, product]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const subject = product ? `${product.ref} — ${name || "Demande"}` : `Message de ${name}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setReady(true);
  }

  return (
    <div className="wrap page narrow">
      <p className="eyebrow">Atelier</p>
      <h1 className="section-title">Écrire avant d’acheter.</h1>
      <p className="lede">
        Dimensionnement d’un site, fiche technique, délai ou lot. Le message s’ouvre dans votre logiciel de messagerie,
        adressé à {site.email}.
      </p>
      {site.phone && <p>{site.phone}</p>}
      <p className="muted">{site.hours}</p>
      {ready && (
        <p className="banner">Si la messagerie ne s’est pas ouverte, copiez le texte et envoyez-le à {site.email}.</p>
      )}
      <form className="fields" onSubmit={submit}>
        <label className="field">
          <span>Nom</span>
          <input value={name} required autoComplete="name" onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input
            type="email"
            value={email}
            required
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea required value={message} onChange={(event) => setMessage(event.target.value)} />
        </label>
        <button className="btn btn-clay" type="submit">
          Préparer l’e-mail
        </button>
      </form>
    </div>
  );
}
