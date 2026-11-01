import { site } from "../data/site.ts";
import { useTitle } from "../lib/useTitle.ts";

export function LegalPage() {
  useTitle("Mentions légales");
  return (
    <div className="wrap page narrow prose">
      <h1 className="section-title">Mentions légales</h1>
      <p>
        Le site {site.name} présente le catalogue et prépare des demandes de commande. Éditeur : {site.name},{" "}
        {site.address}, {site.city}, Sénégal. Contact : <a href={`mailto:${site.email}`}>{site.email}</a>,{" "}
        <a href={`tel:${site.phoneTel}`}>{site.phone}</a>. {site.hours}.
      </p>
      <p>
        Les prix sont indiqués en francs CFA, toutes taxes comprises. La TVA est de {Math.round(site.vatRate * 100)} %
        et le transport est compris dans le prix. L’hébergeur du site sera indiqué ici au moment de la mise en ligne.
      </p>
      <p>
        Le panier est enregistré dans votre navigateur. Aucun compte n’est créé. Le formulaire de contact et la demande
        de commande ouvrent votre logiciel de messagerie : le message part quand vous l’envoyez. Les coordonnées
        saisies servent à préparer ce message, elles ne sont pas stockées sur un serveur du site.
      </p>
    </div>
  );
}
