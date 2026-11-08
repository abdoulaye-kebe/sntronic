import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb.tsx";
import { whatsappHref } from "../components/WhatsAppButton.tsx";
import { getArticle } from "../data/articles.ts";
import { useTitle } from "../lib/useTitle.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

const related: Record<string, { to: string; label: string }[]> = {
  "compteur-eau-lorawan": [
    { to: "/produit/shengda-lorawan", label: "Voir le compteur d’eau LoRaWAN" },
    { to: "/usages/eau-postpaye", label: "Facturer l’eau après consommation" },
  ],
  "compteur-prepaye-sts": [
    { to: "/produit/shengda-sts", label: "Voir le compteur prépayé STS" },
    { to: "/produit/shengda-smart-card", label: "Voir le compteur à carte" },
    { to: "/usages/eau-prepaye", label: "Faire payer l’eau avant de la livrer" },
  ],
  "qualifier-un-reseau": [
    { to: "/produit/adeunis-ftd", label: "Voir le testeur Adeunis FTD" },
    { to: "/guide", label: "Choisir un réseau" },
  ],
  "lorawan-ou-nb-iot": [
    { to: "/catalogue/lorawan", label: "Voir les capteurs LoRaWAN" },
    { to: "/catalogue/lte-m", label: "Voir les terminaux LTE-M" },
    { to: "/catalogue/nb-iot", label: "Voir les terminaux NB-IoT" },
    { to: "/guide", label: "Tableau LoRaWAN, LTE-M, NB-IoT" },
  ],
};

export function ArticlePage() {
  const { slug } = useParams();
  const article = getArticle(slug);
  useTitle(article?.title ?? "Article introuvable");
  if (!article) return <NotFoundPage />;

  const links = related[article.slug] ?? [];
  const message = `Bonjour SNTRONIC, je souhaite un devis au sujet de « ${article.title} ».`;

  return (
    <div className="wrap page">
      <Breadcrumb
        items={[{ label: "Accueil", to: "/" }, { label: "Blog", to: "/blog" }, { label: article.title }]}
      />
      <article className="post">
        <p className="eyebrow">{article.kicker}</p>
        <h1 className="section-title">{article.title}</h1>
        <p className="lede">{article.description}</p>
        <div className="prose">
          {article.sections.map((section) => (
            <section key={section.title ?? section.paragraphs[0]}>
              {section.title ? <h2>{section.title}</h2> : null}
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <div className="post-actions">
          {links.map((link) => (
            <Link key={link.to} className="text-link" to={link.to}>
              {link.label}
            </Link>
          ))}
          <a className="text-link" href={whatsappHref(message)} target="_blank" rel="noreferrer">
            Demander un devis sur WhatsApp
          </a>
          <Link className="text-link" to="/contact">
            Écrire par e-mail
          </Link>
        </div>
      </article>
    </div>
  );
}
