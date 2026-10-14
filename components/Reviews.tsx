// Place this file at: components/Reviews.tsx

"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import data from "@/data/reviews.json"

const VISIBLE_COUNT = 4

export default function Reviews() {
  const t = useTranslations("Reviews")
  const rawLocale = useLocale()
  const locale = rawLocale === "ar" ? "ar" : "en"

  const reviews = data.reviews
  const [startIndex, setStartIndex] = useState(0)

  if (reviews.length === 0) return null

  // With fewer reviews than slots the old code produced a negative index and crashed
  const count = Math.min(VISIBLE_COUNT, reviews.length)
  const canSlide = reviews.length > VISIBLE_COUNT

  // Circular: previous/next always move by one and wrap around
  const showPrevious = () => setStartIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  const showNext = () => setStartIndex((prev) => (prev + 1) % reviews.length)

  const visibleReviews = Array.from({ length: count }, (_, i) => reviews[(startIndex + i) % reviews.length])

  return (
    <section className="mt-0 w-full bg-white py-10">
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-14">
        <h2 className="text-2xl font-extrabold text-black sm:text-3xl">{t("title")}</h2>

        {canSlide && (
          <div className="flex shrink-0 flex-row gap-2">
            {/* Icons flip automatically in RTL, no more hand-picked ← → per locale */}
            <button
              type="button"
              onClick={showPrevious}
              aria-label={t("prevAria")}
              className="rounded-full p-2 text-black hover:bg-gray-100 hover:text-gray-500"
            >
              <ArrowLeft size={22} className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={t("nextAria")}
              className="rounded-full p-2 text-black hover:bg-gray-100 hover:text-gray-500"
            >
              <ArrowRight size={22} className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>

      <div
        aria-live="polite"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-14"
      >
        {visibleReviews.map((review) => (
          <div key={review.id} className="min-h-40 rounded-2xl border border-gray-200 p-4 text-black">
            <p className="text-yellow-400">{review.rating}</p>
            <p className="mt-2 font-bold">{review.name[locale]}</p>
            <p className="mt-2 font-mono text-xs leading-relaxed">{review.review[locale]}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
