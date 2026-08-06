// Place this file at: components/Navbar.tsx

"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { useSyncExternalStore } from "react"
import DropDown from "@/components/DropDown"
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("Navbar")
  const isLoggedIn = useSyncExternalStore(
  (callback) => {
    window.addEventListener("storage", callback)
    return () => window.removeEventListener("storage", callback)
  },
  () => localStorage.getItem("isLoggedIn") === "true",
  () => false
)

  return (
    <div className="w-full bg-white text-black border-b relative">
      <nav className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-6 gap-4">

        {/* Burger + Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
            aria-label={t("toggleMenu")}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="font-bold text-xl" onClick={() => router.push(`/${locale}`)}>
            {t("logo")}
          </h1>
        </div>

        {/* Links - تظهر بس على الشاشات الكبيرة */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <select
            className="outline-none bg-transparent"
            onChange={(e) => router.push(`/${locale}${e.target.value}`)}
            defaultValue=""
          >
            <option value="" disabled>
              {t("shop")}
            </option>
            <option value="/Category/man">{t("men")}</option>
            <option value="/Category/woman">{t("women")}</option>
          </select>

          <Link href={`/${locale}/#onsale`}>{t("onSale")}</Link>
          <Link href={`/${locale}/#arrivals`}>{t("newArrive")}</Link>
          <Link href={`/${locale}/#brand`}>{t("brands")}</Link>
        </div>

        {/* Search */}
        <div className="flex-1 flex justify-end lg:justify-start">
          {isSearchOpen ? (
            <div className="relative w-full max-w-md animate-in fade-in duration-200">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                autoFocus
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-10 outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2"
              aria-label={t("openSearch")}
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href={`/${locale}/cart`}>
            <ShoppingCart className="cursor-pointer" size={22} />
          </Link>
          <div className="hidden sm:block">
  {isLoggedIn ? (
    <DropDown />
  ) : (
    <Link href={`/${locale}/login`}>
      <User className="cursor-pointer" size={22} />
    </Link>
  )}
</div>
        </div>
      </nav>

      {/* القائمة المنسدلة على الموبايل */}
      {isMenuOpen && (
        <div className="lg:hidden border-t px-4 py-4 flex flex-col gap-4 bg-white">
          <select
            className="outline-none border rounded-lg p-2"
            onChange={(e) => {
              router.push(`/${locale}${e.target.value}`)
              setIsMenuOpen(false)
            }}
            defaultValue=""
          >
            <option value="" disabled>
              {t("shop")}
            </option>
            <option value="/Category/man">{t("men")}</option>
            <option value="/Category/woman">{t("women")}</option>
          </select>

          <Link href={`/${locale}/#arrivals`} onClick={() => setIsMenuOpen(false)}>
            {t("newArrive")}
          </Link>
          <Link href={`/${locale}/#onsale`} onClick={() => setIsMenuOpen(false)}>
            {t("onSale")}
          </Link>
          <Link href={`/${locale}/#brand`} onClick={() => setIsMenuOpen(false)}>
            {t("brands")}
          </Link>
          <Link href={`/${locale}/login`} onClick={() => setIsMenuOpen(false)} className="sm:hidden">
            {t("myAccount")}
          </Link>
        </div>
      )}
    </div>
  )
}
