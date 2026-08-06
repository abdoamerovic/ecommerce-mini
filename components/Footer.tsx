// Place this file at: components/Footer.tsx

"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function Footer() {
  const t = useTranslations("Footer")
  const locale = useLocale()

  const brands = [
    { id: 1, src: "/images/facebook.png", alt: "facebook" },
    { id: 2, src: "/images/github.png", alt: "github" },
    { id: 3, src: "/images/instagram.png", alt: "instagram" },
    { id: 4, src: "/images/twitter.png", alt: "twitter" },
  ]

  const paymentIcons = [
    { src: "/images/visa.png", alt: "Visa" },
    { src: "/images/card.png", alt: "Mastercard" },
    { src: "/images/paypal.png", alt: "PayPal" },
    { src: "/images/apple_pay.png", alt: "Apple Pay" },
    { src: "/images/googlepay.png", alt: "Google Pay" },
  ]

  return (
    <div className="w-full bg-[#f0f0f0] px-6 py-20">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">

        <section className="max-w-xs">
          <h1 className="font-bold text-xl">{t("logo")}</h1>
          <p className="text-gray-600 mt-3">{t("tagline")}</p>
          <div className="flex gap-3 mt-4">
            {brands.map((brand) => (
              <Image key={brand.id} src={brand.src} alt={brand.alt} width={24} height={24} />
            ))}
          </div>
        </section>

        <section>
          <h1 className="font-semibold mb-3">{t("company.title")}</h1>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/about`}>{t("company.about")}</Link></li>
            <li><Link href={`/${locale}/features`}>{t("company.feature")}</Link></li>
            <li><Link href={`/${locale}/works`}>{t("company.works")}</Link></li>
            <li><Link href={`/${locale}/career`}>{t("company.career")}</Link></li>
          </ul>
        </section>

        <section>
          <h1 className="font-semibold mb-3">{t("help.title")}</h1>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/support`}>{t("help.customerSupport")}</Link></li>
            <li><Link href={`/${locale}/delivery`}>{t("help.deliveryDetails")}</Link></li>
            <li><Link href={`/${locale}/terms`}>{t("help.termsConditions")}</Link></li>
            <li><Link href={`/${locale}/privacy`}>{t("help.privacyPolicy")}</Link></li>
          </ul>
        </section>

        <section>
          <h1 className="font-semibold mb-3">{t("faq.title")}</h1>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/account`}>{t("faq.account")}</Link></li>
            <li><Link href={`/${locale}/deliveries`}>{t("faq.manageDeliveries")}</Link></li>
            <li><Link href={`/${locale}/orders`}>{t("faq.orders")}</Link></li>
            <li><Link href={`/${locale}/payments`}>{t("faq.payments")}</Link></li>
          </ul>
        </section>

        <section>
          <h1 className="font-semibold mb-3">{t("resources.title")}</h1>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/ebooks`}>{t("resources.freeEbooks")}</Link></li>
            <li><Link href={`/${locale}/tutorials`}>{t("resources.devTutorial")}</Link></li>
            <li><Link href={`/${locale}/blog`}>{t("resources.blog")}</Link></li>
            <li><Link href={`/${locale}/youtube`}>{t("resources.youtube")}</Link></li>
          </ul>
        </section>

      </div>

      <hr className="max-w-7xl mx-auto my-6" />

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm text-gray-500">{t("copyright")}</p>
        <div className="flex gap-2">
          {paymentIcons.map((icon) => (
            <Image key={icon.alt} src={icon.src} alt={icon.alt} width={44} height={30} className="h-6 w-auto" />
          ))}
        </div>
      </div>
    </div>
  )
}
