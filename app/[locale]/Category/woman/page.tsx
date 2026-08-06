// app/Category/woman/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import Detials from "@/components/Detials"
import productsData from "@/data/products.json"
import Reviews from "@/components/Reviews"

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

export default function WomanPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  // مفيش id (جاي من navbar) -> الحالة الثابتة الافتراضية
  if (!id) {
    return (
      <div>
        <Detials />
      </div>
    )
  }

  // فيه id (جاي من Arrivals) -> دور على المنتج ده وشوف هو women فعلاً
  const clicked = (productsData as ProductData[]).find((p) => p.id === id)

  if (!clicked || clicked.category !== "women") {
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
    breadcrumb: ["Home", "Shop", "Women", clicked.name_en],
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
    <div>
      <Detials product={product} />
      <div  className=" flex flex-row flex-wrap">
      
      </div>
      <Reviews />
    </div>
  )
}

