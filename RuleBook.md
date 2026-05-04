# Website Engineering Rulebook

## 1. Core Principles

- Do not break visual design.
- Do not refactor blindly.
- Always work incrementally.
- Manual validation is mandatory after any UI change.

---

## 2. Build System Rules

- Use build-pages.js for all page generation.
- Do not introduce runtime partial loading.
- Keep output static HTML.

---

## 3. Image Optimization Rules

- Use <picture> for all photo images:

<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" width="" height="" loading="lazy" decoding="async">
</picture>

- LCP image:
  - loading="eager"
  - fetchpriority="high"
  - must be local asset

- Do NOT convert:
  - logos
  - icons
  - SVGs
  - favicon

---

## 4. CSS Rules

- CSS is split into:
  - vendor.css
  - base.css
  - components.css
  - layout.css
  - pages.css

- Do not reorder CSS files.
- Do not merge files back.
- Do not remove CSS without validation.

### CSS Pruning Rules

- Only remove:
  - clearly unused modules
  - blog/shop/product remnants

- Never remove:
  - navigation styles
  - sliders
  - mobile menu
  - animations
  - team/project/contact sections

---

## 5. Hero Section Rules

- First hero image must:
  - be local
  - be preloaded
  - use fetchpriority="high"

- Do not use remote images for LCP.

- Swiper autoplay:
  - disabled during initial load
  - optional after load only

- Hero layout must have fixed height to avoid CLS.

---

## 6. JavaScript Rules

- Use defer for scripts.
- Avoid scroll listeners (use IntersectionObserver).
- Do not add heavy libraries.

---

## 7. Performance Rules

- Do not optimize blindly.
- Always measure before and after.

- Priority order:
  1. Images
  2. CSS
  3. LCP element
  4. Third-party scripts

---

## 8. Component Rules

- Reuse components via build system.
- Do not duplicate markup.
- Keep structure consistent.

---

## 9. Validation Rules (MANDATORY)

After any change, manually check:

- mobile menu
- hero section
- sliders
- Our Team section
- project cards
- contact form
- footer
- responsive (375 / 768 / 1366)

Console:
- no errors

---

## 10. Prohibited Actions

- No blind CSS deletion
- No large refactors without testing
- No adding frameworks (React, etc.)
- No removing fallback images
- No breaking responsive layout

---

## 11. Workflow

1. Make change
2. Build project
3. Manual test
4. Fix issues
5. Then proceed

---

## 12. Optimization Policy

- Do not optimize while layout is changing.
- Only optimize after UI is stable.