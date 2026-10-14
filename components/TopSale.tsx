// Place this file at: components/TopSale.tsx

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useShuffledProducts, type ListProduct } from "@/lib/useProducts"
import { getProductHref } from "@/lib/productRoute"

const DEFAULT_IMAGE = "/images/default-product.jpg"
const INITIAL_COUNT = 4
const EXPANDED_COUNT = 12

function ProductCard({ product }: { product: ListProduct }) {
  const [imgSrc, setImgSrc] = useState(product.image || DEFAULT_IMAGE)
  const t = useTranslations("TopSale")
  const locale = useLocale()
  const name = locale === "ar" ? product.name_ar : product.name_en

  return (
    // These cards had a hover effect but no link at all. Now they open the product.
    <Link
      href={getProductHref(locale, product)}
      className="block rounded-2xl p-2 text-start transition-shadow duration-200 hover:shadow-lg sm:p-3"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />

        {!product.inStock && (
          <span className="absolute inset-e-2 top-2 rounded-full bg-gray-800 px-2 py-1 text-xs text-white">
            {t("outOfStock")}
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-semibold">{name}</h3>

      <div className="mt-1 flex flex-wrap items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.round(product.rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ms-1 text-xs text-gray-500">
          {product.rating} ({product.reviews})
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-bold">${product.price}</span>
        {product.oldPrice ? (
          <span className="text-sm text-gray-400 line-through">${product.oldPrice}</span>
        ) : null}
        {product.discount > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">-{product.discount}%</span>
        )}
      </div>
    </Link>
  )
}

export default function TopSale() {
  const t = useTranslations("TopSale")
  const { products, loading } = useShuffledProducts()
  const [expanded, setExpanded] = useState(false)

  const visibleProducts = products.slice(0, expanded ? EXPANDED_COUNT : INITIAL_COUNT)
  const canExpand = !expanded && products.length > INITIAL_COUNT

  const heading = (
    <h2 className="mb-8 text-center text-3xl font-extrabold sm:text-4xl md:text-5xl">{t("title")}</h2>
  )

  // id="onsale" lives here only. The home page also wrapped this in <div id="onsale"> (duplicate id).
  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" id="onsale">
        {heading}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
          {Array.from({ length: INITIAL_COUNT }).map((_, i) => (
            <div key={i} className="rounded-2xl p-3">
              <div className="aspect-square w-full animate-pulse rounded-xl bg-gray-200" />
              <div className="mt-3 h-4 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" id="onsale">
      {heading}

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {canExpand && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border px-8 py-3 transition-colors hover:bg-black hover:text-white"
          >
            {t("viewMore")}
          </button>
        </div>
      )}
    </section>
  )
}
