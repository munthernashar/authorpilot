# STEP 5 — AI Integration

This step implements modular AI integration in the backend (OpenAI + local Ollama).

## Implemented

- Added modular AI prompt templates in `apps/api/src/services/ai/prompt-templates.ts`.
- Added provider abstraction in `apps/api/src/services/ai/openai.service.ts` with runtime provider switching:
  - OpenAI text + structured JSON + image generation
  - Ollama local text generation via `POST /api/generate`
- Added book/domain orchestration layer in `apps/api/src/services/ai/book-ai.service.ts` for:
  - title generation
  - outline generation
  - chapter continuation
  - inline rewrite
  - inline expansion
- Integrated AI routes:
  - `POST /api/v1/books/:bookId/title/generate`
  - `POST /api/v1/books/:bookId/outline/generate`
  - `POST /api/v1/chapters/:chapterId/ai/continue`
  - `POST /api/v1/chapters/:chapterId/ai/rewrite`
  - `POST /api/v1/chapters/:chapterId/ai/expand`
- Outline generation now:
  - runs AI generation,
  - persists outline as generated chapter records,
  - marks `Book.status = OUTLINE_READY`,
  - stores full output in `AiJob.outputJson`.

## Notes

- `AI_PROVIDER=openai` uses OpenAI models (`OPENAI_API_KEY` required).
- `AI_PROVIDER=ollama` routes text generation to local Ollama (`OLLAMA_BASE_URL`, `OLLAMA_MODEL_TEXT`).
- Image generation currently remains OpenAI-only and returns a clear `501` when provider is `ollama`.
- Long-running queue workers for AI jobs will be finalized in STEP 6.

## Step status

✅ STEP 5 complete. Awaiting confirmation to proceed to **STEP 6 — Background Workers**.
