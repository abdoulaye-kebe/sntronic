import { Link } from "react-router-dom";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={light ? "logo logo-light" : "logo"}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="22" height="22">
          <path
            d="M7 21c2.4-3.2 5-4.8 9-4.8s6.6 1.6 9 4.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M4.5 16.5c3.2-4.4 6.8-6.6 11.5-6.6s8.3 2.2 11.5 6.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="16" cy="23.2" r="1.7" fill="currentColor" />
        </svg>
      </span>
      <span>SNTRONIC</span>
    </Link>
  );
}
