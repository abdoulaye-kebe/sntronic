import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { useCatalog } from "../context/CatalogContext.tsx";
import { menu, type MenuItem } from "../data/menu.ts";
import { formatXOF, isQuoted, lineTtcXof } from "../lib/money.ts";
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
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const mastRef = useRef<HTMLElement>(null);
  const section = sectionOf(location.pathname, location.search);
  const productMenu = menu.find((item) => item.id === "produits");

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenMenu(null);
    setMobileSection(null);
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

  useEffect(() => {
    if (!openMenu) return;
    const onPointer = (event: PointerEvent) => {
      if (!mastRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [openMenu]);

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
    <header ref={mastRef} className={`mast ${searchOpen ? "search-open" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <div className="shopbar">
        <div className="wrap shopbar-inner">
          <Logo />
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
                      <strong>{isQuoted(product) ? "Sur devis" : formatXOF(lineTtcXof(product.priceHt))}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>
          <nav className="shop-links" aria-label="Raccourcis">
            <Link className="btn btn-clay btn-devis" to="/contact">
              <span className="devis-long">Demander un devis</span>
              <span className="devis-short">Devis</span>
            </Link>
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
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => {
              setMenuOpen((value) => !value);
              setSearchOpen(false);
              setMobileSection(null);
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
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
                aria-expanded={item.children ? openMenu === item.id : undefined}
                aria-controls={item.id === "produits" ? "mega-produits" : undefined}
                onFocus={() => setOpenMenu(item.children ? item.id : null)}
              >
                {item.label}
                {item.children ? <Caret /> : null}
              </Link>
              {item.children && item.id !== "produits" && openMenu === item.id && (
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
        {openMenu === "produits" && productMenu?.children && (
          <div className="mega-panel" id="mega-produits" role="region" aria-label="Produits">
            <div className="wrap mega-grid">
              {productMenu.children.map((child) => (
                <Link key={child.to} className="mega-link" to={child.to}>
                  <MegaIcon to={child.to} />
                  <span>
                    <strong>{child.label}</strong>
                    {child.hint ? <small>{child.hint}</small> : null}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {menuOpen && (
        <nav className="nav-mobile wrap" aria-label="Menu mobile">
          {menu.map((item) => (
            <MobileGroup
              key={item.id}
              item={item}
              open={mobileSection === item.id}
              onToggle={() => setMobileSection((current) => (current === item.id ? null : item.id))}
              onNavigate={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      )}
    </header>
  );
}

function MobileGroup({
  item,
  open,
  onToggle,
  onNavigate,
}: {
  item: MenuItem;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const extras = (item.children ?? []).filter((child) => {
    if ((item.id === "contact" || item.id === "produits") && child.to === item.to) return false;
    return true;
  });
  return (
    <div className={open ? "nav-group open" : "nav-group"}>
      <div className="nav-row">
        <Link to={item.to ?? "/"} onClick={onNavigate}>
          {item.label}
        </Link>
        {extras.length > 0 && (
          <button type="button" aria-expanded={open} aria-label={open ? `Replier ${item.label}` : `Déplier ${item.label}`} onClick={onToggle}>
            <Caret />
          </button>
        )}
      </div>
      {open && extras.length > 0 && (
        <div className="nav-subs">
          {extras.map((child) => (
            <Link key={child.label} to={child.to} onClick={onNavigate}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function sectionOf(pathname: string, search: string): string {
  const query = new URLSearchParams(search);
  if (query.get("accessoire")) return "accessoires";
  if (query.get("usage")) return "usages";
  if (pathname === "/") return "accueil";
  if (pathname.startsWith("/services") || pathname.startsWith("/formation")) return "services";
  if (pathname.startsWith("/usages")) return "usages";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/contact") || pathname.startsWith("/a-propos") || pathname.startsWith("/livraison")) return "contact";
  if (pathname.startsWith("/catalogue") || pathname.startsWith("/produit") || pathname.startsWith("/guide")) return "produits";
  return "";
}

function MegaIcon({ to }: { to: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (to.includes("gateways")) {
    return (
      <svg {...common}>
        <path d="M12 20v-6" />
        <path d="M8.5 11a6 6 0 0 1 7 0" />
        <path d="M6 8.2a10 10 0 0 1 12 0" />
        <circle cx="12" cy="20" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (to.includes("modules")) {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 4v4M15 4v4M9 16v4M15 16v4M4 9h4M4 15h4M16 9h4M16 15h4" />
      </svg>
    );
  }
  if (to.includes("domotique")) {
    return (
      <svg {...common}>
        <path d="M4 11.5 12 5l8 6.5V20H4z" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }
  if (to.endsWith("/guide")) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 1.5" />
      </svg>
    );
  }
  if (to === "/catalogue") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="7" height="7" rx="1.4" />
        <rect x="13" y="4" width="7" height="7" rx="1.4" />
        <rect x="4" y="13" width="7" height="7" rx="1.4" />
        <rect x="13" y="13" width="7" height="7" rx="1.4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="7" y="3.5" width="10" height="17" rx="2" />
      <path d="M10 7.5h4M10 11h4M10 14.5h2.5" />
    </svg>
  );
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

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
