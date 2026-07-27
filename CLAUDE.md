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

## Structure and conventions

### Herramientas-IA/ (tools directory)
- `index.html` is a long single page: a grid of AI tools grouped into category sections (Chatbots, Investigación, Agentes, Productividad, Automatización, Vibe Coding, Video e Imagen). Each tool is an `.ai-button-row` with three parts: the tool link (`.ai-button`), an info button (`.info-button`, opens a matching `#modal-<tool>` via `data-modal`) and a YouTube tutorial link (`.youtube-button`, or `.sin-enlace` as a placeholder when no tutorial exists yet). All modal markup lives at the bottom of the same file, one `<div id="modal-...">` per tool.
- To add a new tool: add an `.ai-button-row` in the right category, add its logo image to the folder, and append a corresponding `#modal-*` block with a short description and (optionally) EN/ES Wikipedia or docs links.
- `styles.css` is the light theme; `styles-dark.css` is a separate full dark theme stylesheet, toggled at runtime by `scripts.js` via a `dark-mode` class on `<body>` and persisted in `localStorage`. `scripts.js` also wires up modal open/close behavior.
- Google Analytics 4 (gtag) is embedded directly in `index.html`, with custom click events (`click_herramienta`, `click_tutorial`, `click_info`, `click_guia`, `click_recursos`) tracked via inline `<script>` at the bottom of the file — preserve this tracking when editing the page's interactive elements.
- This section is a PWA: `manifest.json` + `sw.js` (cache-first service worker) + `icon-192.png`/`icon-512.png`. `generador.html` is a standalone offline utility (not part of the site nav) for regenerating those PNG icons from an inline SVG via `<canvas>` — open it directly in a browser and use the download buttons.
- `cual.html` is a standalone comparison/decision guide ("¿Cuál IA elegir?"), linked from the corner emoji button on the main page.

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
- Favicons are frequently inlined as `data:image/svg+xml` data URIs rather than separate files — follow this pattern for simple icon needs instead of adding new binary assets.
- Pages are self-contained: CSS is per-section (no shared global stylesheet across `Herramientas-IA`/`Recursos-IA`/`Cursos-IA`), and external libraries (Bootstrap, Google Fonts) are pulled from CDNs via `<link>`/`<script>` tags rather than bundled.
- `.gitignore` excludes `*.pptx` and `Placas*.*` (source slide decks) — these are not tracked and won't appear in the working tree.

## Pending improvements (Herramientas-IA/index.html)

The tools directory page is manually maintained HTML (~870 lines) and has outgrown that pattern. Planned but not yet implemented:

- **Data-driven rendering**: extract each tool's data (name, URL, logo, category, modal description, YouTube link) into a single JS/JSON data file and render the button rows + modals dynamically. Today, adding a tool means editing three separate HTML blocks by hand, which has already caused a copy-paste bug (the Replit modal briefly had `<h3>Perplexity</h3>` as its title — fixed 2026-07-27). Main tradeoff: adds a small vanilla-JS rendering layer and makes tool content less directly crawlable in raw HTML.
- **Self-host favicons**: several tool logos are hotlinked from external sites' `/favicon.ico` (Minimax, Genspark, Manus, Make, n8n, Lovable, Kimi) — fragile if those sites change or block hotlinking.
- **Fuller PWA offline cache**: `sw.js`'s `urlsToCache` list omits `styles-dark.css` and the logo images, so offline support is partial.
- **Consolidate light/dark CSS**: `styles.css` and `styles-dark.css` are separate full stylesheets (326 + 357 lines) rather than one stylesheet using CSS variables/`prefers-color-scheme`, risking future drift between themes.
