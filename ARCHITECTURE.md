# Architecture

## High-level flow

Browser (Next.js client components)
  -> fetch
Next.js API routes (server)
  -> supabase-js
Supabase (hosted Postgres + REST)

No separate backend — Next.js API routes act as the backend and enforce access rules.

## Auth

Mock auth via httpOnly cookie (`ajaia_user_id`). Login page lists seeded users; clicking one sets the cookie. Every server component and API route calls `getCurrentUser()` to read the cookie and load the user from Supabase.

Why mock: assignment allows simulated users. Real auth adds nothing for a 4-hour scope.

## Data model

Three tables:
- users (id, email, name, created_at)
- documents (id, title, content, owner_id, created_at, updated_at)
- shares (id, document_id, shared_with_user_id, permission, created_at)

Unique constraint on (document_id, shared_with_user_id).

Access rules:
- Owner: full read/write/delete/share
- Shared user with edit: read/write
- Anyone else: blocked (redirect on pages, 403 on API)

Enforced in both page.tsx and API routes.

## Editor

TipTap (ProseMirror-based). HTML content stored in documents.content. Autosave debounced 2s after last change, PATCH to /api/docs/[id].

## Deployment

Vercel, auto-deploy from GitHub main. Env vars set in Vercel project settings.

## Tradeoffs

- Hosted Supabase over local Postgres: instant setup, no migrations.
- Server components for data fetching: no loading states, cookies work naturally.
- Autosave + manual save: autosave default, manual for explicit control.
- RLS disabled: pragmatic demo shortcut; production would use RLS + server checks.

## For production

- Real auth (Supabase Auth or Auth.js)
- RLS policies
- Optimistic UI + conflict resolution
- Real-time via WebSocket
- Blob storage for uploads