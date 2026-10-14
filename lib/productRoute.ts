
const CATEGORY_ALIASES: Record<string, string> = { man: "men", woman: "women" }

export function normalizeCategory(category: string) {
  const c = category.toLowerCase()
  return CATEGORY_ALIASES[c] ?? c
}

export function getProductHref(locale: string, product: { id: string; category: string }) {
  const category = normalizeCategory(product.category)
  const id = encodeURIComponent(product.id)

  if (category === "men") return `/${locale}/Category/man?id=${id}`
  if (category === "women") return `/${locale}/Category/woman?id=${id}`

  // Other categories used to be dead clicks
  return `/${locale}/Product/${category}?id=${id}`
}