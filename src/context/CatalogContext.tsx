import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getProduct as findProduct,
  products as seedProducts,
  searchProducts as filterProducts,
  type Product,
} from "../data/catalog.ts";

const STORAGE_KEY = "sntronic-catalog-v2";

type CatalogContextValue = {
  products: Product[];
  customized: boolean;
  getProduct: (slug: string | undefined) => Product | undefined;
  search: (query: string) => Product[];
  saveProduct: (product: Product, previousSlug?: string) => string | null;
  deleteProduct: (slug: string) => void;
  resetCatalog: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function readStored(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item) => item && typeof item.slug === "string" && item.name);
  } catch {
    return null;
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const stored = readStored();
  const [products, setProducts] = useState<Product[]>(() => {
    if (!stored) return seedProducts;
    const known = new Set(stored.map((item) => item.slug));
    const added = seedProducts.filter((item) => !known.has(item.slug));
    return added.length ? [...added, ...stored] : stored;
  });
  const [customized, setCustomized] = useState(stored !== null);
  const [error, setError] = useState<string | null>(null);

  const persist = (next: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProducts(next);
      setCustomized(true);
      setError(null);
      return null;
    } catch {
      const message = "Enregistrement impossible : la photo est trop lourde pour le navigateur.";
      setError(message);
      return message;
    }
  };

  const value = useMemo<CatalogContextValue>(() => {
    return {
      products,
      customized,
      getProduct: (slug) => findProduct(slug, products),
      search: (query) => filterProducts(query, products),
      saveProduct: (product, previousSlug) => {
        const slug = product.slug.trim();
        const clash = products.some((item) => item.slug === slug && item.slug !== previousSlug);
        if (!slug || clash) return "Cette adresse de fiche est déjà utilisée.";
        const next = previousSlug
          ? products.map((item) => (item.slug === previousSlug ? product : item))
          : [product, ...products.filter((item) => item.slug !== slug)];
        return persist(next);
      },
      deleteProduct: (slug) => {
        persist(products.filter((item) => item.slug !== slug));
      },
      resetCatalog: () => {
        localStorage.removeItem(STORAGE_KEY);
        setProducts(seedProducts);
        setCustomized(false);
        setError(null);
      },
    };
  }, [customized, products]);

  return (
    <CatalogContext.Provider value={value}>
      {error && <p className="admin-toast">{error}</p>}
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog doit être utilisé dans CatalogProvider");
  return context;
}
