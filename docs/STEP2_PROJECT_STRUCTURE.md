# STEP 2 — Project Structure

This step defines the complete production folder structure for AuthorPilot as a modular, scalable monorepo.

## 1) Monorepo layout

```text
authorpilot/
├─ apps/
│  ├─ web/                                  # Next.js + Tailwind frontend
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ (marketing)/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ pricing/page.tsx
│  │  │  │  │  └─ features/page.tsx
│  │  │  │  ├─ (auth)/
│  │  │  │  │  ├─ login/page.tsx
│  │  │  │  │  ├─ register/page.tsx
│  │  │  │  │  └─ forgot-password/page.tsx
│  │  │  │  ├─ (app)/
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ dashboard/page.tsx
│  │  │  │  │  ├─ books/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ new/page.tsx
│  │  │  │  │  │  └─ [bookId]/
│  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │     ├─ outline/page.tsx
│  │  │  │  │  │     ├─ chapters/[chapterId]/page.tsx
│  │  │  │  │  │     ├─ resources/page.tsx
│  │  │  │  │  │     ├─ covers/page.tsx
│  │  │  │  │  │     └─ exports/page.tsx
│  │  │  │  │  ├─ personas/
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  ├─ new/page.tsx
│  │  │  │  │  │  └─ [personaId]/page.tsx
│  │  │  │  │  ├─ settings/
│  │  │  │  │  │  ├─ profile/page.tsx
│  │  │  │  │  │  ├─ organization/page.tsx
│  │  │  │  │  │  └─ billing/page.tsx
│  │  │  │  │  └─ jobs/page.tsx
│  │  │  │  ├─ api/
│  │  │  │  │  └─ health/route.ts
│  │  │  │  ├─ globals.css
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ not-found.tsx
│  │  │  ├─ components/
│  │  │  │  ├─ ui/
│  │  │  │  ├─ layout/
│  │  │  │  ├─ dashboard/
│  │  │  │  ├─ editor/
│  │  │  │  ├─ books/
│  │  │  │  ├─ personas/
│  │  │  │  ├─ uploads/
│  │  │  │  └─ ai/
│  │  │  ├─ features/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ books/
│  │  │  │  ├─ chapters/
│  │  │  │  ├─ personas/
│  │  │  │  ├─ resources/
│  │  │  │  ├─ covers/
│  │  │  │  ├─ exports/
│  │  │  │  └─ jobs/
│  │  │  ├─ lib/
│  │  │  │  ├─ api-client.ts
│  │  │  │  ├─ auth.ts
│  │  │  │  ├─ query-client.ts
│  │  │  │  ├─ env.ts
│  │  │  │  └─ utils.ts
│  │  │  ├─ hooks/
│  │  │  ├─ styles/
│  │  │  └─ types/
│  │  ├─ public/
│  │  ├─ package.json
│  │  ├─ tailwind.config.ts
│  │  ├─ postcss.config.js
│  │  ├─ tsconfig.json
│  │  ├─ next.config.mjs
│  │  └─ .env.example
│  │
│  ├─ api/                                  # Express API service
│  │  ├─ src/
│  │  │  ├─ index.ts
│  │  │  ├─ app.ts
│  │  │  ├─ config/
│  │  │  │  ├─ env.ts
│  │  │  │  ├─ logger.ts
│  │  │  │  ├─ redis.ts
│  │  │  │  ├─ prisma.ts
│  │  │  │  ├─ s3.ts
│  │  │  │  └─ openai.ts
│  │  │  ├─ common/
│  │  │  │  ├─ constants/
│  │  │  │  ├─ errors/
│  │  │  │  ├─ middleware/
│  │  │  │  │  ├─ auth.middleware.ts
│  │  │  │  │  ├─ org-scope.middleware.ts
│  │  │  │  │  ├─ rate-limit.middleware.ts
│  │  │  │  │  ├─ validation.middleware.ts
│  │  │  │  │  └─ error-handler.middleware.ts
│  │  │  │  ├─ utils/
│  │  │  │  └─ validators/
│  │  │  ├─ modules/
│  │  │  │  ├─ auth/
│  │  │  │  │  ├─ auth.controller.ts
│  │  │  │  │  ├─ auth.routes.ts
│  │  │  │  │  ├─ auth.service.ts
│  │  │  │  │  ├─ auth.schema.ts
│  │  │  │  │  └─ auth.types.ts
│  │  │  │  ├─ users/
│  │  │  │  ├─ organizations/
│  │  │  │  ├─ dashboard/
│  │  │  │  ├─ personas/
│  │  │  │  ├─ books/
│  │  │  │  ├─ outlines/
│  │  │  │  ├─ chapters/
│  │  │  │  ├─ editor/
│  │  │  │  ├─ resources/
│  │  │  │  ├─ uploads/
│  │  │  │  ├─ images/
│  │  │  │  ├─ covers/
│  │  │  │  ├─ exports/
│  │  │  │  ├─ jobs/
│  │  │  │  └─ usage/
│  │  │  ├─ integrations/
│  │  │  │  ├─ ai/
│  │  │  │  │  ├─ ai-text.service.ts
│  │  │  │  │  ├─ ai-image.service.ts
│  │  │  │  │  ├─ prompt.service.ts
│  │  │  │  │  └─ guardrails.service.ts
│  │  │  │  ├─ storage/
│  │  │  │  │  ├─ s3-storage.service.ts
│  │  │  │  │  └─ presign.service.ts
│  │  │  │  └─ queue/
│  │  │  │     ├─ queue.factory.ts
│  │  │  │     └─ producers/
│  │  │  ├─ db/
│  │  │  │  ├─ prisma/
│  │  │  │  │  ├─ schema.prisma
│  │  │  │  │  ├─ migrations/
│  │  │  │  │  └─ seed.ts
│  │  │  │  └─ repositories/
│  │  │  └─ telemetry/
│  │  │     ├─ metrics.ts
│  │  │     └─ tracing.ts
│  │  ├─ tests/
│  │  │  ├─ unit/
│  │  │  ├─ integration/
│  │  │  └─ e2e/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ .env.example
│  │
│  └─ worker/                               # BullMQ background workers
│     ├─ src/
│     │  ├─ index.ts
│     │  ├─ config/
│     │  │  ├─ env.ts
│     │  │  ├─ logger.ts
│     │  │  ├─ redis.ts
│     │  │  ├─ prisma.ts
│     │  │  ├─ openai.ts
│     │  │  └─ s3.ts
│     │  ├─ queues/
│     │  │  ├─ market-analysis.queue.ts
│     │  │  ├─ title-outline.queue.ts
│     │  │  ├─ chapter-generation.queue.ts
│     │  │  ├─ image-generation.queue.ts
│     │  │  ├─ cover-generation.queue.ts
│     │  │  └─ export.queue.ts
│     │  ├─ workers/
│     │  │  ├─ market-analysis.worker.ts
│     │  │  ├─ title-outline.worker.ts
│     │  │  ├─ chapter-generation.worker.ts
│     │  │  ├─ image-generation.worker.ts
│     │  │  ├─ cover-generation.worker.ts
│     │  │  └─ export.worker.ts
│     │  ├─ processors/
│     │  │  ├─ chapter/
│     │  │  │  ├─ build-context.packet.ts
│     │  │  │  ├─ generate-section.ts
│     │  │  │  ├─ quality-pass.ts
│     │  │  │  └─ assemble-chapter.ts
│     │  │  └─ exports/
│     │  │     ├─ generate-pdf.ts
│     │  │     └─ generate-docx.ts
│     │  ├─ integrations/
│     │  │  ├─ ai/
│     │  │  ├─ storage/
│     │  │  └─ events/
│     │  └─ telemetry/
│     ├─ tests/
│     │  ├─ unit/
│     │  └─ integration/
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ .env.example
│
├─ packages/
│  ├─ shared/                               # cross-app contracts
│  │  ├─ src/
│  │  │  ├─ constants/
│  │  │  ├─ enums/
│  │  │  ├─ types/
│  │  │  ├─ dto/
│  │  │  ├─ schemas/
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  ├─ ai/                                   # prompt templates and ai adapters
│  │  ├─ src/
│  │  │  ├─ templates/
│  │  │  │  ├─ market-analysis/
│  │  │  │  ├─ title-generation/
│  │  │  │  ├─ outline-generation/
│  │  │  │  ├─ chapter-generation/
│  │  │  │  └─ inline-editor/
│  │  │  ├─ adapters/
│  │  │  │  ├─ openai.adapter.ts
│  │  │  │  └─ structured-output.adapter.ts
│  │  │  ├─ guardrails/
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  ├─ storage/                              # object storage abstraction
│  │  ├─ src/
│  │  │  ├─ client/
│  │  │  ├─ presign/
│  │  │  ├─ keys/
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  └─ config/                               # shared lint/ts/jest config
│     ├─ eslint/
│     ├─ typescript/
│     ├─ jest/
│     └─ package.json
│
├─ infra/
│  ├─ docker/
│  │  ├─ Dockerfile.web
│  │  ├─ Dockerfile.api
│  │  ├─ Dockerfile.worker
│  │  └─ nginx.conf
│  ├─ compose/
│  │  ├─ docker-compose.dev.yml
│  │  └─ docker-compose.prod-sim.yml
│  ├─ terraform/
│  │  ├─ modules/
│  │  └─ environments/
│  └─ scripts/
│     ├─ bootstrap.sh
│     ├─ migrate.sh
│     ├─ seed.sh
│     └─ reset-dev.sh
│
├─ docs/
│  ├─ STEP1_ARCHITECTURE.md
│  ├─ STEP2_PROJECT_STRUCTURE.md
│  ├─ api/
│  │  ├─ openapi.yaml
│  │  └─ examples/
│  ├─ adr/
│  ├─ runbooks/
│  └─ diagrams/
│
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml
│  │  ├─ release.yml
│  │  └─ security-scan.yml
│  ├─ CODEOWNERS
│  └─ pull_request_template.md
│
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ .editorconfig
├─ .gitignore
├─ .env.example
└─ README.md
```

## 2) Architecture-to-folder mapping

- `apps/web`: all user-facing SaaS interfaces (dashboard, book workspace, editor, assets, export management).
- `apps/api`: request/response domain, auth, policy enforcement, persistence orchestration, queue producers.
- `apps/worker`: long-running AI + export jobs with retries and idempotency handling.
- `packages/shared`: compile-time shared contracts between web/api/worker.
- `packages/ai`: model-agnostic prompt and guardrail implementation.
- `packages/storage`: reusable S3-compatible keying and presign logic.

## 3) Module conventions

Each API module should follow this pattern:

```text
modules/<module-name>/
├─ <module>.controller.ts
├─ <module>.routes.ts
├─ <module>.service.ts
├─ <module>.repository.ts (optional)
├─ <module>.schema.ts
└─ <module>.types.ts
```

This keeps validation, routing, orchestration, and persistence concerns separated.

## 4) Environment files

Required `.env` categories:
- Core: `NODE_ENV`, `PORT`, `LOG_LEVEL`
- Database: `DATABASE_URL`
- Redis/Queue: `REDIS_URL`
- Auth: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`
- OpenAI: `OPENAI_API_KEY`, `OPENAI_MODEL_TEXT`, `OPENAI_MODEL_IMAGE`
- Storage: `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_PRIVATE`
- Frontend: `NEXT_PUBLIC_API_BASE_URL`

## 5) Step status

✅ STEP 2 complete. Awaiting confirmation to proceed to **STEP 3 — Backend**.
