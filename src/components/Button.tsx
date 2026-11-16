import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost";

type Common = {
  variant?: Variant;
  size?: "md" | "sm";
  busy?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = Common & { to: string };
type AsButton = Common & {
  to?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-clay",
  ghost: "btn-ghost",
};

export function Button(props: AsLink | AsButton) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const className = ["btn", variantClass[variant], size === "sm" ? "btn-small" : "", props.className].filter(Boolean).join(" ");

  if ("to" in props && props.to) {
    return (
      <Link className={className} to={props.to}>
        {props.children}
      </Link>
    );
  }

  const button = props as AsButton;
  return (
    <button
      className={className}
      type={button.type ?? "button"}
      aria-busy={button.busy || undefined}
      aria-label={button["aria-label"]}
      disabled={button.disabled || button.busy}
      onClick={button.onClick}
    >
      {button.children}
    </button>
  );
}
