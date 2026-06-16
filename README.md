# Project Management Tool

Learning project built with Vue 3 + TypeScript on the frontend and NestJS + TypeScript on the backend.

## Project Structure

```text
backend/   NestJS API server
frontend/  Vue 3 client app
```

## Local Development

Install dependencies in each app:

```powershell
cd backend
npm install

cd ../frontend
npm install

cd ..
npm install
```

Run the frontend and backend together from the project root:

```powershell
npm run dev
```

Or run them separately:

```powershell
npm run dev:backend
npm run dev:frontend
```

The backend runs on `http://localhost:3000`.
The frontend usually runs on `http://localhost:5173`.

## Database

The backend uses Prisma with SQLite. Local data is stored in:

```text
backend/dev.db
```

Create or update the database schema:

```powershell
npm run db:migrate
```

Generate the Prisma client:

```powershell
cd backend
npm run db:generate
```

Seed sample data:

```powershell
npm run db:seed
```

Open Prisma Studio:

```powershell
npm run db:studio
```

Demo login:

```text
demo@example.com
password123
```

## Backend API Examples

Run the backend API:

```powershell
npm run dev:backend
```

The backend stores users, boards, memberships, lists, and cards in SQLite through
Prisma. Data survives backend restarts.

Most project endpoints require a bearer token. Register or log in first, then
send the returned `accessToken` in the `Authorization` header:

```powershell
curl -Method POST http://localhost:3000/auth/login `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"demo@example.com","password":"password123"}'
```

### Boards

```powershell
curl -Headers @{ "Authorization" = "Bearer YOUR_TOKEN" } `
  http://localhost:3000/boards

curl -Method POST http://localhost:3000/boards `
  -Headers @{ "Content-Type" = "application/json"; "Authorization" = "Bearer YOUR_TOKEN" } `
  -Body '{"title":"Learning Board","description":"Database-backed board","visibility":"private"}'
```

### Lists

Lists are nested under boards.

```powershell
curl -Headers @{ "Authorization" = "Bearer YOUR_TOKEN" } `
  http://localhost:3000/boards/YOUR_BOARD_ID/lists

curl -Method POST http://localhost:3000/boards/YOUR_BOARD_ID/lists `
  -Headers @{ "Content-Type" = "application/json"; "Authorization" = "Bearer YOUR_TOKEN" } `
  -Body '{"title":"To Do","status":"todo","position":0}'
```

### Cards

Cards are nested under lists.

```powershell
curl -Headers @{ "Authorization" = "Bearer YOUR_TOKEN" } `
  http://localhost:3000/boards/YOUR_BOARD_ID/lists/YOUR_LIST_ID/cards

curl -Method POST http://localhost:3000/boards/YOUR_BOARD_ID/lists/YOUR_LIST_ID/cards `
  -Headers @{ "Content-Type" = "application/json"; "Authorization" = "Bearer YOUR_TOKEN" } `
  -Body '{"title":"Create backend API","description":"Persist card in SQLite"}'
```

### Validation Example

DTO validation rejects invalid request bodies.

```powershell
curl -Method POST http://localhost:3000/users `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"name":"","email":"not-an-email","isAdmin":true}'
```

Expected response: `400 Bad Request`.
