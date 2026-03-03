# Covmerc Web

A modern web experience for Covmerc that mirrors the core flows of the mobile app (customer, vendor, and admin) using **Next.js**, **TypeScript**, **Tailwind CSS**, and the **Firebase Web SDK**.

## Tech stack

- **Framework**: Next.js (App Router, TypeScript)
- **UI**: Tailwind CSS, custom Covmerc theme (colors aligned with the Flutter app)
- **Auth & Data**: Firebase Web SDK (Auth, Firestore, Storage-ready)

## Project structure

- `app/` – App Router pages
  - `page.tsx` – marketing/landing page
  - `auth/login` – Firebase email/password sign-in
  - `auth/register` – Firebase email/password sign-up
  - `dashboard/customer` – customer dashboard shell
  - `dashboard/vendor` – vendor dashboard shell
  - `dashboard/admin` – admin dashboard shell
- `components/` – layout components (top nav, footer, etc.)
- `lib/firebase.ts` – Firebase initialization and shared helpers
- `styles/globals.css` – global styles + Tailwind entrypoint

## Firebase configuration

The web app is designed to connect to the **same Firebase project** as your existing Covmerc Flutter app.

Create a `.env.local` file in `covmerc_web/` with your Firebase web config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

These values should match the Firebase project already used by the mobile app so auth and data stay in sync across devices.

## Scripts

From the `covmerc_web` folder:

```bash
npm install
npm run dev   # start development server
npm run build # production build
npm start     # start production server (after build)
```

## Next steps / wiring to real data

The current implementation focuses on:

- A **modern, responsive UI** that reflects the Covmerc mobile experience.
- **Firebase Auth** integration (email/password, with Google helper ready to use).
- Cleanly separated **customer**, **vendor**, and **admin** dashboard shells.

To fully match the mobile app:

- Map dashboard views to your existing Firestore collections (products, orders, businesses, chats, etc.).
- Implement role/permission checks (e.g. via custom claims or role documents).
- Mirror mobile navigation flows (e.g. orders tab, support center, business review) using the provided dashboard pages as entry points.

