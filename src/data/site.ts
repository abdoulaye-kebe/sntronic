/** Coordonnées et conditions affichées sur le site. À personnaliser. */
export const site = {
  name: "SNTRONIC",
  email: "contact@sntronic.fr",
  phone: "+221 78 100 07 34",
  phoneTel: "+221781000734",
  address: "Golf sud, villa 610",
  city: "Dakar",
  hours: "Du lundi au vendredi, 9h–18h",
  cityLine: "Dakar, Golf sud, villa 610",
  /** TVA appliquée au prix de vente, transport compris. */
  vatRate: 0.18,
  /** Marge sur le prix d’achat, avant transport et TVA. */
  marginRate: 0.15,
  /** Part du transport intégrée au prix, en proportion du prix d’achat majoré. */
  transportRate: 0.1,
  /** Parité fixe du franc CFA (BCEAO) : 1 € = 655,957 F CFA. */
  eurToXof: 655.957,
  returnsDays: 14,
  adminPin: "atelier",
  countries: [
    "Sénégal",
    "Côte d’Ivoire",
    "Mali",
    "Burkina Faso",
    "Bénin",
    "Togo",
    "Niger",
    "Guinée-Bissau",
    "Autre",
  ],
};
