// Place this file at: components/Categorypadge.tsx

"use client"

import { useState, useMemo, type Dispatch, type SetStateAction } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react"
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
  // Optional fields: add them to products.json for the matching filters to work
  type?: string // "tshirts" | "shorts" | "shirts" | "hoodie" | "jeans"
  style?: string // "casual" | "formal" | "party" | "gym"
  sizes?: string[] // e.g. ["small", "medium"]
  createdAt?: string // ISO date, used by "newest" (falls back to the id number)
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

// Routes like /Category/man and /Category/woman use singular names, products use "men"/"women"
const CATEGORY_ALIASES: Record<string, string> = { man: "men", woman: "women" }

const ALL_PRODUCTS = productsData as Product[]

// The slider range comes from the real data (a hard-coded 50-200 range hid every product above $200)
const PRICES = ALL_PRODUCTS.map((p) => p.price)
const MIN_PRICE = PRICES.length ? Math.floor(Math.min(...PRICES)) : 0
const MAX_PRICE = PRICES.length ? Math.ceil(Math.max(...PRICES)) : 0

type SortOption = "popular" | "newest" | "priceLow" | "priceHigh" | "rating"

function idNumber(id: string) {
  const n = parseInt(id.replace(/\D/g, ""), 10)
  return Number.isNaN(n) ? 0 : n
}

function newestKey(p: Product) {
  return p.createdAt ? Date.parse(p.createdAt) : idNumber(p.id)
}

function getPageNumbers(current: number, total: number): (number | "dots")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const wanted = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)

  const result: (number | "dots")[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push("dots")
    result.push(n)
  })
  return result
}

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
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-semibold"
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

  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedDressStyle, setSelectedDressStyle] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const normalizedCategory = (() => {
    const c = category.toLowerCase()
    return CATEGORY_ALIASES[c] ?? c
  })()

  // Click again to clear; every filter change goes back to page 1
  function toggleFilter(setter: Dispatch<SetStateAction<string | null>>, value: string) {
    setter((current) => (current === value ? null : value))
    setPage(1)
  }

  const filtered = useMemo(() => {
    const list = ALL_PRODUCTS.filter((p) => {
      // The page's own category (men / women / or a dress style such as "casual") always applies.
      // Before, picking a dress style replaced it and matched nothing.
      const inCategory =
        p.category.toLowerCase() === normalizedCategory || p.style?.toLowerCase() === normalizedCategory
      if (!inCategory) return false

      if (p.price > maxPrice) return false
      if (selectedDressStyle && p.style?.toLowerCase() !== selectedDressStyle) return false
      if (selectedType && p.type?.toLowerCase() !== selectedType) return false
      if (selectedSize && !p.sizes?.includes(selectedSize)) return false
      if (selectedColor && !p.colors?.some((c) => c.hex.toLowerCase() === selectedColor.toLowerCase())) {
        return false
      }
      return true
    })

    switch (sortBy) {
      case "priceLow":
        return list.sort((a, b) => a.price - b.price)
      case "priceHigh":
        return list.sort((a, b) => b.price - a.price)
      case "rating":
        return list.sort((a, b) => b.rating - a.rating)
      case "newest":
        return list.sort((a, b) => newestKey(b) - newestKey(a))
      case "popular":
      default:
        return list.sort((a, b) => b.reviews - a.reviews)
    }
  }, [normalizedCategory, maxPrice, selectedDressStyle, selectedType, selectedSize, selectedColor, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function goToProduct(product: Product) {
    router.push(`/${locale}/Product/${product.category.toLowerCase()}?id=${encodeURIComponent(product.id)}`)
  }

  const categoryLabel = t.has(`dressStyles.${category}`)
    ? t(`dressStyles.${category}` as never)
    : category

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/${locale}`} className="hover:text-black">
          {tBread("home")}
        </Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <span className="capitalize text-black">{categoryLabel}</span>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Sidebar: collapsible on mobile, always visible on desktop */}
        <div className="w-full shrink-0 lg:w-64">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((o) => !o)}
            aria-expanded={mobileFiltersOpen}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-2.5 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal size={16} />
            {t("filters")}
          </button>

          <aside className={`${mobileFiltersOpen ? "mt-4 block" : "hidden"} lg:sticky lg:top-6 lg:mt-0 lg:block`}>
            <div className="rounded-2xl border border-gray-200 p-4">
              <FilterSection title={t("filters")} defaultOpen={false}>
                <ul className="flex flex-col gap-3 text-sm text-gray-600">
                  {CLOTHING_TYPES.map((type) => (
                    <li key={type}>
                      <button
                        type="button"
                        aria-pressed={selectedType === type}
                        onClick={() => toggleFilter(setSelectedType, type)}
                        className={`flex w-full items-center justify-between hover:text-black ${
                          selectedType === type ? "font-medium text-black" : ""
                        }`}
                      >
                        {t(`types.${type}`)}
                        <ChevronRight size={14} className="rtl:rotate-180" />
                      </button>
                    </li>
                  ))}
                </ul>
              </FilterSection>

              <FilterSection title={t("price")}>
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={1}
                  value={maxPrice}
                  aria-label={t("price")}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value))
                    setPage(1)
                  }}
                  className="w-full accent-black"
                />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>${MIN_PRICE}</span>
                  <span>${maxPrice}</span>
                </div>
              </FilterSection>

              <FilterSection title={t("colors")}>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      aria-label={hex}
                      aria-pressed={selectedColor === hex}
                      onClick={() => toggleFilter(setSelectedColor, hex)}
                      className={`h-7 w-7 rounded-full border transition-transform ${
                        selectedColor === hex ? "scale-105 ring-2 ring-black ring-offset-2" : "border-gray-200"
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
                      aria-pressed={selectedSize === size}
                      onClick={() => toggleFilter(setSelectedSize, size)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
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
                        aria-pressed={selectedDressStyle === style}
                        onClick={() => toggleFilter(setSelectedDressStyle, style)}
                        className={`flex w-full items-center justify-between hover:text-black ${
                          selectedDressStyle === style ? "font-medium text-black" : ""
                        }`}
                      >
                        {t(`dressStyles.${style}`)}
                        <ChevronRight size={14} className="rtl:rotate-180" />
                      </button>
                    </li>
                  ))}
                </ul>
              </FilterSection>

              {/* Filters apply instantly; on mobile this button just closes the panel */}
              <button
                type="button"
                onClick={() => {
                  setPage(1)
                  setMobileFiltersOpen(false)
                }}
                className="mt-4 w-full rounded-full bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800"
              >
                {t("applyFilter")}
              </button>
            </div>
          </aside>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold capitalize">{categoryLabel}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
              <span>
                {t("showing", {
                  from: filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1,
                  to: Math.min(currentPage * PAGE_SIZE, filtered.length),
                  total: filtered.length,
                })}
              </span>
              <label className="flex items-center gap-2">
                {t("sortBy")}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption)
                    setPage(1)
                  }}
                  className="bg-transparent font-medium text-black outline-none"
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
            <p className="py-20 text-center text-gray-500">{t("noResults")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
              {paged.map((product) => {
                const name = locale === "ar" ? product.name_ar : product.name_en
                return (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => goToProduct(product)}
                    className="w-full rounded-2xl p-2 text-start transition-shadow duration-200 hover:shadow-lg sm:p-3"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={product.image || DEFAULT_IMAGE}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
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
                      <span className="ms-1 text-xs text-gray-500">{product.rating}/5</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-bold">${product.price}</span>
                      {product.oldPrice ? (
                        <span className="text-sm text-gray-400 line-through">${product.oldPrice}</span>
                      ) : null}
                      {product.discount > 0 && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-500">
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
          <div className="mt-10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-black disabled:opacity-40"
            >
              <ChevronLeft size={16} className="rtl:rotate-180" /> {t("previous")}
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              {getPageNumbers(currentPage, totalPages).map((n, i) =>
                n === "dots" ? (
                  <span key={`dots-${i}`} className="px-1 text-gray-400 sm:px-2">
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setPage(n)}
                    aria-current={currentPage === n ? "page" : undefined}
                    className={`h-8 w-8 rounded-lg text-sm font-medium ${
                      currentPage === n ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-black disabled:opacity-40"
            >
              {t("next")} <ChevronRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
