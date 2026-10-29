import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    document.title =
      title === "Accueil"
        ? "SNTRONIC — IoT, passerelles et modules"
        : `${title} — SNTRONIC`;
  }, [title]);
}
