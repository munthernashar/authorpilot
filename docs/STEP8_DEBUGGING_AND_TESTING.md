# STEP 8 — Debugging & Testing

This step defines practical debugging and validation workflows.

## 1) Health checks

### API
```bash
curl -s http://localhost:4000/health
```

Expected:
```json
{"ok":true,"service":"authorpilot-api"}
```

### Job status
```bash
curl -s -H "Authorization: Bearer <ACCESS_TOKEN>" \
  http://localhost:4000/api/v1/jobs/<JOB_ID>
```

## 2) Worker verification

1. Trigger an async endpoint (outline/chapter/image/cover).
2. Confirm API returns `202` + `jobId`.
3. Watch worker logs for completion/failure messages.
4. Poll `/api/v1/jobs/:jobId` until `COMPLETED` or `FAILED`.

## 3) Common failure patterns

- **`Model returned invalid JSON`**: tighten prompt or lower temperature for structured tasks.
- **`Ollama request failed`**: check `OLLAMA_BASE_URL`, model availability (`ollama list`), and server status.
- **`S3_BUCKET_PRIVATE is not configured`**: set bucket env variables and verify MinIO/S3 access.
- **Build type errors for missing modules**: install dependencies (`npm --prefix <app> install`) before build.

## 4) Recommended test plan

### API contract tests
- auth flows (`register/login/refresh/me`)
- org-scoped access checks
- async enqueue endpoints return `202`

### Worker integration tests
- queue payload -> worker handler -> DB state transitions
- retry/failure behavior updates `AiJob.errorMessage`

### Frontend smoke tests
- route rendering (`/dashboard`, `/books`, `/personas`)
- editor actions dispatch to API routes

## 5) Useful commands

```bash
# API
npm --prefix apps/api run build
npm run dev:api

# Worker
npm --prefix apps/worker run build
npm run dev:worker

# Web
npm --prefix apps/web run build
npm run dev:web
```

## Step status

✅ STEP 8 complete.
