import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { menu, type MenuItem } from "../data/menu.ts";
import { formatXOF, lineTtcXof } from "../lib/money.ts";
import { Logo } from "./Logo.tsx";

export function Header() {
  const { count, setOpen } = useCart();
  const { search } = useCatalog();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const section = sectionOf(location.pathname, location.search);

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenMenu(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen && !searchOpen && !openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, openMenu, searchOpen]);

  const results = useMemo(() => (query.trim().length < 2 ? [] : search(query).slice(0, 6)), [query, search]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/catalogue?q=${encodeURIComponent(trimmed)}` : "/catalogue");
    setFocused(false);
    setSearchOpen(false);
    setMenuOpen(false);
    setOpenMenu(null);
  }

  return (
    <header className={`mast ${searchOpen ? "search-open" : ""}`}>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <div className="shopbar">
        <div className="wrap shopbar-inner">
          <Logo light />
          <form className="search search-wide" role="search" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="search">
              Rechercher une référence
            </label>
            <input
              id="search"
              className="search-input"
              placeholder="Rechercher une référence, une gamme…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 160)}
              autoComplete="off"
            />
            <button className="search-go" type="submit" aria-label="Rechercher">
              <SearchIcon />
            </button>
            {focused && query.trim().length >= 2 && (
              <ul className="search-results">
                {results.length === 0 && <li className="search-empty">Aucune référence</li>}
                {results.map((product) => (
                  <li key={product.slug}>
                    <Link to={`/produit/${product.slug}`}>
                      <span>
                        {product.name}
                        <small>{product.ref}</small>
                      </span>
                      <strong>{formatXOF(lineTtcXof(product.priceHt))}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>
          <nav className="shop-links" aria-label="Raccourcis">
            <button type="button" className="cart-link" aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`} onClick={() => setOpen(true)}>
              <BagIcon />
              <span className="cart-label">Panier</span>
              <span className="count">{count}</span>
            </button>
          </nav>
          <button
            type="button"
            className="icon-btn search-toggle"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
            onClick={() => {
              setSearchOpen((value) => !value);
              setMenuOpen(false);
            }}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((value) => !value);
              setSearchOpen(false);
            }}
          >
            {menuOpen ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>
      <div className="site-nav-wrap" onMouseLeave={() => setOpenMenu(null)}>
        <nav className="wrap site-nav" aria-label="Rubriques">
          {menu.map((item) => (
            <div
              key={item.id}
              className={item.children ? "site-item has-sub" : "site-item"}
              onMouseEnter={() => setOpenMenu(item.children ? item.id : null)}
            >
              <Link
                to={item.to ?? "/"}
                className={section === item.id ? "on" : undefined}
                aria-current={section === item.id ? "page" : undefined}
                onFocus={() => setOpenMenu(item.children ? item.id : null)}
              >
                {item.label}
                {item.children ? <Caret /> : null}
              </Link>
              {item.children && openMenu === item.id && (
                <ul className="site-drop">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link to={child.to}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
      {menuOpen && (
        <nav className="nav-mobile wrap" aria-label="Menu mobile">
          {menu.map((item) => (
            <MobileGroup key={item.id} item={item} onNavigate={() => setMenuOpen(false)} />
          ))}
        </nav>
      )}
    </header>
  );
}

function MobileGroup({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  return (
    <div className="nav-group">
      <Link to={item.to ?? "/"} onClick={onNavigate}>
        {item.label}
      </Link>
      {item.children?.map((child) => (
        <Link key={child.label} className="nav-sub" to={child.to} onClick={onNavigate}>
          {child.label}
        </Link>
      ))}
    </div>
  );
}

function sectionOf(pathname: string, search: string): string {
  const query = new URLSearchParams(search);
  if (query.get("accessoire")) return "accessoires";
  if (query.get("usage")) return "usages";
  if (pathname === "/") return "accueil";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/usages")) return "usages";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/contact") || pathname.startsWith("/a-propos") || pathname.startsWith("/livraison")) return "contact";
  if (pathname.startsWith("/catalogue") || pathname.startsWith("/produit") || pathname.startsWith("/guide")) return "produits";
  return "";
}

function Caret() {
  return (
    <svg className="caret" width="9" height="9" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6.5 8h11l-.8 12h-9.4L6.5 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}
