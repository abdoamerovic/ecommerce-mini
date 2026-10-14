// Place this file at: components/Boxblack.tsx
"use client"

import { useState, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { useLocalFlag, setLocalFlag } from "@/lib/uselocalflag"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Boxblack() {
  const t = useTranslations("Boxblack")
  const [email, setEmail] = useState("")
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Server value is `true` so the box stays hidden until we know the real state
  const subscribed = useLocalFlag("newsletterSubscribed", true)

  const errorText = t.has("invalidEmail" as never)
    ? t("invalidEmail" as never)
    : "Please enter a valid email address"

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isSubmitting) return

    const value = email.trim()
    if (!EMAIL_REGEX.test(value)) {
      setHasError(true)
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: send `value` to your newsletter API, then only continue if it succeeds
      setLocalFlag("newsletterSubscribed", true)
    } catch {
      setHasError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (subscribed) return null

  return (
    <div className="mt-16">
      {/* Top half is transparent (page), bottom half is the footer grey.
          The black box always straddles the edge, whatever its height. */}
      <div className="bg-linear-to-b from-transparent from-50% to-[#f0f0f0] to-50%">
        <div className="mx-auto flex w-[calc(100%-2rem)] max-w-280 flex-col items-center justify-between gap-6 rounded-2xl bg-black p-6 md:flex-row md:justify-evenly md:p-10">
          <h2 className="text-center font-serif text-xl font-extrabold text-white sm:text-2xl md:text-start">
            {t("heading")}
            <br />
            {t("headingHighlight")}
          </h2>

          <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-sm flex-col gap-2 md:w-80">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              aria-label={t("emailPlaceholder")}
              aria-invalid={hasError}
              aria-describedby={hasError ? "newsletter-error" : undefined}
              className={`h-10 w-full rounded-2xl bg-white px-4 text-base text-gray-700 outline-none sm:text-sm ${
                hasError ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-white/40"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setHasError(false)
              }}
            />

            {hasError && (
              <p id="newsletter-error" role="alert" className="px-2 text-sm text-red-400">
                {errorText}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-2xl bg-white font-bold text-black disabled:opacity-60"
            >
              {t("subscribe")}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}