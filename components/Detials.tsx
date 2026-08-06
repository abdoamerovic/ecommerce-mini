"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Minus, Plus, Check, SlidersHorizontal, MoreHorizontal, BadgeCheck } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import reviewsData from "@/data/reviews.json"

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
  oldPrice?: number
  discount?: number
  description_en: string
  description_ar: string
  colors: ColorVariant[]
}

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

const SIZE_KEYS = ["small", "medium", "large", "xLarge"] as const
const INITIAL_REVIEWS_COUNT = 6
const EXPANDED_REVIEWS_COUNT = 10

const addToCart = (item: {
  productId: string
  name: string
  size: string
  color: string
  price: number
  image: string
  quantity: number
}) => {
  if (typeof window === "undefined") return
  try {
    const existingCart = localStorage.getItem("cart")
    const cartItems = existingCart ? JSON.parse(existingCart) : []
    cartItems.push(item)
    localStorage.setItem("cart", JSON.stringify(cartItems))
  } catch (error) {
    console.error("Error saving cart item:", error)
  }
}

export default function Detials({ product = mockProduct }: { product?: Product }) {
  const t = useTranslations("ProductDetails")
  const rawLocale = useLocale()
  const locale = rawLocale === "ar" ? "ar" : "en"

  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [mainImage, setMainImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<(typeof SIZE_KEYS)[number]>("large")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"productDetails" | "ratingReviews" | "faqs">("ratingReviews")
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(INITIAL_REVIEWS_COUNT)
  const [justAdded, setJustAdded] = useState(false)

  const currentColor = product.colors[selectedColorIndex]
  const currentImages = currentColor.images

  const name = locale === "ar" ? product.name_ar : product.name_en
  const description = locale === "ar" ? product.description_ar : product.description_en

  const allReviews = reviewsData.reviews
  const visibleReviews = allReviews.slice(0, visibleReviewsCount)
  const hasMoreReviews = visibleReviewsCount < allReviews.length

  function handleLoadMoreReviews() {
    setVisibleReviewsCount(EXPANDED_REVIEWS_COUNT)
  }

  function handleColorSelect(index: number) {
    setSelectedColorIndex(index)
    setMainImage(0)
  }

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      name,
      size: selectedSize,
      color: currentColor.name,
      price: product.price,
      image: currentImages[mainImage] || currentImages[0],
      quantity,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const writeReview = () => {
    const userreview = prompt(t("writeReviewPrompt"))
    if (userreview && userreview.trim() !== "") {
      const newreview = {
        id: Date.now().toString(),
        text: userreview,
      }
      try {
        const existingReviews = localStorage.getItem("reviews")
        const reviews = existingReviews ? JSON.parse(existingReviews) : []
        reviews.push(newreview)
        localStorage.setItem("reviews", JSON.stringify(reviews))
        alert(t("reviewThanks"))
      } catch (error) {
        console.error("Error saving review:", error)
        alert(t("reviewError"))
      }
    }
  }

  const tabs: { key: "productDetails" | "ratingReviews" | "faqs" }[] = [
    { key: "productDetails" },
    { key: "ratingReviews" },
    { key: "faqs" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        {product.breadcrumb.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-2">
            {crumb}
            {i < product.breadcrumb.length - 1 && <span>›</span>}
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            {currentImages.map((img, i) => (
              <button
                key={img}
                onClick={() => setMainImage(i)}
                className={`relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border-2 transition-colors ${
                  mainImage === i ? "border-black" : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} - ${currentColor.name} - ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={currentImages[mainImage]}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase underline decoration-4 underline-offset-8 decoration-blue-500">
            {name}
          </h1>

          <div className="flex items-center gap-1 mt-4">
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
            <span className="text-sm text-gray-500 ml-1">
              {product.rating}/5 ({product.reviews})
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.oldPrice && (
              <span className="text-xl text-gray-400 line-through">${product.oldPrice}</span>
            )}
            {product.discount && (
              <span className="bg-red-100 text-red-500 text-sm font-medium px-3 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          <p className="text-gray-500 mt-4 leading-relaxed">{description}</p>

          <hr className="my-6 border-gray-200" />

          <div>
            <p className="text-sm text-gray-500 mb-3">{t("selectColors")}</p>
            <div className="flex gap-3">
              {product.colors.map((color, i) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(i)}
                  aria-label={color.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColorIndex === i && (
                    <Check size={16} className={color.name === "white" ? "text-black" : "text-white"} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div>
            <p className="text-sm text-gray-500 mb-3">{t("chooseSize")}</p>
            <div className="flex gap-3 flex-wrap">
              {SIZE_KEYS.map((sizeKey) => (
                <button
                  key={sizeKey}
                  onClick={() => setSelectedSize(sizeKey)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label={t("decreaseQuantity")}>
                <Minus size={16} />
              </button>
              <span className="w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} aria-label={t("increaseQuantity")}>
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white font-semibold rounded-full py-3 hover:bg-gray-800 transition-colors"
            >
              {justAdded ? t("addedToCart") : t("addToCart")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-10 border-b border-gray-200 mt-12">
        {tabs.map(({ key }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-4 text-sm md:text-base font-medium transition-colors ${
              activeTab === key ? "text-black border-b-2 border-black" : "text-gray-400"
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
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                {allReviews.length} {t("allReviews")}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={t("filterReviews")}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <SlidersHorizontal size={18} className="text-black" />
                </button>

                <select className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none bg-white">
                  <option value="1">{t("sortLatest")}</option>
                  <option value="2">{t("sortOldest")}</option>
                  <option value="3">{t("sortHighestRating")}</option>
                </select>

                <button
                  className="bg-black text-white font-semibold rounded-full py-2 px-5 hover:bg-gray-800 transition-colors"
                  onClick={writeReview}
                >
                  {t("writeReview")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleReviews.map((review) => {
                const starCount = review.rating.length
                const reviewerName = locale === "ar" ? review.name.ar : review.name.en
                const reviewText = locale === "ar" ? review.review.ar : review.review.en

                return (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-5 relative">
                    <button
                      aria-label={t("moreOptions")}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < starCount ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-semibold text-black">{reviewerName}</span>
                      <BadgeCheck size={16} className="text-green-500 fill-green-500" />
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">&quot;{reviewText}&quot;</p>
                  </div>
                )
              })}
            </div>

            {hasMoreReviews && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMoreReviews}
                  className="border border-gray-300 rounded-full px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors"
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