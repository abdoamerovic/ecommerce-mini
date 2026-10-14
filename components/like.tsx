// Place this file at: components/Like.tsx

"use client"

import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import productsData from "@/data/products.json"
import { getProductHref, normalizeCategory } from "@/lib/productRoute"

type Product = {
  id: string
  name_en: string
  name_ar: string
  category: string
  image?: string
  price: number
  oldPrice?: number | null
  discount?: number
  rating?: number
  reviews?: number
  inStock?: boolean
}

const DEFAULT_IMAGE = "/images/default-product.jpg"
const MAX_ITEMS = 4
const ALL_PRODUCTS = productsData as Product[]

export default function Like({
  category,
  excludeId,
}: {
  category?: string
  excludeId?: string
} = {}) {
  const t = useTranslations("Like")
  const rawLocale = useLocale()
  const locale = rawLocale === "ar" ? "ar" : "en"

  // The current product must never suggest itself (the old fallback ignored excludeId)
  const candidates = ALL_PRODUCTS.filter((p) => p.id !== excludeId)

  // "man"/"woman" (route names) now match "men"/"women" (data names)
  const wanted = category ? normalizeCategory(category) : null
  const sameCategory = wanted ? candidates.filter((p) => normalizeCategory(p.category) === wanted) : candidates

  const visibleProducts = (sameCategory.length > 0 ? sameCategory : candidates).slice(0, MAX_ITEMS)

  if (visibleProducts.length === 0) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h2 className="mb-8 text-center text-3xl font-extrabold sm:text-4xl md:text-5xl">{t("title")}</h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
        {visibleProducts.map((product) => {
          const name = locale === "ar" ? product.name_ar : product.name_en
          const discount = product.discount ?? 0

          return (
            <Link
              key={product.id}
              href={getProductHref(locale, product)}
              className="block rounded-2xl p-2 text-start transition-shadow duration-200 hover:shadow-lg sm:p-3"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={product.image || DEFAULT_IMAGE}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />

                {product.inStock === false && (
                  <span className="absolute inset-e-2 top-2 rounded-full bg-gray-800 px-2 py-1 text-xs text-white">
                    {t("outOfStock")}
                  </span>
                )}

                {discount > 0 && (
                  <span className="absolute inset-s-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                    -{discount}%
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
                      i < Math.round(product.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="ms-1 text-xs text-gray-500">
                  {product.rating ?? 0} ({product.reviews ?? 0})
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2">
                <span className="font-bold">${product.price}</span>
                {product.oldPrice ? (
                  <span className="text-sm text-gray-400 line-through">${product.oldPrice}</span>
                ) : null}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
