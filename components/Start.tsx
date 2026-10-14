// Place this file at: components/Start.tsx

"use client"

import { Fragment } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"

export default function Start() {
  const t = useTranslations("Hero")
  const locale = useLocale()

  // toLocaleString() with no locale formats differently on the server and in the browser
  // (e.g. "30,000" vs "٣٠٬٠٠٠"), which caused hydration warnings. Pass the page locale explicitly.
  const formatNumber = new Intl.NumberFormat(locale)

  const stats = [
    { value: 200, label: t("internationalBrands") },
    { value: 2000, label: t("highQualityProducts") },
    { value: 30000, label: t("happyCustomers") },
  ]

  const handleShopNow = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.querySelector("#cards")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <section className="bg-[#f2f0f1]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 py-10 sm:px-6 lg:min-h-175 lg:flex-row lg:px-8 lg:py-20">
        <div className="flex-1 lg:-mt-8">
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            {t("description")}
          </p>

          <button
            type="button"
            onClick={handleShopNow}
            className="mt-8 w-full rounded-full bg-black px-10 py-4 font-medium text-white transition duration-300 hover:bg-gray-800 sm:w-auto"
          >
            {t("shopNow")}
          </button>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6 lg:mt-12">
            {stats.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 && <div className="hidden w-px bg-gray-300 md:block" />}
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">{formatNumber.format(stat.value)}+</h2>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 justify-center py-6 md:py-0">
          <Image
            src="/images/fashion.jpg"
            alt="Fashion Model"
            width={650}
            height={700}
            sizes="(max-width: 1024px) 90vw, 576px"
            priority
            className="h-auto w-full max-w-md object-cover lg:max-w-xl"
          />
          {/* Decorative stars: positioned in % of the image box instead of fixed px, sized per breakpoint */}
          <Image
            src="/images/star.jpg"
            alt=""
            width={44}
            height={44}
            className="pointer-events-none absolute inset-s-3 top-[60%] h-8 w-8 -translate-y-1/2 mix-blend-multiply sm:h-11 sm:w-11"
          />
          <Image
            src="/images/star.jpg"
            alt=""
            width={80}
            height={80}
            className="pointer-events-none absolute inset-e-4 top-[15%] h-14 w-14 -translate-y-1/2 mix-blend-multiply sm:h-20 sm:w-20"
          />
        </div>
      </div>
    </section>
  )
}
