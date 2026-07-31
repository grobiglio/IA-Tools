# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static, multi-page website (no framework, no build step, no package manager) with content in Spanish about artificial intelligence: a tools directory, a curated resources page, and course materials. Author: Guillermo A. Robiglio. Each top-level folder is deployed independently under `ingg.ar`:

- `Herramientas-IA/` → `ingg.ar/herramientas-ia/`
- `Recursos-IA/` → `ingg.ar/enlaces/`
- `Cursos-IA/` → `ingg.ar/curso-chatgpt/`

There is no server-side code, no dependencies, and no test suite. Every page is plain HTML/CSS/vanilla JS meant to be opened directly in a browser or served by any static file server.

## Running locally

No build or install step. To preview with correct relative paths, serve from the repo root (or a section's folder) with any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then open the relevant `index.html` (e.g. `http://localhost:8000/Herramientas-IA/`).

`Herramientas-IA/` has a generation step (no dependencies, Node only): after editing `herramientas.json`, run `cd Herramientas-IA && node build.js` before committing. `node build.js --check` fails if the generated files are stale.

## Structure and conventions

### Herramientas-IA/ (tools directory)
**`index.html` is a generated artifact — `herramientas.json` is the source of truth.** See `Herramientas-IA/README.md` for the maintainer-facing guide.

- Pipeline: `herramientas.json` → `node build.js` → the two generated regions of `index.html` (the category grid and the modals) plus the precache list and `CACHE_NAME` of `sw.js`. Output is plain static HTML, so the tool names and descriptions stay crawlable and the page works without JS.
- `build.js` only rewrites what sits between `<!-- BEGIN:GRID -->`/`<!-- END:GRID -->` and `<!-- BEGIN:MODALES -->`/`<!-- END:MODALES -->` (and `// BEGIN:CACHE`/`// BEGIN:ASSETS` in `sw.js`). It never writes below `END:MODALES`, so the `<head>`, the GA4 tracking and the footer are out of its reach by construction — edit those by hand as before. Never hand-edit inside the markers.
- Each tool renders as an `.ai-button-row` with three parts: the tool link (`.ai-button`), an info button (`.info-button`, opens `#modal-<id>` via `data-modal`) and a YouTube tutorial link (`.youtube-button`, or `.sin-enlace` — rendered with no `href` — when `tutorial` is `null`). The tool's `id` field fixes the modal id, so the button↔modal pairing can't drift; `build.js` also asserts the bijection on every run.
- Adding a tool is: drop `logo_<id>.png` (64×64 PNG, transparent, centered) in the folder, add one object to `herramientas.json`, run `node build.js`. CLI: `--check` (fails if the artifacts are stale), `--stats`, `--nombres`.
- `build.js` validates the data and refuses to build on: duplicate ids or names, non-https urls, a `logo` starting with `http` (no hotlinking — the 7 tools that used to hotlink other sites' `favicon.ico` are now self-hosted), a missing logo file, an empty description, or a description containing HTML comments.
- Google Analytics 4 (gtag) is embedded directly in `index.html`, with custom click events (`click_herramienta`, `click_tutorial`, `click_info`, `click_guia`, `click_recursos`) tracked via inline `<script>` at the bottom of the file — preserve this tracking when editing the page's interactive elements. Notes:
  - The `nombre` field is what gets sent as the `herramienta` parameter (the tracker reads `textContent.trim()` of the `.ai-button`). Renaming a tool is expected and encouraged when the vendor renames it — a directory showing stale names looks abandoned — but it splits the GA4 series on that date, so record the old value in `nombresPrevios`. `build.js` warns on every detected rename and reminds you to document it; `--nombres` prints the equivalence table.
  - Any new control added to the page must not reuse the classes `.corner-link`, `.ai-button`, `.info-button`, `.youtube-button` or `.additional-cta-button`. The theme toggle uses its own `.corner-toggle` precisely because the tracker binds `click_guia` to the *first* `.corner-link` in the DOM.
  - `click_recursos` reports `destino: 'enlaces.html'` although the real href is `https://ingg.ar/ia/recursos/`. Left as is on purpose, for continuity of the historical report.
- `styles.css` is a **single** stylesheet holding both themes as custom properties (`:root` = dark, `html[data-theme="light"]` = light overrides). `styles-dark.css` no longer exists. The theme is applied via a `data-theme` attribute on `<html>`, set by a synchronous script in the `<head>` before first paint (anti-FOUC), read from `localStorage.theme` with **dark as the default**. `scripts.js` wires the modals and the `#theme-toggle` button. `cual.html` is pinned to light via `data-theme="light"` in its markup (its own inline `<style>` has light colors hardcoded).
- This section is a PWA: `manifest.json` + `sw.js` + `icon-192.png`/`icon-512.png`. `sw.js` is generated: network-first for HTML (so a newly added tool shows up on the next reload rather than waiting for the service worker to change), cache-first for everything else, cross-origin requests untouched, old caches cleaned in `activate`, and `CACHE_NAME` derived from a content hash so invalidation isn't a manual step. `generador.html` is a standalone offline utility (not part of the site nav) for regenerating those PNG icons from an inline SVG via `<canvas>` — open it directly in a browser and use the download buttons.
- `cual.html` is a standalone comparison/decision guide ("¿Cuál IA elegir?"), linked from the corner emoji button on the main page. It shares `styles.css` and reuses 5 of the tool logos.

### Recursos-IA/ (resources page)
- Single `index.html` page built from repeated `.grid` sections, each pairing a `.card` (image, embedded YouTube iframe, or Udemy-style preview) with an `.explain` aside describing the resource. Follow this two-column card pattern when adding a new resource row.
- Includes Open Graph and Twitter Card meta tags for link-preview rendering (WhatsApp/social sharing) — keep these in sync with `og-image.jpg` if content changes materially.

### Cursos-IA/ (course materials)
- `contenido/` holds the course pages themselves: `index.html` is a card-grid landing page linking to numbered topic pages (`1-gen-ia.html`, `2-prompt.html`, `3-chatgpt.html`, `4-otras-ia.html`); each topic page is a series of `<section>`s with headings, prose, and the occasional `.aplicacion-box` callout. Shared styling lives in `contenido/styles/style.css`.
- `contenido/apuntes/` holds long-form Markdown study notes per tool (`Apunte-ChatGPT.md`, `Apunte-Claude.md`, `Apunte-Gemini.md`, `uso-ChatGPT.md`) — these are reference/study material, not rendered directly by the HTML pages.
- `landing/` holds separate short landing pages (`index.html`, `bruner.html`, `fadea.html`) for course sign-up/access, each with its own `styles.css`.
- New topic pages should follow the existing numbered naming convention and be added as a `course-card` in `contenido/index.html`.

## General conventions across the repo
- All user-facing text is in Spanish (`lang="es"`); keep new content in Spanish.
- Favicons are frequently inlined as `data:image/svg+xml` data URIs rather than separate files — follow this pattern for simple icon needs instead of adding new binary assets. This does *not* apply to the tool logos in `Herramientas-IA/`, which are local `logo_*.png` files by design.
- Pages are self-contained: CSS is per-section (no shared global stylesheet across `Herramientas-IA`/`Recursos-IA`/`Cursos-IA`), and external libraries (Bootstrap, Google Fonts) are pulled from CDNs via `<link>`/`<script>` tags rather than bundled.
- `.gitignore` excludes `*.pptx` and `Placas*.*` (source slide decks) — these are not tracked and won't appear in the working tree.

## Pending improvements (Herramientas-IA/)

The four items previously listed here — data-driven rendering, self-hosted favicons, a complete PWA precache and a single consolidated stylesheet — were all implemented on 2026-07-30. What remains open:

- **`cual.html` isn't themed**: it shares `styles.css` but its own inline `<style>` still has light colors hardcoded, so it's pinned to `data-theme="light"`. Converting those ~6 rules to the shared tokens would let it follow the user's theme.
- **9 tools sitting in the backlog** as `"pendiente": true` entries in `herramientas.json` (OPAL; Cursor, Claude Code, Codex; Midjourney, Flux, Ideogram, Luma, Kling). They need a logo, a description and a URL to go live.
- **Firebase Studio is being sunset by Google** (new workspaces disabled since 2026-06-22, full shutdown announced for 2027) — decide whether to drop it from the Vibe Coding category or leave it with a note.
- **No automated tests**: `node build.js --check` covers staleness and the button↔modal bijection, but there's no link checker for the 26 tool URLs, which do rot (`us2.make.com` had gone 404).
- **13 of 26 tools still have no tutorial** (`"tutorial": null`), rendered as a disabled ▶.
