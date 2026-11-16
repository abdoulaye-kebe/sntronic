import { Link } from "react-router-dom";

export function SectionTitle({
  title,
  href,
  linkLabel,
  id,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}) {
  return (
    <div className="shelf-head">
      <h2 id={id}>{title}</h2>
      {href && linkLabel ? <Link to={href}>{linkLabel}</Link> : null}
    </div>
  );
}
