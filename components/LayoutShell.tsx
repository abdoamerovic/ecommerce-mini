"use client"

import { usePathname } from "next/navigation"
import Alert from "@/components/alert"
import Navbar from "@/components/Navbar"
import Boxblack from "@/components/Boxblack"
import Footer from "@/components/Footer"

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideLayout =
    pathname?.endsWith("/login") || pathname?.endsWith("/Signup")

  return (
    <>
      {!hideLayout && <Alert />}
      {!hideLayout && <Navbar />}

      <main className="flex-1">{children}</main>

      {!hideLayout && (
        <div className="-mb-15 relative z-10">
          <Boxblack />
        </div>
      )}

      {!hideLayout && <Footer />}
    </>
  )
}
