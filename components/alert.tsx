"use client"
import { useSyncExternalStore, useState } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

function subscribe() {
  return () => {}
}

function getSnapshot() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const isDismissed = localStorage.getItem("alertDismissed") === "true"
  return !isLoggedIn && !isDismissed
}

function getServerSnapshot() {
  return false
}

export default function Alert() {
  const show = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [dismissed, setDismissed] = useState(false)

  const t = useTranslations("Alert")
  const locale = useLocale()

  function handleClose() {
    setDismissed(true)
    localStorage.setItem("alertDismissed", "true")
  }

  if (!show || dismissed) return null

  return (
    <div className="w-full h-8 bg-black text-white border-b">
      <nav className="max-w-7xl mx-auto h-full relative flex items-center justify-center px-6">
        <p className="text-center">
          {t("message")}{" "}
          <Link href={`/${locale}/login`} className="font-medium underline">
            {t("signUpLink")}
          </Link>
        </p>
        <button onClick={handleClose} className="absolute right-6 cursor-pointer">
          {t("close")}
        </button>
      </nav>
    </div>
  )
}