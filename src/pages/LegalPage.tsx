import { site } from "../data/site.ts";
import { useTitle } from "../lib/useTitle.ts";

export function LegalPage() {
  useTitle("Mentions légales");
  return (
    <div className="wrap page narrow prose">
      <h1 className="section-title">Mentions légales</h1>
      <p>
        Le site {site.name} présente le catalogue et prépare des demandes de commande. Éditeur : {site.name}. Contact :{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. {site.hours}.
      </p>
      <p>
        Les prix sont indiqués en euros hors taxes et toutes taxes comprises, avec une TVA à{" "}
        {Math.round(site.vatRate * 100)} %. Le franc CFA est affiché en parallèle, au taux fixe 1 € = 655,957 F CFA. Le
        montant enregistré reste le prix en euros hors taxes. L’hébergeur du site sera indiqué ici au moment de la mise
        en ligne.
      </p>
      <p>
        Le panier est enregistré dans votre navigateur. Aucun compte n’est créé. Le formulaire de contact et la demande
        de commande ouvrent votre logiciel de messagerie : le message part quand vous l’envoyez. Les coordonnées
        saisies servent à préparer ce message, elles ne sont pas stockées sur un serveur du site.
      </p>
    </div>
  );
}
