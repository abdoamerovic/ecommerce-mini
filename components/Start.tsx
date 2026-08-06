// Place this file at: components/Start.tsx

"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"


export default function Start() {
  const t = useTranslations("Hero")
  const internationalBrands = 200
  const highQualityProducts = 2000
  const happyCustomers = 30000
 const goto = () => {
  document.querySelector("#cards")?.scrollIntoView({
    behavior: "smooth",
  })
}

  return (
    <section className="bg-[#f2f0f1]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 min-h-175 flex flex-col lg:flex-row items-center justify-between gap-8 py-14 lg:py-20">

        <div className="flex-1 -mt-8">
          <h1 className="text-5xl md:text-6xl lg:text-6xl font-black leading-tight">
            {t("title")}
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-8 max-w-lg">
            {t("description")}
          </p>

          <button onClick={goto} className="mt-8 bg-black text-white px-10 py-4 rounded-full font-medium hover:bg-gray-800 transition duration-300">
            {t("shopNow")}
          </button>

          <div className="flex flex-wrap gap-8 mt-12">
            <div>
              <h2 className="text-3xl font-bold">{internationalBrands.toLocaleString()}+</h2>
              <p className="text-gray-600 text-sm mt-1">{t("internationalBrands")}</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300"></div>

            <div>
              <h2 className="text-3xl font-bold">{highQualityProducts.toLocaleString()}+</h2>
              <p className="text-gray-600 text-sm mt-1">{t("highQualityProducts")}</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300"></div>

            <div>
              <h2 className="text-3xl font-bold">{happyCustomers.toLocaleString()}+</h2>
              <p className="text-gray-600 text-sm mt-1">{t("happyCustomers")}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center relative md:py-0 py-6">
          <Image
            src="/images/fashion.jpg"
            alt="Fashion Model"
            width={650}
            height={700}
            priority
            className="w-full max-w-md lg:max-w-xl h-auto object-cover"
          />
          <Image
  src="/images/star.jpg"
  alt=""
  width={44}
  height={44}
  className="absolute top-60 -translate-y-1/2 left-4 mix-blend-multiply w-11 h-11"
/>
<Image
  src="/images/star.jpg"
  alt=""
  width={80}
  height={80}
  className="absolute top-30 -translate-y-1/2 right-4 mix-blend-multiply w-20 h-20"
/>
        </div>
      </div>
    </section>
  )
}
