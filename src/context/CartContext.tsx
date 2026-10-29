import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "../data/catalog.ts";
import { useCatalog } from "./CatalogContext.tsx";

const STORAGE_KEY = "sntronic-cart";

export type CartLine = { slug: string; qty: number };
export type DetailedLine = CartLine & { product: Product };

type CartContextValue = {
  lines: DetailedLine[];
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => line && typeof line.slug === "string" && line.qty > 0);
  } catch {
    return [];
  }
}

function detail(lines: CartLine[], catalog: Product[]): DetailedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.slug, catalog);
    if (!product || product.stock <= 0) return [];
    return [{ slug: line.slug, qty: Math.min(line.qty, product.stock), product }];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog();
  const [stored, setStored] = useState<CartLine[]>(readStored);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [stored]);

  const lines = useMemo(() => detail(stored, products), [products, stored]);

  const add = (slug: string, qty = 1) => {
    const product = getProduct(slug, products);
    if (!product || product.stock <= 0 || qty <= 0) return;
    setStored((current) => {
      const existing = current.find((line) => line.slug === slug);
      const nextQty = Math.min(product.stock, (existing?.qty ?? 0) + qty);
      if (existing) {
        return current.map((line) => (line.slug === slug ? { ...line, qty: nextQty } : line));
      }
      return [...current, { slug, qty: nextQty }];
    });
    setOpen(true);
  };

  const setQty = (slug: string, qty: number) => {
    const product = getProduct(slug, products);
    if (!product) return;
    setStored((current) => {
      if (qty <= 0) return current.filter((line) => line.slug !== slug);
      const nextQty = Math.min(product.stock, qty);
      return current.map((line) => (line.slug === slug ? { ...line, qty: nextQty } : line));
    });
  };

  const remove = (slug: string) => {
    setStored((current) => current.filter((line) => line.slug !== slug));
  };

  const clear = () => {
    setStored([]);
    localStorage.setItem(STORAGE_KEY, "[]");
  };

  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  const value = { lines, count, open, setOpen, add, setQty, remove, clear };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider");
  return context;
}
