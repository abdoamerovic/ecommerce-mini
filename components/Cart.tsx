// Place this file at: components/Cart.tsx

"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useCartStore } from "@/lib/store/cartStore"
import { calculateTotals } from "@/lib/pricing"

const DEFAULT_IMAGE = "/images/default-product.jpg"

const subscribeNoop = () => () => {}

export default function Cart() {
  const t = useTranslations("Cart")
  const locale = useLocale()

  // The cart may be restored from localStorage on the client; render it only after
  // hydration so server and client HTML match.
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const storeItems = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const [coupon, setCoupon] = useState("")

  const items = isClient ? storeItems : []
  const isEmpty = isClient && items.length === 0
  const { subtotal, discount, delivery, total } = calculateTotals(items)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/${locale}`}>{t("home")}</Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <span className="font-semibold text-black">{t("title")}</span>
      </nav>

      <h1 className="mb-6 mt-4 text-2xl font-extrabold text-black">{t("title")}</h1>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        {/* Items (flex-1 instead of a fixed 751px width, which overflowed the container) */}
        <div className="flex w-full min-w-0 flex-col gap-4 rounded-2xl border-2 border-gray-200 p-4 lg:flex-1">
          {isEmpty ? (
            <p className="py-10 text-center text-gray-500">{t("empty")}</p>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 sm:gap-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
                  <Image
                    src={item.image || DEFAULT_IMAGE}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      {t("size")}: {item.size}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("color")}: {item.color}
                    </p>
                    <p className="pt-2 font-bold">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      aria-label={t("removeItem")}
                      className="p-1 text-red-500 transition-colors hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center gap-3 rounded-full bg-gray-100 px-3 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.size, item.color, -1)}
                        aria-label={t("decreaseQuantity")}
                        disabled={item.quantity <= 1}
                        className="p-1 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.size, item.color, 1)}
                        aria-label={t("increaseQuantity")}
                        className="p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-200 p-4 lg:sticky lg:top-6 lg:w-96 lg:shrink-0">
          <h2 className="text-lg font-bold">{t("orderSummary")}</h2>

          <div className="flex justify-between text-gray-600">
            <span>{t("subtotal")}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-500">
            <span>{t("discount")}</span>
            <span>-${discount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>{t("deliveryFee")}</span>
            <span>${delivery.toFixed(2)}</span>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between text-lg font-bold">
            <span>{t("total")}</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder={t("couponPlaceholder")}
              aria-label={t("couponPlaceholder")}
              className="min-w-0 flex-1 rounded-lg border-2 border-gray-200 px-3 py-2 text-base outline-none focus:border-black sm:text-sm"
            />
            {/* TODO: wire to your coupon API; the button is disabled until something is typed */}
            <button
              type="button"
              disabled={!coupon.trim()}
              className="rounded-full bg-black px-5 font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {t("apply")}
            </button>
          </div>

          <Link
            href={`/${locale}/checkout`}
            aria-disabled={items.length === 0}
            tabIndex={items.length === 0 ? -1 : undefined}
            className={`flex h-11 w-full items-center justify-center rounded-full bg-black font-medium text-white transition-colors hover:bg-gray-800 ${
              items.length === 0 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {t("checkout")}
          </Link>
        </div>
      </div>
    </div>
  )
}
