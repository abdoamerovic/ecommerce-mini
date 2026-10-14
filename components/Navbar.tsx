// Place this file at: components/Navbar.tsx

"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import DropDown from "@/components/DropDown"
import { useLocalFlag } from "@/lib/uselocalflag"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("Navbar")

  // Same-tab aware: the old subscription only listened to the "storage" event, which the
  // browser does NOT fire in the tab that made the change, so the navbar stayed on the
  // login icon after logging in until a reload. Use setLocalFlag("isLoggedIn", true/false)
  // in your login/logout code so this updates immediately.
  const isLoggedIn = useLocalFlag("isLoggedIn", false)

  // Escape closes whatever is open
  useEffect(() => {
    if (!isMenuOpen && !isSearchOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isMenuOpen, isSearchOpen])

  // Icon-only links need an accessible name. Falls back to English until these keys exist in your messages.
  function optionalLabel(key: string, fallback: string) {
    return t.has(key as never) ? t(key as never) : fallback
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: navigate to your search results page, e.g. router.push(`/${locale}/search?q=...`)
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="relative w-full border-b bg-white text-black">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Burger + Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="lg:hidden"
            aria-label={t("toggleMenu")}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Was an <h1 onClick>: not a link, not keyboard accessible, and a second h1 on the page */}
          <Link
            href={`/${locale}`}
            className={`text-xl font-bold ${isSearchOpen ? "hidden sm:inline" : ""}`}
          >
            {t("logo")}
          </Link>
        </div>

        {/* Links: large screens only */}
        <div className="hidden shrink-0 items-center gap-6 lg:flex">
          {/* Controlled with value="" so picking the same option twice still navigates */}
          <select
            aria-label={t("shop")}
            className="bg-transparent outline-none"
            onChange={(e) => router.push(`/${locale}${e.target.value}`)}
            value=""
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
        <div className="flex flex-1 justify-end lg:justify-start">
          {isSearchOpen ? (
            <form role="search" onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
              <Search
                className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                autoFocus
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                className="w-full rounded-full bg-gray-100 py-2 ps-10 pe-10 text-base outline-none sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label={optionalLabel("closeSearch", "Close search")}
                className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2"
              aria-label={t("openSearch")}
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Icons */}
        <div className="flex shrink-0 items-center gap-4">
          <Link href={`/${locale}/cart`} aria-label={optionalLabel("cart", "Cart")}>
            <ShoppingCart size={22} />
          </Link>

          <div className="hidden sm:block">
            {isLoggedIn ? (
              <DropDown />
            ) : (
              <Link href={`/${locale}/login`} aria-label={t("myAccount")}>
                <User size={22} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu: overlays the page instead of pushing it down */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-40 flex flex-col gap-4 border-t bg-white px-4 py-4 shadow-md lg:hidden"
        >
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">{t("shop")}</span>
            <Link href={`/${locale}/Category/man`} onClick={closeMenu} className="ps-3">
              {t("men")}
            </Link>
            <Link href={`/${locale}/Category/woman`} onClick={closeMenu} className="ps-3">
              {t("women")}
            </Link>
          </div>

          <Link href={`/${locale}/#onsale`} onClick={closeMenu}>
            {t("onSale")}
          </Link>
          <Link href={`/${locale}/#arrivals`} onClick={closeMenu}>
            {t("newArrive")}
          </Link>
          <Link href={`/${locale}/#brand`} onClick={closeMenu}>
            {t("brands")}
          </Link>

          {/* Logged-in phone users used to get a "My account" link that went to /login, and no way to log out */}
          <div className="sm:hidden">
            {isLoggedIn ? (
              <DropDown />
            ) : (
              <Link href={`/${locale}/login`} onClick={closeMenu}>
                {t("myAccount")}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
