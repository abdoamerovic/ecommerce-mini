"use client"

import { useSyncExternalStore, useState } from "react"
import { useTranslations } from "next-intl"
import { isUser, clearCurrentUser, type StoredUser } from "@/lib/auth"

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}


let cachedRaw: string | null = null
let cachedUser: StoredUser | null = null

function getSnapshot(): StoredUser | null {
  const data = localStorage.getItem("user")

  
  if (data === cachedRaw) {
    return cachedUser
  }

  cachedRaw = data

  if (!data) {
    cachedUser = null
    return cachedUser
  }

  try {
    const parsed = JSON.parse(data)
    cachedUser = isUser(parsed) ? parsed : null
  } catch {
    cachedUser = null
  }

  return cachedUser
}

function getServerSnapshot(): StoredUser | null {
  return null
}

export default function DropDown() {
  const t = useTranslations("Auth")
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [open, setOpen] = useState(false)

  if (!user) return null

  function handleLogout() {
    clearCurrentUser()
    setOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-medium hover:underline cursor-pointer"
      >
        {user.name}
      </button>

      {open && (
        <div className="absolute inset-e-0 top-full mt-2 min-w-45 rounded-lg border bg-white shadow-md p-3 z-50">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <hr className="my-2" />
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  )
}