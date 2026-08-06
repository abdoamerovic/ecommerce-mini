# SHOP.CO — Multi-language E-commerce Mini Site

A small multi-page **Next.js (App Router) + TypeScript** e-commerce demo with English/Arabic
support (including full RTL), a cart & wishlist, and localized SEO.

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js 18+
- npm (or yarn / pnpm / bun)

### Install & run
```bash
npm install
npm run dev
```

Open one of:
- [http://localhost:3000/en](http://localhost:3000/en) — English
- [http://localhost:3000/ar](http://localhost:3000/ar) — Arabic (RTL)

Visiting `/` redirects automatically to the saved/default locale via middleware.

### Build for production
```bash
npm run build
npm start
```

### Clearing the cache (Windows PowerShell)
If you hit stale build errors after switching branches/dependencies:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

## ⏱️ Timeline & Learning Curve (honest note)

The task's suggested timebox was **4–6 hours**. That wasn't realistic for me, and I'd rather say
so plainly than pretend otherwise.

- **~4 days** went into learning React/Next.js basics before writing real project code. My
  background is **Vue** (Composition API, Pinia), so a lot of this — Server vs. Client
  Components, the App Router's file-based routing, React's hooks model — wasn't a quick
  translation from what I already knew. Some of it I'm still not 100% solid on.
- **~9 days total** on the project itself. That included some back-and-forth I'd rather admit
  than hide: I started wiring up translations with `react-i18next`, ran into `next-intl`
  runtime errors partway through because I hadn't fully understood which library the project
  was actually supposed to use, and ended up migrating components over one at a time as the
  errors surfaced rather than deciding this upfront. The Cart/Wishlist state also went through
  a rewrite (manual `localStorage` sync → Zustand) once I understood the tradeoffs better.

I'm noting this instead of smoothing it over because the result isn't polished from a single
clear plan — it's closer to "learned this stack while building it, fixed things as they broke."
Some sections below reflect that too: they're marked as done vs. in-progress honestly, and a
few areas (see Known Tradeoffs and Bonus) I know are incomplete or not something I fully
understand yet, rather than things I chose to skip.

---

## 🧱 Tech Choices & Tradeoffs

These weren't all decided upfront — some were arrived at after hitting a wall with a different
approach first. Noted where that's the case.

| Area | Choice | Why / Tradeoff |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Required by the task. Still learning the Server/Client Component boundary — a few components are probably marked `"use client"` more than strictly necessary because I wasn't confident which parts needed it. |
| Styling | Tailwind CSS | Utility-first, and `dir="rtl"` on `<html>` handles most RTL flipping for free — though a couple of manually-positioned elements (icons, arrows) needed explicit RTL-aware overrides I added case-by-case as I noticed them, not systematically. |
| i18n | **next-intl** (ended up here, didn't start here) | I initially built several components with `react-i18next` before realizing partway through that the project setup (middleware, provider) was actually next-intl. That caused real runtime errors (`NextIntlClientProvider` context missing) that I had to debug and fix component-by-component. Everything should be on next-intl now, but I can't rule out a stray `react-i18next` import somewhere I haven't found yet. |
| State | **Zustand** + `persist` middleware | Started with manual `localStorage` + `useSyncExternalStore` for the cart (worked, but verbose), switched to Zustand once I understood it would remove most of that boilerplate and make Wishlist easier to add consistently. |
| Forms & Validation | React Hook Form + Zod | Specified by the task. Login/Signup were originally plain `useState` forms with manual `if` checks; not fully migrated to RHF + Zod yet — see checklist. |
| Data | Local JSON (`/data/products.json`, `/data/reviews.json`) via Next.js **Route Handlers** | Components try the API first and fall back to importing the local JSON directly if the fetch fails — mainly because that's what was already working before the route handlers existed, and I kept it as a safety net rather than removing it. |
| Auth | Mock, `localStorage`-backed | No backend. Signup writes a user record, Login checks against it. Simple, but I know it's not how real auth should work — good enough to demonstrate the flow, not production logic. |

### Known tradeoffs / things I'm not fully confident about
- Auth and cart data live in `localStorage` only — no real backend or session, and no server-side validation backing up the client-side checks.
- I fixed several Cumulative Layout Shift issues by adding skeleton loaders, but I only checked the pages I was actively told had problems — I haven't audited every page for the same pattern.
- Search is not instant/debounced (bonus item, not implemented).
- No automated test suite yet (bonus item).
- Some RTL edge cases (icon mirroring, arrow direction in carousels) were fixed reactively when they looked wrong, not verified systematically across every component.

---

## ✅ SEO Checklist

- [x] `Metadata` API for localized `<title>` / `<description>` per page
- [x] `<html lang="en">` / `<html lang="ar">` set per locale in `app/[locale]/layout.tsx`
- [x] `dir="rtl"` applied automatically for Arabic
- [x] `hreflang` alternate links (`en` / `ar` / `x-default`)
- [x] Canonical URLs per page
- [x] Open Graph + Twitter meta tags, localized
- [ ] JSON-LD `Product` schema with `offers` (in progress — Product page)
- [ ] JSON-LD `BreadcrumbList` (in progress — Category/Product pages)
- [ ] `sitemap.xml` covering EN + AR routes
- [ ] `robots.txt`
- [ ] Lighthouse SEO ≥ 90 (Desktop + Mobile, both languages) — pending final audit

> Items above are tracked honestly as **in progress**; see the project board / commit history
> for current status rather than assuming completion.

---

## 📊 Lighthouse Screenshots

_Add screenshots here after running Lighthouse for:_
- `/en` Desktop
- `/en` Mobile
- `/ar` Desktop
- `/ar` Mobile

```
docs/
  lighthouse-en-desktop.png
  lighthouse-en-mobile.png
  lighthouse-ar-desktop.png
  lighthouse-ar-mobile.png
```

---

## 📁 Project Structure (high level)

```
app/
  [locale]/
    layout.tsx        # locale-aware root layout (lang, dir, I18nProvider)
    page.tsx           # Home
    Category/[slug]/    # Category listing
    Product/[type]/      # Product detail
    cart/
    checkout/
    login/  Signup/
  api/
    products/route.ts
    products/[id]/route.ts
    categories/route.ts
components/            # Navbar, Footer, Alert, Cart, Reviews, Form, etc.
lib/
  store/                # Zustand stores (cart, wishlist, auth)
  i18n/                 # next-intl config
data/
  products.json
  reviews.json
public/
  images/
middleware.ts           # locale detection & redirect
```

---

## 🌍 Multi-language Notes

- Default locale: **English** (`en`); **Arabic** (`ar`) is fully RTL.
- Language preference persists via cookie (read/written in `middleware.ts`) so a returning
  visitor lands on their last-used language without a client-side flash.
- All UI strings, validation messages, and error text are translated — see
  `lib/i18n/messages/{en,ar}.json` (or `messages/{en,ar}.json`, depending on final layout).

---

## 📦 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | All products |
| GET | `/api/products/[id]` | Single product by id |
| GET | `/api/categories` | Distinct category list |

---

## 🧪 Bonus / Not Yet Implemented

- [ ] Unit tests
- [ ] Theme toggle (dark mode)
- [ ] Instant/debounced search
- [ ] Dynamic OG images
- [ ] Deployed preview (Vercel)

---

## Learn More (Next.js defaults)

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)
- [Deploy on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)