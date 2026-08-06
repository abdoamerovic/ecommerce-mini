"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function Form() {
  const t = useTranslations("form")
  const locale = useLocale()

  const photos = [
    { id: 1, src: "/images/form/casul.png", alt: "casual", ratio: "1 / 1" },
    { id: 2, src: "/images/form/formal.png", alt: "formal", ratio: "2 / 1" },
    { id: 3, src: "/images/form/gym.png", alt: "gym", ratio: "2 / 1" },
    { id: 4, src: "/images/form/party.png", alt: "party", ratio: "1 / 1" },
  ]

  const areas = ["one", "two", "three", "four"]

  return (
    <div className="flex justify-center">
      <form className="w-280 h-auto md:h-196.5 bg-[#F0F0F0] p-8 rounded-2xl">
        <h1 className="text-[45px] font-bold text-black mb-8 text-center font-sans">
          {t("title")}
        </h1>

        <div
          className="flex flex-col gap-4 md:grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 298px)",
            gridTemplateAreas: `
              "one two two"
              "three three four"
            `,
          }}
        >
          {photos.map((imag, i) => (
            <div
              key={imag.id}
              style={{ gridArea: areas[i] }}
              className={`relative overflow-hidden rounded-lg ${imag.ratio} md:aspect-auto md:h-full`}
            >
              <Link
                href={`/${locale}/Product/${imag.alt.toLowerCase()}`}
                className="block relative w-full h-full"
              >
                <Image
                  src={imag.src}
                  alt={imag.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                />

                <div className="absolute top-0 left-0 p-4 md:p-6">
                  <p className="text-black text-lg md:text-xl font-semibold capitalize bg-white/70 px-3 py-1 rounded-md">
                    {t(imag.alt)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}