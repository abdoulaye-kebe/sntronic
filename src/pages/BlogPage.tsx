import { Link } from "react-router-dom";
import { articles } from "../data/articles.ts";
import { useTitle } from "../lib/useTitle.ts";

export function BlogPage() {
  useTitle("Blog");

  return (
    <div className="wrap page">
      <header className="service-intro">
        <p className="eyebrow">Journal</p>
        <h1 className="section-title">Blog</h1>
        <p className="lede">
          Quatre questions qui reviennent avant un devis : le relevé d’eau, le prépayé, le test de couverture, et le
          choix du réseau.
        </p>
      </header>
      <div className="post-list">
        {articles.map((article) => (
          <article key={article.slug} className="post-card">
            <p className="eyebrow">{article.kicker}</p>
            <h2>
              <Link to={`/blog/${article.slug}`}>{article.title}</Link>
            </h2>
            <p>{article.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
