import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TotalsBlock } from "./CartPage.tsx";
import { useCart } from "../context/CartContext.tsx";
import { site } from "../data/site.ts";
import { cartTotals, formatXOF, lineTtcXof, type Totals } from "../lib/money.ts";
import { useTitle } from "../lib/useTitle.ts";

const ORDER_KEY = "sntronic-last-order";

type Customer = {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  note: string;
};

export type StoredOrder = {
  ref: string;
  createdAt: string;
  customer: Customer;
  lines: { name: string; refCode: string; qty: number; priceHt: number }[];
  totals: Totals;
};

const emptyCustomer: Customer = {
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  postcode: "",
  city: "",
  country: "Sénégal",
  note: "",
};

export function CheckoutPage() {
  useTitle("Commande");
  const navigate = useNavigate();
  const { lines, clear } = useCart();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);

  const totals = cartTotals(lines.map((line) => ({ priceHt: line.product.priceHt, qty: line.qty })));

  function update<K extends keyof Customer>(key: K, value: Customer[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (lines.length === 0) return;
    const order: StoredOrder = {
      ref: makeRef(),
      createdAt: new Date().toISOString(),
      customer,
      lines: lines.map((line) => ({
        name: line.product.name,
        refCode: line.product.ref,
        qty: line.qty,
        priceHt: line.product.priceHt,
      })),
      totals,
    };
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    clear();
    navigate("/commande/confirmation");
  }

  if (lines.length === 0) {
    return (
      <div className="wrap page">
        <h1 className="section-title">Commande</h1>
        <div className="empty">
          <p>Le panier est vide.</p>
          <Link className="btn btn-primary" to="/catalogue">
            Choisir des références
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <h1 className="section-title">Demande de commande</h1>
      <p className="lede">
        Le paiement en ligne n’est pas ouvert. La demande prépare la facture : vous l’envoyez par e-mail, l’atelier
        confirme le délai et le règlement.
      </p>
      <form className="checkout" onSubmit={submit}>
        <div className="fields">
          <div className="fields-2">
            <Field label="Nom" value={customer.name} onChange={(value) => update("name", value)} required autoComplete="name" />
            <Field
              label="Société"
              value={customer.company}
              onChange={(value) => update("company", value)}
              autoComplete="organization"
            />
          </div>
          <div className="fields-2">
            <Field
              label="E-mail"
              type="email"
              value={customer.email}
              onChange={(value) => update("email", value)}
              required
              autoComplete="email"
            />
            <Field
              label="Téléphone"
              type="tel"
              value={customer.phone}
              onChange={(value) => update("phone", value)}
              autoComplete="tel"
            />
          </div>
          <Field
            label="Adresse"
            value={customer.address}
            onChange={(value) => update("address", value)}
            required
            autoComplete="street-address"
          />
          <div className="fields-2">
            <Field
              label="Code postal"
              value={customer.postcode}
              onChange={(value) => update("postcode", value)}
              required
              autoComplete="postal-code"
            />
            <Field
              label="Ville"
              value={customer.city}
              onChange={(value) => update("city", value)}
              required
              autoComplete="address-level2"
            />
          </div>
          <label className="field">
            <span>Pays</span>
            <select value={customer.country} onChange={(event) => update("country", event.target.value)}>
              {site.countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Note</span>
            <textarea
              value={customer.note}
              onChange={(event) => update("note", event.target.value)}
              placeholder="Accès du site, SIM déjà choisie, délai visé…"
            />
          </label>
          <label className="check">
            <input type="checkbox" required />
            <span>Je confirme cette demande. Le règlement se fait à réception de la facture.</span>
          </label>
          <button className="btn btn-clay" type="submit">
            Enregistrer la demande
          </button>
        </div>
        <aside className="summary">
          <h2>Votre sélection</h2>
          <ul className="mini-lines">
            {lines.map((line) => (
              <li key={line.slug}>
                <span>
                  {line.product.name}
                  <small>
                    {line.qty} × {line.product.ref}
                  </small>
                </span>
                <strong>{formatXOF(lineTtcXof(line.product.priceHt, line.qty))}</strong>
              </li>
            ))}
          </ul>
          <TotalsBlock ht={totals.ht} vat={totals.vat} totalTtc={totals.totalTtc} />
          <p className="fine">Transport inclus. TVA {Math.round(site.vatRate * 100)} %.</p>
        </aside>
      </form>
    </div>
  );
}

export function ConfirmationPage() {
  useTitle("Demande enregistrée");
  const order = readOrder();

  if (!order) {
    return (
      <div className="wrap page">
        <h1 className="section-title">Aucune demande en cours</h1>
        <Link className="btn btn-primary" to="/catalogue">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const when = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <div className="wrap page narrow">
      <p className="eyebrow">Demande enregistrée sur cet appareil</p>
      <h1 className="display display-sm">{order.ref}</h1>
      <p className="lede">
        {when}. Envoyez la demande à l’atelier pour qu’elle soit traitée. Le message s’ouvre dans votre logiciel de
        messagerie.
      </p>
      <div className="summary">
        <h2>
          {order.customer.name}
          {order.customer.company ? ` · ${order.customer.company}` : ""}
        </h2>
        <p>
          {order.customer.address}, {order.customer.postcode} {order.customer.city}, {order.customer.country}
        </p>
        <ul className="mini-lines">
          {order.lines.map((line) => (
            <li key={line.refCode}>
              <span>
                {line.name}
                <small>
                  {line.qty} × {line.refCode}
                </small>
              </span>
              <strong>{formatXOF(lineTtcXof(line.priceHt, line.qty))}</strong>
            </li>
          ))}
        </ul>
        <TotalsBlock ht={order.totals.ht} vat={order.totals.vat} totalTtc={order.totals.totalTtc} />
      </div>
      <div className="hero-actions">
        <a className="btn btn-clay" href={mailtoHref(order)}>
          Envoyer par e-mail
        </a>
        <Link className="btn btn-ghost" to="/catalogue">
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `field-${label.toLowerCase().replace(/\s/g, "-")}`;
  return (
    <label className="field" htmlFor={id}>
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function makeRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 4; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SN-${code}`;
}

function readOrder(): StoredOrder | null {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredOrder;
  } catch {
    return null;
  }
}

function mailtoHref(order: StoredOrder) {
  const lines = order.lines
    .map(
      (line) =>
        `- ${line.qty} × ${line.name} (${line.refCode}) — ${formatXOF(lineTtcXof(line.priceHt, line.qty))} TTC`,
    )
    .join("\n");
  const body = [
    `Demande ${order.ref}`,
    "",
    `${order.customer.name}`,
    order.customer.company,
    order.customer.email,
    order.customer.phone,
    `${order.customer.address}`,
    `${order.customer.postcode} ${order.customer.city}`,
    order.customer.country,
    order.customer.note ? `Note : ${order.customer.note}` : "",
    "",
    lines,
    "",
    `Total HT : ${formatXOF(order.totals.ht)}`,
    `TVA ${Math.round(site.vatRate * 100)} % : ${formatXOF(order.totals.vat)}`,
    "Transport : inclus",
    `Total TTC : ${formatXOF(order.totals.totalTtc)}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(`Commande ${order.ref}`)}&body=${encodeURIComponent(body)}`;
}
