// Place this file at: app/[locale]/page.tsx

import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Start from "@/components/Start"
import Arrivals from "@/components/Arrivals"
import TopSale from "@/components/TopSale"
import Form from "@/components/form"
import Reviews from "@/components/Reviews"

const BRANDS = [
  { id: 1, src: "/images/versace.jpg", name: "Versace" },
  { id: 2, src: "/images/zara.jpg", name: "Zara" },
  { id: 3, src: "/images/gucci.jpg", name: "Gucci" },
  { id: 4, src: "/images/Prada-1.jpg", name: "Prada" },
  { id: 5, src: "/images/clievn_klien.jpg", name: "Calvin Klein" },
]

const LOCALES = ["en", "ar"] as const
const OG_LOCALE: Record<string, string> = { en: "en_US", ar: "ar_AR" }

type Props = { params: Promise<{ locale: string }> }

// Unique title, description, canonical, hreflang and social cards for each language
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomeMeta" })

  const title = t("title")
  const description = t("description")
  const ogImage = { url: "/images/og-image.jpg", width: 1200, height: 630, alt: title }

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: t("siteName"),
      title,
      description,
      locale: OG_LOCALE[locale] ?? "en_US",
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  }
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "HomeMeta" })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  // Structured data: helps Google show the site name and the brand's identity
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: t("siteName"),
        url: siteUrl,
        logo: `${siteUrl}/images/logo.png`,
        // sameAs: ["https://facebook.com/yourpage", "https://instagram.com/yourpage"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/${locale}`,
        name: t("siteName"),
        inLanguage: locale,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  }

  return (
    <>
      {/* "<" is escaped so the JSON can never close the script tag early */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Start must contain the page's single <h1> (the main keyword phrase) */}
      <Start />

      {/* The -mt-20 overlap only makes sense on lg+, where the hero has py-20 (80px) of bottom padding. */}
      <section
        id="brand"
        aria-labelledby="brands-heading"
        className="flex w-full flex-wrap items-center justify-evenly gap-x-6 gap-y-2 bg-black px-4 py-2 lg:-mt-20 lg:flex-nowrap"
      >
        <h2 id="brands-heading" className="sr-only">
          {t("brandsHeading")}
        </h2>
        {BRANDS.map((brand) => (
          <Image
            key={brand.id}
            src={brand.src}
            alt={`${brand.name} logo`}
            width={100}
            height={100}
            sizes="(min-width: 640px) 148px, 128px"
            className="h-auto w-full max-w-32 object-contain p-4 sm:max-w-37"
          />
        ))}
      </section>

      <div id="arrivals">
        <Arrivals />
      </div>

      {/* TopSale already renders <section id="onsale"> */}
      <TopSale />

      <Form />
      <Reviews />
    </>
  )
}