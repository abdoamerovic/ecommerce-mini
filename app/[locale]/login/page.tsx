"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { findAccount, setCurrentUser } from "@/lib/auth"

export default function LoginForm() {
  const router = useRouter()
  const t = useTranslations("Auth")
  const locale = useLocale()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      setError(t("errors.fillAllFields"))
      return
    }

    const account = findAccount(email, password)

    if (account) {
      setCurrentUser({ name: account.name, email: account.email })
      router.push(`/${locale}`)
    } else {
      setError(t("errors.invalidCredentials"))
    }
  }

  const authgoogle = () => {
    console.log("hello google")
  }

  const authface = () => {
    console.log("hello face")
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mt-20">
      <div className="flex flex-col gap-4 w-80 border-2 border-black p-3.5 rounded-2xl hover:shadow-2xl hover:shadow-black">
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="bg-black text-white rounded-lg py-2 hover:bg-gray-700">
          {t("login")}
        </button>

        <hr />

        <button
          type="button"
          className="border rounded-lg p-2 hover:border-4 hover:border-gray-600 duration-150"
          onClick={authgoogle}
        >
          {t("loginWithGoogle")}
        </button>
        <button
          type="button"
          className="border rounded-lg p-2 hover:border-4 hover:border-gray-600 duration-150"
          onClick={authface}
        >
          {t("loginWithFacebook")}
        </button>

        <p className="p-2 italic">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/Signup`} className="underline hover:p-0.5">
            {t("createNew")}
          </Link>
        </p>
      </div>
    </form>
  )
}