// Place this file at: components/Detials.tsx

"use client"

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import {
  Star,
  Minus,
  Plus,
  Check,
  SlidersHorizontal,
  MoreHorizontal,
  BadgeCheck,
  ChevronRight,
} from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import reviewsData from "@/data/reviews.json"
import { useCartStore } from "@/lib/store/cartStore"

type ColorVariant = {
  name: string
  hex: string
  images: string[]
}

type Product = {
  id: string
  name_en: string
  name_ar: string
  breadcrumb: string[]
  rating: number
  reviews: number
  price: number
  oldPrice?: number | null
  discount?: number | null
  description_en: string
  description_ar: string
  colors: ColorVariant[]
}

type UserReview = {
  id: string
  text: string
  productId?: string
}

type ReviewSort = "latest" | "oldest" | "highest"

const mockProduct: Product = {
  id: "p21",
  name_en: "ONE LIFE GRAPHIC T-SHIRT",
  name_ar: "تيشيرت رجل",
  breadcrumb: ["Home", "Shop", "Men", "T-shirts"],
  rating: 4.9,
  reviews: 67,
  price: 320,
  oldPrice: 380,
  discount: 15,
  description_en:
    "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
  description_ar: "تيشيرت رجل مريح، خامة قطنية ناعمة ومناسبة لكل المناسبات.",
  colors: [
    {
      name: "darkblue",
      hex: "#1B2A4A",
      images: [
        "/images/mock/image_1.png",
        "/images/mock/image_2.png",
        "/images/mock/image_3.png",
      ],
    },
    {
      name: "darkgreen",
      hex: "#1A5D1A",
      images: ["/images/mock/teshirt_dblue.jpg"],
    },
  ],
}

const DEFAULT_IMAGE = "/images/default-product.jpg"
const SIZE_KEYS = ["small", "medium", "large", "xLarge"] as const
const INITIAL_REVIEWS_COUNT = 6
const REVIEWS_STEP = 6
const REVIEWS_KEY = "reviews"

/* ---- localStorage reviews, exposed as an external store (hydration-safe) ---- */

const reviewListeners = new Set<() => void>()

function subscribeToReviews(callback: () => void) {
  reviewListeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    reviewListeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

function getStoredReviewsSnapshot() {
  try {
    return localStorage.getItem(REVIEWS_KEY) ?? ""
  } catch {
    return ""
  }
}

function parseReviews(raw: string): UserReview[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function Detials({ product = mockProduct }: { product?: Product }) {
  const t = useTranslations("ProductDetails")
  const rawLocale = useLocale()
  const locale = rawLocale === "ar" ? "ar" : "en"

  const addItem = useCartStore((state) => state.addItem)

  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [mainImage, setMainImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<(typeof SIZE_KEYS)[number]>("large")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"productDetails" | "ratingReviews" | "faqs">("ratingReviews")
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(INITIAL_REVIEWS_COUNT)
  const [reviewSort, setReviewSort] = useState<ReviewSort>("latest")
  const [justAdded, setJustAdded] = useState(false)

  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
    }
  }, [])

  // Reviews the visitor wrote were saved to localStorage but never shown. Now they are.
  const storedReviewsRaw = useSyncExternalStore(subscribeToReviews, getStoredReviewsSnapshot, () => "")
  const userReviews = useMemo(
    () => parseReviews(storedReviewsRaw).filter((r) => r.productId === product.id),
    [storedReviewsRaw, product.id]
  )

  // Guard against products with no colors / no images (used to crash)
  const currentColor: ColorVariant | undefined = product.colors[selectedColorIndex] ?? product.colors[0]
  const currentImages = currentColor?.images ?? []
  const mainSrc = currentImages[mainImage] ?? currentImages[0] ?? DEFAULT_IMAGE

  const name = locale === "ar" ? product.name_ar : product.name_en
  const description = locale === "ar" ? product.description_ar : product.description_en

  // The sort <select> did nothing before. Bundled reviews are assumed to be ordered newest-first.
  const sortedReviews = useMemo(() => {
    const list = [...reviewsData.reviews]
    if (reviewSort === "oldest") return list.reverse()
    if (reviewSort === "highest") return list.sort((a, b) => b.rating.length - a.rating.length)
    return list
  }, [reviewSort])

  const visibleReviews = sortedReviews.slice(0, visibleReviewsCount)
  const hasMoreReviews = visibleReviewsCount < sortedReviews.length

  function handleLoadMoreReviews() {
    // Before: jumped to a fixed 10, so the button stayed visible and did nothing with 10+ reviews
    setVisibleReviewsCount((count) => count + REVIEWS_STEP)
  }

  function handleColorSelect(index: number) {
    setSelectedColorIndex(index)
    setMainImage(0)
  }

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name,
      size: selectedSize,
      color: currentColor?.name ?? "",
      price: product.price,
      image: mainSrc,
      quantity,
    })
    setJustAdded(true)
    if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
    addedTimeoutRef.current = setTimeout(() => setJustAdded(false), 2000)
  }

  const writeReview = () => {
    const text = window.prompt(t("writeReviewPrompt"))?.trim()
    if (!text) return

    try {
      const reviews = parseReviews(getStoredReviewsSnapshot())
      reviews.push({ id: Date.now().toString(), text, productId: product.id })
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
      reviewListeners.forEach((listener) => listener())
      window.alert(t("reviewThanks"))
    } catch (error) {
      console.error("Error saving review:", error)
      window.alert(t("reviewError"))
    }
  }

  const tabs: { key: "productDetails" | "ratingReviews" | "faqs" }[] = [
    { key: "productDetails" },
    { key: "ratingReviews" },
    { key: "faqs" },
  ]

  const totalReviews = sortedReviews.length + userReviews.length

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav aria-label="breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {product.breadcrumb.map((crumb, i) => (
          <span key={`${crumb}-${i}`} className="flex items-center gap-2">
            {crumb}
            {i < product.breadcrumb.length - 1 && <ChevronRight size={14} className="rtl:rotate-180" />}
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        {/* Gallery: thumbnails sit under the image on mobile and beside it on desktop */}
        <div className="flex min-w-0 flex-col-reverse gap-4 md:flex-row">
          {currentImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:gap-4 md:overflow-visible md:pb-0">
              {currentImages.map((img, i) => (
                <button
                  type="button"
                  key={img}
                  onClick={() => setMainImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-100 transition-colors md:h-24 md:w-24 ${
                    mainImage === i ? "border-black" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${name} - ${currentColor?.name ?? ""} - ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="relative aspect-square w-full min-w-0 overflow-hidden rounded-2xl bg-gray-100 md:flex-1">
            <Image
              src={mainSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="wrap-break-word text-2xl font-extrabold uppercase underline decoration-blue-500 decoration-4 underline-offset-8 sm:text-3xl md:text-4xl">
            {name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ms-1 text-sm text-gray-500">
              {product.rating}/5 ({product.reviews})
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">${product.price}</span>
            {/* `value && <span/>` rendered a stray "0" when the value was 0 */}
            {product.oldPrice ? (
              <span className="text-xl text-gray-400 line-through">${product.oldPrice}</span>
            ) : null}
            {product.discount ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-500">
                -{product.discount}%
              </span>
            ) : null}
          </div>

          <p className="mt-4 leading-relaxed text-gray-500">{description}</p>

          {product.colors.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />

              <div>
                <p className="mb-3 text-sm text-gray-500">{t("selectColors")}</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      type="button"
                      key={color.name}
                      onClick={() => handleColorSelect(i)}
                      aria-label={color.name}
                      aria-pressed={selectedColorIndex === i}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColorIndex === i && (
                        <Check size={16} className={color.name === "white" ? "text-black" : "text-white"} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <hr className="my-6 border-gray-200" />

          <div>
            <p className="mb-3 text-sm text-gray-500">{t("chooseSize")}</p>
            <div className="flex flex-wrap gap-3">
              {SIZE_KEYS.map((sizeKey) => (
                <button
                  type="button"
                  key={sizeKey}
                  onClick={() => setSelectedSize(sizeKey)}
                  aria-pressed={selectedSize === sizeKey}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    selectedSize === sizeKey
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(`sizes.${sizeKey}`)}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex shrink-0 items-center gap-4 rounded-full bg-gray-100 px-4 py-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={t("decreaseQuantity")}
              >
                <Minus size={16} />
              </button>
              <span className="w-4 text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label={t("increaseQuantity")}>
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="min-w-0 flex-1 rounded-full bg-black py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              {justAdded ? t("addedToCart") : t("addToCart")}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs scroll sideways on narrow screens instead of overflowing the page */}
      <div className="mt-12 flex justify-start gap-6 overflow-x-auto border-b border-gray-200 sm:justify-center md:gap-10">
        {tabs.map(({ key }) => (
          <button
            type="button"
            key={key}
            onClick={() => setActiveTab(key)}
            className={`shrink-0 whitespace-nowrap pb-4 text-sm font-medium transition-colors md:text-base ${
              activeTab === key ? "border-b-2 border-black text-black" : "text-gray-400"
            }`}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </div>

      <div className="py-8 text-gray-600">
        {activeTab === "productDetails" && <p>{description}</p>}

        {activeTab === "ratingReviews" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                {totalReviews} {t("allReviews")}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {/* Decorative for now: no filter logic is wired to this button */}
                <button
                  type="button"
                  aria-label={t("filterReviews")}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                >
                  <SlidersHorizontal size={18} className="text-black" />
                </button>

                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value as ReviewSort)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none"
                >
                  <option value="latest">{t("sortLatest")}</option>
                  <option value="oldest">{t("sortOldest")}</option>
                  <option value="highest">{t("sortHighestRating")}</option>
                </select>

                <button
                  type="button"
                  className="rounded-full bg-black px-5 py-2 font-semibold text-white transition-colors hover:bg-gray-800"
                  onClick={writeReview}
                >
                  {t("writeReview")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {userReviews.map((review) => (
                <div key={`user-${review.id}`} className="relative rounded-xl border border-gray-200 p-5">
                  <p className="text-sm leading-relaxed text-gray-600">&quot;{review.text}&quot;</p>
                </div>
              ))}

              {visibleReviews.map((review) => {
                const starCount = review.rating.length
                const reviewerName = locale === "ar" ? review.name.ar : review.name.en
                const reviewText = locale === "ar" ? review.review.ar : review.review.en

                return (
                  <div key={review.id} className="relative rounded-xl border border-gray-200 p-5">
                    <button
                      type="button"
                      aria-label={t("moreOptions")}
                      className="absolute inset-e-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    <div className="mb-2 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < starCount ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>

                    <div className="mb-2 flex items-center gap-1.5 pe-8">
                      <span className="font-semibold text-black">{reviewerName}</span>
                      <BadgeCheck size={16} className="shrink-0 fill-green-500 text-green-500" />
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600">&quot;{reviewText}&quot;</p>
                  </div>
                )
              })}
            </div>

            {hasMoreReviews && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleLoadMoreReviews}
                  className="rounded-full border border-gray-300 px-8 py-3 font-medium transition-colors hover:bg-black hover:text-white"
                >
                  {t("loadMoreReviews")}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "faqs" && <p>{t("noFaqs")}</p>}
      </div>
    </div>
  )
}
