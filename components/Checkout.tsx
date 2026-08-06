// Place this file at: components/Checkout.tsx

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { useCartStore } from "@/lib/store/cartStore"
import { CheckCircle2, MapPin, User, Mail, Phone, ShoppingBag, Truck } from "lucide-react"

const DELIVERY_FEE = 10
const DISCOUNT_RATE = 0.2

type ShippingInfo = {
  fullName: string
  email: string
  address: string
  city: string
  phone: string
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">{message}</p>
}

export default function Checkout() {
  const t = useTranslations("Checkout")
  const locale = useLocale()

  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({})
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * DISCOUNT_RATE
  const total = subtotal - discount + (items.length > 0 ? DELIVERY_FEE : 0)

  function handleChange(field: keyof ShippingInfo, value: string) {
    setShipping((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const newErrors: Partial<ShippingInfo> = {}
    if (!shipping.fullName.trim()) newErrors.fullName = t("errors.required")
    if (!shipping.email.trim()) newErrors.email = t("errors.required")
    if (!shipping.address.trim()) newErrors.address = t("errors.required")
    if (!shipping.city.trim()) newErrors.city = t("errors.required")
    if (!shipping.phone.trim()) newErrors.phone = t("errors.required")

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handlePlaceOrder() {
    if (items.length === 0) return
    if (!validate()) return

    setIsPlacingOrder(true)

    // محاكاة استدعاء API لإتمام الطلب
    setTimeout(() => {
      setIsPlacingOrder(false)
      setOrderPlaced(true)
      clearCart()
    }, 1000)
  }

  const inputBase =
    "w-full border rounded-xl px-4 py-2.5 outline-none transition-colors bg-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-black/10"

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
          <CheckCircle2 size={40} strokeWidth={1.75} />
        </div>
        <h1 className="text-3xl font-extrabold mb-3">{t("successTitle")}</h1>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">{t("successMessage")}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center rounded-full bg-black text-white font-medium px-10 py-3.5 hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          {t("backToHome")}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <Link href={`/${locale}`} className="hover:text-black transition-colors">
          {t("home")}
        </Link>
        <span className="text-gray-300">/</span>
        <Link href={`/${locale}/cart`} className="hover:text-black transition-colors">
          {t("cart")}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-black">{t("title")}</span>
      </div>

      <h1 className="text-3xl font-extrabold text-black mt-2 mb-8">{t("title")}</h1>

      {items.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
          <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="text-gray-500 mb-6">{t("emptyCart")}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-full bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Shipping form */}
          <div className="w-full lg:flex-1 flex flex-col gap-6">
            <div className="border border-gray-200 rounded-3xl p-6 md:p-7 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <h2 className="font-bold text-lg">{t("shippingInfo")}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    <User size={13} /> {t("fullName")}
                  </label>
                  <input
                    type="text"
                    value={shipping.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="John Doe"
                    className={`${inputBase} ${
                      errors.fullName ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-black"
                    }`}
                  />
                  <FieldError message={errors.fullName} />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    <Mail size={13} /> {t("email")}
                  </label>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`${inputBase} ${
                      errors.email ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-black"
                    }`}
                  />
                  <FieldError message={errors.email} />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    <MapPin size={13} /> {t("address")}
                  </label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 Main St"
                    className={`${inputBase} ${
                      errors.address ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-black"
                    }`}
                  />
                  <FieldError message={errors.address} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                      {t("city")}
                    </label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className={`${inputBase} ${
                        errors.city ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-black"
                      }`}
                    />
                    <FieldError message={errors.city} />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                      <Phone size={13} /> {t("phone")}
                    </label>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`${inputBase} ${
                        errors.phone ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-black"
                      }`}
                    />
                    <FieldError message={errors.phone} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-3xl p-6 md:p-7 bg-white">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  <ShoppingBag size={15} />
                </div>
                <h2 className="font-bold text-lg">{t("items")}</h2>
                <span className="ml-auto text-sm text-gray-400">
                  {items.length} {t("qty")}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.color}-${item.size}`}
                    className="flex items-center gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-100">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.size} · {item.color} · {t("qty")} {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-sm shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-96 lg:sticky lg:top-6 border border-gray-200 rounded-3xl p-6 md:p-7 bg-white flex flex-col gap-4">
            <h2 className="font-bold text-lg mb-1">{t("orderSummary")}</h2>

            <div className="flex justify-between text-sm text-gray-500">
              <span>{t("subtotal")}</span>
              <span className="text-black font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-red-500">
              <span>{t("discount")}</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Truck size={14} /> {t("deliveryFee")}
              </span>
              <span className="text-black font-medium">${DELIVERY_FEE.toFixed(2)}</span>
            </div>

            <hr className="border-gray-100 my-1" />

            <div className="flex justify-between items-baseline">
              <span className="font-bold text-base">{t("total")}</span>
              <span className="font-extrabold text-2xl">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full h-12 mt-2 flex items-center justify-center gap-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isPlacingOrder ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {t("placingOrder")}
                </>
              ) : (
                t("placeOrder")
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-1">
              {t("home")} → {t("cart")} → {t("title")}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}