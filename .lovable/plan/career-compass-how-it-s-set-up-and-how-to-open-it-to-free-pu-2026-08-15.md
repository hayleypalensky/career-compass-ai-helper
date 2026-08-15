# Career Compass — How it's set up, and how to open it to free public users

## What the app is

A resume-tailoring + job-application tracker. Signed-in users fill out a profile (personal info, education, experience, skills), paste a job description, and the app suggests skills, rewrites their summary and bullet points, generates a cover letter, and exports a styled PDF resume. It also tracks applications by status.

Pages: `/` (home), `/auth` (sign in/up, forgot password, MFA), `/profile`, `/tailor`, `/jobs`, `/help`. Everything except home and auth requires login.

## Your current setup

**Frontend (all inside Lovable):** React 18 + Vite + TypeScript, Tailwind + shadcn/ui components, React Router for pages, TanStack Query for data fetching, react-hook-form + zod for forms.

**Backend (Supabase project `ilrrxwkxrbgslpifkdlf`):**
- Auth: email/password with MFA support.
- Database: two tables.
  - `profiles` — one row per user (`id` = auth user id, `email`, and the whole resume stored as a `resume_data` JSON blob).
  - `jobs` — one row per tracked application (company, position, status, application_date, location, remote, notes, description, `attachments` JSON, `user_id`).
- Edge functions (5): `generate-summary`, `generate-bullets`, `suggest-skills`, `generate-cover-letter`, `generate-resume-pdf`.

## What's connected outside of Lovable

1. **OpenAI (your own API key)** — four edge functions call `https://api.openai.com/v1/chat/completions` using an `OPENAI_API_KEY` secret stored in Supabase. Models in use: `gpt-4o-mini` for summaries, bullets, and cover letters; `gpt-4.1-2025-04-14` for skill suggestions. Your OpenAI account is billed, not Lovable AI.
2. **Resume PDF API on Render** — `https://resume-pdf-api.onrender.com/generate`, a separate FastAPI service you deployed. The `generate-resume-pdf` edge function forwards the resume JSON (including a `header_color` hex value from the color picker) to it and streams the returned PDF back to the browser. The app labels this the "Professional PDF" option.
3. **Built-in fallback PDF** — `jspdf` + `html2canvas` in the browser, offered as "Basic PDF (Fallback)" so exports still work if the Render service is asleep or down.

Flow for AI features: browser -> Supabase edge function -> OpenAI -> back.
Flow for the good PDF: browser -> Supabase edge function -> Render FastAPI -> PDF blob -> download.

## Notes for your developer friend (worth fixing before public launch)

- The Supabase URL and anon publishable key are hardcoded in `src/integrations/supabase/client.ts`, `src/services/aiService.ts`, and `src/services/resumeApiService.ts`. `aiService.ts` creates a *second* Supabase client, so AI calls do not share the logged-in session — these should be consolidated onto the single shared client.
- `resume_data` as one JSON blob works, but normalizing into `experiences` / `education` / `skills` tables is the natural next step for querying and analytics.
- Edge functions currently accept any request carrying the anon key. For a free public app they need per-user auth checks plus rate limiting, or OpenAI cost can be abused. Same for the Render service, which is open to the internet with no auth.
- Render free tier cold-starts (~30-60s on first request), which is why the fallback exporter exists.
- Row Level Security policies and table grants on `profiles` and `jobs` should be re-verified before opening signups.
- No migration files are checked into `supabase/migrations`, so the schema lives only in the hosted project. Capturing it as migrations makes the setup reproducible.

## Proposed next steps (pick any, in order of value)

1. Verify RLS + grants on `profiles` and `jobs`, and capture the current schema as migration files.
2. Consolidate to one Supabase client and remove the duplicated hardcoded keys.
3. Add auth verification + simple per-user rate limits to all five edge functions.
4. Decide OpenAI vs Lovable AI for the AI features (Lovable AI removes your OpenAI key and billing from the picture).
5. Harden the PDF path: either lock the Render service down, or move PDF generation into the edge function so there is no third-party dependency.
6. Public polish: landing page copy, SEO metadata, email confirmation flow, and publishing to your `career-compass-ai-helper` domain.
