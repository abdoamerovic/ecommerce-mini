

"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

// Full class names are written out so Tailwind can see them. The old `ratio: "1 / 1"`
// was dropped into className as-is, which is not a valid class and did nothing.
const PHOTOS = [
  { id: 1, src: "/images/form/casul.png", alt: "casual", ratio: "aspect-square", span: "md:col-span-1" },
  { id: 2, src: "/images/form/formal.png", alt: "formal", ratio: "aspect-[2/1]", span: "md:col-span-2" },
  { id: 3, src: "/images/form/gym.png", alt: "gym", ratio: "aspect-[2/1]", span: "md:col-span-2" },
  { id: 4, src: "/images/form/party.png", alt: "party", ratio: "aspect-square", span: "md:col-span-1" },
] as const

export default function Form() {
  const t = useTranslations("form")
  const locale = useLocale()

  // It was a <form> with no inputs and fixed w-280 (1120px) that overflowed every screen below ~1150px
  return (
    <section className="px-4 sm:px-6">
      <div className="mx-auto w-full max-w-280 rounded-2xl bg-[#F0F0F0] p-5 sm:p-8">
        <h2 className="mb-6 text-center font-sans text-3xl font-bold text-black sm:mb-8 sm:text-4xl md:text-[45px]">
          {t("title")}
        </h2>

        {/* 1 column on mobile; on md+ a 3-column grid: [1][2 2] / [3 3][4] */}
        <div className="grid grid-cols-1 gap-4 md:auto-rows-55 md:grid-cols-3 lg:auto-rows-74.5">
          {PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-lg ${photo.ratio} ${photo.span} md:aspect-auto md:h-full`}
            >
              {/* These pointed at /Product/<style> (a product page without an id). The category page handles dress styles. */}
              <Link href={`/${locale}/Category/${photo.alt}`} className="relative block h-full w-full">
                <Image
                  src={photo.src}
                  alt={t(photo.alt)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />

                <div className="absolute inset-s-0 top-0 p-3 md:p-6">
                  <p className="rounded-md bg-white/70 px-3 py-1 text-base font-semibold capitalize text-black md:text-xl">
                    {t(photo.alt)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
