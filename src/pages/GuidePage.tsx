import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export function GuidePage() {
  useTitle("Choisir un réseau");
  return (
    <div className="wrap page">
      <div className="narrow">
        <p className="eyebrow">Guide</p>
        <h1 className="section-title">Choisir le réseau avant la référence.</h1>
        <p className="lede">
          LoRaWAN, LTE-M et NB-IoT ne se remplacent pas. La question utile est : qui porte le réseau, l’objet bouge-t-il,
          et combien d’octets partent à chaque envoi.
        </p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>LoRaWAN</th>
              <th>LTE-M</th>
              <th>NB-IoT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Qui porte le réseau</th>
              <td>Votre passerelle, ou un réseau opéré déjà couvert</td>
              <td>Un opérateur mobile</td>
              <td>Un opérateur mobile</td>
            </tr>
            <tr>
              <th>Carte SIM</th>
              <td>Non</td>
              <td>Oui</td>
              <td>Oui</td>
            </tr>
            <tr>
              <th>Mobilité</th>
              <td>Sur la zone couverte par la passerelle</td>
              <td>Adapté aux objets qui se déplacent</td>
              <td>Plutôt des points fixes</td>
            </tr>
            <tr>
              <th>Débit</th>
              <td>Faible, messages courts</td>
              <td>Plus large, adapté à des traces fréquentes</td>
              <td>Très faible</td>
            </tr>
            <tr>
              <th>Autonomie</th>
              <td>Plusieurs années sur pile, selon la période</td>
              <td>Bonne, inférieure à un capteur LoRa très espacé</td>
              <td>Très bonne sur un objet fixe</td>
            </tr>
            <tr>
              <th>Cas typique</th>
              <td>Bâtiment, exploitation, quartier</td>
              <td>Traceur, alerte, site isolé mobile</td>
              <td>Compteur, place, fuite, cave</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="guide-grid">
        <article>
          <h2>Commencer par LoRaWAN</h2>
          <p>
            Vous avez plusieurs points sur le même lieu et vous pouvez poser une passerelle avec Ethernet, ou un lien
            4G. Les capteurs Fieldnode et une Gatehouse intérieure ou extérieure forment le kit de base. Bande EU868.
          </p>
          <Link to="/catalogue/lorawan">Voir les capteurs</Link>
        </article>
        <article>
          <h2>Commencer par le cellulaire</h2>
          <p>
            Le point est seul, loin, ou il bouge. LTE-M si l’objet se déplace ou envoie plus souvent. NB-IoT s’il reste
            en place et doit tenir longtemps. La couverture dépend de l’opérateur et de la SIM que vous choisissez.
          </p>
          <Link to="/catalogue/lte-m">Voir le LTE-M</Link>
        </article>
        <article>
          <h2>Vous construisez la carte</h2>
          <p>
            Les modules Modulab et les modems Cellspan sont faits pour être intégrés. Un capteur fini reste plus simple
            si le boîtier, l’indice de protection et la pile sont déjà résolus.
          </p>
          <Link to="/catalogue/modules">Voir les modules</Link>
        </article>
      </div>
    </div>
  );
}
