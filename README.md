# Project Management Tool

Learning project built with Vue 3 + TypeScript on the frontend and NestJS + TypeScript on the backend.

## Project Structure

```text
backend/   NestJS API server
frontend/  Vue 3 client app
```

## Backend API Examples

Run the backend API:

```powershell
cd backend
npm run start:dev
```

The backend stores data in memory during Phase 2. If the server restarts, users,
boards, lists, and cards reset.

### Users

```powershell
curl http://localhost:3000/users

curl -Method POST http://localhost:3000/users `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"name":"Ehab","email":"ehab@example.com"}'
```

### Boards

```powershell
curl http://localhost:3000/boards

curl -Method POST http://localhost:3000/boards `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"title":"Learning Board","description":"Phase 2 testing","visibility":"private","ownerId":"user-1"}'
```

### Lists

Lists are nested under boards.

```powershell
curl http://localhost:3000/boards/YOUR_BOARD_ID/lists

curl -Method POST http://localhost:3000/boards/YOUR_BOARD_ID/lists `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"title":"To Do"}'
```

### Cards

Cards are nested under lists.

```powershell
curl http://localhost:3000/boards/YOUR_BOARD_ID/lists/YOUR_LIST_ID/cards

curl -Method POST http://localhost:3000/boards/YOUR_BOARD_ID/lists/YOUR_LIST_ID/cards `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"title":"Create backend API","description":"Finish Phase 2 CRUD"}'
```

### Validation Example

DTO validation rejects invalid request bodies.

```powershell
curl -Method POST http://localhost:3000/users `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"name":"","email":"not-an-email","isAdmin":true}'
```

Expected response: `400 Bad Request`.
