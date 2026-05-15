# Covmerc Web (Next.js + Firebase)

Responsive web frontend for an existing production Firebase project already used by Flutter mobile clients.

## Why Next.js (App Router) as the preferred stack

For this project, **Next.js App Router** is the better default than Vite because:

- You get SEO-friendly server-rendered landing pages out of the box.
- Route-level layouts make it clean to enforce a protected admin shell.
- It keeps marketing content and dashboard in one codebase without extra routing setup.

Vite is excellent for dashboard-only apps, but this project explicitly needs both a public marketing page and secure admin tools.

---

## Implemented architecture

### 1) Public landing page

- Route: `/`
- Sections: Hero (with app store CTAs), Features, How it Works, Contact/Support form
- SEO: server-rendered content + route metadata
- Performance: lightweight components and static-first content

### 2) Protected admin dashboard

- Root: `/dashboard/admin`
- Guarded layout verifies:
  1. Firebase Auth session exists
  2. Admin role via one of:
     - custom claim (`admin === true`, `role === "admin"`, or `roles` includes `"admin"`)
     - `admins/{uid}` document exists
     - `users/{uid}` has `role: "admin"` or `roles[]` includes `"admin"`
- Overview panel fetches Firestore collection counts
- Data manager supports paginated/filterable tables and safe CRUD patterns

### 3) Shared Firebase safety controls

- Firebase wiring isolated in `lib/firebase.ts` and admin helpers in `lib/admin-firestore.ts`
- Managed collection config in `lib/admin-collections.ts`
- Shared mobile collections default to **read-only**
- Writable collections only allow **field allowlists**
- Archive operation is used instead of hard delete

---

## Step-by-step setup

1. Install dependencies

```bash
npm install
```

2. Configure Firebase web env values in `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Align admin-managed collections to your real schema:

- Edit `lib/admin-collections.ts`
- Keep critical/shared collections read-only until model parity is validated
- Restrict `editableFields` to safe scalar fields

4. Start dev server

```bash
npm run dev
```

5. Test the key routes:

- `/` landing page
- `/auth/login`
- `/dashboard/admin` (should redirect or deny non-admins)
- `/dashboard/admin/data`

---

## Folder structure (current)

```txt
app/
  layout.tsx
  page.tsx                          # Landing page (SEO + support form)
  auth/login/page.tsx               # Firebase sign-in + admin-aware routing
  dashboard/admin/
    layout.tsx                      # Protected admin shell/guard
    page.tsx                        # Overview metrics
    data/page.tsx                   # Collection chooser
    data/[collectionId]/page.tsx    # Paginated/filterable table + safe updates

components/
  layout/TopNav.tsx
  layout/Footer.tsx
  landing/SupportForm.tsx
  dashboard/AdminShell.tsx
  ui/ThemeToggle.tsx

hooks/
  use-admin-session.ts
  use-theme-mode.ts

lib/
  firebase.ts                       # Firebase app/auth/db/storage init
  admin-firestore.ts                # Role checks, metrics, safe CRUD helpers
  admin-collections.ts              # Collection safety config
```

---

## Firebase initialization script (service layer)

`lib/firebase.ts` centralizes the project connection and exposes:

- `getFirebase()` -> `{ app, auth, db, storage }`
- Google provider helpers
- Runtime checks for missing env variables in development

This keeps Firebase initialization modular and reusable across landing/admin/auth features.

---

## Security Rules reminders (important)

Because this web app shares data with mobile clients, rules must protect existing collections while permitting admin workflows.

### Firestore example pattern

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function hasAdminClaim() {
      return isSignedIn() &&
        (request.auth.token.admin == true ||
         request.auth.token.role == "admin" ||
         (request.auth.token.roles is list &&
          request.auth.token.roles.hasAny(["admin"])));
    }

    function isAdminDoc(uid) {
      return exists(/databases/$(database)/documents/admins/$(uid));
    }

    function isAdmin() {
      return hasAdminClaim() || isAdminDoc(request.auth.uid);
    }

    match /webSupportLeads/{docId} {
      allow create: if true;      // optional public support form
      allow read, update, delete: if isAdmin();
    }

    match /supportTickets/{docId} {
      allow read, update, create: if isAdmin();
    }

    // Shared critical collections (example):
    match /users/{uid} {
      allow read: if isSignedIn();
      allow update: if request.auth.uid == uid || isAdmin();
    }

    match /orders/{orderId} {
      allow read: if isSignedIn();
      // Keep strict field validation if admin can update these docs.
      allow update: if isAdmin();
    }
  }
}
```

### Storage rules reminder

- Keep uploads scoped by auth and path ownership where possible.
- If admin panel uploads to shared storage paths, enforce admin checks for those prefixes.

---

## Notes for production hardening

- Add server-side admin token verification for sensitive operations (Cloud Functions / API routes) when needed.
- For truly critical writes, move mutation logic behind callable functions with schema validation.
- Keep read-only defaults for mobile-shared collections until each write path has explicit parser-compatibility tests.

