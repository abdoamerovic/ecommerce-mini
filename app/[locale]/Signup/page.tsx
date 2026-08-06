"use client"

import { useState, type SyntheticEvent } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { emailExists, saveUser, setCurrentUser } from "@/lib/auth"

export default function Signup() {
  const router = useRouter()
  const t = useTranslations("Auth")
  const locale = useLocale()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError(t("errors.fillAllFields"))
      return
    }

    if (password.length < 8) {
      setError(t("errors.passwordTooShort"))
      return
    }

    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"))
      return
    }

    if (emailExists(email)) {
      setError(t("errors.invalidCredentials"))
      return
    }

    const trimmedEmail = email.trim()
    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    const name = `${trimmedFirstName} ${trimmedLastName}`

    saveUser({
      email: trimmedEmail,
      password,
      name,
    })

    setCurrentUser({ name, email: trimmedEmail })

    router.push(`/${locale}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mt-20">
      <div className="flex flex-col gap-4 w-80 border-2 border-black p-3.5 rounded-2xl hover:shadow-2xl hover:shadow-black">
        <div className="flex gap-2 flex-col">
          <div className="flex flex-col gap-1">
            <label className="text-black italic">{t("firstName")}</label>
            <input
              type="text"
              placeholder={t("firstName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border rounded-lg p-2 hover:border-2 hover:border-gray-500 duration-150"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-black italic">{t("lastName")}</label>
            <input
              type="text"
              placeholder={t("lastName")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border rounded-lg p-2 hover:border-2 hover:border-gray-500 duration-150"
            />
          </div>
        </div>

        <label className="text-black italic">{t("email")}</label>
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2 hover:border-2 hover:border-gray-500 duration-150"
        />

        <label className="text-black italic">{t("password")}</label>
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-2 hover:border-2 hover:border-gray-500 duration-150"
        />

        <label className="text-black italic">{t("confirmPassword")}</label>
        <input
          type="password"
          placeholder={t("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border rounded-lg p-2 hover:border-2 hover:border-gray-500 duration-150"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white rounded-lg py-2 hover:bg-gray-700"
        >
          {t("signup")}
        </button>
      </div>
    </form>
  )
}