# Submission

## Candidate
Khuzaima Azhar — khuzaimaazhar6@gmail.com

## Live URL
https://ajaia-docs-neon-delta.vercel.app

## Test accounts
Mock auth, no password. Click either user on the login page:
- Alice (alice@ajaia.test) — owner
- Bob (bob@ajaia.test) — for testing shared access

## Walkthrough video
PASTE_VIDEO_URL_HERE

## Repo
https://github.com/khuzaimaazhar/ajaia-docs

## What works end-to-end
- Document create / rename / edit / save
- Rich text (bold, italic, underline, H1/H2, lists)
- Autosave + manual save
- Sharing (owner to another user, edit access)
- Owned vs shared documents on dashboard
- Persistence across refresh
- Deployed and testable live

## What's incomplete
- File upload not shipped (ran out of timebox)
- No real-time collaboration
- No password-based auth (mocked by design)
- No version history

## What I'd build next with 2-4 hours
1. File upload (.txt / .md import)
2. Real-time collaboration via Supabase Realtime
3. .docx import via mammoth.js
4. View vs edit permission UI
5. Export to PDF / Markdown

- /api/docs POST route missing in deployed build → New Document button hangs on production. Local build worked; root cause was a missed file commit.