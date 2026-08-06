"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Star } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import productsData from "@/data/products.json"

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

export default function Like({
  category,
  excludeId,
}: {
  category?: string
  excludeId?: string
} = {}) {
  const router = useRouter()
  const t = useTranslations("Like")
  const rawLocale = useLocale()
  const locale = rawLocale === "ar" ? "ar" : "en"

  const allProducts = productsData as Product[]

  const filtered = allProducts.filter((p) => {
    if (excludeId && p.id === excludeId) return false
    if (category && p.category !== category) return false
    return true
  })

  const visibleProducts = (filtered.length > 0 ? filtered : allProducts).slice(0, 4)

  function goToProduct(product: Product) {
    if (product.category === "men") {
      router.push(`/${locale}/Category/man?id=${product.id}`)
    } else if (product.category === "women") {
      router.push(`/${locale}/Category/woman?id=${product.id}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-extrabold text-center mb-6 text-[48px]">
        {t("title")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {visibleProducts.map((product) => {
          const name = locale === "ar" ? product.name_ar : product.name_en
          return (
            <button
              key={product.id}
              onClick={() => goToProduct(product)}
              className="text-left rounded-2xl p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={product.image || DEFAULT_IMAGE}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />

                {product.inStock === false && (
                  <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                    {t("outOfStock")}
                  </span>
                )}

                {!!product.discount && product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-semibold text-sm">{name}</h3>

              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  {product.rating ?? 0} ({product.reviews ?? 0})
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold">${product.price}</span>
                {product.oldPrice ? (
                  <span className="text-gray-400 line-through text-sm">${product.oldPrice}</span>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}