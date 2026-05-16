import type { FurniProduct } from "@/lib/furni-types";
import { siteConfig } from "@/lib/site-metadata";

type Props = {
  product: FurniProduct;
};

export function ProductJsonLd({ product }: Props) {
  const url = `${siteConfig.url}/product/${product.id}`;
  const images = product.imageUrls?.length ? product.imageUrls : [product.image];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: images,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name
      }
    },
    aggregateRating:
      product.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: Math.max(1, Math.round(product.rating))
          }
        : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
