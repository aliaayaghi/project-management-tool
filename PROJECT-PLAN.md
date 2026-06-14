# Project Management Tool Learning Plan

This plan is designed to teach you Vue 3 + TypeScript on the frontend and NestJS + TypeScript on the backend. Each phase is separate so we can complete one phase, then start a new chat or a new session focused on that phase.

## Project Overview

### What we will build
- A project management app with:
  - `Boards`
  - `Lists` inside boards
  - `Cards` inside lists
  - draggable card movement between lists
  - board visibility: `private` and `shared`
  - user accounts and access control
- Frontend: Vue 3 + TypeScript
- Backend: NestJS + TypeScript
- Single repo (monorepo) with frontend and backend side-by-side

### How we learn
- Phase-by-phase implementation
- Explain concepts before building each feature
- Build small working increments
- Reinforce with examples, analogies, and hands-on code

---

## Phase 1: Setup + Architecture

### Goal
Create the repository structure and basic tooling so the app has a clean foundation.

### What to build
- Root repository with two folders: `/backend` and `/frontend`
- Create a new NestJS app in `/backend`
- Create a new Vue 3 app in `/frontend`
- Add TypeScript support to both
- Add shared scripts and README notes

### What you learn
- npm/yarn package management
- TypeScript project configuration
- NestJS app architecture: modules, controllers, providers
- Vue 3 app architecture: `main.ts`, components, Single File Components
- Monorepo structure and why one repo is easier for learning

### How we learn
- Start with CLI commands to scaffold apps
- Inspect generated files and explain each one
- Compare backend and frontend folder layouts
- Run each app separately to verify the setup

### Deliverables
- `/backend` NestJS app ready to start
- `/frontend` Vue app ready to start
- `PROJECT-PLAN.md` with phase definitions

---

## Phase 2: Backend Domain Modeling + API Design

### Goal
Design the data model for boards, lists, cards, and users, and expose CRUD APIs.

### What to build
- Define TypeScript interfaces/classes for:
  - `Board`
  - `List`
  - `Card`
  - `User`
- Build NestJS controllers and services for:
  - board CRUD
  - list CRUD
  - card CRUD
- Create API routes like:
  - `GET /boards`
  - `POST /boards`
  - `GET /boards/:boardId/lists`
  - `POST /boards/:boardId/lists`
  - `POST /boards/:boardId/lists/:listId/cards`
- Add DTOs and validation for request payloads

### What you learn
- NestJS controllers and routes
- Services and dependency injection
- DTOs, `class-validator`, and data validation
- REST design for nested resources
- TypeScript types for backend data models

### How we learn
- Explain each backend layer before implementing it
- Write a DTO and then use it in the controller
- Test APIs with Postman or curl
- Track how request data flows through NestJS

### Deliverables
- Fully functional backend API for boards/lists/cards
- Basic in-memory storage or simple persistence for Phase 2
- Example API calls documented in README

---

## Phase 3: Frontend UI + Component Design

### Goal
Build the first Vue UI screens so the app can display boards, lists, and cards.

### What to build
- Create Vue components for:
  - `BoardListView`
  - `BoardCard`
  - `ListColumn`
  - `CardItem`
  - `BoardDetailView`
- Build pages for:
  - board dashboard
  - board detail with list columns
- Add forms for creating boards, lists, and cards
- Show static or mock data first

### What you learn
- Vue Composition API: `setup()`, `ref()`, `reactive()`
- Component props and emits
- Single File Components structure (`<template>`, `<script setup>`, `<style>`)
- Event handling and form binding
- Building UI from domain models

### How we learn
- Build one component at a time and explain its inputs/outputs
- Connect components using props and emits
- Replace static mock data with reactive state
- Keep UI logic small and reusable

### Deliverables
- Working Vue UI for viewing boards and lists
- Components that render data correctly
- Basic create form UI for boards/lists/cards

---

## Phase 4: Frontend / Backend Integration

### Goal
Connect the Vue frontend to the NestJS backend API and make live data flow.

### What to build
- Use `fetch` or `axios` in Vue to call backend APIs
- Load board and list data from backend
- Create new boards, lists, and cards through the UI
- Delete and update items from the UI
- Show loading and error states

### What you learn
- HTTP requests from frontend to backend
- Promises, async/await, and error handling
- Mapping API responses into UI state
- Keeping frontend state synchronized with backend

### How we learn
- Build a small API client layer in Vue
- Explain the network request lifecycle
- Compare frontend state before and after integration
- Observe actual API responses in browser devtools

### Deliverables
- Full frontend/backend communication
- UI can create/read/update/delete board data
- Working local development flow for both apps

---

## Phase 5: Routing + State Management

### Goal
Add Vue Router and state management so the app supports multiple pages and shared data.

### What to build
- Add Vue Router with routes for:
  - board dashboard
  - board detail page
  - board settings or share page
- Add a simple store using Pinia or a scoped shared state pattern
- Share board and user state across multiple components

### What you learn
- Vue Router basics: routes, route params, navigation
- Page-based app structure
- State management patterns in Vue
- When to use a store vs local component state

### How we learn
- Configure router and inspect route objects
- Create route-aware components using `useRoute()` and `useRouter()`
- Build a small store and explain why it helps
- Update UI state from multiple pages

### Deliverables
- Multi-page Vue app with router navigation
- Shared state for boards and current user
- Clean separation between pages and components

---

## Phase 6: Authentication + Access Control

### Goal
Add user accounts, login/register flow, and board visibility rules.

### What to build
- Backend authentication endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
- Use JWT authentication in NestJS
- Protect board routes for private/shared access
- Frontend login/register pages
- Save auth state and include token in requests

### What you learn
- Authentication concepts: signup, login, sessions, JWT
- NestJS guards and Passport strategies
- Storing tokens safely on the frontend
- Protecting frontend routes
- Shared vs private board visibility

### How we learn
- Explain JWT structure and how it works
- Build auth endpoints first, then guard routes
- Step through login flow from UI to backend
- Demonstrate a protected API call failure vs success

### Deliverables
- Working auth system with login/register
- Protected backend data for private boards
- Shared board membership concept implemented

---

## Phase 7: Drag-and-Drop Card Movement

### Goal
Implement card movement between lists and teach how UI state maps to domain actions.

### What to build
- Add drag-and-drop support in Vue UI for cards
- Allow moving cards between lists like `To Do`, `In Progress`, `Done`
- Update backend when card position or list changes
- Show instant UI feedback during drag operations

### What you learn
- DOM drag-and-drop fundamentals
- Vue event handling for drag actions
- State updates based on UI interactions
- Synchronizing order changes with the backend

### How we learn
- Build a simple DnD flow with native browser events or a Vue helper
- Explain drag events and how they carry data
- Update card objects when list membership changes
- Persist the moved card’s new list in backend API

### Deliverables
- Working drag-and-drop movement in board view
- Backend update support for moved cards
- Smooth UI experience for list transitions

---

## Phase 8: Database Persistence + Production Readiness

### Goal
Add real database persistence and prepare the app for a developer-ready setup.

### What to build
- Add a database to backend: SQLite, PostgreSQL, or Prisma
- Persist users, boards, lists, cards, and memberships
- Add migrations or simple schema setup
- Add backend seeding or sample data
- Improve developer scripts for running both apps together

### What you learn
- ORM and database concepts
- Data relationships and schema design
- Persistence lifecycle from backend service to database
- How to run and troubleshoot migrations

### How we learn
- Define entities and relations in the ORM
- Run migrations and inspect the database
- Compare in-memory storage to real persistence
- Explain why persistence is essential for production apps

### Deliverables
- Database-backed backend implementation
- Local dev script to start frontend + backend
- Clean folder structure and README instructions

---

## Phase 9: Polish, Validation, and Testing

### Goal
Make the app feel complete, add validation, improve UX, and optionally add tests.

### What to build
- Form validation on frontend and backend
- Error display and user feedback
- Search/filter controls for boards and cards
- Unit tests for backend services or frontend components
- Better CSS and responsive layout

### What you learn
- UX polish techniques
- Validation best practices
- Basic testing patterns in Vue and NestJS
- Deployable app quality considerations

### How we learn
- Add validations after the main flow works
- Explain why errors should be surfaced clearly
- Write a small test and show how it catches regressions
- Review the app end-to-end

### Deliverables
- Improved user experience
- Validation on forms and API inputs
- At least one test for a key part of the app

---

## Suggested Phase Sequence
1. Phase 1: Setup + Architecture
2. Phase 2: Backend Domain + API Design
3. Phase 3: Frontend UI + Component Design
4. Phase 4: Frontend/Backend Integration
5. Phase 5: Routing + State Management
6. Phase 6: Authentication + Access Control
7. Phase 7: Drag-and-Drop Card Movement
8. Phase 8: Database Persistence + Production Readiness
9. Phase 9: Polish, Validation, and Testing

Each phase is independent enough that we can finish it, then start a new chat or a new session focused on the next phase.

---

## Notes
- Keep each phase small and focused.
- Build the feature, then explain it with examples.
- If you want, I can begin Phase 1 now with exact commands and code.
