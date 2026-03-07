# STEP 7 — Deployment

This step provides concrete local and production deployment instructions.

## 1) Local deployment with Docker Compose

Start full stack (Postgres, Redis, MinIO, API, Worker, Web):

```bash
docker compose -f infra/compose/docker-compose.dev.yml up --build
```

Services:
- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`

## 2) Local deployment without Docker

### API
```bash
cp apps/api/.env.example apps/api/.env
npm --prefix apps/api install
npm --prefix apps/api run prisma:generate
npm --prefix apps/api run prisma:migrate
npm run dev:api
```

### Worker
```bash
cp apps/worker/.env.example apps/worker/.env
npm --prefix apps/worker install
npm run dev:worker
```

### Web
```bash
cp apps/web/.env.example apps/web/.env
npm --prefix apps/web install
npm run dev:web
```

## 3) Production deployment blueprint

- Deploy `apps/api`, `apps/worker`, and `apps/web` as separate services.
- Use managed PostgreSQL and Redis.
- Use S3-compatible object storage (S3/R2/MinIO).
- Set `AI_PROVIDER=openai` or `AI_PROVIDER=ollama` per environment.
- Scale worker replicas independently from API replicas.

## 4) Required environment variables

### API
- Core: `NODE_ENV`, `PORT`, `DATABASE_URL`, `CORS_ORIGIN`
- Auth: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL_DAYS`
- AI: `AI_PROVIDER`, `OPENAI_*`, `OLLAMA_*`
- Queue: `REDIS_HOST`, `REDIS_PORT`
- Storage: `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_PRIVATE`

### Worker
- `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT`, `AI_PROVIDER`, `OPENAI_*`, `OLLAMA_*`

### Web
- `NEXT_PUBLIC_API_BASE_URL`

## Step status

✅ STEP 7 complete. Awaiting confirmation to proceed to **STEP 8 — Debugging & Testing**.
