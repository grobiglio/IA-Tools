# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static, multi-page website (no framework, no build step, no package manager) with content in Spanish about artificial intelligence: an entry/landing page, a tools directory and a curated resources page. Author: Guillermo A. Robiglio. Each top-level folder is deployed independently under `ingg.ar`:

- `Landing/` → `ingg.ar/ia/`
- `Herramientas-IA/` → `ingg.ar/herramientas-ia/`
- `Recursos-IA/` → `ingg.ar/ia/recursos/` (`ingg.ar/enlaces/` is a separate, still-live page used as the author link in the footers)

There is no server-side code, no dependencies, and no test suite. Every page is plain HTML/CSS/vanilla JS meant to be opened directly in a browser or served by any static file server.

## Running locally

No build or install step. To preview with correct relative paths, serve from the repo root (or a section's folder) with any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then open the relevant `index.html` (e.g. `http://localhost:8000/Herramientas-IA/`).

`Herramientas-IA/` has a generation step (no dependencies, Node only): after editing `herramientas.json`, run `cd Herramientas-IA && node build.js` before committing. `node build.js --check` fails if the generated files are stale. **Also run it after editing `styles.css` or `scripts.js`**: their URLs carry a content hash.

## Structure and conventions

### Herramientas-IA/ (tools directory)
**`index.html` is a generated artifact — `herramientas.json` is the source of truth.** See `Herramientas-IA/README.md` for the maintainer-facing guide.

- Pipeline: `herramientas.json` → `node build.js` → the two generated regions of `index.html` (the category grid and the modals) plus the precache list and `CACHE_NAME` of `sw.js`. Output is plain static HTML, so the tool names and descriptions stay crawlable and the page works without JS.
- `build.js` only rewrites what sits between `<!-- BEGIN:GRID -->`/`<!-- END:GRID -->` and `<!-- BEGIN:MODALES -->`/`<!-- END:MODALES -->` (and `// BEGIN:CACHE`/`// BEGIN:ASSETS` in `sw.js`). It never writes below `END:MODALES`, so the `<head>`, the GA4 tracking and the footer are out of its reach by construction — edit those by hand as before. Never hand-edit inside the markers. One narrow exception: it rewrites the `?v=<hash>` suffix of the `styles.css`/`scripts.js` references in `index.html` and `cual.html` (cache busting, see below).
- Each tool renders as an `.ai-button-row` with three parts: the tool link (`.ai-button`), an info button (`.info-button`, opens `#modal-<id>` via `data-modal`) and a YouTube tutorial link (`.youtube-button`, or `.sin-enlace` — rendered with no `href` — when `tutorial` is `null`). The tool's `id` field fixes the modal id, so the button↔modal pairing can't drift; `build.js` also asserts the bijection on every run.
- Adding a tool is: drop `logo_<id>.png` (64×64 PNG, transparent, centered) in the folder, add one object to `herramientas.json`, run `node build.js`. CLI: `--check` (fails if the artifacts are stale), `--stats`, `--nombres`.
- `build.js` validates the data and refuses to build on: duplicate ids or names, non-https urls, a `logo` starting with `http` (no hotlinking — the 7 tools that used to hotlink other sites' `favicon.ico` are now self-hosted), a missing logo file, an empty description, or a description containing HTML comments.
- Google Analytics 4 (gtag) is embedded directly in `index.html`, with custom click events (`click_herramienta`, `click_tutorial`, `click_info`, `click_guia`, `click_recursos`, `click_acceso`) tracked via inline `<script>` at the bottom of the file — preserve this tracking when editing the page's interactive elements. Notes:
  - The `nombre` field is what gets sent as the `herramienta` parameter (the tracker reads `textContent.trim()` of the `.ai-button`). Renaming a tool is expected and encouraged when the vendor renames it — a directory showing stale names looks abandoned — but it splits the GA4 series on that date, so record the old value in `nombresPrevios`. `build.js` warns on every detected rename and reminds you to document it; `--nombres` prints the equivalence table.
  - Any new control added to the page must not reuse the classes `.corner-link`, `.ai-button`, `.info-button`, `.youtube-button` or `.additional-cta-button`. The theme toggle uses its own `.corner-toggle` precisely because the tracker binds `click_guia` to the *first* `.corner-link` in the DOM.
  - `click_recursos` reports `destino: 'enlaces.html'` although the real href is `https://ingg.ar/ia/recursos/`. Left as is on purpose, for continuity of the historical report.
  - `click_acceso` (added 2026-11-14) tracks the three `.extra-link` buttons under "Recursos Adicionales" (Ecosistema IA, Biblioteca IA, Canal Python & IA), sending their `data-destino` (`ecosistema`, `biblioteca`, `whatsapp`). They use their own `.extra-link` class precisely so they don't feed `click_herramienta`/`click_recursos`.
- `styles.css` is a **single** stylesheet holding both themes as custom properties (`:root` = dark, `html[data-theme="light"]` = light overrides). `styles-dark.css` no longer exists. The theme is applied via a `data-theme` attribute on `<html>`, set by a synchronous script in the `<head>` before first paint (anti-FOUC), read from `localStorage.theme` with **dark as the default**. `scripts.js` wires the modals and the `#theme-toggle` button. `cual.html` is pinned to light via `data-theme="light"` in its markup (its own inline `<style>` has light colors hardcoded).
- This section is a PWA: `manifest.json` + `sw.js` + `icon-192.png`/`icon-512.png`. `sw.js` is generated: network-first for HTML (so a newly added tool shows up on the next reload rather than waiting for the service worker to change), cache-first for everything else, cross-origin requests untouched, old caches cleaned in `activate`, and `CACHE_NAME` derived from a content hash so invalidation isn't a manual step. `generador.html` is a standalone offline utility (not part of the site nav) for regenerating those PNG icons from an inline SVG via `<canvas>` — open it directly in a browser and use the download buttons.
- **Cache busting** (added 2026-11-15): the host (Hostinger CDN, `server: hcdn`) serves static files with `cache-control: max-age=604800` (7 days) and no `cache-control` on HTML. Because `styles.css` kept the same URL, phones and CDN edges kept the old CSS for days after a deploy — new markup showed up unstyled on mobile while desktop (DevTools open, cache disabled) looked fine. Fix: `build.js` appends `?v=<sha1 of the file>` to `styles.css`/`scripts.js` in the HTML and in the `sw.js` precache list, and the SW `install` precaches with `cache: "reload"` so it never copies a stale HTTP-cached file into the new cache. Any new local CSS/JS file referenced from the HTML should be added to `VERSIONADOS` in `build.js`.
- `cual.html` is a standalone comparison/decision guide ("¿Cuál IA elegir?"), linked from the corner emoji button on the main page. It shares `styles.css` and reuses 5 of the tool logos.

### Recursos-IA/ (resources page)
- Single `index.html` page built from repeated `.grid` sections, each pairing a `.card` (image, embedded YouTube iframe, or Udemy-style preview) with an `.explain` aside describing the resource. Follow this two-column card pattern when adding a new resource row.
- Includes Open Graph and Twitter Card meta tags for link-preview rendering (WhatsApp/social sharing) — keep these in sync with `og-image.jpg` if content changes materially.

### Landing/ (ecosystem entry page)
- Single `index.html` + `styles.css`: a header and a `.button-container` of `.button` links to the rest of the ecosystem (Herramientas IA, Recursos IA, Biblioteca IA, the Python & IA WhatsApp channel, and an inline "Notepad" that opens a `contenteditable` blank window). Font Awesome icons from cdnjs.
- Until 2026-11-14 it lived at `Cursos-IA/landing/`. The whole `Cursos-IA/` section (course pages, Markdown study notes, the `bruner.html`/`fadea.html` landings) was removed then: the author no longer keeps links to their own courses because they go stale fast. Don't re-add dated course links here. The removed material is still in git history.
- "Biblioteca IA" points to a Claude artifact (`claude.ai/artifact/83mk2XC3W28TjrXEFsbZJe`), not the old Google Drive folder.

## General conventions across the repo
- All user-facing text is in Spanish (`lang="es"`); keep new content in Spanish.
- Favicons are frequently inlined as `data:image/svg+xml` data URIs rather than separate files — follow this pattern for simple icon needs instead of adding new binary assets. This does *not* apply to the tool logos in `Herramientas-IA/`, which are local `logo_*.png` files by design.
- Pages are self-contained: CSS is per-section (no shared global stylesheet across `Landing`/`Herramientas-IA`/`Recursos-IA`), and external libraries (Bootstrap, Google Fonts) are pulled from CDNs via `<link>`/`<script>` tags rather than bundled.
- `.gitignore` excludes `*.pptx` and `Placas*.*` (source slide decks) — these are not tracked and won't appear in the working tree.

## Pending improvements (Herramientas-IA/)

The four items previously listed here — data-driven rendering, self-hosted favicons, a complete PWA precache and a single consolidated stylesheet — were all implemented on 2026-07-30. What remains open:

- **`cual.html` isn't themed**: it shares `styles.css` but its own inline `<style>` still has light colors hardcoded, so it's pinned to `data-theme="light"`. Converting those ~6 rules to the shared tokens would let it follow the user's theme.
- **Grok Bot (xAI) sitting in the backlog** as a `"pendiente": true` entry under Agentes, added 2026-11-14. It's a closed, cloud-hosted multi-agent product similar in spirit to Paperclip, but it's paid-only (The X Subscription Premium/Super/Ultra, SuperGrok/SuperGrok Heavy, or some Cursor plans), so it waits until there's free/general access or a decision to list paid-only tools. Its `url` is the official docs page because the product page (`x.ai/grok-bot`) couldn't be verified (403 to automated requests).
- **Seedance also sitting in the backlog** as a `"pendiente": true` entry in `herramientas.json`. The other nine (OPAL; Cursor, Claude Code, Codex; Midjourney, Flux, Ideogram, Luma, Kling) went live on 2026-09-28. Seedance stayed out because `seedance.ai` states in its own footer that it is not affiliated with ByteDance, the actual author of the model — it needs a decision on which URL it should point to (the official ByteDance model page, Dreamina, or none).
- **No automated tests**: `node build.js --check` covers staleness and the button↔modal bijection, but there's no link checker for the 37 tool URLs, which do rot (`us2.make.com` had gone 404).
- **24 of 37 tools still have no tutorial** (`"tutorial": null`), rendered as a disabled ▶ — the nine added on 2026-09-28 and the three agents added on 2026-11-14 (OpenClaw, Hermes Agent, Paperclip) all came in without one.
