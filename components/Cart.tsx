"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { useCartStore } from "@/lib/store/cartStore"

const DELIVERY_FEE = 10
const DISCOUNT_RATE = 0.2

export default function Cart() {
  const t = useTranslations("Cart")
  const locale = useLocale()

  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * DISCOUNT_RATE
  const total = subtotal - discount + (items.length > 0 ? DELIVERY_FEE : 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/${locale}`}>{t("home")}</Link>
        <span>&gt;</span>
        <span className="font-semibold text-black">{t("title")}</span>
      </div>

      <h1 className="text-2xl font-extrabold text-black mt-4 mb-6">{t("title")}</h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-187.75 border-2 border-gray-200 rounded-2xl p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-10">{t("empty")}</p>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex items-center justify-between gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">{t("size")}: {item.size}</p>
                    <p className="text-sm text-gray-500">{t("color")}: {item.color}</p>
                    <h3 className="pt-2 font-bold">${item.price.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    aria-label={t("removeItem")}
                  >
                    <Image src="/images/icons8-delete-32.png" alt="" width={20} height={20} />
                  </button>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, -1)}
                      aria-label={t("decreaseQuantity")}
                      className="font-bold"
                    >
                      −
                    </button>
                    <span className="w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, 1)}
                      aria-label={t("increaseQuantity")}
                      className="font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-full lg:w-95 border-2 border-gray-200 rounded-2xl p-4 flex flex-col gap-4">
          <h1 className="font-bold text-lg">{t("orderSummary")}</h1>

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
            <span>${items.length > 0 ? DELIVERY_FEE.toFixed(2) : "0.00"}</span>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between font-bold text-lg">
            <span>{t("total")}</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t("couponPlaceholder")}
              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 outline-none"
            />
            <button className="px-5 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors">
              {t("apply")}
            </button>
          </div>

          <Link
            href={`/${locale}/checkout`}
            className="w-full h-11 flex items-center justify-center rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            {t("checkout")}
          </Link>
        </div>
      </div>
    </div>
  )
}