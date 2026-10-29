import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle.ts";

export function AboutPage() {
  useTitle("À propos");
  return (
    <div className="wrap page narrow">
      <p className="eyebrow">SNTRONIC</p>
      <h1 className="section-title">Un comptoir pour le matériel qui reste dehors.</h1>
      <div className="prose">
        <p>
          SNTRONIC vend des appareils LoRaWAN, LTE-M et NB-IoT, des passerelles, et les modules pour les intégrer.
          Les fiches disent ce que l’objet mesure, comment il parle, et comment on l’alimente.
        </p>
        <p>
          Le catalogue s’adresse aux intégrateurs, aux exploitants de sites et aux ateliers qui construisent un
          produit. Une serre, un parc de bennes, une armoire de comptage : le bon réseau n’est pas le même.
        </p>
        <h2>Quatre gammes</h2>
        <p>
          Fieldnode pour les capteurs LoRaWAN. Cellspan pour le cellulaire. Gatehouse pour les passerelles. Modulab
          pour les cartes à intégrer.
        </p>
        <h2>Commander</h2>
        <p>
          Le panier prépare une demande. L’e-mail la transmet, la facture confirme le délai et le règlement. Pour un
          lot ou un site entier, le formulaire de contact est le bon chemin.
        </p>
        <p>
          <Link className="text-link" to="/contact">
            Écrire à l’atelier
          </Link>
        </p>
      </div>
    </div>
  );
}
