import { useState, type FormEvent } from "react";
import { site } from "../data/site.ts";
import { useTitle } from "../lib/useTitle.ts";
import { whatsappHref } from "../components/WhatsAppButton.tsx";

const needs = ["Session de formation pratique", "Laboratoire IoT", "Session et laboratoire"] as const;

export function TrainingPage() {
  useTitle("Formation");
  const [school, setSchool] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [need, setNeed] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const body = [
      `École : ${school}`,
      `Contact : ${name}`,
      `E-mail : ${email}`,
      `Téléphone : ${phone}`,
      city ? `Ville : ${city}` : "",
      `Demande : ${need}`,
      headcount ? `Effectif : ${headcount}` : "",
      "",
      message,
    ]
      .filter((line) => line !== "")
      .join("\n");
    const subject = `Formation — ${school}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setReady(true);
  }

  const whatsapp = whatsappHref(
    school || need
      ? `Bonjour SNTRONIC, je représente une école de formation${school ? ` (${school})` : ""}. Demande : ${need || "session ou laboratoire IoT"}.`
      : "Bonjour SNTRONIC, je représente une école de formation et je souhaite une session ou un laboratoire IoT.",
  );

  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">Services</p>
        <h1 className="section-title">Sessions de formation pour les écoles.</h1>
        <p className="lede">
          Sessions pratiques pour les écoles de formation : technologies LoRaWAN et intégration de services IoT. Le
          programme et le devis se confirment avec l’école.
        </p>
      </header>
      <div className="train-layout">
        <div className="train-topics">
          <article>
            <h2>Technologies LoRaWAN</h2>
            <p>
              Les stagiaires posent des capteurs et une passerelle, puis lisent les messages qui arrivent. On voit
              l’enregistrement sur le réseau, le contenu d’un envoi, et comment un testeur dit si l’endroit est couvert
              avant d’installer le reste.
            </p>
          </article>
          <article>
            <h2>Intégration de services IoT</h2>
            <p>
              La session continue jusqu’à la plateforme : tableaux de bord, alertes, et le branchement vers le système
              de l’école ou d’un client. L’architecture reste la même que sur un projet : l’équipement, le réseau, le
              cœur de réseau, puis l’application.
            </p>
          </article>
          <article>
            <h2>Laboratoire IoT</h2>
            <p>
              Pour une école qui veut pratiquer après la session, un lot d’équipements peut rester sur place :
              capteurs, passerelle et modules, selon le nombre de postes. Le contenu du laboratoire se choisit avec
              l’école, il n’est pas figé dans un catalogue.
            </p>
          </article>
        </div>
        <form className="train-form fields" id="demande" onSubmit={submit}>
          <h2>Demander une session ou un laboratoire</h2>
          <p className="muted">
            Le message s’ouvre dans votre logiciel de messagerie, adressé à {site.email}.
          </p>
          {ready && (
            <p className="banner">
              Si la messagerie ne s’est pas ouverte, copiez le texte et envoyez-le à {site.email}.
            </p>
          )}
          <label className="field">
            <span>École de formation</span>
            <input value={school} required autoComplete="organization" onChange={(event) => setSchool(event.target.value)} />
          </label>
          <div className="fields-2">
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
          </div>
          <div className="fields-2">
            <label className="field">
              <span>Téléphone</span>
              <input
                type="tel"
                value={phone}
                required
                autoComplete="tel"
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Ville</span>
              <input value={city} autoComplete="address-level2" onChange={(event) => setCity(event.target.value)} />
            </label>
          </div>
          <div className="fields-2">
            <label className="field">
              <span>Demande</span>
              <select required value={need} onChange={(event) => setNeed(event.target.value)}>
                <option value="">Choisir</option>
                {needs.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Nombre de stagiaires</span>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={headcount}
                onChange={(event) => setHeadcount(event.target.value)}
              />
            </label>
          </div>
          <label className="field">
            <span>Précisions</span>
            <textarea
              required
              value={message}
              placeholder="Filière, dates envisagées, matériel déjà en place."
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          <button className="btn btn-clay" type="submit">
            Préparer l’e-mail
          </button>
          <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">
            Ou écrire sur WhatsApp
          </a>
        </form>
      </div>
    </div>
  );
}
