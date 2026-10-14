// Place this file at: components/LayoutShell.tsx

"use client"

import { usePathname } from "next/navigation"
import Alert from "@/components/alert"
import Navbar from "@/components/Navbar"
import Boxblack from "@/components/Boxblack"
import Footer from "@/components/Footer"

// Case-insensitive and tolerant of a trailing slash: "/en/login", "/ar/Signup/", ...
const AUTH_PAGE = /\/(login|signup)\/?$/i

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = AUTH_PAGE.test(pathname ?? "")

  return (
    <>
      {!hideLayout && <Alert />}
      {!hideLayout && <Navbar />}

      <main className="flex-1">{children}</main>

      {/* The "-mb-15 relative z-10" wrapper that used to sit here now lives on Boxblack itself.
          Once a visitor subscribed, Boxblack rendered nothing but the empty wrapper kept its
          negative margin and pulled the footer 60px up over the page content. */}
      {!hideLayout && <Boxblack />}

      {!hideLayout && <Footer />}
    </>
  )
}
