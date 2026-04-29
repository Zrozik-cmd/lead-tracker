# Lead Tracker — Mini CRM

A mini CRM application for managing leads, comments, search, filtering, and pagination.

**Stack:** Next.js (App Router) · NestJS · PostgreSQL · Prisma · TypeScript · Docker

---

## Features

- Leads CRUD: create, read, update, delete
- Lead comments with nested lead route
- Search by name, email, company
- Filter by status
- Pagination and sorting support
- Backend validation and Swagger API docs
- Docker Compose setup for local development

---

## Quick Start

### Local Development

**Prerequisites:** Node.js 18+, PostgreSQL running locally

**Backend:**

```bash
cd backend
cp .env.example .env        # fill in your DATABASE_URL
npm install
npx prisma migrate deploy
npm run start:dev
```

**Frontend:**

```bash
cd frontend
cp .env.example .env.local   # fill in NEXT_PUBLIC_API_URL
npm install
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- Swagger: http://localhost:4000/api/docs

---

### Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Swagger: http://localhost:4000/api/docs

---

## Environment Variables

**backend/.env.example**

```env
DATABASE_URL=postgresql://lead_user:lead_pass@localhost:5432/lead_db
```

**frontend/.env.example**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## API Reference

**Base URL:** `http://localhost:4000/api`

### Leads

- `GET /leads`
  - Query params: `page`, `limit`, `search`, `status`, `sort`, `order`
- `POST /leads`
- `GET /leads/:id`
- `PATCH /leads/:id`
- `DELETE /leads/:id`

### Comments

- `GET /leads/:leadId/comments`
- `POST /leads/:leadId/comments`

---

## Project Structure

- `backend/` – NestJS API server
- `frontend/` – Next.js UI application
- `docker-compose.yml` – local development with PostgreSQL, backend, frontend
- `backend/prisma/` – Prisma schema and migrations

---

## Notes

- `frontend` expects `NEXT_PUBLIC_API_URL` to point to the backend API.
- When using Docker Compose, the backend is available on port `4000`.
