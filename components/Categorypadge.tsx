"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import productsData from "@/data/products.json"

type ProductColor = {
  name: string
  hex: string
  image?: string
}

type Product = {
  id: string
  name_en: string
  name_ar: string
  category: string
  image: string
  description_en?: string
  description_ar?: string
  price: number
  oldPrice: number | null
  discount: number
  rating: number
  reviews: number
  inStock: boolean
  colors?: ProductColor[]
}

const DEFAULT_IMAGE = "/images/default-product.jpg"
const PAGE_SIZE = 9

const CLOTHING_TYPES = ["tshirts", "shorts", "shirts", "hoodie", "jeans"] as const
const SIZES = [
  "xxSmall", "xSmall", "small", "medium", "large",
  "xLarge", "xxLarge", "3xLarge", "4xLarge",
] as const
const DRESS_STYLES = ["casual", "formal", "party", "gym"] as const
const COLOR_SWATCHES = [
  "#22C55E", "#EF4444", "#F59E0B", "#3B82F6", "#06B6D4",
  "#6366F1", "#A855F7", "#EC4899", "#FFFFFF", "#111827",
]

type SortOption = "popular" | "newest" | "priceLow" | "priceHigh" | "rating"

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between font-semibold text-sm"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

export default function Categorypadge({ category }: { category: string }) {
  const t = useTranslations("CategoryPage")
  const tBread = useTranslations("Breadcrumb")
  const locale = useLocale()
  const router = useRouter()

  const allProducts = productsData as Product[]

  const [priceRange, setPriceRange] = useState(200)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedDressStyle, setSelectedDressStyle] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [page, setPage] = useState(1)

  const activeDressStyle = selectedDressStyle ?? category

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (activeDressStyle && p.category.toLowerCase() !== activeDressStyle.toLowerCase()) return false
      if (p.price > priceRange) return false
      if (selectedColor && !p.colors?.some((c) => c.hex.toLowerCase() === selectedColor.toLowerCase())) {
        return false
      }
      return true
    })

    switch (sortBy) {
      case "priceLow":
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case "priceHigh":
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      case "popular":
      default:
        list = [...list].sort((a, b) => b.reviews - a.reviews)
        break
    }

    return list
  }, [allProducts, selectedDressStyle, priceRange, selectedColor, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToProduct(product: Product) {
  router.push(`/${locale}/Product/${product.category.toLowerCase()}?id=${product.id}`)
}

  function pageNumbers() {
    const nums: (number | "dots")[] = []
    for (let i = 1; i <= Math.min(3, totalPages); i++) nums.push(i)
    if (totalPages > 4) nums.push("dots")
    if (totalPages > 3) nums.push(totalPages)
    return nums
  }

  const categoryLabel = t.has(`dressStyles.${category}`)
    ? t(`dressStyles.${category}` as never)
    : category

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>{tBread("home")}</span>
        <span>›</span>
        <span className="text-black capitalize">{categoryLabel}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="border border-gray-200 rounded-2xl p-4">
            <FilterSection title={t("filters")} defaultOpen={false}>
              <ul className="flex flex-col gap-3 text-sm text-gray-600">
                {CLOTHING_TYPES.map((type) => (
                  <li key={type}>
                    <button
                      type="button"
                      onClick={() => setSelectedType((s) => (s === type ? null : type))}
                      className={`w-full flex items-center justify-between hover:text-black ${
                        selectedType === type ? "text-black font-medium" : ""
                      }`}
                    >
                      {t(`types.${type}`)}
                      <ChevronRight size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection title={t("price")}>
              <input
                type="range"
                min={50}
                max={200}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value))
                  setPage(1)
                }}
                className="w-full accent-black"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>$50</span>
                <span>${priceRange}</span>
              </div>
            </FilterSection>

            <FilterSection title={t("colors")}>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={hex}
                    onClick={() => {
                      setSelectedColor((c) => (c === hex ? null : hex))
                      setPage(1)
                    }}
                    className={`w-7 h-7 rounded-full border transition-transform ${
                      selectedColor === hex ? "ring-2 ring-black ring-offset-2 scale-105" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title={t("size")}>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize((s) => (s === size ? null : size))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t(`sizes.${size}`)}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={t("dressStyle")}>
              <ul className="flex flex-col gap-3 text-sm text-gray-600">
                {DRESS_STYLES.map((style) => (
                  <li key={style}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDressStyle((s) => (s === style ? null : style))
                        setPage(1)
                      }}
                      className={`w-full flex items-center justify-between hover:text-black ${
                        selectedDressStyle === style ? "text-black font-medium" : ""
                      }`}
                    >
                      {t(`dressStyles.${style}`)}
                      <ChevronRight size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <button
              type="button"
              onClick={() => setPage(1)}
              className="w-full mt-4 bg-black text-white rounded-full py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              {t("applyFilter")}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold capitalize">{categoryLabel}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>
                {t("showing", {
                  from: filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1,
                  to: Math.min(page * PAGE_SIZE, filtered.length),
                  total: filtered.length,
                })}
              </span>
              <label className="flex items-center gap-2">
                {t("sortBy")}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="outline-none font-medium text-black bg-transparent"
                >
                  <option value="popular">{t("sortOptions.popular")}</option>
                  <option value="newest">{t("sortOptions.newest")}</option>
                  <option value="priceLow">{t("sortOptions.priceLow")}</option>
                  <option value="priceHigh">{t("sortOptions.priceHigh")}</option>
                  <option value="rating">{t("sortOptions.rating")}</option>
                </select>
              </label>
            </div>
          </div>

          {paged.length === 0 ? (
            <p className="text-center text-gray-500 py-20">{t("noResults")}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {paged.map((product) => {
                const name = locale === "ar" ? product.name_ar : product.name_en
                return (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => goToProduct(product)}
                    className="text-left rounded-2xl p-3 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={product.image || DEFAULT_IMAGE}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
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
                        {product.rating}/5
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
                        <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-40 hover:text-black"
            >
              <ChevronLeft size={16} /> {t("previous")}
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers().map((n, i) =>
                n === "dots" ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      page === n ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-40 hover:text-black"
            >
              {t("next")} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}