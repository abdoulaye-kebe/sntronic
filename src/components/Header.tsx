import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { aisles, productsInAisle, type AisleId } from "../data/catalog.ts";
import { formatEUR, formatXOF, lineTtc, toXof } from "../lib/money.ts";
import { Logo } from "./Logo.tsx";

export function Header() {
  const { count, setOpen } = useCart();
  const { products, search } = useCatalog();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [rail, setRail] = useState<AisleId | null>(null);

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setRail(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen && !searchOpen && !rail) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setRail(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, rail, searchOpen]);

  const results = useMemo(() => (query.trim().length < 2 ? [] : search(query).slice(0, 6)), [query, search]);
  const openAisle = aisles.find((aisle) => aisle.id === rail);
  const openProducts = openAisle ? productsInAisle(openAisle.id, products).slice(0, 10) : [];

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/catalogue?q=${encodeURIComponent(trimmed)}` : "/catalogue");
    setFocused(false);
    setSearchOpen(false);
    setMenuOpen(false);
    setRail(null);
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
                      <strong>
                        {formatEUR(lineTtc(product.priceHt))}
                        <small>{formatXOF(toXof(lineTtc(product.priceHt)))}</small>
                      </strong>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>
          <nav className="shop-links" aria-label="Raccourcis">
            <a href="/catalogue">Catalogue</a>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/a-propos">À propos de nous</NavLink>
            <NavLink to="/guide">Guide</NavLink>
            <NavLink to="/contact">Contact</NavLink>
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
      <div className="rail-wrap" onMouseLeave={() => setRail(null)}>
        <nav className="wrap rail" aria-label="Familles">
          {aisles.map((aisle) => {
            const current = location.pathname === `/catalogue/${aisle.id}`;
            const on = rail === aisle.id || current;
            return (
              <NavLink
                key={aisle.id}
                to={`/catalogue/${aisle.id}`}
                className={on ? "on" : undefined}
                onMouseEnter={() => setRail(aisle.id)}
                onFocus={() => setRail(aisle.id)}
              >
                <AisleGlyph id={aisle.id} />
                <span>{aisle.name}</span>
              </NavLink>
            );
          })}
        </nav>
        {openAisle && (
          <div className="mega">
            <div className="wrap mega-inner">
              <div>
                <p className="mega-title">{openAisle.name}</p>
                <div className="mega-cols">
                  {openProducts.map((product) => (
                    <Link key={product.slug} to={`/produit/${product.slug}`}>
                      {product.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link className="btn btn-clay" to={`/catalogue/${openAisle.id}`}>
                Voir le rayon
              </Link>
            </div>
          </div>
        )}
      </div>
      {menuOpen && (
        <nav className="nav-mobile wrap" aria-label="Menu mobile">
          <NavLink to="/catalogue" onClick={() => setMenuOpen(false)}>
            Catalogue
          </NavLink>
          {aisles.map((aisle) => (
            <NavLink key={aisle.id} to={`/catalogue/${aisle.id}`} onClick={() => setMenuOpen(false)}>
              {aisle.name}
            </NavLink>
          ))}
          <NavLink to="/services" onClick={() => setMenuOpen(false)}>
            Services
          </NavLink>
          <NavLink to="/a-propos" onClick={() => setMenuOpen(false)}>
            À propos de nous
          </NavLink>
          <NavLink to="/guide" onClick={() => setMenuOpen(false)}>
            Guide de choix
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
        </nav>
      )}
    </header>
  );
}

function AisleGlyph({ id }: { id: AisleId }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true as const,
  };
  if (id === "devices") {
    return (
      <svg {...common}>
        <path d="M5 12a7 7 0 0 1 14 0" />
        <path d="M8 12a4 4 0 0 1 8 0" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <path d="M12 13.5V20" />
      </svg>
    );
  }
  if (id === "modules") {
    return (
      <svg {...common}>
        <rect x="4" y="7" width="16" height="10" rx="1.5" />
        <path d="M8 7V4M12 7V4M16 7V4M8 20v-3M12 20v-3M16 20v-3" />
      </svg>
    );
  }
  if (id === "domotique") {
    return (
      <svg {...common}>
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M7 10.5V19h10v-8.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3v4" />
      <path d="M8 7h8" />
      <path d="M12 7v13" />
      <path d="M7 20h10" />
      <path d="M5 10a7 7 0 0 1 2.2-2" />
      <path d="M19 10a7 7 0 0 0-2.2-2" />
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
