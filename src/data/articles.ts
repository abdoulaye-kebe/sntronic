export type ArticleSection = {
  title?: string;
  paragraphs: string[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: "compteur-eau-lorawan",
    kicker: "Eau",
    title: "Compteur d’eau LoRaWAN : relever l’index sans se déplacer",
    description:
      "Un compteur d’eau LoRaWAN envoie l’index vers la plateforme. SNTRONIC le fournit sur devis, avec un délai de 3 jours à 1 semaine.",
    sections: [
      {
        paragraphs: [
          "Le compteur reste sur la conduite. À chaque période, il envoie l’index en LoRaWAN vers une passerelle, puis vers la plateforme. Le service d’eau facture la consommation réelle, sans envoyer quelqu’un relever le cadran.",
          "LoRaWAN convient quand une passerelle couvre le quartier, ou quand un réseau opéré est déjà là. Depuis un regard, la radio passe souvent mieux qu’un câble qu’il faudrait tirer jusqu’au local.",
        ],
      },
      {
        title: "Ce que SNTRONIC propose",
        paragraphs: [
          "Le compteur d’eau LoRaWAN Shengda est vendu sur devis. Le montant et, pour une quantité importante, le délai sont confirmés avant commande. Une commande courante part entre 3 jours et 1 semaine.",
          "Un capteur de niveau complète le relevé sur une cuve ou un réservoir. Le même principe sert le postpayé : on mesure, on envoie, on facture ensuite.",
        ],
      },
    ],
  },
  {
    slug: "compteur-prepaye-sts",
    kicker: "Eau",
    title: "Compteur prépayé STS : le crédit ouvre l’eau",
    description:
      "Le jeton STS de 20 chiffres charge le crédit. La vanne se ferme quand le solde est épuisé. Les compteurs Shengda sont sur devis.",
    sections: [
      {
        paragraphs: [
          "En prépayé, l’eau suit le crédit. L’usager achète un jeton STS de 20 chiffres, le saisit sur le compteur, et la vanne s’ouvre. Quand le solde tombe à zéro, la vanne se ferme. Un rechargement la rouvre.",
          "Le compteur peut aussi garder un mode postpayé selon la référence. LoRaWAN, NB-IoT ou 4G Cat1 servent à remonter l’index et, selon le modèle, à commander la vanne à distance.",
        ],
      },
      {
        title: "Deux façons de prépayer",
        paragraphs: [
          "Le compteur prépayé STS Shengda intègre la vanne et le jeton. Le compteur à carte charge le crédit par carte, puis la vanne suit le solde. Les deux sont sur devis : le prix et le délai d’une quantité importante sont indiqués dans le devis.",
          "Sur un compteur déjà posé, un émetteur d’impulsions et un relais peuvent couper l’arrivée sans remplacer tout le compteur. Le choix se fait après une visite du point d’eau.",
        ],
      },
    ],
  },
  {
    slug: "qualifier-un-reseau",
    kicker: "Réseau",
    title: "Qualifier le réseau avant de poser les capteurs",
    description:
      "Le testeur Adeunis FTD affiche sur place la puissance et la qualité du signal LoRaWAN ou Sigfox, et mémorise le point GPS.",
    sections: [
      {
        paragraphs: [
          "Poser cent capteurs puis découvrir qu’un regard n’est pas couvert coûte plus cher qu’une demi-journée de mesures. On commence par marcher le site avec un testeur, à l’endroit exact où chaque appareil sera fixé.",
          "Le Field Test Device Adeunis se tient à la main. L’écran montre tout de suite si le réseau répond : puissance, qualité du signal, voie montante et descendante. Le GPS retient le point de mesure. On s’en sert au démarrage, pour choisir LoRaWAN ou Sigfox et placer une passerelle, puis au déploiement, pour confirmer l’emplacement.",
        ],
      },
      {
        title: "Versions",
        paragraphs: [
          "Les versions courantes en Europe et en Afrique de l’Ouest sont le LoRaWAN EU863-870 et le Sigfox RC1. D’autres bandes existent : LoRaWAN US902-928, AS923-1, Sigfox RC4. Le testeur est sur devis.",
        ],
      },
    ],
  },
  {
    slug: "lorawan-ou-nb-iot",
    kicker: "Réseau",
    title: "LoRaWAN, LTE-M ou NB-IoT pour un projet au Sénégal",
    description:
      "LoRaWAN passe par votre passerelle, sans carte SIM. LTE-M et NB-IoT passent par un opérateur mobile. Le bon choix dépend du site, pas du catalogue.",
    sections: [
      {
        paragraphs: [
          "LoRaWAN, LTE-M et NB-IoT ne se remplacent pas. La question utile est : qui porte le réseau, l’objet bouge-t-il, et combien d’octets partent à chaque envoi.",
          "En LoRaWAN, les capteurs parlent à une passerelle que vous posez, ou à un réseau déjà opéré. Il n’y a pas de carte SIM dans chaque compteur. La portée est longue, le débit est faible, et l’autonomie se compte en années si l’envoi n’est pas trop fréquent. C’est le cas d’un index d’eau ou d’une sonde de sol.",
        ],
      },
      {
        title: "Quand le LTE-M convient",
        paragraphs: [
          "Le LTE-M utilise le réseau mobile. Chaque objet a une SIM, et il n’y a pas de passerelle à installer. Il sert à un objet qui se déplace ou qui envoie plus souvent : un traceur sur une remorque, un bouton d’alerte, une sonde dans un local isolé. Le débit est plus large que le NB-IoT, l’autonomie reste bonne, mais inférieure à celle d’un capteur LoRaWAN qui n’envoie que de temps en temps.",
          "La couverture dépend de l’opérateur et de la SIM, à l’endroit précis. On la vérifie sur place, on ne la suppose pas depuis une carte.",
        ],
      },
      {
        title: "Quand le NB-IoT est plus simple",
        paragraphs: [
          "Le NB-IoT passe aussi par un opérateur mobile et une SIM, sans passerelle. Il vise des points fixes : un compteur, une place, une fuite, un regard. Le débit est très faible, l’autonomie est très bonne, et la radio entre souvent mieux dans une cave qu’un lien plus large.",
          "Là encore, la couverture se vérifie sur le site. Le guide du site reprend les trois cas côte à côte. Pour le LoRaWAN, un testeur de réseau affiche le signal avant la pose des capteurs.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string | undefined): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
