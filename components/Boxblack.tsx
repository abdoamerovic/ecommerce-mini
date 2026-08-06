// Place this file at: components/Boxblack.tsx

"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

export default function Boxblack() {
  const t = useTranslations("Boxblack")
  const [inputValue, setInputValue] = useState("")
  const [subscribed, setSubscribed] = useState(true) // يبدأ true عشان الصندوق يفضل مخفي لحد ما نتأكد

  useEffect(() => {
    const isSubscribed = localStorage.getItem("newsletterSubscribed") === "true"
    setSubscribed(isSubscribed)
  }, [])

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function subscribe() {
    if (!isValidEmail(inputValue.trim())) {
      return
    }

    localStorage.setItem("newsletterSubscribed", "true")
    setSubscribed(true)
  }

  if (subscribed) return null

  return (
    <div className="w-full max-w-280 h-50 min-h-40 bg-black rounded-2xl flex flex-col md:flex-row items-center justify-evenly gap-6 mt-25 p-6 mx-auto">
      <h1 className="text-center text-2xl font-extrabold font-serif text-white">
        {t("heading")}
        <br />
        {t("headingHighlight")}
      </h1>

      <div className="flex flex-col justify-center gap-2">
        <input
          type="text"
          placeholder={t("emailPlaceholder")}
          className="w-80 h-10 rounded-2xl p-4 bg-white text-gray-700"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="w-80 h-10 bg-white rounded-2xl text-black font-bold"
          onClick={subscribe}
        >
          {t("subscribe")}
        </button>
      </div>
    </div>
  )
}
