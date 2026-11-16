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
  const [ready, setReady] = useState(false);
  const src = productImage(product);
  const size = large ? "photo photo-lg" : small ? "photo photo-sm" : "photo";

  if (failed) {
    return <DeviceArt art={product.art} category={product.category} label={product.ref} large={large} small={small} />;
  }

  return (
    <div className={ready ? size : `${size} is-loading`}>
      <span className="photo-skeleton" aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        width={800}
        height={600}
        loading={large ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
