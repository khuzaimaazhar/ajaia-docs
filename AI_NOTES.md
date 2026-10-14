# AI Workflow Notes

## Tools used
- Claude (Sonnet) as primary coding assistant
- ChatGPT for occasional sanity checks

## Where AI materially helped
- Scaffolding: Next.js + Supabase setup, folder structure, API boilerplate (saved ~45 min)
- TipTap integration: toolbar wiring and editor config
- Supabase schema design and RLS debugging
- Fast diagnosis of Next.js 16 quirks (cacheComponents conflict, route conflicts)
- Documentation drafts (edited for accuracy)

## What AI got wrong / what I changed or rejected
- Suggested `export const dynamic = 'force-dynamic'` — broke on Next.js 16 with cacheComponents. Removed it, disabled cache components in config instead.
- Assumed default layout.tsx existed — it had been deleted during cleanup. Caught it and recreated.
- Used old Supabase anon key format — Supabase migrated to publishable keys. Updated to `sb_publishable_...`.
- First autosave draft fired on every keystroke. Revised to debounce properly.
- Suggested RLS policies — disabled RLS for demo speed and documented the tradeoff.

## How I verified correctness
- End-to-end manual tests: create, edit, save, refresh, reopen, share, switch user
- Both seeded users tested for ownership boundaries
- Deployed to Vercel and retested full flow on production
- TypeScript Problems panel kept clean before commit

## Independence note
Every AI output was reviewed. Errors were fixed based on my own understanding of Next.js, Supabase, and TipTap. Architecture, scope cuts, and tradeoffs are decisions I made and can defend.