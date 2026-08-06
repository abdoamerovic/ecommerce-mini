
export type StoredUser = {
  name: string
  email: string
}

type StoredAccount = StoredUser & {
  password: string
}

const ACCOUNTS_KEY = "accounts"
const CURRENT_USER_KEY = "user"

function getAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function emailExists(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  return getAccounts().some((a) => a.email.toLowerCase() === normalized)
}

export function saveUser(account: StoredAccount) {
  const accounts = getAccounts()
  accounts.push(account)
  saveAccounts(accounts)
}

export function findAccount(email: string, password: string): StoredAccount | null {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedPassword = password.trim()

  return (
    getAccounts().find(
      (a) =>
        a.email.toLowerCase() === normalizedEmail &&
        a.password === normalizedPassword
    ) ?? null
  )
}

export function setCurrentUser(user: StoredUser) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  localStorage.setItem("isLoggedIn", "true")
  // notify listeners in the SAME tab (native "storage" events only fire cross-tab)
  window.dispatchEvent(new Event("storage"))
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem("isLoggedIn")
  window.dispatchEvent(new Event("storage"))
}

export function isUser(value: unknown): value is StoredUser {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as StoredUser).name === "string" &&
    typeof (value as StoredUser).email === "string"
  )
}
