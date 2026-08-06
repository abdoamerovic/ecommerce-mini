// Place this file at: lib/i18n/LanguageSwitcher.tsx (replaces the old one)

"use client"

import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function toggleLocale() {
    const nextLocale = locale === "en" ? "ar" : "en"
    const segments = pathname.split("/")
    segments[1] = nextLocale
    router.push(segments.join("/") || "/")
  }

  return (
    <button
      onClick={toggleLocale}
      className="text-sm font-medium border rounded-full px-3 py-1 hover:bg-gray-100"
    >
      {locale === "en" ? "العربية" : "English"}
    </button>
  )
}
