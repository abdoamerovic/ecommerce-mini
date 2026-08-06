// Place this file at: components/Reviews.tsx

"use client"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import data from "@/data/reviews.json"

export default function Reviews() {
  const t = useTranslations("Reviews")
  const rawLocale = useLocale()
  const locale = rawLocale === "ar" ? "ar" : "en"

  const reviews = data.reviews
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 4

  const swapToLeft = () => {
    setStartIndex((prev) =>
      prev === 0 ? reviews.length - visibleCount : prev - 1
    )
  }

  const swapToRight = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= reviews.length ? 0 : prev + 1
    )
  }

  const visibleReviews = Array.from({ length: visibleCount }, (_, i) =>
    reviews[(startIndex + i) % reviews.length]
  )

  return (
    <div className="w-full bg-white py-10 mt-0">
      <div className="flex justify-between items-center px-14 mb-6">
        <h1 className="font-extrabold text-3xl text-black">{t("title")}</h1>
        <div className="flex flex-row gap-4">
          <button
            onClick={swapToLeft}
            aria-label={t("prevAria")}
            className="font-extrabold text-lg text-black hover:text-gray-500"
          >
            {locale === "ar" ? "→" : "←"}
          </button>
          <button
            onClick={swapToRight}
            aria-label={t("nextAria")}
            className="font-extrabold text-lg text-black hover:text-gray-500"
          >
            {locale === "ar" ? "←" : "→"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap justify-evenly items-center gap-5">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="w-full max-w-60 h-40 p-4 border border-gray-200 rounded-2xl text-black"
          >
            <p className="text-yellow-400">{review.rating}</p>
            <p className="text-black font-bold mt-2">{review.name[locale]}</p>
            <p className="text-black font-mono text-[10px] mt-2 flex flex-row">
              {review.review[locale]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
