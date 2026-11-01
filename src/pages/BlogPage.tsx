import { useTitle } from "../lib/useTitle.ts";

export function BlogPage() {
  useTitle("Blog");
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">Journal</p>
      <h1 className="section-title">Blog</h1>
      <div className="prose">
        <p>Aucun article pour le moment.</p>
      </div>
    </div>
  );
}
