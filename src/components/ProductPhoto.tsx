import { useState } from "react";
import { productImage, type Product } from "../data/catalog.ts";
import { DeviceArt } from "./DeviceArt.tsx";

export function ProductPhoto({
  product,
  large = false,
  small = false,
  alt = "",
}: {
  product: Product;
  large?: boolean;
  small?: boolean;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = productImage(product);
  const tone = src.includes("/tektelic-")
    ? " photo-cutout"
    : src.includes("/sensecap-") || src.includes("/adeunis-")
      ? " photo-studio"
      : src.includes("/compteurs/")
        ? " photo-meter"
        : "";
  const plate = /\.(jpe?g|webp)$/i.test(src) ? " photo-plate" : "";
  const size = `${large ? "photo photo-lg" : small ? "photo photo-sm" : "photo"}${tone}${plate}`;

  if (failed) {
    return <DeviceArt art={product.art} category={product.category} label={product.ref} large={large} small={small} />;
  }

  return (
    <div className={size}>
      <img src={src} alt={alt} onError={() => setFailed(true)} />
    </div>
  );
}
