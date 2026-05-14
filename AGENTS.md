# Fianar Smart City — AGENTS.md

## Architecture

- **Single Express 5 server** (`backend/index.js`, port 5000) — not two servers anymore.
- `.env` lives in `backend/`. Required vars: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`. A `.env.example` is provided.
- DB config: `src/config/db.js` → `MONGO_URI`. The old `config/db.js` (`MONGODB_URI`) has been **removed**.
- Frontend at `frontend/` — Vite + React 19 + Tailwind CSS v4 + react-router-dom + Leaflet.
- Frontend talks to backend at `localhost:5050` (port defined in `frontend/src/services/api.js` as `API_BASE`). All raw `fetch()` calls use `API_BASE` import.
- `frontend/src/hooks/useAuth.js` — centralized JWT hook: parses token, exposes `user`, `isAuthenticated`, `isAdmin`, `login()`, `logout()`.
- `frontend/src/components/ProtectedRoute.jsx` — route guard, wraps admin/citizen routes, redirects unauthenticated users to `/login`.

## Dev commands

| What | Where | Command |
|---|---|---|
| Backend (single server, port 5000) | `backend/` | `nodemon index.js` |
| Frontend (port 5173) | `frontend/` | `npm run dev` |
| Build frontend | `frontend/` | `npm run build` |
| Seed bus data | `backend/` | `npm run seed` |

`dev` script now points to `index.js` (was `src/index.js` — fixed). No tests, no CI.

## API endpoints

| Prefix | Source | Auth |
|---|---|---|
| `/api/users` | `src/routes/user.route.js` | Public: register/login. Admin: CRUD |
| `/api/historic-places` | `src/routes/historicPlace.route.js` | GET public, POST/PUT/DELETE admin |
| `/api/buses` | `src/routes/bus.route.js` | GET public, POST/PUT/DELETE admin |
| `/api/stops` | `src/routes/stop.route.js` | GET public, POST/PUT/DELETE admin |
| `/api/reservations` | `src/routes/reservations.js` | All public |
| `/api/responsibles` | `src/routes/responsibles.js` | All public |
| `/api/notifications` | `src/routes/notificationRoutes.js` | All public |
| `/uploads` | Static files | Public |

## Known bugs / traps (fixed)

- ✅ Stop.js duplicate schema — **fixed** (now one schema, `required: true` on coordinates).
- ✅ seedData.js — **fixed** (ESM imports, `forwardStops`/`forwardTimes` fields).
- ✅ `.env` now includes `JWT_SECRET` and `GEMINI_API_KEY` (with placeholder values).
- ✅ Dead code removed: `backend/routes/`, `backend/config/db.js`, `backend/server.js`.
- ✅ Ticket status enum now includes `"waiting"` and `"processing"`.
- ⚠️  Bus routes are mounted under `/api/buses` (not `/api/bus`).
- ⚠️  The 60s auto-mark-absent interval calls itself via HTTP (`localhost:5000`).
- ⚠️  No `Reservation` model exists — `routes/statistics.js` was dead code and has been removed.

## Key dependencies (non-obvious details)

- **Tailwind CSS v4** — `@import "tailwindcss"` (not `@tailwind`), custom theme via `@theme` in `frontend/src/index.css`.
- **Gemini AI** (`@google/generative-ai`) — model `gemini-1.5-flash`, used for incident classification, place descriptions, semantic search.
- **Multer** — image uploads in `backend/uploads/`, served statically via `express.static`.
- **Mongoose** — `2dsphere` index on HistoricPlace for `$near` geospatial queries.
- **Express 5** (`^5.2.1`) — route param patterns, middleware error handling differ from Express 4.
- **Frontend ESLint** — flat config at `frontend/eslint.config.js`, no npm script to run it.

## Routing (frontend)

`App.jsx` uses `react-router-dom` (`BrowserRouter`, `Routes`, `Route`).

- **`/`** → `HomePage` (standalone, outside `Layout`) — public landing page with own navbar/hero/modules/benefits/footer. Redirects authenticated users (admin → `/admin`, citizen → `/citizen`).
- **`<Layout />`** wraps all internal pages: provides site chrome (nav with user menu, footer) via `<Outlet />`.
  - **`/citizen`** → `CitizenDashboard` — logged-in citizen's hub with quick-access module cards.
  - **`/ticket`** → `CitoyenPage` — ticket reservation wizard.
  - **`/my-tickets`** → `MyTicketsPage` — user's ticket history.
  - **`/queue`** → `QueuePage` — real-time queue status.
  - **`/admin/*`** → `AdminPage` (ProtectedRoute with requireAdmin).
  - **`/login`** → `Login`
  - **`/register`** → `Register`
  - **`/places`** → `HistoricHome`
  - **`/admin/places`** → `HistoricAdmin` (ProtectedRoute with requireAdmin)
  - **`/bus`** → `ClientBusPanel`
  - **`/admin/bus`** → `AdminBusPanel` (ProtectedRoute with requireAdmin)

## Auth

JWT in `Authorization: Bearer <token>`, stored in `localStorage`. Roles: `citizen`, `admin`.

- `useAuth` hook (`hooks/useAuth.js`) reads token from localStorage and parses the JWT payload. It syncs across tabs via `storage` event.
- After login: admin → `/admin`, citizen → `/citizen`.
- Landing page (`/`) checks auth on mount and redirects accordingly.
- Navbar in `Layout` shows user avatar/name/logout when authenticated; login/register buttons when not. "Accueil" nav item dynamically points to `/citizen` or `/admin` for authenticated users.

## File uploads

Historic places: `upload.array("photos")` via multer. Frontend sends `multipart/form-data`. Location field must be JSON-stringified.
