# Boards — Full-Stack Project Management App

A Trello-inspired project management tool built as a **learning project** to practice building full-stack web applications with modern JavaScript frameworks from scratch.

> This project is not intended for production use. Every part of it — auth, drag-and-drop, state management, REST API, database schema — was built intentionally to understand *how* these things work, not just that they work.

---

## Screenshots

**Board dashboard — light mode**
![Board dashboard showing four boards in a grid layout](screenshots/Screenshot%202026-06-16%20193243.png)

**Board detail — dark mode**
![Board detail view showing lists and cards with drag-and-drop](screenshots/Screenshot%202026-06-16%20193710.png)

---

## What It Does

Users can sign up, create boards, organize work into lists and cards, and drag items around to reflect progress. It behaves like a lightweight Kanban tool.

**Features built:**
- User registration and login with JWT authentication
- Personal dashboard showing all boards with live search
- Per-board view with lists (columns) and cards
- Drag-and-drop to move cards between lists and reorder lists
- Inline editing and deletion for boards, lists, and cards
- Card search and filter within a board
- Light and dark theme toggle
- Persistent data — everything survives page refresh and server restart

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Vue 3 (`<script setup>`) | Component framework — Composition API throughout |
| TypeScript | Type safety across all components, stores, and API calls |
| Pinia | Global state management (boards, lists, cards, auth) |
| Vue Router | Client-side routing with navigation guards |
| Vite | Dev server and build tool |

### Backend
| Tool | Purpose |
|---|---|
| NestJS | Server framework — modules, controllers, services, guards |
| Prisma ORM | Database access layer with a typed client |
| SQLite (`better-sqlite3`) | Local relational database |
| Passport.js + JWT | Authentication strategy |
| bcrypt | Password hashing |
| class-validator | Request body validation via DTOs |

---

## Concepts Explored

This project was built specifically to get hands-on with:

**Vue 3 & Pinia**
- Composition API with `<script setup lang="ts">` and `defineProps` / `defineEmits`
- Reactive state with `ref`, `computed`, and `watch`
- Pinia stores as the single source of truth — actions call the API, then update local state
- Vue Router navigation guards for protecting authenticated routes

**NestJS**
- Module system and dependency injection
- Separating concerns: controllers handle HTTP, services handle logic
- Custom JWT guard applied at the route level
- DTO validation with decorators (`@IsString`, `@IsEmail`, etc.)

**Prisma**
- Schema-first database modeling
- Migrations to evolve the schema safely
- Typed queries — no raw SQL, no runtime surprises
- Seeding a database with realistic demo data

**Authentication**
- Stateless JWT flow: register → receive token → send token on every request
- Bcrypt hashing — passwords are never stored in plaintext
- Auth state persisted in `localStorage` and restored on page load

**Drag and Drop**
- Native HTML5 Drag-and-Drop API (`draggable`, `dragstart`, `dragover`, `drop`)
- Passing data between elements via `dataTransfer`
- Distinguishing card drops from list drops using different data keys
- Preventing event propagation so nested draggables don't interfere

---

## Project Structure

```
├── frontend/          Vue 3 client
│   └── src/
│       ├── api/       Typed fetch wrappers for each endpoint
│       ├── components/
│       ├── models/    TypeScript interfaces (Board, List, Card, User)
│       ├── pages/
│       ├── router/
│       └── stores/    Pinia stores (auth, project)
│
└── backend/           NestJS API server
    ├── prisma/
    │   └── schema.prisma
    └── src/
        ├── auth/
        ├── boards/
        ├── cards/
        ├── lists/
        └── users/
```

---

## Running Locally

**Prerequisites:** Node.js 20+

```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install
cd .. && npm install
```

```bash
# Run frontend and backend together
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

**Seed the demo account:**

```bash
cd backend
npm run build && node dist/prisma/demo-seed.js
```

```
Email    : aliaa@boards.demo
Password : Demo@Boards#9Kx!
```

The demo account comes with four pre-loaded boards (Product Roadmap, Marketing Sprint, Bug Tracker, Personal) with realistic lists and cards to explore.

**Database commands:**

```bash
npm run db:migrate   # apply schema migrations
npm run db:studio    # open Prisma Studio (visual DB browser)
```
