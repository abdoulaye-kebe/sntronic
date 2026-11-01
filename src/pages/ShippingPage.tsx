import { site } from "../data/site.ts";
import { useTitle } from "../lib/useTitle.ts";

export function ShippingPage() {
  useTitle("Livraison et retours");
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">Commandes</p>
      <h1 className="section-title">Livraison et retours</h1>
      <div className="faq">
        <details open>
          <summary>Délais</summary>
          <p>
            Les références en stock partent de la boutique à Dakar, Golf sud, villa 610, sous 24 à 48 heures ouvrées.
            Une fiche « sur commande » indique son délai. La confirmation d’e-mail fige la date.
          </p>
        </details>
        <details>
          <summary>Frais</summary>
          <p>
            Le transport est déjà compris dans le prix affiché, en francs CFA. Il n’y a pas de frais de livraison à
            ajouter à la commande. La TVA est de {Math.round(site.vatRate * 100)} %.
          </p>
        </details>
        <details>
          <summary>Retours</summary>
          <p>
            {site.returnsDays} jours pour changer d’avis sur un article non utilisé, dans son emballage d’origine.
            Écrivez avant le renvoi pour recevoir l’adresse et le numéro de demande. Les modules soudés ou programmés
            pour un site ne reviennent pas au tarif catalogue.
          </p>
        </details>
        <details>
          <summary>Facture et garantie</summary>
          <p>
            La facture part avec l’expédition. La garantie est celle indiquée sur la facture.
          </p>
        </details>
      </div>
    </div>
  );
}
