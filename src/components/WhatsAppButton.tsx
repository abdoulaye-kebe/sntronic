import { useLocation } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext.tsx";
import { getArticle } from "../data/articles.ts";
import { site } from "../data/site.ts";

export function whatsappHref(text: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function WhatsAppButton() {
  const { pathname } = useLocation();
  const { getProduct } = useCatalog();
  if (pathname.startsWith("/admin")) return null;

  const product = pathname.startsWith("/produit/") ? getProduct(pathname.slice("/produit/".length)) : undefined;
  const article = pathname.startsWith("/blog/") ? getArticle(pathname.slice("/blog/".length)) : undefined;
  const subject = product ? `${product.name} (réf. ${product.ref})` : article?.title;
  const text = pathname.startsWith("/formation")
    ? "Bonjour SNTRONIC, je représente une école de formation et je souhaite une session ou un laboratoire IoT."
    : subject
      ? `Bonjour SNTRONIC, je souhaite un devis pour ${subject}.`
      : "Bonjour SNTRONIC, je souhaite un devis.";

  return (
    <a className="whatsapp" href={whatsappHref(text)} target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 3C7.3 3 3.46 6.82 3.46 11.54c0 1.5.4 2.96 1.15 4.24L3.4 21l5.36-1.18a8.6 8.6 0 0 0 3.28.64h.01c4.74 0 8.58-3.82 8.58-8.54C20.63 6.82 16.78 3 12.04 3Zm0 15.62h-.01a7.1 7.1 0 0 1-3.62-.99l-.26-.15-3.18.7.68-3.1-.17-.27a7.05 7.05 0 0 1-1.08-3.77c0-3.9 3.18-7.07 7.1-7.07 1.9 0 3.68.74 5.02 2.08a7.04 7.04 0 0 1 2.08 5.01c0 3.9-3.19 7.06-7.56 7.06Zm4.01-5.29c-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.11-.14.22-.57.71-.7.86-.13.14-.26.16-.48.05-.22-.11-.93-.34-1.77-1.09-.65-.58-1.1-1.3-1.23-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.4.11-.13.15-.22.22-.37.08-.14.04-.27-.02-.38-.06-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38h-.43c-.14 0-.38.05-.58.27-.2.22-.76.74-.76 1.81s.78 2.1.89 2.24c.11.14 1.53 2.34 3.71 3.28.52.22.92.36 1.24.46.52.17.99.14 1.36.09.42-.06 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.1-.2-.15-.42-.26Z"
      />
    </svg>
  );
}
