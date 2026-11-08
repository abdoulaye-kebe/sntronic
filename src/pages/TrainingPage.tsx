import { useState, type FormEvent, type ReactNode } from "react";
import { site } from "../data/site.ts";
import { useTitle } from "../lib/useTitle.ts";
import { whatsappHref } from "../components/WhatsAppButton.tsx";

function TrainIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="train-ico" viewBox="0 0 48 48" aria-hidden="true">
      {children}
    </svg>
  );
}

const schoolTypes = [
  "École d’ingénieurs",
  "Université",
  "Centre de formation professionnelle",
  "Lycée technique",
  "Autre",
];
const levels = ["Licence", "Master", "Ingénieur", "Technicien", "Mixte"];
const durations = ["Demi-journée", "1 à 2 jours", "3 à 5 jours", "Module de semestre", "À définir"];
const needOptions = ["Sessions de formation", "Laboratoire IoT", "Formation des enseignants"];
const techOptions = ["LoRaWAN", "LTE-M", "NB-IoT", "Intégration de services IoT"];

const chain = [
  {
    title: "Capteur",
    text: "Mesure et module radio",
    icon: (
      <>
        <rect x="12" y="12" width="24" height="24" rx="3" />
        <path d="M18 6v6M24 6v6M30 6v6M18 36v6M24 36v6M30 36v6M6 18h6M6 24h6M6 30h6M36 18h6M36 24h6M36 30h6" />
      </>
    ),
  },
  {
    title: "Réseau",
    text: "LoRaWAN, LTE-M ou NB-IoT",
    icon: (
      <>
        <circle cx="24" cy="36" r="3" />
        <path d="M17 29a10 10 0 0 1 14 0M11 23a18 18 0 0 1 26 0M5 17a26 26 0 0 1 38 0" />
      </>
    ),
  },
  {
    title: "Plateforme",
    text: "Serveur réseau et base de données",
    icon: (
      <>
        <ellipse cx="24" cy="12" rx="14" ry="5" />
        <path d="M10 12v12c0 3 6 5 14 5s14-2 14-5V12M10 24v12c0 3 6 5 14 5s14-2 14-5V24" />
      </>
    ),
  },
  {
    title: "Application",
    text: "Tableau de bord et alertes",
    icon: (
      <>
        <path d="M8 8v32h32" />
        <path d="M14 32l8-10 6 6 10-14" />
      </>
    ),
  },
];

const sessions = [
  {
    title: "Choisir la bonne technologie",
    text: "Comparer LoRaWAN, LTE-M et NB-IoT selon le besoin.",
    points: ["Portée, débit, consommation, coût", "Études de cas locaux", "Atelier de choix sur un cahier des charges"],
    icon: (
      <>
        <path d="M24 8v32M12 40h24M12 14h24" />
        <path d="M12 14l-6 12a6 6 0 0 0 12 0zM36 14l-6 12a6 6 0 0 0 12 0z" />
      </>
    ),
  },
  {
    title: "LoRaWAN en pratique",
    text: "Monter un réseau et y connecter des capteurs.",
    points: ["Passerelle et nœuds, classes A, B et C", "Serveur réseau (ChirpStack ou TTN)", "Activation, décodage des données"],
    icon: (
      <>
        <circle cx="24" cy="36" r="3" />
        <path d="M17 29a10 10 0 0 1 14 0M11 23a18 18 0 0 1 26 0M5 17a26 26 0 0 1 38 0" />
      </>
    ),
  },
  {
    title: "LTE-M et NB-IoT en pratique",
    text: "Connecter un module cellulaire et l’exploiter.",
    points: ["Modules, carte SIM IoT, configuration réseau", "Commandes AT, modes d’économie d’énergie", "Mesures de couverture et de consommation"],
    icon: (
      <>
        <circle cx="24" cy="16" r="3" />
        <path d="M24 22v20M16 42l8-20 8 20M19 34h10M17 11a8 8 0 0 0 0 10M31 11a8 8 0 0 1 0 10" />
      </>
    ),
  },
  {
    title: "Intégration de services IoT",
    text: "Transformer la donnée en service.",
    points: ["MQTT, HTTP et API", "Base de données et tableau de bord", "Alertes et supervision"],
    icon: (
      <>
        <circle cx="10" cy="24" r="4" />
        <circle cx="38" cy="12" r="4" />
        <circle cx="38" cy="36" r="4" />
        <path d="M14 24h8l8-12h4M22 24l8 12h4" />
      </>
    ),
  },
  {
    title: "Projet fil rouge",
    text: "Un cas d’usage réel, du capteur à l’application.",
    points: ["Eau, agriculture, bâtiment ou logistique", "Travail en équipe, restitution finale", "Évaluation adaptée à votre cursus"],
    icon: (
      <>
        <path d="M12 6v38" />
        <path d="M12 8h26l-6 9 6 9H12" />
      </>
    ),
  },
];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function TrainingPage() {
  useTitle("Formation");
  const [school, setSchool] = useState("");
  const [schoolType, setSchoolType] = useState(schoolTypes[0]);
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [techs, setTechs] = useState<string[]>([]);
  const [headcount, setHeadcount] = useState("");
  const [level, setLevel] = useState(levels[0]);
  const [duration, setDuration] = useState(durations[0]);
  const [period, setPeriod] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [recap, setRecap] = useState("");
  const [copied, setCopied] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setCopied(false);
    if (!school.trim() || !name.trim() || !email.trim()) {
      setError("Renseignez le nom de l’établissement, le nom du contact et l’e-mail.");
      setRecap("");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("L’adresse e-mail n’est pas valide.");
      setRecap("");
      return;
    }
    if (needs.length === 0) {
      setError("Choisissez au moins un besoin : formation, laboratoire ou formation des enseignants.");
      setRecap("");
      return;
    }
    const lines = [
      "Demande de formation IoT — SNTRONIC",
      "",
      `Établissement : ${school.trim()} (${schoolType}${city.trim() ? `, ${city.trim()}` : ""})`,
      `Contact : ${name.trim()}${role.trim() ? `, ${role.trim()}` : ""}`,
      `E-mail : ${email.trim()}${phone.trim() ? ` — Tél. : ${phone.trim()}` : ""}`,
      `Besoin : ${needs.join(", ")}`,
      `Technologies : ${techs.join(", ") || "à préciser"}`,
      `Étudiants : ${headcount.trim() || "à préciser"} — Niveau : ${level}`,
      `Durée : ${duration} — Période : ${period.trim() || "à préciser"}`,
    ];
    if (message.trim()) lines.push("", `Précisions : ${message.trim()}`);
    setError("");
    setRecap(lines.join("\n"));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(recap);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Demande de formation IoT — ${school.trim()}`)}&body=${encodeURIComponent(recap)}`;
  const whatsapp = whatsappHref(
    `Bonjour SNTRONIC, je représente ${school.trim() || "une école"} et je souhaite ${needs.join(", ") || "une formation ou un laboratoire IoT"}.`,
  );

  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">Services</p>
        <h1 className="section-title">Formez vos étudiants à l’IoT sur du vrai matériel</h1>
        <p className="lede">
          Sessions pratiques et laboratoire IoT pour les écoles et centres de formation : LoRaWAN, LTE-M et NB-IoT, de
          la connexion d’un capteur jusqu’au service intégré.
        </p>
        <div className="home-actions">
          <a className="btn btn-clay" href="#demande">
            Demander une formation ou un laboratoire
          </a>
          <a className="btn btn-ghost" href="#sessions">
            Voir les sessions
          </a>
        </div>
      </header>

      <section className="train-block">
        <h2 className="section-title">Trois réseaux, trois usages</h2>
        <p className="train-intro">
          Un projet IoT suit toujours la même chaîne. Le réseau en est une étape, et c’est celle qui change selon le
          besoin. Les étudiants apprennent à comparer les technologies, puis à choisir la bonne.
        </p>
        <ol className="train-chain">
          {chain.map((step) => (
            <li key={step.title}>
              <TrainIcon>{step.icon}</TrainIcon>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </li>
          ))}
        </ol>
        <div className="table-wrap" role="region" aria-label="Comparatif des technologies" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th />
                <th>LoRaWAN</th>
                <th>LTE-M</th>
                <th>NB-IoT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Réseau</th>
                <td>Fréquences libres, réseau privé ou communautaire</td>
                <td>Réseau mobile d’un opérateur, carte SIM IoT</td>
                <td>Réseau mobile d’un opérateur, carte SIM IoT</td>
              </tr>
              <tr>
                <th>Débit</th>
                <td>Très faible</td>
                <td>Moyen (jusqu’à environ 1 Mbit/s)</td>
                <td>Faible</td>
              </tr>
              <tr>
                <th>Mobilité</th>
                <td>Limitée</td>
                <td>Bonne, avec transfert entre antennes</td>
                <td>Objets fixes</td>
              </tr>
              <tr>
                <th>Autonomie</th>
                <td>Plusieurs années sur pile</td>
                <td>Longue grâce aux modes veille</td>
                <td>Très longue grâce aux modes veille</td>
              </tr>
              <tr>
                <th>Cas d’usage</th>
                <td>Compteurs d’eau, agriculture, bâtiments</td>
                <td>Suivi de flotte, équipements mobiles, alarmes</td>
                <td>Compteurs, capteurs en sous-sol ou en zone difficile</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="train-note">
          La disponibilité de LTE-M et de NB-IoT dépend de la couverture de l’opérateur. Nous la vérifions avec vous
          avant la formation.
        </p>
      </section>

      <section className="train-block" id="sessions">
        <h2 className="section-title">Sessions pratiques</h2>
        <p className="train-intro">
          Chaque session alterne explications courtes et manipulations. Les étudiants repartent avec une chaîne
          complète qui fonctionne.
        </p>
        <div className="train-sessions">
          {sessions.map((session) => (
            <article key={session.title}>
              <TrainIcon>{session.icon}</TrainIcon>
              <h3>{session.title}</h3>
              <p>{session.text}</p>
              <ul>
                {session.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="train-formats">
          <div>
            <strong>Demi-journée</strong>
            <span>Initiation ou découverte d’une technologie</span>
          </div>
          <div>
            <strong>Un à cinq jours</strong>
            <span>Parcours intensif sur une ou plusieurs technologies</span>
          </div>
          <div>
            <strong>Module de semestre</strong>
            <span>Intégré à votre programme, avec travaux pratiques</span>
          </div>
        </div>
      </section>

      <section className="train-block train-lab">
        <div>
          <h2 className="section-title">Un laboratoire IoT dans votre école</h2>
          <p className="train-intro">
            Nous vous aidons à équiper une salle pour que vos enseignants poursuivent les travaux pratiques toute
            l’année.
          </p>
        </div>
        <div className="train-lab-card">
          <ul>
            <li>Kits pédagogiques : cartes, capteurs, modules LoRaWAN, LTE-M et NB-IoT</li>
            <li>Passerelle LoRaWAN et serveur réseau configurés</li>
            <li>Plateforme de visualisation pour les projets d’étudiants</li>
            <li>Formation des enseignants et supports de travaux pratiques</li>
            <li>Prix en francs CFA, transport et TVA compris</li>
          </ul>
        </div>
      </section>

      <section className="train-block" id="demande">
        <h2 className="section-title">Votre demande</h2>
        <p className="train-intro">
          Décrivez votre besoin. La demande est envoyée à {site.email}. Nous revenons vers vous avec une proposition
          adaptée.
        </p>
        <form className="train-form" onSubmit={submit}>
          <label className="field">
            <span>Nom de l’établissement</span>
            <input value={school} required autoComplete="organization" onChange={(event) => setSchool(event.target.value)} />
          </label>
          <div className="fields-2">
            <label className="field">
              <span>Type d’établissement</span>
              <select value={schoolType} onChange={(event) => setSchoolType(event.target.value)}>
                {schoolTypes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Ville</span>
              <input value={city} autoComplete="address-level2" onChange={(event) => setCity(event.target.value)} />
            </label>
          </div>
          <div className="fields-2">
            <label className="field">
              <span>Nom du contact</span>
              <input value={name} required autoComplete="name" onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="field">
              <span>Fonction</span>
              <input
                value={role}
                autoComplete="organization-title"
                onChange={(event) => setRole(event.target.value)}
              />
            </label>
          </div>
          <div className="fields-2">
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
              <span>Téléphone</span>
              <input type="tel" value={phone} autoComplete="tel" onChange={(event) => setPhone(event.target.value)} />
            </label>
          </div>
          <fieldset className="field">
            <span>Besoin</span>
            <div className="train-checks">
              {needOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={needs.includes(option)}
                    onChange={() => setNeeds((current) => toggle(current, option))}
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="field">
            <span>Technologies souhaitées</span>
            <div className="train-checks">
              {techOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={techs.includes(option)}
                    onChange={() => setTechs((current) => toggle(current, option))}
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="fields-2">
            <label className="field">
              <span>Nombre d’étudiants</span>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={headcount}
                onChange={(event) => setHeadcount(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Niveau</span>
              <select value={level} onChange={(event) => setLevel(event.target.value)}>
                {levels.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="fields-2">
            <label className="field">
              <span>Durée souhaitée</span>
              <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                {durations.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Période souhaitée</span>
              <input
                value={period}
                placeholder="Par exemple : mars 2027"
                onChange={(event) => setPeriod(event.target.value)}
              />
            </label>
          </div>
          <label className="field">
            <span>Précisions</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
          </label>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="btn btn-clay" type="submit">
            Préparer ma demande
          </button>
        </form>
        {recap ? (
          <div className="train-recap" role="status">
            <h2>Demande prête</h2>
            <p>Vérifiez le récapitulatif, puis envoyez-le à SNTRONIC.</p>
            <pre>{recap}</pre>
            <div className="train-actions">
              <a className="btn btn-clay" href={mailto}>
                Envoyer par e-mail
              </a>
              <button className="btn btn-ghost" type="button" onClick={() => void copy()}>
                {copied ? "Copié" : "Copier la demande"}
              </button>
              <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">
                Ou écrire sur WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
