# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Covmerc Web is a Next.js 15 (App Router) e-commerce marketplace for furniture/home goods (Nigerian market). It uses Firebase as its BaaS (Auth, Firestore, Storage) with no local emulators — all data services are cloud-hosted.

### Environment

A `.env.local` with CI placeholder values is sufficient for building, running the dev server, and executing E2E tests. The app gracefully handles missing/invalid Firebase credentials for local development — pages render and navigation works, but real auth and data operations require valid Firebase project credentials.

### Key commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Build | `npm run build` |
| E2E tests | `PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test` |
| E2E tests (with auto-build) | `npm run test:e2e` |

### Non-obvious notes

- **No lockfile**: The repo uses `npm` without a committed lockfile. `npm install` resolves latest compatible versions each time.
- **E2E tests work with placeholders**: The Playwright config in `playwright.config.ts` falls back to `ci-placeholder` values for all Firebase env vars, so tests pass without real credentials.
- **PLAYWRIGHT_SKIP_WEBSERVER**: When the dev server is already running, set `PLAYWRIGHT_SKIP_WEBSERVER=1` and `PLAYWRIGHT_BASE_URL=http://localhost:3000` to skip the build+start cycle that Playwright otherwise triggers.
- **ESLint v9 with legacy config**: The project uses `.eslintrc.json` (not flat config) via `eslint-config-next`. The `next lint` command works but emits a deprecation warning about Next.js 16.
- **No Docker or local emulators**: All persistence is Firebase cloud. There is no `docker-compose.yml` or emulator setup.
- **Node.js 20+**: The project targets Node 20+ (22 works fine). No `.nvmrc` is committed.
