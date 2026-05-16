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

- [ ] Add `public/og/og-default.jpg` (1200×630) and optional route-specific images
- [ ] Wire `openGraph.images` / `twitter.images` in `lib/site-metadata.ts`
- [ ] Replace critical Unsplash placeholders in seed data and hero sections
- [ ] Verify product pages still use dynamic OG from `app/product/[id]/layout.tsx`

**Effort:** ~0.5–1 day · **No backend**

---

## E2 — Product image upload (Firebase Storage)

**Goal:** Vendors and admins upload images instead of pasting URLs only.

**Tasks**

- [ ] Storage rules: `products/{userId}/**` write for `request.auth.uid == userId`
- [ ] `lib/storage-upload.ts` — `uploadProductImage(file, { vendorId, productId })` → `downloadURL`
- [ ] UI: file input + preview on `app/vendor/products/new` and `app/admin/products`
- [ ] Persist `imageUrl` + `imageUrls[]` in Firestore (Flutter-aligned shape)
- [ ] Optional: `POST /api/upload/product-image` with Admin SDK for stricter control

**Effort:** ~2–3 days

**Key files:** `lib/firebase.ts`, `lib/store-firestore.ts`, vendor/admin product forms

---

## E3 — Firestore blog + slug URLs

**Goal:** Blog content in Firestore (shared ops with mobile/admin), not `localStorage`.

**Tasks**

- [ ] Collection `blogPosts`: `title`, `excerpt`, `content`, `coverImage`, `category`, `author`, `publishedAt`, `slug`, `status`
- [ ] `subscribeToBlogPosts()` in `lib/store-firestore.ts`
- [ ] Replace `FurniStoreProvider` blog `localStorage` with Firestore subscription
- [ ] Route `app/blog/[slug]/page.tsx` + `generateMetadata`; redirect `/blog/[id]` if needed
- [ ] Admin authoring in `/admin/content` or Firestore data manager

**Effort:** ~2–3 days

---

## E4 — Advanced shop filters

**Goal:** Easier discovery on a growing catalog.

**Tasks**

- [ ] Price range (client-side first; Firestore range queries + indexes later)
- [ ] “In stock only” toggle
- [ ] Optional: material/finish from `product.specs`
- [ ] Sync filters to URL: `?category=&min=&max=&inStock=1`
- [ ] Update `app/shop/page.tsx` filter UI (sidebar + mobile)

**Effort:** ~1 day (filters only)

---

## E5 — E2E tests (Playwright)

**Goal:** CI smoke tests for critical revenue paths.

**Tasks**

- [ ] Add Playwright; tests under `e2e/`
- [ ] Flows: shop → product → cart → checkout (Pay on Delivery or mocked Paystack)
- [ ] Flows: login → account orders; contact form
- [ ] CI job in `.github/workflows/ci.yml` (test Firebase project or emulators)

**Effort:** ~2–3 days

---

## E6 — Wishlist (optional)

**Goal:** Save products while signed in.

**Tasks**

- [ ] Firestore: `wishlists/{userId}/items` or `users/{uid}.wishlistProductIds`
- [ ] Heart on `ProductCard`; `/account/wishlist`
- [ ] “Add to cart” from wishlist via existing `addToCart`

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
