# Move PDF generation into the edge function (drop the Render dependency)

## Goal

Generate the "Professional PDF" entirely inside the `generate-resume-pdf` Supabase edge function, so `https://resume-pdf-api.onrender.com` is no longer in the path. No cold starts, no external service to keep alive, same download UX.

## How it works today

Browser -> `generate-resume-pdf` edge function -> Render FastAPI (Python/fpdf) -> PDF bytes -> browser download. The frontend also sanitizes Unicode to ASCII because fpdf uses latin-1 encoding.

## How it will work after

Browser -> `generate-resume-pdf` edge function (builds the PDF in Deno) -> PDF bytes -> browser download.

The request/response contract stays identical: the function still accepts the same JSON (`name`, `email`, `phone`, `website`, `summary`, `education[]`, `experience[]`, `skills`, `header_color`) and still returns `application/pdf` bytes. That means `src/services/resumeApiService.ts` and the export buttons need no changes.

## Implementation

1. **Add a PDF renderer inside the function.** Use `jspdf` via Deno's npm import (`import { jsPDF } from "npm:jspdf"`) — the same library the fallback exporter already uses, so layout code and behavior are familiar. Alternative if we want richer typography later: `pdf-lib`.

2. **New file `supabase/functions/generate-resume-pdf/renderResume.ts`** holding the layout: header block (name in `header_color`, contact line), Professional Summary, Experience (job title / company / location+dates, bulleted points with wrapping), Education, Skills. Uses `splitTextToSize` for wrapping, tracks a `y` cursor, and adds a page when content overflows. Ported from the existing `src/utils/pdfGenerator.ts` layout so the output looks like the current professional PDF rather than a downgrade.

3. **Rewrite `supabase/functions/generate-resume-pdf/index.ts`** to: handle CORS preflight, validate the body with zod (clear 400 on bad input), call `renderResume(data)`, and return the bytes with `Content-Type: application/pdf`. Remove the `fetch` to Render.

4. **Drop the latin-1 workaround.** jsPDF's standard fonts are still WinAnsi, so keep the existing `sanitizeText` in `resumeApiService.ts` for safety, but the crash risk goes away. If we want true Unicode (accents, curly quotes, non-Latin names), embed a TTF such as DejaVu Sans in the function and register it with `addFileToVFS`/`addFont` — worth doing as a follow-up rather than in the first pass.

5. **Keep the fallback button** for one release, then decide whether to remove it once the edge-function path is proven.

6. **Verify** by calling the deployed function directly with a realistic resume payload, saving the PDF, rendering each page to an image, and inspecting for clipped text, overlap, wrong header color, and page breaks in the middle of a bullet.

## Trade-offs

- Edge functions have a memory/CPU ceiling; a jsPDF text-layout resume is light, so this is not a concern.
- Layout must be re-expressed in JS. That is the bulk of the work — the Python service's exact spacing won't carry over automatically, so expect a round or two of visual tuning.
- Once this ships, the Render service and its deployment can be retired.

## Out of scope

Auth checks and rate limiting on the function (tracked separately), and any resume design changes.
