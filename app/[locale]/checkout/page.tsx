'use client'

import { useLocale, useTranslations } from "next-intl"

export default function Checkout() {
  const t = useTranslations("Checkout")
  const locale = useLocale()

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{locale}</p>
    </main>
  )
}
