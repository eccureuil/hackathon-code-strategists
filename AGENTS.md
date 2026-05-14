# AGENTS.md

## State
Dernier commit `b5e80a2`. Projet Smart City — gestion de lignes de bus. Stack : Express + Mongoose (backend), React + Vite + Tailwind v4 (frontend).

## Problèmes connus

- **`backend/index.js` n'importait que `userRoutes`** — bus/stop routes non montées sur l'app Express. Corrigé.
- **Frontend** `baseURL: "http://localhost:5050/api"` mais backend écoute sur `PORT=5000` (fallback) — mismatch.
- **Backend `.env`** : créer `backend/.env` avec `MONGO_URI`, `JWT_SECRET`, `PORT=5000`.
- **`backend/src/controllers/user.controller.js`** a `getProfile` mais les handlers utilisent des formats de réponse inconsistants (`res.json(user)` sans wrapper pour getUsers/getUser, `{ success: true, data }` ailleurs).
- **Login/Register pages** (`frontend/src/pages/`) sont mortes — `App.jsx` n'a pas de router, `login.jsx` appelle le mauvais endpoint (`/auth/login` au lieu de `/users/login`).

## Commandes

**Backend**
- `npm run dev` — nodemon
- `node src/utils/seedData.js` — seed (depuis `backend/`)

**Frontend**
- `npm run dev` — Vite
- `npm run build`
- `npm run lint`

## Architecture

```
backend/
  index.js ← userRoutes seulement monté (bus/stop non branchés)
  src/
    routes/ → controllers/ → services/
    models/ ← Mongoose schémas
    middleware/auth.middleware.js ← JWT
    utils/seedData.js

frontend/
  src/
    main.jsx → App.jsx (role toggle admin/client)
    components/Bus/AdminBusPanel.jsx (gère arrêts + lignes)
    services/api.js ← axios, JWT interceptor
    pages/login.jsx, register.jsx ← dead code
```
