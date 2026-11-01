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
  const tone = product.image?.includes("/tektelic-")
    ? " photo-cutout"
    : product.image?.includes("/sensecap-")
      ? " photo-studio"
      : product.image?.includes("/compteurs/")
        ? " photo-meter"
        : "";
  const size = `${large ? "photo photo-lg" : small ? "photo photo-sm" : "photo"}${tone}`;

  if (failed) {
    return <DeviceArt art={product.art} category={product.category} label={product.ref} large={large} small={small} />;
  }

  return (
    <div className={size}>
      <img src={productImage(product)} alt={alt} onError={() => setFailed(true)} />
    </div>
  );
}
