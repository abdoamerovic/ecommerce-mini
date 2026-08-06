"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import localProducts from "@/data/products.json"

type Product = {
  id: string
  name_en: string
  name_ar: string
  category: string
  image: string
  price: number
  oldPrice: number | null
  discount: number
  rating: number
  reviews: number
  inStock: boolean
}

const DEFAULT_IMAGE = "/images/default-product.jpg"

function getRandomProducts(all: Product[], count: number): Product[] {
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.image || DEFAULT_IMAGE)
  const t = useTranslations("TopSale")
  const locale = useLocale()
  const name = locale === "ar" ? product.name_ar : product.name_en

  return (
    <div className="rounded-2xl p-3 hover:shadow-lg transition-shadow duration-200">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />

        {!product.inStock && (
          <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
            {t("outOfStock")}
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
              i < Math.round(product.rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {product.rating} ({product.reviews})
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold">${product.price}</span>
        {product.oldPrice && (
          <span className="text-gray-400 line-through text-sm">
            ${product.oldPrice}
          </span>
        )}
        {product.discount > 0 && (
          <span className="left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>
    </div>
  )
}

export default function TopSale() {
  const t = useTranslations("TopSale")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products")

        if (!res.ok) {
          throw new Error("API response not ok")
        }

        const data: Product[] = await res.json()
        setAllProducts(data)
        setVisibleProducts(getRandomProducts(data, 4))
      } catch (error) {
        console.warn("API failed, using local data instead:", error)
        setAllProducts(localProducts as Product[])
        setVisibleProducts(getRandomProducts(localProducts as Product[], 4))
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  function handleViewMore() {
    setVisibleProducts(getRandomProducts(allProducts, 12))
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-10" id="onsale">
        <h2 className="text-2xl font-extrabold text-center mb-6 text-[48px]">
          {t("title")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-3">
              <div className="w-full aspect-square rounded-xl bg-gray-200 animate-pulse" />
              <div className="mt-3 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="mt-2 h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10" id="onsale">
      <h2 className="text-2xl font-extrabold text-center mb-6 text-[48px]">
        {t("title")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleViewMore}
          className="border rounded-full px-8 py-3 hover:bg-black hover:text-white transition-colors"
        >
          {t("viewMore")}
        </button>
      </div>
    </section>
  )
}