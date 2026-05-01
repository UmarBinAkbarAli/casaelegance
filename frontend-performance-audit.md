# Frontend Performance And Refactor Audit

Date: 2026-05-01

Scope: static HTML/CSS/JavaScript website in `files-mentioned-by-the-user-home`.

No implementation changes were made as part of this audit. This report is intended to be reviewed and approved before refactoring.

## Executive Summary

The website is close to completion and already has a useful static build foundation through `build-pages.js` and `templates/partials`. The most practical optimization path is to build on that existing static generation approach, not to introduce React, Next.js, or runtime HTML partial injection.

The highest-impact issues are:

- `styles.css` is approximately 206 KB uncompressed and contains a large Webflow-style export with likely unused blog, shop, ecommerce, utility, and legacy classes.
- Every page links `./arsy-ref.css`, but that file does not exist in the site root. This creates a render-blocking 404 on every page.
- Every generated page loads Swiper CSS and JS even when no Swiper slider exists, such as `projects.html`, `project-details.html`, and `contact.html`.
- Images do not include explicit `width` and `height`, so layout shifts are more likely.
- Nearly all images lack `loading="lazy"` and `decoding="async"`, including below-the-fold images.
- The `assets/` directory contains about 36.9 MB of files, but only about 3.3 MB appears referenced by the current pages. Around 33.6 MB appears unused for the current static site.
- Fonts are loaded as five remote OTF files from Website Files CDN. They should be self-hosted as WOFF2 with fewer weights if possible.
- Some homepage project links point to `/project/...`, but the static site has `project-details.html`, which can cause broken links depending on hosting.
- Some content and assets are still pulled from external demo/reference domains, including `demo.bravisthemes.com` and `cdn.prod.website-files.com`.

What should be fixed first:

1. Remove or restore the missing `arsy-ref.css` reference.
2. Conditionally load Swiper only on pages that use sliders.
3. Add image dimensions, lazy loading, async decoding, and priority hints.
4. Optimize/deploy only referenced images and assets.
5. Extend the existing static build system to cover all repeated sections and `project-details.html`.
6. Split and gradually prune `styles.css` only after visual regression checks.

What should not be changed blindly:

- Do not rewrite the entire CSS file at once.
- Do not remove Webflow-style classes until all current page markup is mapped.
- Do not replace Swiper unless visual parity and gesture behavior are confirmed.
- Do not move header/footer to runtime `fetch()` injection for production HTML, because it can hurt SEO and first render.
- Do not remove reveal animations wholesale; they are already implemented with `IntersectionObserver` and mostly animate only `opacity` and `transform`.

## Current Project Structure Notes

Important production source files:

- `index.html`
- `about.html`
- `services.html`
- `projects.html`
- `project-details.html`
- `contact.html`
- `styles.css`
- `script.js`
- `build-pages.js`
- `templates/layout.html`
- `templates/partials/header.html`
- `templates/partials/mobile-menu.html`
- `templates/partials/search-modal.html`
- `templates/partials/footer.html`
- `templates/partials/partners.html`
- `templates/partials/home-global-styles.html`

Existing static build approach:

- `build-pages.js` reads the generated HTML pages.
- It extracts each page's `<main>...</main>` block.
- It wraps the main content in `templates/layout.html`.
- It injects shared partials such as header, mobile menu, search modal, partners, and footer.

This is the right direction. The recommended component strategy is to improve this build-time partial system rather than loading shared HTML at runtime.

## Measured File And Asset Findings

Core file sizes:

- `styles.css`: about 205.6 KB, 3,493 lines.
- `script.js`: about 13.1 KB, 429 lines.
- `index.html`: about 82.6 KB.
- `services.html`: about 45.9 KB.
- `about.html`: about 24.6 KB.
- `projects.html`: about 24.1 KB.
- `project-details.html`: about 13.5 KB.
- `contact.html`: about 8.7 KB.
- `templates/partials/partners.html`: about 30.4 KB, mostly inline SVG.

Asset inventory:

- Total `assets/`: about 36.9 MB across 166 files.
- Referenced by current pages/CSS: about 3.3 MB across about 30 files.
- Apparently unused by current pages/CSS: about 33.6 MB across about 136 files.

Largest referenced assets:

- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f7e0b317dbdb8e3231_02. Khyber Restaurant.png`: about 543 KB, used by `index.html`.
- `assets/project-elegant-retreat.png`: about 337 KB, used by `projects.html`.
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8eeb18c917589f966d7_01. Khyber Restaurant_Hero.jpeg`: about 300 KB, used by `projects.html`.
- `assets/casa-elegance-logo.png`: about 273 KB, used on all pages.
- `assets/project-modern-marvel.png`: about 265 KB, used by `projects.html`.
- `assets/project-grand-vista.png`: about 248 KB, used by `projects.html`.
- `assets/casa-elegance-icon.png`: about 140 KB, used by `about.html` and `services.html`.

Largest apparently unused assets:

- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/3BHK Apartment - Blue Waters.mp4`: about 1.3 MB.
- Several Khyber Restaurant PNGs between about 445 KB and 881 KB.
- Several Palm Hills villa JPEGs between about 386 KB and 740 KB.
- `assets/hero-main.png`: about 546 KB.
- `assets/testimonial-bg.png`: about 488 KB.

## Performance Audit

### CSS

Current issue:

- `styles.css` begins with remote font faces, then a large minified Webflow export, followed by custom site CSS.
- It includes broad sections for blog, shop, ecommerce, product pages, checkout, Webflow widgets, Webflow icons, and utility classes that appear unused by the current visible pages.
- The CSS is render-blocking and loaded on every page.

Why it matters:

- Larger CSS increases download, parse, style calculation, and render-blocking time.
- Unused selectors make future maintenance risky because it is harder to know which rules are active.

Recommended fix:

- Phase the cleanup. First split the file into conceptual files without deleting rules.
- Suggested files:
  - `styles/base.css`
  - `styles/vendor-webflow.css`
  - `styles/components.css`
  - `styles/pages-home.css`
  - `styles/pages-about.css`
  - `styles/pages-projects.css`
  - `styles/pages-contact.css`
- After visual checks pass, prune unused Webflow/blog/shop/product/checkout sections.

Risk level: High if done aggressively, Low to Medium if split first without deleting rules.

### JavaScript

Current issue:

- `script.js` is reasonably small and uses vanilla JS.
- Swiper initialization is guarded, but Swiper library files are loaded globally from CDN on all pages.
- `projects.html` has an inline filter script instead of centralizing behavior in `script.js`.
- Header behavior uses a passive scroll listener, which is acceptable but could be optimized through `requestAnimationFrame` if jank appears.
- Project filter resize logic is unthrottled.

Why it matters:

- Loading Swiper on non-slider pages wastes bandwidth and parse time.
- Inline scripts make caching and organization weaker.
- Resize handlers can fire repeatedly during drag-resize.

Recommended fix:

- Add page-level flags to `build-pages.js`, such as `needsSwiper`.
- Only include Swiper CSS/JS for `index.html`, `about.html`, and `services.html`.
- Move the project filter script into `script.js` or a small `components/projects-filter.js`.
- Debounce or `requestAnimationFrame`-gate resize updates.
- Add `defer` to local scripts in the layout.

Risk level: Low.

### Render Blocking Requests

Current issue:

- All pages load:
  - Swiper CSS from CDN.
  - Missing `./arsy-ref.css`.
  - `styles.css`.
  - Swiper JS from CDN.
  - `script.js`.

Why it matters:

- The missing stylesheet is an unnecessary network failure.
- Swiper CSS is render-blocking even on pages that do not use it.

Recommended fix:

- Remove `arsy-ref.css` if it is a stale reference.
- If it is required, restore the file and confirm what rules it contains.
- Load Swiper conditionally.
- Add `defer` to JS scripts.

Risk level: Low.

### Third-Party Libraries

Current issue:

- Swiper is loaded globally.
- Remote fonts are loaded from Website Files.
- Multiple images are pulled from `cdn.prod.website-files.com` and `demo.bravisthemes.com`.
- Google Maps iframe is present on the contact page.

Why it matters:

- External origins introduce DNS/TLS latency, cache unpredictability, privacy considerations, and possible future asset breakage.

Recommended fix:

- Self-host all final production images.
- Self-host fonts as WOFF2.
- Keep Google Maps iframe lazy-loaded, but ensure it only exists on the contact page.
- Conditionally load Swiper.

Risk level: Medium because changing external assets can alter visual appearance if replacements are not exact.

### Images

Current issue:

- Most images have no `loading`, `decoding`, `width`, or `height`.
- Project/gallery images are loaded at original dimensions and formats.
- Large PNG images are used where WebP/AVIF would likely be smaller.
- The logo file is about 273 KB, which is too large for a repeated brand asset.

Why it matters:

- Missing dimensions can cause layout shift.
- Large images delay LCP and increase bandwidth.
- Repeated heavy logo/icon files affect every page.

Recommended fix:

- Add explicit `width` and `height` attributes.
- Add `loading="lazy"` to below-fold images.
- Add `decoding="async"` to non-critical images.
- Use `fetchpriority="high"` only for the true LCP image on each page.
- Convert large PNG/JPEG images to WebP and optionally AVIF.
- Replace `casa-elegance-logo.png` with an optimized PNG/WebP/SVG if available.
- Keep original source images outside the deployment folder or in a separate archive.

Risk level: Low to Medium.

### Fonts

Current issue:

- Five OTF weights of Mona Sans are loaded remotely:
  - 400
  - 500
  - 600
  - 700
  - 800
- `font-display: swap` is already present.

Why it matters:

- OTF files are heavier than WOFF2.
- Five weights may be more than the design actually needs.
- Remote font hosting adds external request cost.

Recommended fix:

- Self-host WOFF2 versions.
- Keep only required weights, likely 400, 600, and 800 or 400, 500, and 700.
- Add preload for the most important above-the-fold weight only if measured useful.

Risk level: Medium due to possible text reflow and subtle typography changes.

### Caching Opportunities

Current issue:

- Static assets are not fingerprinted.
- Large assets appear mixed between production and archive use.

Why it matters:

- Without hashed filenames or cache headers, repeat visits may not be as efficient.

Recommended fix:

- If hosting supports it, use long-cache headers for assets and short-cache for HTML.
- Consider hashed generated filenames only if a build step is acceptable.
- At minimum, keep stable asset paths and avoid changing filenames frequently.

Risk level: Low.

## Code Structure Audit

### Existing Strengths

- A static build file already exists.
- Header, mobile menu, search modal, footer, partners, and layout are already partialized.
- JavaScript is vanilla and not bloated.
- Scroll reveals use `IntersectionObserver`.
- No heavy framework is present.

### Main Structure Issues

- `project-details.html` is not included in `build-pages.js`, so it repeats layout/header/footer manually.
- `build-pages.js` has hardcoded page config but lacks per-page script/style flags.
- Service cards are repeated in `about.html` and `services.html`.
- Testimonials are repeated in `index.html`, `about.html`, and `services.html`.
- Contact form markup is repeated in `about.html` and `contact.html`.
- Project card markup is repeated and should be data-backed.
- Inline page script in `projects.html` should be centralized.
- The current generated pages contain full duplicated header/footer output, which is expected for final static HTML, but the source-of-truth should be partials/templates.

## Static-Site Component Strategy

Recommended strategy: build-time components with generated static HTML.

This preserves:

- SEO-friendly full HTML.
- Fast first render.
- No dependency on client-side `fetch()` for shared layout.
- No heavy framework.

Recommended build structure:

- Keep `templates/layout.html`.
- Keep `templates/partials/header.html`.
- Keep `templates/partials/mobile-menu.html`.
- Keep `templates/partials/search-modal.html`.
- Keep `templates/partials/footer.html`.
- Convert repeated sections to build-time partials or template functions.

Suggested new files:

- `templates/partials/service-card.html`
- `templates/partials/service-grid.html`
- `templates/partials/testimonials.html`
- `templates/partials/contact-form.html`
- `templates/partials/project-card.html`
- `templates/partials/project-breadcrumb.html`
- `templates/partials/project-cta.html`
- `templates/data/services.json`
- `templates/data/testimonials.json`
- `templates/data/projects.json`
- `templates/data/pages.json`

Alternative acceptable approach:

- Use JavaScript template strings inside `build-pages.js` instead of many small partial files.
- This can be simpler for repeated cards because data varies per item.

Avoid for production:

- Runtime `fetch()` of navbar/footer partials, unless paired with pre-rendering. Runtime injection can hurt SEO, delay visible layout, and create flash-of-missing-navigation.

## Animation Performance Audit

Current animation model:

- `script.js` uses `IntersectionObserver`.
- Reveal targets are elements with `data-w-id` and inline `opacity:0`.
- On intersection, `is-visible` is added once and the observer unobserves the target.
- CSS animates mostly `opacity` and `transform`.

This is the right model.

Current issues:

- `will-change: transform, opacity` is applied to all hidden reveal targets and may remain longer than needed.
- There are many reveal targets across pages.
- Homepage has a duplicate `data-w-id` value for multiple work cards.
- The animated site background has continuous animation. It is visually lightweight, but should respect reduced motion.
- Some hover effects use scale/filter/backdrop blur. These are acceptable in moderation but should be watched on mobile.

Recommended fix:

- Add `prefers-reduced-motion` CSS to disable non-essential animations.
- Remove `will-change` after reveal completes, or only apply it shortly before animation.
- Keep animation targets at wrapper/card level, not every small child.
- Do not animate Swiper slide internals directly.
- Do not animate iframe internals.
- Use transform and opacity only.

Risk level: Low if changes are additive.

## Asset Optimization Report

Images:

- Convert large `.png`, `.jpg`, and `.jpeg` images to WebP.
- Consider AVIF for hero/project images if acceptable.
- Keep JPEG fallback only if needed.
- Add responsive image sizes for hero/project cards if time allows.

Logo/icon:

- `assets/casa-elegance-logo.png` is about 273 KB and appears on every page.
- `assets/casa-elegance-icon.png` is about 140 KB and repeated in service cards.
- These should be replaced with optimized SVG/WebP/PNG assets.

Unused assets:

- Do not delete immediately if they are source/project archive assets.
- For deployment, publish only referenced production assets or move archive assets outside the public deploy folder.

Videos:

- One unused MP4 is present in current assets.
- If used later, provide poster, lazy loading, compressed MP4/WebM, and do not autoplay heavy video above the fold.

CSS background images:

- `assets/bg/bg-dark.jpg` is referenced by CSS and is about 81 KB.
- It is acceptable, but should be converted to WebP if visually identical.

External images:

- Replace `demo.bravisthemes.com` and Website Files production CDN images with local optimized assets before launch.

## Duplicate Section And Component Report

### Navbar

Source file:

- `templates/partials/header.html`

Pages where used:

- `index.html`
- `about.html`
- `services.html`
- `projects.html`
- `project-details.html`
- `contact.html`

Suggested location:

- Keep `templates/partials/header.html`.

Data/config needed:

- Active page state.
- Navigation label/href list.

### Mobile Menu

Source file:

- `templates/partials/mobile-menu.html`

Pages where used:

- All pages.

Suggested location:

- Keep `templates/partials/mobile-menu.html`.

Data/config needed:

- Same nav list as header.

### Footer

Source file:

- `templates/partials/footer.html`

Pages where used:

- All pages.

Suggested location:

- Keep `templates/partials/footer.html`.

Data/config needed:

- Contact email.
- Phone.
- Address.
- Footer links.
- Copyright year.

### Search Modal

Source file:

- `templates/partials/search-modal.html`

Pages where used:

- All pages.

Suggested location:

- Keep `templates/partials/search-modal.html`.

Data/config needed:

- Search behavior destination if real search is added.

### Hero Sections

Source files:

- `index.html` hero slider.
- `projects.html` page hero.
- `project-details.html` detail hero.

Pages where used:

- Home, projects, project details.

Suggested shared location:

- `templates/partials/page-hero.html`
- `templates/partials/project-detail-hero.html`
- Keep homepage hero as specialized component due to Swiper complexity.

Data/config needed:

- Eyebrow.
- Title.
- Breadcrumb links.
- Hero image(s).
- CTA.

### Breadcrumbs

Source files:

- `projects.html`
- `project-details.html`

Suggested shared location:

- `templates/partials/breadcrumb.html`

Data/config needed:

- Array of `{ label, href }`.
- Current page label.

### Service Cards

Source files:

- `about.html`
- `services.html`
- Related homepage service interaction in `index.html`.

Pages where used:

- About.
- Services.
- Home, with different interactive markup.

Suggested shared location:

- `templates/partials/service-grid.html`
- `templates/data/services.json`

Data/config needed:

- Number.
- Title.
- Description.
- Icon path.
- Link.
- Optional image for home interaction.

### CTA Sections

Source files:

- `project-details.html`
- `about.html`
- `contact.html`
- Homepage CTAs.

Suggested shared location:

- `templates/partials/cta.html`

Data/config needed:

- Kicker.
- Heading.
- Body copy.
- Button label.
- Button href.

### Contact Forms

Source files:

- `about.html`
- `contact.html`

Suggested shared location:

- `templates/partials/contact-form.html`

Data/config needed:

- Form action, if real backend exists.
- Button label.
- Optional intro copy.

Important note:

- Current JS prevents form submission for `[data-about-form]`. Confirm whether the form is decorative, mailto-backed, or connected to a service before changing this.

### Testimonials

Source files:

- `index.html`
- `about.html`
- `services.html`

Suggested shared location:

- `templates/partials/testimonials.html`
- `templates/data/testimonials.json`

Data/config needed:

- Quote.
- Author.
- Avatar.
- Optional rating/role/company.

### Project Cards

Source files:

- `index.html`
- `projects.html`

Suggested shared location:

- `templates/partials/project-card.html`
- `templates/data/projects.json`

Data/config needed:

- Title.
- Category.
- Image.
- Alt text.
- Link.
- Metadata/year/location/scope.

### Partners

Source file:

- `templates/partials/partners.html`

Pages where used:

- `index.html`
- `services.html`

Suggested shared location:

- Keep `templates/partials/partners.html`, but consider moving inline SVGs to cacheable SVG files if visual behavior permits.

Data/config needed:

- Partner logo path or inline SVG reference.
- Alt/aria label.

## Performance Budget

Recommended targets:

- Total first-party JS: under 50 KB uncompressed.
- Per-page third-party JS: load only when required.
- Total render-blocking CSS: under 80 KB for common CSS, under 150 KB total page CSS.
- LCP image: under 180 KB compressed WebP/AVIF.
- Total initial page image payload: under 1 MB.
- Any single non-hero image: under 250 KB.
- Fonts: one family, 2-3 weights, WOFF2, `font-display: swap`.
- Lighthouse desktop performance: 90+.
- Lighthouse mobile performance: 80+ initially, 90+ after CSS and image pruning.
- CLS: below 0.1.
- INP: below 200 ms.

## Implementation Instructions

### Phase 1: Safe Quick Wins

Files to modify:

- `templates/layout.html`
- `build-pages.js`
- Possibly all generated HTML via build.

Steps:

1. Remove `./arsy-ref.css` from `templates/layout.html` if confirmed unused.
2. Add page config in `build-pages.js` for `needsSwiper`.
3. Include Swiper CSS/JS only when `needsSwiper` is true.
4. Add `defer` to `script.js`.
5. Add `project-details.html` to the build page list.
6. Fix homepage project links from `/project/...` to valid static paths.
7. Add lazy loading and decoding attributes to below-fold images.
8. Add image dimensions.

Testing:

- Run `node build-pages.js`.
- Open every page.
- Test header, mobile menu, search modal, homepage hero, testimonial sliders, about team slider, project filter, FAQ if present, and contact map.

Risk:

- Low, except adding `project-details.html` to generation may overwrite manual layout. Back up or review before running.

### Phase 2: CSS/JS Cleanup

Files to modify:

- `styles.css`
- New `styles/*.css` files if splitting.
- `script.js`
- `projects.html` or build output source.

Steps:

1. Move inline project filter JS into `script.js`.
2. Add a `setupProjectsFilter()` function guarded by selector checks.
3. Debounce or `requestAnimationFrame`-gate resize handling.
4. Split CSS without deleting rules.
5. Confirm visual parity.
6. Prune unused CSS gradually.

Testing:

- Before/after screenshots.
- Lighthouse coverage report.
- Manual page-by-page visual check.

Risk:

- Medium to High for CSS pruning.

### Phase 3: Componentization

Files to create:

- `templates/partials/service-grid.html` or build function.
- `templates/partials/testimonials.html` or build function.
- `templates/partials/contact-form.html`.
- `templates/partials/project-card.html`.
- `templates/data/services.json`.
- `templates/data/testimonials.json`.
- `templates/data/projects.json`.

Files to modify:

- `build-pages.js`
- Page source HTML, or page data config if source is moved into templates.

Steps:

1. Centralize nav/footer/contact details.
2. Componentize service cards.
3. Componentize testimonials.
4. Componentize contact form.
5. Componentize project cards.
6. Keep generated HTML static.

Testing:

- Run build after each component extraction.
- Diff generated pages.
- Check SEO output still includes full content in HTML source.

Risk:

- Medium.

### Phase 4: Animation Optimization

Files to modify:

- `styles.css`
- `script.js`
- Possibly generated HTML only for duplicate reveal IDs.

Steps:

1. Add `prefers-reduced-motion` rules.
2. Ensure reveal animations remain `opacity` and `transform` only.
3. Avoid animating Swiper internals and iframes directly.
4. Remove or clear `will-change` after reveal completion.
5. Fix duplicate homepage work-card `data-w-id` values if uniqueness matters for tooling/debugging.

Testing:

- Scroll through each page on mobile and desktop.
- Check reduced-motion mode.
- Verify sliders still animate correctly.

Risk:

- Low.

### Phase 5: Asset Optimization

Files/folders to modify:

- `assets/`
- HTML image references.
- CSS background image references.

Steps:

1. Create optimized WebP/AVIF variants.
2. Replace large repeated logo/icon assets.
3. Keep original archive images outside deployable public assets.
4. Localize external demo/reference images.
5. Add responsive `srcset` for major project and hero images if time allows.

Testing:

- Visual compare image quality.
- Lighthouse image audits.
- Check all image paths.

Risk:

- Medium.

### Phase 6: Final Testing And Validation

Steps:

1. Run build.
2. Run broken-link scan.
3. Run Lighthouse desktop and mobile.
4. Run browser responsive checks.
5. Verify no console errors.
6. Verify all animations, sliders, filter buttons, menu, search modal, map, and forms.
7. Confirm SEO meta content.

Risk:

- Low.

## File-By-File Audit

### `templates/layout.html`

Current issue:

- Includes missing `./arsy-ref.css`.
- Includes Swiper CSS/JS on every page.
- Scripts are not marked `defer`.

Why it matters:

- Missing CSS creates a blocking 404.
- Swiper is unnecessary on non-slider pages.
- Non-deferred scripts can delay parsing.

Recommended fix:

- Remove or restore `arsy-ref.css`.
- Add conditional Swiper placeholders.
- Use `defer` for scripts.

Risk level: Low.

### `build-pages.js`

Current issue:

- Good static rendering approach, but hardcoded and incomplete.
- Does not include `project-details.html`.
- Does not support per-page scripts/styles.

Why it matters:

- Manual pages can drift away from shared layout.
- All pages pay for the same assets.

Recommended fix:

- Add page config fields:
  - `needsSwiper`
  - `includePartners`
  - `beforeHeader`
  - `extraScripts`
  - `bodyClass` if needed
- Include `project-details.html`.

Risk level: Medium.

### `styles.css`

Current issue:

- About 206 KB.
- Contains remote OTF fonts.
- Contains large Webflow export and likely unused page families.
- Contains long-lived `will-change` for reveal targets.

Why it matters:

- Render-blocking size and maintainability risk.

Recommended fix:

- Convert fonts to WOFF2 and self-host.
- Split CSS first.
- Then prune unused sections after visual verification.
- Add reduced-motion handling.

Risk level: High for pruning, Low for additive reduced-motion.

### `script.js`

Current issue:

- Overall lean and acceptable.
- Initialization functions run globally but are guarded by DOM queries.
- Depends on globally loaded Swiper.
- Does not include project filter behavior, which is inline in `projects.html`.

Why it matters:

- Some behavior cannot be cached centrally.
- Swiper can be conditionally loaded without breaking guarded setup.

Recommended fix:

- Add `setupProjectsFilter()`.
- Keep all setup functions selector-guarded.
- Use conditional Swiper library includes.

Risk level: Low.

### `index.html`

Current issue:

- Heaviest page.
- Loads many external images/assets.
- No lazy loading on below-fold images.
- No width/height attributes.
- Uses absolute `/project/...` links that do not match the static file structure.
- Duplicate reveal `data-w-id` on work cards.

Why it matters:

- Likely largest LCP and network cost.
- Broken links hurt UX and SEO.

Recommended fix:

- Preload first hero image only.
- Lazy-load below-fold images.
- Localize external demo images.
- Fix project URLs.
- Optimize large Khyber/project images.

Risk level: Medium.

### `about.html`

Current issue:

- Repeats services, testimonials, contact form, and partners-like structures.
- Loads remote testimonial images.
- No image dimensions/lazy attributes.

Why it matters:

- Repeated markup is hard to maintain.
- Remote assets increase latency.

Recommended fix:

- Use shared service, testimonial, and contact-form components.
- Localize images.
- Add image loading attributes.

Risk level: Medium.

### `services.html`

Current issue:

- Repeats service cards from about page.
- Loads Swiper only for testimonials.
- Uses repeated partner inline SVGs.

Why it matters:

- Duplicate maintenance.
- Large inline SVG blocks increase HTML size.

Recommended fix:

- Shared service-card component.
- Shared testimonial component.
- Conditional Swiper.
- Consider cacheable SVG files for partners.

Risk level: Low to Medium.

### `projects.html`

Current issue:

- Includes Swiper even though no Swiper markup exists.
- Has inline project filter script.
- Project cards are hardcoded.
- No lazy loading/image dimensions.

Why it matters:

- Avoidable JS/CSS payload.
- Hardcoded cards are difficult to scale.

Recommended fix:

- Remove Swiper from this page.
- Move filter behavior into `script.js`.
- Drive cards from `projects.json` or a build-time data object.

Risk level: Low.

### `project-details.html`

Current issue:

- Not generated by `build-pages.js`.
- Repeats header/footer/layout manually.
- Gallery repeats the same three image files twice.
- Includes Swiper even though no Swiper markup exists.

Why it matters:

- Can drift from shared navigation/footer.
- Avoidable asset loading.
- Gallery repetition may be intentional, but should be data-driven if repeated project templates are planned.

Recommended fix:

- Add to `build-pages.js`.
- Create project detail data.
- Remove Swiper on this page.
- Add image loading attributes.

Risk level: Medium.

### `contact.html`

Current issue:

- Includes Swiper even though no Swiper markup exists.
- Contact form repeats about form.
- Map iframe is correctly lazy-loaded.
- Contact copy contains visible encoding artifacts: `WeÃƒÂ¢...`.

Why it matters:

- Avoidable JS/CSS.
- Form behavior needs a real strategy.
- Encoding artifacts hurt polish and trust.

Recommended fix:

- Remove Swiper from this page.
- Shared contact form partial.
- Confirm whether form should submit or stay decorative.
- Fix encoded copy.

Risk level: Medium.

### `templates/partials/partners.html`

Current issue:

- About 30 KB and mostly inline SVG.
- Repeated into generated pages.

Why it matters:

- Inline SVG is not cacheable as separate files.
- Large HTML blocks increase page size.

Recommended fix:

- Keep inline if exact hover/color behavior depends on it.
- Otherwise move logos to optimized SVG files and reference with `<img>`.

Risk level: Medium because inline SVG may be part of visual styling.

## Broken Links And Missing Files

Found missing local references:

- `./arsy-ref.css` on all pages.
- `/project/grand-vista` in `index.html`.
- `/project/elegant-retreat` in `index.html`.
- `/project/modern-marvel` in `index.html`.

Recommended fix:

- Remove/restore `arsy-ref.css`.
- Replace `/project/...` links with `./project-details.html` or create matching static detail routes/pages.

Risk level: Low.

## Final Validation Checklist

Performance:

- Run Lighthouse on desktop and mobile.
- Check total transferred CSS/JS/image size.
- Verify no render-blocking 404s.
- Verify Swiper is absent from non-slider pages.

Responsive:

- Test 375px mobile.
- Test 390px mobile.
- Test 768px tablet.
- Test 1024px laptop.
- Test 1440px desktop.

Browser:

- Chrome.
- Edge.
- Firefox.
- Safari/WebKit if available.

Links:

- Scan all `href` and `src` paths.
- Confirm no missing local files.
- Confirm project detail links work.

Animations:

- Confirm reveal animations trigger once.
- Confirm smooth scroll performance.
- Confirm sliders still work.
- Confirm reduced-motion mode disables non-essential movement.

SEO:

- Confirm unique page titles.
- Confirm meta descriptions.
- Confirm one meaningful H1 per page.
- Confirm image alt text.
- Confirm full navigation/footer exists in final HTML source.
- Add canonical and Open Graph tags if launch requires them.

Accessibility:

- Confirm menu/search buttons have labels.
- Confirm focus states.
- Confirm modal focus behavior if time allows.
- Confirm form labels or accessible names.

Deployment:

- Deploy only production assets.
- Keep archive/source media out of public deploy output.
- Apply long cache headers to assets.
- Apply short cache headers to HTML.
