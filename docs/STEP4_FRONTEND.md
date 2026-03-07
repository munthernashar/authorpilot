# STEP 4 — Frontend Implementation

This step implements the frontend foundation for AuthorPilot in `apps/web` using Next.js + Tailwind.

## Implemented

- Next.js App Router app scaffold with TypeScript and Tailwind.
- Global layout and UI utility classes.
- Auth pages with real API integration:
  - `/login` (calls `/api/v1/auth/login`)
  - `/register` (calls `/api/v1/auth/register`)
  - stores access/refresh token in localStorage
- Application shell with top navigation and logout action.
- Dashboard page (`/dashboard`) with live dashboard summary fetch when auth token is available.
- Books workspace pages:
  - `/books`
  - `/books/[bookId]`
  - `/books/[bookId]/chapters/[chapterId]`
- Inline chapter editor with AI action controls (`continue`, `rewrite`, `expand`).
- Personas page (`/personas`).
- Resources upload view (`/resources`).
- Cover generator UI (`/covers`).
- Export UI (`/exports`).
- Frontend environment template with `NEXT_PUBLIC_API_BASE_URL`.

## Notes

- Components are organized by domain (`components/books`, `components/personas`, `components/editor`, `components/layout`).
- API client abstraction is in `src/lib/api.ts`.
- Next step will connect all views to backend APIs and implement real auth/session flows.

## Step status

✅ STEP 4 complete. Awaiting confirmation to proceed to **STEP 5 — AI Integration**.
