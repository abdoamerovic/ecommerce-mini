
import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always", // every URL always has /en or /ar
})

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
