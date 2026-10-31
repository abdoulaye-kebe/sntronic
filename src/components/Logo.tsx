import { Link } from "react-router-dom";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={light ? "logo logo-light" : "logo"} aria-label="SNTRONIC, accueil">
      <Mark />
      <span className="logo-rule" aria-hidden="true" />
      <span className="logo-lockup" aria-hidden="true">
        <span className="logo-word">
          SNTR
          <Power />
          NIC
        </span>
        <span className="logo-tag">Connecter • Accompagner • Innover</span>
      </span>
    </Link>
  );
}

function Mark() {
  return (
    <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M44 14c10 1 12 12 4 16-9 5-16 3-16 10 0 8 10 10 16 14 5 4-1 12-10 12-12 0-16-8-14-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="6" cy="22" r="2" />
        <path d="M8 22h7" />
        <circle cx="4.5" cy="33" r="2" />
        <path d="M6.5 33h9" />
        <circle cx="7" cy="44" r="2" />
        <path d="M9 44h6" />
        <path d="M46 12c3.4 2.2 5 5 5 5" />
        <path d="M50 8c4.6 3.2 7 7.2 7 7.2" />
      </g>
      <circle cx="30" cy="46" r="3.3" fill="#e8771a" />
    </svg>
  );
}

function Power() {
  return (
    <svg className="logo-power" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.4 8.2a7.2 7.2 0 1 0 9.2 0"
        fill="none"
        stroke="#e8771a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M12 2.4v6.8" fill="none" stroke="#e8771a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
