import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export function NotFoundPage() {
  useTitle("Page introuvable");
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">404</p>
      <h1 className="section-title">Cette page n’est pas au catalogue.</h1>
      <Link className="btn btn-primary" to="/catalogue">
        Retourner au catalogue
      </Link>
    </div>
  );
}
