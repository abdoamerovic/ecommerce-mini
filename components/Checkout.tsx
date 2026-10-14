// Place this file at: components/Checkout.tsx

"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { useCartStore } from "@/lib/store/cartStore"
import { calculateTotals } from "@/lib/pricing"
import { CheckCircle2, MapPin, User, Mail, Phone, ShoppingBag, Truck } from "lucide-react"

const DEFAULT_IMAGE = "/images/default-product.jpg"
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const subscribeNoop = () => () => {}

type ShippingInfo = {
  fullName: string
  email: string
  address: string
  city: string
  phone: string
}

type ErrorKey = "required" | "invalidEmail" | "invalidPhone"

const FIELD_ORDER: (keyof ShippingInfo)[] = ["fullName", "email", "address", "city", "phone"]

// Accept Arabic-Indic digits (٠١٢...) as well as Latin ones
function normalizeDigits(value: string) {
  return value.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
}

type FieldProps = {
  id: keyof ShippingInfo
  label: string
  icon?: ReactNode
  type?: string
  autoComplete?: string
  inputMode?: "text" | "email" | "tel"
  placeholder?: string
  value: string
  error?: string
  onChange: (field: keyof ShippingInfo, value: string) => void
}

function Field({ id, label, icon, type = "text", autoComplete, inputMode, placeholder, value, error, onChange }: FieldProps) {
  const inputId = `shipping-${id}`
  const errorId = `${inputId}-error`

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500"
      >
        {icon} {label}
      </label>
      <input
        id={inputId}
        name={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-base outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 sm:text-sm ${
          error ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-black"
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Checkout() {
  const t = useTranslations("Checkout")
  const locale = useLocale()

  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const storeItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, ErrorKey>>>({})
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Don't leave the fake "API call" running (and calling setState) after unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const items = isClient ? storeItems : []
  const { subtotal, discount, delivery, total } = calculateTotals(items)
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  // Falls back to the generic "required" message if the new keys aren't in your messages files yet
  function errorText(key: ErrorKey) {
    const path = `errors.${key}`
    return t.has(path as never) ? t(path as never) : t("errors.required")
  }

  function handleChange(field: keyof ShippingInfo, value: string) {
    setShipping((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ShippingInfo, ErrorKey>> = {}

    if (!shipping.fullName.trim()) newErrors.fullName = "required"

    if (!shipping.email.trim()) newErrors.email = "required"
    else if (!EMAIL_REGEX.test(shipping.email.trim())) newErrors.email = "invalidEmail"

    if (!shipping.address.trim()) newErrors.address = "required"
    if (!shipping.city.trim()) newErrors.city = "required"

    const phone = shipping.phone.trim()
    const digits = normalizeDigits(phone).replace(/\D/g, "")
    if (!phone) newErrors.phone = "required"
    else if (digits.length < 7 || digits.length > 15) newErrors.phone = "invalidPhone"

    setErrors(newErrors)

    const firstInvalid = FIELD_ORDER.find((field) => newErrors[field])
    if (firstInvalid) document.getElementById(`shipping-${firstInvalid}`)?.focus()

    return !firstInvalid
  }

  function handlePlaceOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isPlacingOrder || items.length === 0) return
    if (!validate()) return

    setIsPlacingOrder(true)

    // Simulated API call. Replace with a real request to your orders endpoint.
    timeoutRef.current = setTimeout(() => {
      setIsPlacingOrder(false)
      setOrderPlaced(true)
      clearCart()
    }, 1000)
  }

  if (!isClient) {
    return <div className="mx-auto min-h-[50vh] max-w-6xl px-4 py-10 sm:px-6" />
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/50">
          <CheckCircle2 size={40} strokeWidth={1.75} />
        </div>
        <h1 className="mb-3 text-2xl font-extrabold sm:text-3xl">{t("successTitle")}</h1>
        <p className="mx-auto mb-10 max-w-sm leading-relaxed text-gray-500">{t("successMessage")}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center rounded-full bg-black px-10 py-3.5 font-medium text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
        >
          {t("backToHome")}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="breadcrumb" className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href={`/${locale}`} className="transition-colors hover:text-black">
          {t("home")}
        </Link>
        <span className="text-gray-300">/</span>
        <Link href={`/${locale}/cart`} className="transition-colors hover:text-black">
          {t("cart")}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-black">{t("title")}</span>
      </nav>

      <h1 className="mb-8 mt-2 text-2xl font-extrabold text-black sm:text-3xl">{t("title")}</h1>

      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 px-4 py-16 text-center sm:py-24">
          <ShoppingBag size={40} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
          <p className="mb-6 text-gray-500">{t("emptyCart")}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 font-medium text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-1">
            {/* Shipping form */}
            <form
              id="checkout-form"
              onSubmit={handlePlaceOrder}
              noValidate
              className="rounded-3xl border border-gray-200 bg-white p-5 md:p-7"
            >
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <MapPin size={16} />
                </div>
                <h2 className="text-lg font-bold">{t("shippingInfo")}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Field
                  id="fullName"
                  label={t("fullName")}
                  icon={<User size={13} />}
                  autoComplete="name"
                  value={shipping.fullName}
                  error={errors.fullName && errorText(errors.fullName)}
                  onChange={handleChange}
                />
                <Field
                  id="email"
                  label={t("email")}
                  icon={<Mail size={13} />}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={shipping.email}
                  error={errors.email && errorText(errors.email)}
                  onChange={handleChange}
                />
                <Field
                  id="address"
                  label={t("address")}
                  icon={<MapPin size={13} />}
                  autoComplete="street-address"
                  value={shipping.address}
                  error={errors.address && errorText(errors.address)}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    id="city"
                    label={t("city")}
                    autoComplete="address-level2"
                    value={shipping.city}
                    error={errors.city && errorText(errors.city)}
                    onChange={handleChange}
                  />
                  <Field
                    id="phone"
                    label={t("phone")}
                    icon={<Phone size={13} />}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={shipping.phone}
                    error={errors.phone && errorText(errors.phone)}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>

            {/* Items */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 md:p-7">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <ShoppingBag size={15} />
                </div>
                <h2 className="text-lg font-bold">{t("items")}</h2>
                <span className="ms-auto text-sm text-gray-400">
                  {totalQuantity} {t("qty")}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.color}-${item.size}`}
                    className="flex items-center gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 sm:gap-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-100">
                      <Image
                        src={item.image || DEFAULT_IMAGE}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {item.size} · {item.color} · {t("qty")} {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="flex w-full flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 md:p-7 lg:sticky lg:top-6 lg:w-96 lg:shrink-0">
            <h2 className="mb-1 text-lg font-bold">{t("orderSummary")}</h2>

            <div className="flex justify-between text-sm text-gray-500">
              <span>{t("subtotal")}</span>
              <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-red-500">
              <span>{t("discount")}</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Truck size={14} /> {t("deliveryFee")}
              </span>
              <span className="font-medium text-black">${delivery.toFixed(2)}</span>
            </div>

            <hr className="my-1 border-gray-100" />

            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold">{t("total")}</span>
              <span className="text-2xl font-extrabold">${total.toFixed(2)}</span>
            </div>

            {/* Lives outside the <form>, linked through the `form` attribute */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isPlacingOrder}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {isPlacingOrder ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {t("placingOrder")}
                </>
              ) : (
                t("placeOrder")
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
