# SHOP.CO: Multi-language E-commerce Mini Site

A small multi-page **Next.js (App Router) + TypeScript** e-commerce demo with English/Arabic
support (including full RTL), a cart and wishlist, and localized SEO.

> **This is my first Next.js project.** It works, but it is not the structure I would choose
> today. The sections below explain what is in it, what I would do differently, and where I
> know it is incomplete. I want the next project to be better, so I am writing the lessons down.

---

## Setup and Run

### Prerequisites
- Node.js 18+
- npm (or yarn / pnpm / bun)

### Environment variables
Create `.env.local` in the project root:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

In production set it to the real domain (for example `https://yourdomain.com`) in the hosting
settings (Vercel/Netlify). It is used for canonical URLs, hreflang, Open Graph and JSON-LD.
`.env.local` is not committed, so it has to be set again on the host.

### Install and run
```bash
npm install
npm run dev
```

Open one of:
- [http://localhost:3000/en](http://localhost:3000/en): English
- [http://localhost:3000/ar](http://localhost:3000/ar): Arabic (RTL)

Visiting `/` redirects to the saved or default locale (handled in `proxy.ts`, the Next.js 16
name for what used to be `middleware.ts`).

### Build for production
```bash
npm run build
npm start
```

### Clearing the cache (Windows PowerShell)
If you hit stale build errors after switching branches or dependencies:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

## Timeline and Learning Curve (honest note)

The task's suggested timebox was **4-6 hours**. That was not realistic for me, and I would rather
say so plainly.

- **~4 days** went into learning React/Next.js basics before writing real project code. My
  background is **Vue** (Composition API, Pinia), so Server vs. Client Components, file-based
  routing and React's hooks model were not a quick translation.
- **~9 days total** on the project. That included back-and-forth: I started with `react-i18next`,
  hit `next-intl` runtime errors because I had not understood which library the setup used, and
  migrated components one at a time as errors appeared. The Cart/Wishlist state was also
  rewritten (manual `localStorage` sync, then Zustand).
- After the first version I did a **review and cleanup pass** (layout, accessibility, SEO,
  hydration). That pass taught me more than the first build did, and the notes below come from it.

The result is closer to "learned the stack while building it, fixed things as they broke" than
to a single clear plan.

---

## Tech Choices and Tradeoffs

| Area | Choice | Why / Tradeoff |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Required by the task. |
| Styling | Tailwind CSS | Utility-first. `dir="rtl"` on `<html>` handles most RTL flipping. I used logical utilities (`ps-*`, `pe-*`, `inset-s-*`, `inset-e-*`) where possible so the same markup works in both directions. |
| i18n | **next-intl** (ended up here, did not start here) | Provider is `NextIntlClientProvider` in the locale layout. Everything should be migrated from `react-i18next`, but a stray import may remain. |
| State | **Zustand** + `persist` | Replaced manual `localStorage` + `useSyncExternalStore`. Less boilerplate, and Wishlist is consistent with Cart. |
| Forms and validation | React Hook Form + Zod | Specified by the task. Login/Signup are not fully migrated yet. |
| Data | Local JSON via Route Handlers | Components call the API first and fall back to the local JSON if the fetch fails. |
| Auth | Mock, `localStorage`-backed | No backend. Demonstrates the flow only. |
| Small flags | `lib/uselocalflag.ts` | A tiny hook over `localStorage` (`isLoggedIn`, `newsletterSubscribed`) that updates in the same tab. The plain `storage` event does not fire in the tab that made the change. |

---

## Project Structure

```
app/
  layout.tsx            # pass-through only (see "Layouts" below)
  [locale]/
    layout.tsx          # the one <html> and <body>: lang, dir, fonts, NextIntlClientProvider
    page.tsx            # Home: generateMetadata, JSON-LD, hero, brands, sections
    Category/[slug]/    # Category listing
    Product/[type]/     # Product detail
    cart/  checkout/
    login/  Signup/
  api/
    products/route.ts
    products/[id]/route.ts
    categories/route.ts
components/
  LayoutShell.tsx       # Alert + Navbar + Boxblack + Footer; hidden on login/signup
  Navbar.tsx  Footer.tsx  Boxblack.tsx (newsletter box)  Alert.tsx
  Start  Arrivals  TopSale  Reviews  form  Cart  Checkout  Detials  like ...
lib/
  uselocalflag.ts       # same-tab-aware localStorage flag hook
  useProducts.ts  productRoute.ts  pricing.ts
  store/                # Zustand stores (cart, wishlist, auth)
  i18n/messages/{en,ar}.json
data/
  products.json  reviews.json
public/images/
proxy.ts                # locale detection and redirect
```

### Layouts
There must be exactly **one** `<html>` and `<body>` in the tree. They live in
`app/[locale]/layout.tsx` so `lang` and `dir` are correct for each language. `app/layout.tsx`
just returns `children`. Having `<html>` in both files caused a hydration mismatch (server
rendered one set of `className`s, the client another). That mistake is the reason this section exists.

---

## What I Learned About `"use client"`

My first instinct was to put `"use client"` on anything that looked interactive or used a hook.
After the review I understand the rule better:

- **Needs `"use client"`:** state (`useState`), effects, event handlers, browser APIs
  (`localStorage`, `window`), and hooks built on them. Examples here: `Navbar` (menu and search
  state, Escape key), `Boxblack` (form state, `localStorage` flag), `Cart`, `like`.
- **Does not need it:** components that only render markup and translations. `Footer` is
  marked `"use client"` in this project, but a Server Component can use `useTranslations` from
  `next-intl` too. I now read the flag in `Footer` only because of the newsletter overlap, and
  the better design is to remove that dependency (see below).
- **Better pattern for next time:** keep pages and layouts as Server Components, and push
  `"use client"` down to the smallest interactive piece (one button, one form), instead of
  marking a whole section.
- **Server-vs-client values:** anything read from `localStorage` is unknown on the server, so
  the first client render must match the server. That is why `useLocalFlag(key, serverDefault)`
  takes a server value. Getting this wrong produces hydration warnings and layout shift.

---

## Known Issues and Tradeoffs

- Auth and cart data live in `localStorage` only. There is no backend, session or server-side validation.
- **Newsletter box:** the subscribe handler still has a `TODO` where the API call should go. The
  box is hidden using a `localStorage` flag, so it comes back if the user clears storage or
  switches device. The box overlaps the footer using a two-color background (not negative
  margins), so it does not depend on footer padding.
- **Navbar search** opens and closes but does not navigate to a results page yet.
- Footer social links point to `#` and need real URLs.
- Hydration and layout shift: I fixed the issues I was shown (skeletons, the newsletter box,
  the double `<html>`), but I have not audited every page.
- Route folder names are inconsistent (`Category`, `Product`, `Signup` vs `cart`, `checkout`,
  `login`). I would use lowercase everywhere next time. Changing them now means updating every link.
- Some RTL edge cases (icon mirroring, carousel arrows) were fixed reactively, not systematically.
- No automated tests.

---

## SEO Checklist

- [x] `generateMetadata` with localized `<title>` / `<description>` (Home)
- [x] `<html lang>` and `dir="rtl"` set per locale in `app/[locale]/layout.tsx`
- [x] `metadataBase` set from `NEXT_PUBLIC_SITE_URL`
- [x] `hreflang` alternates (`en` / `ar` / `x-default`)
- [x] Canonical URLs (Home)
- [x] Open Graph + Twitter cards, localized (Home)
- [x] JSON-LD `Organization` + `WebSite` (Home)
- [x] Single `<h1>` per page, `<h2>` for sections, descriptive image `alt` text
- [ ] Same `generateMetadata` pattern for Category and Product pages
- [ ] JSON-LD `Product` with `offers` (Product page)
- [ ] JSON-LD `BreadcrumbList` (Category / Product pages)
- [ ] `app/sitemap.ts` covering EN + AR routes
- [ ] `app/robots.ts`
- [ ] `public/images/og-image.jpg` (1200x630) and `public/images/logo.png` added
- [ ] Lighthouse SEO >= 90 (Desktop + Mobile, both languages), pending final audit

Translation keys for the Home metadata live under `HomeMeta` in
`lib/i18n/messages/{en,ar}.json`. The `siteName` value is still the placeholder
"Your Store Name" and needs the real brand name.

---

## Lighthouse Screenshots

_Add screenshots after running Lighthouse for `/en` and `/ar`, on Desktop and Mobile:_

```
docs/
  lighthouse-en-desktop.png
  lighthouse-en-mobile.png
  lighthouse-ar-desktop.png
  lighthouse-ar-mobile.png
```

---

## Multi-language Notes

- Default locale: **English** (`en`). **Arabic** (`ar`) is fully RTL.
- Language preference persists via cookie, read in `proxy.ts`, so a returning visitor lands on
  their last-used language.
- UI strings, validation messages and error text are translated. See `lib/i18n/messages/{en,ar}.json`.
- Navbar and Footer links are built as `/${locale}/...`, so switching language keeps the route.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | All products |
| GET | `/api/products/[id]` | Single product by id |
| GET | `/api/categories` | Distinct category list |

---

## What I Will Do Differently Next Project

1. Decide the i18n library and the folder structure **before** writing components.
2. Keep pages and layouts as Server Components, and add `"use client"` only to small interactive leaves.
3. Put `<html>` and `<body>` in exactly one layout from the start.
4. Use lowercase route names and one naming convention for files.
5. Avoid hard-coded pixel math between components (for example negative margins that depend
   on another component's padding). Use layouts that adapt on their own.
6. Add `sitemap`, `robots` and metadata to every page as I create it, not at the end.
7. Write the README as I go instead of at the end.

---

## Bonus / Not Yet Implemented

- [ ] Unit tests
- [ ] Theme toggle (dark mode)
- [ ] Instant/debounced search
- [ ] Dynamic OG images
- [ ] Deployed preview (Vercel)

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl.dev)
- [Learn Next.js](https://nextjs.org/learn)
- [Deploy on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
