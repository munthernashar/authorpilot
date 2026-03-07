# AuthorPilot

AuthorPilot is a multi-tenant SaaS platform for AI-assisted book creation.

## Implemented so far

- ✅ STEP 1 architecture (`docs/STEP1_ARCHITECTURE.md`)
- ✅ STEP 2 project structure (`docs/STEP2_PROJECT_STRUCTURE.md`)
- ✅ STEP 3 backend foundation (`apps/api`)
- ✅ STEP 4 frontend foundation (`apps/web`)
- ✅ STEP 5 AI integration (`apps/api/src/services/ai`)
- ✅ STEP 6 background workers (`apps/worker`)
- ✅ STEP 7 deployment (`infra/compose`, `infra/docker`)
- ✅ STEP 8 debugging & testing (`docs/STEP8_DEBUGGING_AND_TESTING.md`)

## Backend (apps/api)

### Features included

- Express + TypeScript API under `/api/v1`
- JWT auth (register/login/refresh/me)
- Organization-scoped authorization model
- PostgreSQL models via Prisma
- Personas CRUD (create/list)
- Books endpoints (create/list + outline async job enqueue record)
- Chapters endpoints (create/update + async continue job record)
- Upload presign endpoint for S3-compatible storage
- Job status endpoint
- Dashboard summary endpoint (`GET /api/v1/dashboard/summary`)

### Quick start

1. Install dependencies:

```bash
npm install
npm --prefix apps/api install
```

2. Configure environment:

```bash
cp apps/api/.env.example apps/api/.env
# update DATABASE_URL and JWT secrets
```

3. Generate Prisma client and run migrations:

```bash
npm --prefix apps/api run prisma:generate
npm --prefix apps/api run prisma:migrate
```

4. Run API:

```bash
npm run dev:api
```

Health check: `GET http://localhost:4000/health`


## Frontend (apps/web)

Run locally:

```bash
npm --prefix apps/web install
npm --prefix apps/web run dev
```

App URL: `http://localhost:3000`


## AI Integration

Backend AI provider options:

- `AI_PROVIDER=openai`
  - requires `OPENAI_API_KEY`
  - optional `OPENAI_MODEL_TEXT`
  - optional `OPENAI_MODEL_IMAGE`
- `AI_PROVIDER=ollama`
  - uses local Ollama server (`OLLAMA_BASE_URL`, default `http://localhost:11434`)
  - optional `OLLAMA_MODEL_TEXT`
  - note: image generation endpoints remain OpenAI-only


## Worker (apps/worker)

Run locally:

```bash
npm --prefix apps/worker install
npm run dev:worker
```

Requires Redis and PostgreSQL.


## Docker Compose (full stack)

```bash
docker compose -f infra/compose/docker-compose.dev.yml up --build
```

Services:
- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- MinIO Console: `http://localhost:9001`


## Debugging quick checks

```bash
# API health
curl -s http://localhost:4000/health

# Build checks
npm --prefix apps/api run build
npm --prefix apps/worker run build
npm --prefix apps/web run build
```


## Dashboard API wiring

The dashboard page fetches `/api/v1/dashboard/summary` when `authorpilot_access_token` is present in browser localStorage.


## Auth flow (frontend)

- Login/Register pages now call backend auth endpoints directly.
- On success, frontend stores tokens in localStorage (key: `authorpilot_access_token`).
- Dashboard summary uses this token for authenticated API calls.
