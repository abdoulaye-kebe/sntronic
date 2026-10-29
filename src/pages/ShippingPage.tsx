import { site } from "../data/site.ts";
import { formatEUR, formatXOF, toXof } from "../lib/money.ts";
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
            Les références en stock partent sous 24 à 48 heures ouvrées, vers la France métropolitaine. Une fiche « sur
            commande » indique son délai. La confirmation d’e-mail fige la date.
          </p>
        </details>
        <details>
          <summary>Frais</summary>
          <p>
            {formatEUR(site.shippingTtc)} TTC ({formatXOF(toXof(site.shippingTtc))}) en France métropolitaine, offerts à
            partir de {formatEUR(site.freeShippingFromTtc)} TTC ({formatXOF(toXof(site.freeShippingFromTtc))}). Hors
            France, y compris en zone franc CFA, les frais sont confirmés avec la demande.
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
            La facture part avec l’expédition. Les particuliers bénéficient de la garantie légale de conformité. Pour
            un lot professionnel, la garantie est celle indiquée sur la facture.
          </p>
        </details>
      </div>
    </div>
  );
}
