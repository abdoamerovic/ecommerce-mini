// Place this file at: lib/hooks/useLocalFlag.ts
"use client"

import { useSyncExternalStore } from "react"

const listeners = new Set<() => void>()
// Fallback when localStorage is unavailable (e.g. Safari private mode)
const memory = new Map<string, boolean>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

function readFlag(key: string): boolean {
  if (memory.has(key)) return memory.get(key) as boolean
  try {
    return localStorage.getItem(key) === "true"
  } catch {
    return false
  }
}

export function setLocalFlag(key: string, value: boolean) {
  memory.set(key, value)
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // storage unavailable: the in-memory value above still works for this session
  }
  listeners.forEach((listener) => listener())
}

/**
 * Reads a "true"/"false" flag from localStorage without hydration mismatches.
 * `serverValue` is what the server (and the first hydration pass) will see.
 */
export function useLocalFlag(key: string, serverValue = false) {
  return useSyncExternalStore(
    subscribe,
    () => readFlag(key),
    () => serverValue
  )
}