# STEP 1 — Product Architecture (Revised)

This document defines the production architecture for **AuthorPilot**, a multi-tenant SaaS for AI-assisted long-form book creation (in the spirit of coauthor.ai).

---

## 1) System Architecture

### 1.1 Runtime topology

```text
┌──────────────────────────────────────────────────────────────────┐
│                         Client (Web)                            │
│  Next.js App Router + Tailwind + TipTap/Lexical + React Query  │
└───────────────────────────────┬──────────────────────────────────┘
                                │ HTTPS (cookie auth + CSRF)
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                        API Layer (Express)                      │
│  - Auth + org RBAC                                               │
│  - Book/outline/chapter/editor APIs                              │
│  - Upload presign APIs                                            │
│  - Export orchestration                                            │
│  - Job status + SSE progress                                       │
└───────────────┬──────────────────────┬────────────────────────────┘
                │                      │
                ▼                      ▼
        ┌──────────────┐        ┌──────────────┐
        │ PostgreSQL   │        │ Redis        │
        │ (Prisma ORM) │        │ (BullMQ+cache│
        └──────┬───────┘        │ +rate-limit) │
               │                └──────┬───────┘
               │                       │
               ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │ S3 Compatible│        │ Worker Pool  │
        │ Object Store │◄──────►│ (BullMQ)     │
        └──────────────┘        └──────┬───────┘
                                         │
                                         ▼
                                 ┌──────────────┐
                                 │ OpenAI API   │
                                 │ Text + Image │
                                 └──────────────┘
```

### 1.2 Core architectural decisions
- **Multi-tenant by organization**: every business entity is scoped to `organization_id`; authorization checks are enforced at service layer for every query.
- **Async-first AI pipeline**: anything beyond sub-second response is queued (outline/chapter/image/cover/export/analysis).
- **Section-first generation**: chapters are produced in sections with memory summaries to reduce repetition and drift.
- **Idempotent jobs**: each AI step has stable keys and prompt hashes to support retries without duplicate writes.
- **Composable modules**: auth, books, personas, AI, resources, exports, jobs are isolated by interface.

### 1.3 Bounded contexts
- **Identity & Access**: users, organizations, memberships, sessions, tokens.
- **Authoring**: books, outlines, chapters, section drafts, editor operations.
- **AI Orchestration**: prompts, job steps, memory cards, quality checks.
- **Assets**: uploaded resources, generated images, covers.
- **Publishing**: PDF/DOCX export artifacts.
- **Observability & Audit**: structured logs, traces, audit records.

---

## 2) Tech Stack

### 2.1 Frontend (required)
- **Next.js (App Router)**
- **Tailwind CSS**
- React Query for async/server state
- React Hook Form + Zod for forms/validation
- TipTap or Lexical editor for inline AI interactions

### 2.2 Backend (required)
- **Node.js + Express + TypeScript**
- Prisma ORM with PostgreSQL
- BullMQ workers with Redis
- JWT access + rotating refresh token cookies
- Pino logger + OpenTelemetry tracing

### 2.3 Infra and storage
- PostgreSQL 15+
- Redis 7+
- S3-compatible object storage (S3/R2/MinIO)
- Docker Compose local environment

### 2.4 AI and document stack
- OpenAI API (text generation, structured outputs, image generation)
- `docx` for DOCX assembly
- HTML-to-PDF renderer (Playwright/Puppeteer service)

---

## 3) Database Schema

### 3.1 Tenant & identity
- `users(id, email unique, password_hash, full_name, created_at, updated_at)`
- `organizations(id, name, slug unique, owner_user_id, created_at)`
- `organization_members(id, organization_id, user_id, role, created_at, unique(organization_id,user_id))`
- `refresh_tokens(id, user_id, token_hash, expires_at, revoked_at, created_at)`
- `subscriptions(id, organization_id, provider, plan_code, status, period_start, period_end)`
- `usage_events(id, organization_id, user_id, feature_key, units, metadata_json, created_at)`

### 3.2 Authoring domain
- `author_personas(id, organization_id, name, tone, audience, genre, constraints_json, created_at)`
- `books(id, organization_id, persona_id nullable, title, subtitle, description, language, status, target_word_count, created_by, created_at)`
- `book_memory_cards(id, book_id, card_type, content_json, version, created_at)`
- `book_market_analyses(id, book_id, status, input_json, output_json, created_at, completed_at)`
- `book_outlines(id, book_id, version, status, structure_json, created_at)`
- `chapters(id, book_id, outline_ref, title, position, status, target_words, created_at)`
- `chapter_sections(id, chapter_id, title, position, brief, status, summary, key_facts_json)`
- `chapter_drafts(id, chapter_id, section_id nullable, version, markdown_content, model, token_usage_json, prompt_hash, created_at)`
- `editor_operations(id, book_id, chapter_id, user_id, operation_json, created_at)`

### 3.3 AI orchestration
- `ai_jobs(id, organization_id, type, status, priority, input_json, output_json, progress, error_message, created_at, started_at, finished_at)`
- `ai_job_steps(id, ai_job_id, step_key, status, input_json, output_json, prompt_hash, retry_count, started_at, finished_at)`
- `prompt_templates(id, key, version, template_text, variables_json, is_active, created_at)`

### 3.4 Assets & publishing
- `resources(id, organization_id, book_id nullable, storage_key, file_name, mime_type, size_bytes, category, metadata_json, created_at)`
- `generated_images(id, organization_id, book_id nullable, prompt, model, width, height, storage_key, created_at)`
- `book_covers(id, book_id, concept_prompt, front_key, full_wrap_key, status, created_at)`
- `exports(id, book_id, format, status, storage_key, created_by, error_message, created_at, completed_at)`

### 3.5 Security/audit
- `audit_logs(id, organization_id, user_id, action, entity_type, entity_id, details_json, created_at)`

### 3.6 Important indexes
- `books(organization_id, updated_at desc)`
- `chapters(book_id, position)`
- `chapter_sections(chapter_id, position)`
- `ai_jobs(organization_id, status, created_at desc)`
- `usage_events(organization_id, feature_key, created_at)`

---

## 4) API Structure

Base: `/api/v1`

### 4.1 Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### 4.2 Organizations & dashboard
- `GET /dashboard/summary`
- `GET /usage`
- `GET /billing/subscription`

### 4.3 Personas
- `POST /personas`
- `GET /personas`
- `GET /personas/:personaId`
- `PATCH /personas/:personaId`
- `DELETE /personas/:personaId`

### 4.4 Books and writing
- `POST /books`
- `GET /books`
- `GET /books/:bookId`
- `PATCH /books/:bookId`
- `POST /books/:bookId/market-analysis` (async)
- `POST /books/:bookId/title/generate`
- `POST /books/:bookId/outline/generate` (async)
- `GET /books/:bookId/outlines`
- `POST /books/:bookId/chapters/generate` (async, chapter-by-chapter)
- `GET /books/:bookId/chapters`
- `GET /chapters/:chapterId`
- `PATCH /chapters/:chapterId/content`
- `POST /chapters/:chapterId/ai/continue`
- `POST /chapters/:chapterId/ai/rewrite`
- `POST /chapters/:chapterId/ai/expand`

### 4.5 Uploads/resources
- `POST /uploads/presign`
- `POST /resources`
- `GET /books/:bookId/resources`

### 4.6 Image and cover generation
- `POST /books/:bookId/images/generate` (async)
- `POST /books/:bookId/covers/generate` (async)
- `GET /books/:bookId/covers`

### 4.7 Export
- `POST /books/:bookId/exports/pdf` (async)
- `POST /books/:bookId/exports/docx` (async)
- `GET /books/:bookId/exports`

### 4.8 Jobs and progress
- `GET /jobs/:jobId`
- `GET /jobs/:jobId/events` (SSE)

---

## 5) AI Integration (OpenAI)

### 5.1 Service interfaces
- `AITextService.generateStructured<T>()`
- `AITextService.generateEditorialPatch()`
- `AIImageService.generateImage()`
- `PromptService.renderTemplate(key, version, variables)`
- `AIGuardrailsService.checkRepetition(), checkConsistency(), checkPersonaFit()`

### 5.2 Long-context generation protocol (chapter-by-chapter)
1. **Blueprint phase**
   - produce writing brief: objective, thesis, audience, reading level, tone rules.
2. **Outline phase**
   - produce part/chapter/section tree and expected outcomes per section.
3. **Section generation phase**
   - for each section, create a constrained context packet:
     - blueprint
     - chapter synopsis
     - prior section summaries
     - memory cards (entities, facts, timeline, glossary)
   - generate one section only with strict schema.
4. **Quality pass phase**
   - run repetition and contradiction checks.
   - run persona/tone compliance check.
   - if failed, auto-rewrite with error-guided prompt.
5. **Assembly phase**
   - merge approved sections into chapter draft.
   - update chapter summary and memory cards.
6. **Book continuity phase**
   - update global memory cards before next chapter.

### 5.3 Anti-repetition controls
- Hard ban list from recent n-grams.
- Previous section **summary-only** inclusion (not full content) to avoid runaway echo.
- Consistency cards with canonical facts and character rules.
- Distinct generation temperature/profile by task (outline low variance, prose moderate).

### 5.4 Reliability
- Store prompt + model + hash per step.
- Retry only failed steps.
- Support manual regeneration of a specific section/chapter without invalidating whole book.

---

## 6) File Storage (S3 Compatible)

### 6.1 Key layout
- `private/{orgId}/resources/{resourceId}/{filename}`
- `private/{orgId}/books/{bookId}/images/{imageId}.png`
- `private/{orgId}/books/{bookId}/covers/{coverId}-front.png`
- `private/{orgId}/books/{bookId}/covers/{coverId}-full.png`
- `private/{orgId}/books/{bookId}/exports/{exportId}.pdf|.docx`

### 6.2 Security pattern
- private buckets only
- short-lived pre-signed URLs (PUT/GET)
- API-level MIME/type/size enforcement
- optional async malware scanning queue

---

## 7) Background Jobs & Queues

### 7.1 Queues
- `market-analysis-queue`
- `title-outline-queue`
- `chapter-generation-queue`
- `image-generation-queue`
- `cover-generation-queue`
- `export-queue`

### 7.2 Job contract
Each job payload includes:
- `jobId`
- `organizationId`
- `actorUserId`
- `resourceRef` (e.g., `bookId`, `chapterId`)
- `operation` and typed parameters
- `idempotencyKey`

### 7.3 State machine
`queued -> running -> completed | failed | retrying | canceled`

### 7.4 Worker guarantees
- input schema validation
- distributed lock per resource for conflicting jobs
- retries with exponential backoff + jitter
- dead-letter capture after max retries
- durable progress writes for SSE polling

---

## 8) Security, Compliance, and Reliability

- Access token short TTL; rotating refresh tokens in HTTP-only secure cookies.
- CSRF protection for cookie-based auth flows.
- RBAC (`owner`, `admin`, `editor`, `viewer`) enforced in services.
- Per-organization rate limits and AI usage quota checks.
- Audit trail for login, export, delete, and billing-impacting actions.
- Structured logs + trace IDs propagated from API to workers.
- Backups: daily PostgreSQL snapshot + object lifecycle policy.
- Secret management via environment/secret store, never persisted in DB/plain logs.

---

## 9) SaaS Module Breakdown for Implementation

- `apps/web` (Next.js frontend)
- `apps/api` (Express HTTP API)
- `apps/worker` (BullMQ workers)
- `packages/shared` (types, schemas, constants)
- `packages/ai` (prompt templates and AI adapters)
- `packages/storage` (S3 abstraction)

This structure supports independent scaling and cleaner CI/CD.

---

## 10) Deployment Targets

- Local: Docker Compose (Postgres, Redis, MinIO, API, Worker, Web)
- Cloud: containerized deploy (ECS/Kubernetes/Fly/Render) with managed Postgres + Redis + object storage.
- Separate autoscaling policies for API and workers.

---

## 11) Acceptance criteria for STEP 1

STEP 1 is considered complete when architecture includes:
- required stack choices,
- complete domain model,
- API map,
- AI long-context generation strategy,
- object storage strategy,
- queue/worker design,
- security and reliability baseline.

All above are defined in this document.

---

## Deliverable Status

✅ STEP 1 complete. Awaiting confirmation to proceed to **STEP 2 — Project Structure**.
