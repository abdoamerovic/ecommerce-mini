// Place this file at: lib/hooks/useProducts.ts
"use client"

import { useEffect, useState } from "react"
import localProducts from "@/data/products.json"

export type ListProduct = {
  id: string
  name_en: string
  name_ar: string
  category: string
  image: string
  price: number
  oldPrice: number | null
  discount: number
  rating: number
  reviews: number
  inStock: boolean
}

// Arrivals and TopSale both need the products. Sharing the request means one
// call to /api/products per page load instead of two.
let inflight: Promise<ListProduct[]> | null = null

function fetchProducts(): Promise<ListProduct[]> {
  if (!inflight) {
    inflight = fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) throw new Error(`API responded with ${res.status}`)
        const json: unknown = await res.json()
        if (!Array.isArray(json)) throw new Error("Unexpected API response")
        return json as ListProduct[]
      })
      .catch((error) => {
        console.warn("API failed, using local data instead:", error)
        inflight = null // let the next mount try the API again
        return localProducts as ListProduct[]
      })
  }
  return inflight
}

// Fisher-Yates: unbiased (sort(() => Math.random() - 0.5) is not)
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Products in a random order, shuffled once per mount (so "view more" reveals more instead of re-rolling). */
export function useShuffledProducts() {
  const [products, setProducts] = useState<ListProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchProducts().then((data) => {
      if (cancelled) return
      setProducts(shuffle(data))
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading }
}