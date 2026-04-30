# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript portfolio website for "Casa Elegance" interior design services. No build tools, no package manager, no backend — deploy by serving the files directly.

## Development

Open `index.html` in a browser directly, or use any static file server:

```bash
# Python
python -m http.server 8080

# Node (if available)
npx serve .
```

No build step, no compilation, no install required.

## Architecture

Three files drive the entire site:

- **[index.html](index.html)** — Single-page layout with all sections (hero, services, portfolio, testimonials, FAQ, contact)
- **[styles.css](styles.css)** — All styles (~1,000 lines). Uses CSS custom properties for theming. BEM naming (`mrittik-*`, `services-*`, `work-*`). Desktop breakpoint at `992px` (min-width).
- **[script.js](script.js)** — Vanilla JS, no frameworks. Organized as independent setup functions called at load time:

| Function | Responsibility |
|---|---|
| `setupMrittikHeader()` | Fixed nav, mobile menu toggle, search modal |
| `setupHeroSlider()` | Hero carousel with autoplay, touch, dots |
| `setupScrollReveal()` | Intersection Observer fade-in animations |
| `setupServices()` | Service card tilt/hover effects |
| `setupSlider()` | Testimonial slider with touch support |
| `setupFaq()` | Accordion FAQ |

All setup functions are called unconditionally at script load — there are no lifecycle hooks or lazy initialization.

## Assets

Images live in [assets/](assets/) as PNG/WebP. Some images are also loaded from an external CDN (`assets.website-files.com`). The file `arsy-ref.css` is referenced in the HTML but not present locally — this is expected (external reference).

## Conventions

- Data attributes (`data-*`) are the primary DOM selector strategy in JS — avoid adding `id`/`class` selectors that clash with existing BEM names.
- Touch events use `{ passive: true }` — maintain this when adding new touch handlers.
- The `tmp-*` files in the project root are reference/scratch files, not part of the site.
