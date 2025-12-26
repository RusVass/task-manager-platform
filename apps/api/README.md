# Task Manager API (Express + MongoDB)

REST API для таск-менеджера: Express 4, MongoDB/Mongoose, JWT. Сутності `User` (role: `user` | `admin`, `blocked`) та `Task` (title, description, dueDate, completed, createBy). Swagger UI доступний для тестування.

![Swagger](../web/public/demo.svg)

## Стек
- Node.js 20, Express 4
- MongoDB + Mongoose 8
- JWT (`Authorization: Bearer <token>`)
- bcrypt для хешування паролів
- swagger-jsdoc + swagger-ui-express

## Швидкий старт
```bash
cd apps/api
npm install
```

Створіть `.env`:
```
MONGODB_URI=mongodb://localhost:27017/task-manager
PORT=3001
JWT_SECRET=super-secret
ADMIN_EMAIL=admin@example.com   # опційно: робить цей email адміном
```

Запуск у дев:
```bash
npm run dev   # http://localhost:3001
# Swagger UI: http://localhost:3001/api/docs
```

## Docker
- Локально з репозиторію:
  ```bash
  docker compose up --build
  ```
  Підніме Mongo + API (порти 27017, 3001).
- Окремі команди з каталогу `apps/api`:
  ```bash
  npm run docker:build
  npm run docker:up
  npm run docker:down
  npm run docker:logs
  ```

## Структура
```
apps/api/
├─ config/         # db, swagger
├─ controllers/    # auth, task, user
├─ middlewares/    # checkAuth, role guards
├─ models/         # Mongoose схеми User, Task
├─ routes/         # authRoutes, taskRoutes, userRoutes
├─ server.js       # вхідна точка Express
└─ Dockerfile
```

## Маршрути (JWT Bearer)
- Auth:
  - `POST /api/auth/register` — `{ username, email, password }`; перший користувач або `ADMIN_EMAIL` стає `admin`.
  - `POST /api/auth/login` — `{ email, password }` → `{ token, user }`.
  - `GET /api/auth/profile` — поточний користувач (без пароля).
- Tasks:
  - `GET /api/tasks/my` — задачі поточного користувача.
  - `POST /api/tasks` — `{ title?, description?, dueDate? }` (потрібно хоча б title/description).
  - `GET /api/tasks/:id` — задача власника.
  - `PUT /api/tasks/:id` — оновити опис/статус (лише власник).
  - `DELETE /api/tasks/:id` — видалити (лише власник).
  - `GET /api/tasks` — всі задачі, тільки `admin`.
- Users (admin):
  - `GET /api/users` — всі користувачі без паролів.
  - `PATCH /api/users/:id/block` — `{ blocked: boolean }`; не можна блокувати себе чи іншого адміна.

## Безпека та поведінка
- JWT перевіряється в `checkAuth`; блокує, якщо користувач заблокований або токен протермінований.
- `requireRole('admin')` обмежує адмін-маршрути.
- Паролі хешуються bcrypt із salt 10.

## Корисні скрипти
- `npm run dev` — nodemon сервер.
- `npm run lint:check` / `npm run lint:fix`
- `npm run format:check` / `npm run format:write`
- Docker: `npm run docker:build`, `npm run docker:up`, `npm run docker:down`, `npm run docker:logs`, `npm run docker:ps`

## Обмеження
- Немає інтеграційних/юніт-тестів.
- Валідація вводу мінімальна; для продакшн додайте rate limiting, розширені схеми, логування аудиту.

