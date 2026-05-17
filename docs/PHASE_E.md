# Phase E — Post-launch enhancements (E1–E6)

Phases **A–D** are complete on `dev` (Firebase commerce, Paystack, marketplace, policies, analytics).  
This branch (`phase-e`) tracks **Phase E** work: items intentionally deferred from A–D.

## Branch workflow

| Branch    | Purpose                                      |
|-----------|----------------------------------------------|
| `dev`     | Integration / staging (default)              |
| `main`    | Production                                   |
| `phase-e` | Phase E features (E1 → E6); PRs target `dev` |

Recommended: one PR per milestone (E1, E2, …) or one PR when a milestone group is done.

---

## E1 — Brand & SEO assets

**Goal:** Real brand presence and shareable link previews.

**Tasks**

- [x] Generated OG via `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/shop/opengraph-image.tsx`
- [x] Default `openGraph.images` / `twitter.images` in `lib/site-metadata.ts`
- [x] Absolute URLs for product OG via `resolveOgImageUrl()`
- [ ] Replace critical Unsplash placeholders in seed data and hero sections (optional)

**Effort:** ~0.5–1 day · **No backend**

---

## E2 — Product image upload (Firebase Storage)

**Goal:** Vendors and admins upload images instead of pasting URLs only.

**Tasks**

- [x] `storage.rules` — `products/{ownerId}/**` (deploy with `firebase deploy --only storage`)
- [x] `lib/storage-upload.ts` + `components/product/ProductImageUpload.tsx`
- [x] Vendor `app/vendor/products/new` and admin `app/admin/products` forms
- [x] Persist `imageUrl` + `imageUrls[]` in Firestore (Flutter-aligned shape)
- [ ] Optional: `POST /api/upload/product-image` with Admin SDK for stricter control

**Effort:** ~2–3 days

**Key files:** `lib/firebase.ts`, `lib/store-firestore.ts`, vendor/admin product forms

---

## E3 — Firestore blog + slug URLs

**Goal:** Blog content in Firestore (shared ops with mobile/admin), not `localStorage`.

**Tasks**

- [x] Collection `blogPosts`: `title`, `excerpt`, `content`, `coverImage`, `category`, `author`, `publishedAt`, `slug`, `status`
- [x] `subscribeToBlogPosts()` + `createBlogPostInFirestore()` in `lib/store-firestore.ts`
- [x] `FurniStoreProvider` uses Firestore (seed fallback when empty)
- [x] `app/blog/[slug]/page.tsx` + `layout.tsx` metadata; legacy id URLs match by id or slug
- [x] Admin: `/admin/content` + data manager `blogPosts`

**Effort:** ~2–3 days

---

## E4 — Advanced shop filters

**Goal:** Easier discovery on a growing catalog.

**Tasks**

- [x] Price range (client-side; `min` / `max` URL params)
- [x] “In stock only” toggle (`inStock=1`)
- [x] Material / finish from `product.specs`
- [x] URL sync: `?category=&min=&max=&inStock=1&material=&finish=&q=&sort=`
- [x] `app/shop/page.tsx` sidebar + mobile filter panel

**Effort:** ~1 day (filters only)

---

## E5 — E2E tests (Playwright)

**Goal:** CI smoke tests for critical revenue paths.

**Tasks**

- [x] Playwright in `e2e/` + `playwright.config.ts` (`npm run test:e2e`)
- [x] Commerce: shop → cart → checkout payment step (Pay on Delivery)
- [x] Auth redirect + contact form smoke tests
- [x] CI job `e2e` in `.github/workflows/ci.yml` (uses `ci-placeholder` + seed fallback)

**Effort:** ~2–3 days

---

## E6 — Wishlist (optional)

**Goal:** Save products while signed in.

**Tasks**

- [x] Firestore `wishlists/{userId}/items/{productId}` + `firestore.rules`
- [x] `WishlistButton` on `ProductCard` and product page; `/account/wishlist`
- [x] Add to cart from wishlist via `ProductCard`

**Effort:** ~2 days

---

## Out of repo (process)

| Item              | Notes                                                |
|-------------------|------------------------------------------------------|
| Branch protection | GitHub Team for required reviews on private repos   |
| Paystack / Resend | Production keys + webhook URL in dashboard          |
| CD deploy         | `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID`   |

---

## Suggested implementation order

1. **E1** — quick SEO/trust win  
2. **E2** — unblock real vendor listings  
3. **E3** — content on Firestore  
4. **E4** — shop UX  
5. **E5** — regression safety  
6. **E6** — engagement (optional)

---

## References (Phases A–D, merged)

- Firebase storefront: `FurniStoreProvider`, `lib/store-firestore.ts`
- Marketplace: `lib/store-marketplace.ts`, `/vendor`, `/account`
- Paystack: `app/api/paystack/*`
- Policies: `/shipping`, `/returns`
- Analytics: `lib/analytics.ts` (`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`)
