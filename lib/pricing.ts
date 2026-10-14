// Place this file at: lib/pricing.ts
// Single source of truth for cart/checkout totals (was duplicated in two files).

export const DELIVERY_FEE = 10
export const DISCOUNT_RATE = 0.2

type PricedItem = { price: number; quantity: number }

export function calculateTotals(items: PricedItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * DISCOUNT_RATE
  const delivery = items.length > 0 ? DELIVERY_FEE : 0
  const total = subtotal - discount + delivery

  return { subtotal, discount, delivery, total }
}