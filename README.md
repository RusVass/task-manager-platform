# ✅ Task Manager (API + Web)
Full-stack task management platform: Express + MongoDB REST API and Next.js (App Router) frontend with admin/user roles, JWT, tasks list, and admin panel.

![Demo](./apps/web/public/demo.svg)

## Stack
- Backend: Node.js, Express, MongoDB + Mongoose, JWT, Swagger UI, Nodemon
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Server Actions + Next.js API routes; JWT зберігається в httpOnly cookie, видається через API route handlers.

## Repository structure
```
.
├─ apps/
│  ├─ api/           # Express API (controllers, routes, config)
│  └─ web/           # Next.js App Router frontend
├─ docker-compose.yml # API + MongoDB
```

## Quick start (local)
### Backend (API)
1) Install deps  
`cd apps/api && npm install`

2) Create `apps/api/.env`:
```
MONGODB_URI=mongodb://localhost:27017/task-manager
PORT=3001
JWT_SECRET=super-secret
```

3) Run dev server  
`npm run dev`  
API: `http://localhost:3001`, Swagger: `http://localhost:3001/api/docs`.

### Frontend (Next.js)
1) Go to client  
`cd apps/web && npm install`

2) Create `apps/web/.env.local`:
```
BACKEND_URL=http://localhost:3001
APP_BASE_URL=http://localhost:3000
COOKIE_NAME=tm_token
```

3) Start UI  
`npm run dev`  
UI: `http://localhost:3000`

## Features
- Registration/login with JWT, токен у HTTP-only cookie (Next.js API routes/Server Actions).
- Roles: `user` (own tasks) and `admin` (all tasks + user management).
- Tasks CRUD: create, list, update status/description, delete.
- Admin panel: users list, block/unblock, view all tasks.
- Swagger UI for API testing.

## Key endpoints (JWT Bearer)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/profile`
- Tasks: `GET /api/tasks/my`, `GET /api/tasks` (admin), `POST /api/tasks`, `GET/PUT/DELETE /api/tasks/:id`
- Users (admin): `GET /api/users`, `PATCH /api/users/:id/block`

## Docker (API + MongoDB)
- One command: `docker compose up --build` (uses `apps/api/Dockerfile`, seeds MongoDB via env)
- Stop: `docker compose down` (volumes persist `mongo-data`)
- Needs `apps/api/.env` or env vars for `MONGODB_URI`, `PORT`, `JWT_SECRET`.

## Useful scripts
- Backend (inside `apps/api`): `npm run dev`, `npm run lint:check`, `npm run lint:fix`, `npm run format:check`, `npm run format:write`
- Frontend (inside `apps/web`): `npm run dev`, `npm run lint`, `npm run check`, `npm run build`