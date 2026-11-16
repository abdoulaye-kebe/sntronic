import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type Service = { short: string; title: string; text: string; to?: string };

export function ServiceCard({ service, index, more = false }: { service: Service; index: number; more?: boolean }) {
  const href = service.to ?? (more ? "/services" : undefined);
  return (
    <article className="service-card">
      <div className="service-mark">
        <span className="service-icon">
          <ServiceIcon index={index} />
        </span>
        <span className="service-num">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h2>{more ? service.short : service.title}</h2>
      <p>{service.text}</p>
      {href ? (
        <Link className="text-link" to={href}>
          {service.to ? "Voir les sessions" : "En savoir plus"}
        </Link>
      ) : null}
    </article>
  );
}

function ServiceIcon({ index }: { index: number }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  let body: ReactNode;
  if (index === 0) {
    body = (
      <>
        <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z" />
        <path d="M12 12.2 3.5 7.5M12 12.2V20.5M12 12.2 20.5 7.5" />
      </>
    );
  } else if (index === 1) {
    body = (
      <>
        <circle cx="6" cy="7" r="2.1" />
        <circle cx="18" cy="7" r="2.1" />
        <circle cx="12" cy="17.2" r="2.1" />
        <path d="M8 8.2 10.5 15.2M16 8.2 13.5 15.2M8.1 7h7.8" />
      </>
    );
  } else if (index === 2) {
    body = (
      <>
        <path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10z" />
        <circle cx="12" cy="11" r="2" />
      </>
    );
  } else if (index === 3) {
    body = (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m14.7 9.3-1.2 4.2-4.2 1.2 1.2-4.2z" />
      </>
    );
  } else if (index === 4) {
    body = (
      <>
        <path d="M4 19.5h16" />
        <path d="M7 16.5V11M12 16.5V6.5M17 16.5v-4" />
      </>
    );
  } else {
    body = (
      <>
        <path d="m3 9 9-4.5L21 9l-9 4.5L3 9z" />
        <path d="M7 11.2V15c1.6 1.2 3.2 1.8 5 1.8s3.4-.6 5-1.8v-3.8" />
      </>
    );
  }
  return <svg {...common}>{body}</svg>;
}
