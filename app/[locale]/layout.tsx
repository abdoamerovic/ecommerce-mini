import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import LayoutShell from "@/components/LayoutShell"

const locales = ["en", "ar"]

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} className="flex flex-col min-h-full">
      <NextIntlClientProvider messages={messages}>
        <LayoutShell>{children}</LayoutShell>
      </NextIntlClientProvider>
    </div>
  )
}