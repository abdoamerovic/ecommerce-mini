// Place this file at: components/Footer.tsx

"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { useLocalFlag } from "@/lib/uselocalflag"

export default function Footer() {
  const t = useTranslations("Footer")
  const locale = useLocale()

  // Same flag as Boxblack, so the footer only reserves room for the overlap while the box is visible
  const subscribed = useLocalFlag("newsletterSubscribed", true)

  // Replace the "#" hrefs with your real profile URLs
  const brands = [
    { id: 1, src: "/images/facebook.png", alt: "Facebook", href: "#" },
    { id: 2, src: "/images/github.png", alt: "GitHub", href: "#" },
    { id: 3, src: "/images/instagram.png", alt: "Instagram", href: "#" },
    { id: 4, src: "/images/twitter.png", alt: "Twitter", href: "#" },
  ]

  const paymentIcons = [
    { src: "/images/visa.png", alt: "Visa" },
    { src: "/images/card.png", alt: "Mastercard" },
    { src: "/images/paypal.png", alt: "PayPal" },
    { src: "/images/apple_pay.png", alt: "Apple Pay" },
    { src: "/images/googlepay.png", alt: "Google Pay" },
  ]

  return (
    <footer
      className={`w-full bg-[#f0f0f0] px-6 pb-10 ${
        // pt-24 (96px) = 60px overlap from Boxblack + ~36px gap
        subscribed ? "pt-12" : "pt-24"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8">
        <section className="max-w-xs">
          <p className="text-xl font-bold">{t("logo")}</p>
          <p className="mt-3 text-gray-600">{t("tagline")}</p>
          <div className="mt-4 flex gap-3">
            {brands.map((brand) => (
              <a
                key={brand.id}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={brand.alt}
              >
                <Image src={brand.src} alt="" width={24} height={24} />
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">{t("company.title")}</h2>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/about`}>{t("company.about")}</Link></li>
            <li><Link href={`/${locale}/features`}>{t("company.feature")}</Link></li>
            <li><Link href={`/${locale}/works`}>{t("company.works")}</Link></li>
            <li><Link href={`/${locale}/career`}>{t("company.career")}</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">{t("help.title")}</h2>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/support`}>{t("help.customerSupport")}</Link></li>
            <li><Link href={`/${locale}/delivery`}>{t("help.deliveryDetails")}</Link></li>
            <li><Link href={`/${locale}/terms`}>{t("help.termsConditions")}</Link></li>
            <li><Link href={`/${locale}/privacy`}>{t("help.privacyPolicy")}</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">{t("faq.title")}</h2>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/account`}>{t("faq.account")}</Link></li>
            <li><Link href={`/${locale}/deliveries`}>{t("faq.manageDeliveries")}</Link></li>
            <li><Link href={`/${locale}/orders`}>{t("faq.orders")}</Link></li>
            <li><Link href={`/${locale}/payments`}>{t("faq.payments")}</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">{t("resources.title")}</h2>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link href={`/${locale}/ebooks`}>{t("resources.freeEbooks")}</Link></li>
            <li><Link href={`/${locale}/tutorials`}>{t("resources.devTutorial")}</Link></li>
            <li><Link href={`/${locale}/blog`}>{t("resources.blog")}</Link></li>
            <li><Link href={`/${locale}/youtube`}>{t("resources.youtube")}</Link></li>
          </ul>
        </section>
      </div>

      <hr className="mx-auto my-6 max-w-7xl border-gray-300" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-gray-500">{t("copyright")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {paymentIcons.map((icon) => (
            <Image
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              width={44}
              height={30}
              className="h-6 w-auto"
            />
          ))}
        </div>
      </div>
    </footer>
  )
}