// app/Category/man/page.tsx
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Detials from "@/components/Detials"
import productsData from "@/data/products.json"
import data from "@/data/reviews.json"
import Like from "@/components/like"


type ProductColor = {
  name: string
  hex: string
  image?: string
}

type ProductData = {
  id: string
  category: string
  name_en: string
  name_ar: string
  rating?: number
  reviews?: number
  price: number
  oldPrice?: number
  discount?: number
  description_en?: string
  description_ar?: string
  image?: string
  colors?: ProductColor[]
}

type Review = {
  id: string
  rating: number
  name: { en: string; ar?: string }
  review: { en: string; ar?: string }
}

export default function ManPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const rawReviews = (data.reviews ?? []) as Array<{
    id: string | number
    rating: string | number
    name: { en: string; ar?: string }
    review: { en: string; ar?: string }
  }>
  const reviews: Review[] = rawReviews.map((review) => ({
    id: String(review.id),
    rating:
      typeof review.rating === "string"
        ? Number(review.rating)
        : review.rating,
    name: review.name,
    review: review.review,
  }))
  const [startIndex] = useState(0)
  const visibleCount = 8
  const visibleReviews = reviews.slice(startIndex, startIndex + visibleCount)

  // مفيش id (جاي من navbar) -> الحالة الثابتة الافتراضية
  if (!id) {
    return (
      <div>
        <Detials />
      </div>
    )
  }

  // فيه id (جاي من Arrivals) -> دور على المنتج ده وشوف هو men فعلاً
  const clicked = (productsData as ProductData[]).find((p) => p.id === id)

  if (!clicked || clicked.category !== "men") {
    return (
      <div>
        <Detials />
      </div>
    )
  }

  const colors = (
    clicked.colors ?? [{ name: "default", hex: "#999999", image: clicked.image }]
  ).map((color) => ({
    name: color.name,
    hex: color.hex,
    images: color.image ? [color.image] : [],
  }))

  const product = {
    id: clicked.id,
    name_en: clicked.name_en,
    name_ar: clicked.name_ar,
    breadcrumb: ["Home", "Shop", "Men", clicked.name_en],
    rating: clicked.rating ?? 0,
    reviews: clicked.reviews ?? 0,
    price: clicked.price,
    oldPrice: clicked.oldPrice ?? 0,
    discount: clicked.discount ?? 0,
    description_en: clicked.description_en ?? "",
    description_ar: clicked.description_ar ?? "",
    colors,
  }

  return (
    <>
    <div>
      <Detials product={product} />
      
    </div>
    <Like/>
    </>
  )
}
