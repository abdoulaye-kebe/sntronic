import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}

const toneOf: Record<string, string> = {
  LoRaWAN: "lora",
  "LTE-M": "lte",
  "NB-IoT": "nb",
};

/** Pastille de techno, sous le titre : lisible, sans recouvrir la photo. */
export function TechChip({ network }: { network: string }) {
  return <span className={`tech-chip tech-${toneOf[network] ?? "lora"}`}>{network}</span>;
}
