# STEP 6 — Background Workers

This step implements background workers for long-running AI tasks.

## Implemented

- Added `apps/worker` service with BullMQ worker runtime.
- Added queue consumers for:
  - `outline-generation`
  - `chapter-generation`
  - `image-generation`
  - `cover-generation`
- Added job handlers that:
  - load domain data from PostgreSQL via Prisma,
  - call AI providers (OpenAI or Ollama for text),
  - persist results back into `Chapter` and `AiJob` records,
  - mark failures with `AiJob.status=FAILED` + `errorMessage`.
- Updated API routes to enqueue work instead of processing inline for:
  - book outline generation,
  - chapter continuation,
  - image generation,
  - cover generation.

## Queue lifecycle

1. API creates `AiJob` with `QUEUED` status.
2. API enqueues BullMQ payload with `aiJobId`.
3. Worker sets job to `RUNNING` and updates progress.
4. Worker writes final output and marks `COMPLETED`.
5. On error, worker marks `FAILED` with message.

## Step status

✅ STEP 6 complete. Awaiting confirmation to proceed to **STEP 7 — Deployment**.
