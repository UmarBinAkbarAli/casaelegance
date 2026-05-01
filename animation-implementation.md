# Animation Implementation Checklist

This document is a planning guide for adding smooth scroll-triggered animations across the Casa Elegance site without changing behavior, breaking sliders, or hurting performance.

No code changes are included here. This is an implementation checklist and safety report only.

## Animation Strategy

Use the existing homepage reveal model across the site:

- Start selected wrappers in a hidden pre-animated state
- Detect viewport entry with `IntersectionObserver`
- Add a visible class once
- Animate with `opacity` and `transform` only

This is the safest approach because it:

- Matches the current site animation language
- Avoids fighting existing `Swiper` sliders
- Avoids layout-jank from animating size or position properties
- Keeps scroll performance smooth

## Existing Animation System

Current reveal engine references:

- JS observer setup: [script.js](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/script.js:199)
- Reveal activation: [script.js](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/script.js:214)
- Hidden-state transition rules: [styles.css](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/styles.css:39)
- Visible-state transition rules: [styles.css](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/styles.css:1246)

Current slider/interactivity references:

- Hero slider: [script.js](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/script.js:86)
- Services hover interaction: [script.js](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/script.js:224)
- Testimonial slider: [script.js](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/script.js:300)
- About page sliders/video hooks: [script.js](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/script.js:389)

## Safety Rules

Apply these rules everywhere:

- Animate `opacity` and `transform` only
- Prefer `translateY(...)` and very slight `scale(...)`
- Trigger reveal once per element
- Animate wrappers and content groups, not every tiny child
- Keep stagger small and limited to short lists
- Do not animate `height`, `width`, `top`, `left`, `margin`, or `padding`
- Do not animate live iframes directly
- Do not animate internals already controlled by `Swiper`
- Do not create continuous scroll listeners for animation timing

## Safe Targets vs Unsafe Targets

Safe targets:

- Section headings
- Intro copy blocks
- Card grids
- Media wrappers
- CTA wrappers
- Form wrappers
- Static logo strips

Avoid animating directly:

- Hero slide internals
- `Swiper` active slide state internals
- Testimonial slide internals
- Team slide internals
- Service hover internals that already rotate on pointer move
- Live map iframe
- Video iframe itself

## Page-By-Page Checklist

## Homepage

File:

- [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html)

Already using reveal:

- Services intro blocks: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:211)
- Work intro and CTA block: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:313)
- Work cards: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:343)
- Latest blogs title and cards: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:568)

Recommended additions:

- Add reveal to About media wrapper: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:401)
- Add reveal to About content wrapper: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:412)
- Add reveal to testimonial section shell: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:491)
- Add reveal to partners strip container or item groups: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:678)

Do not animate:

- Hero slider internals: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:129)
- Services hover mechanics inside each card: [index.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/index.html:224)

Implementation checklist:

- Keep existing reveal blocks as-is
- Add reveal hooks only to missing static wrappers
- Use stagger only for partner items if needed
- Do not add reveal to each testimonial slide

## About Us

File:

- [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html)

Recommended reveal targets:

- Mission headline: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:78)
- Mission image area: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:85)
- Mission title block: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:89)
- Video frame wrapper and poster wrapper only: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:111)
- Stats block or each stat item: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:120)
- Services grid or service cards: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:143)
- Banner text: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:185)
- Team section heading: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:193)
- Team slider shell: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:197)
- Testimonial section outer shell: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:213)
- Contact intro block: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:285)
- Contact form wrapper: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:289)
- Partner row or partner item group: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:297)

Do not animate:

- Video iframe directly: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:111)
- Team slider individual slides as reveal targets: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:198)
- Testimonial slides individually: [about.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/about.html:220)

Implementation checklist:

- Reveal top mission in layered order
- Reveal stats with very light stagger
- Reveal service cards in a small stagger
- Reveal team section shell, not the moving carousel items
- Reveal contact section in two columns

## Contact Us

File:

- [contact.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/contact.html)

Recommended reveal targets:

- Map frame wrapper: [contact.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/contact.html:85)
- Contact intro block: [contact.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/contact.html:101)
- Contact form wrapper: [contact.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/contact.html:105)

Do not animate:

- Google Maps iframe itself: [contact.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/contact.html:89)

Implementation checklist:

- Reveal map frame as one block
- Reveal intro and form as separate wrappers
- Keep form fields static inside the revealed form container

## Services

File:

- [services.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/services.html)

Recommended reveal targets:

- Services page intro shell: [services.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/services.html:75)
- Service cards: [services.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/services.html:83)
- Testimonial section shell: [services.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/services.html:123)
- Partners strip container or grouped items: [services.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/services.html:182)

Do not animate:

- Testimonial moving slide internals: [services.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/services.html:130)

Implementation checklist:

- Reveal services intro first
- Stagger service cards lightly
- Reveal testimonial shell as a whole
- Reveal partner strip with subtle fade-up only

## Projects

File:

- [projects.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/projects.html)

Recommended reveal targets:

- Hero title and breadcrumb shell: [projects.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/projects.html:75)
- Filter bar wrapper: [projects.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/projects.html:89)
- Project cards grid items: [projects.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/projects.html:100)

Do not animate:

- Filter pill slider behavior itself: [projects.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/projects.html:90)

Implementation checklist:

- Reveal hero shell on load/entry
- Reveal filter bar as one unit
- Reveal project cards with a row-based stagger
- Ensure filtered cards do not replay heavy entrance animations repeatedly

## Project Details

File:

- [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html)

Recommended reveal targets:

- Hero content column: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:81)
- Hero meta column: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:94)
- Showcase media wrapper: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:115)
- Story intro column: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:125)
- Story copy column: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:129)
- Highlight cards: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:138)
- Gallery heading: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:160)
- Gallery grid wrapper or image groups: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:164)
- CTA content and button shell: [project-details.html](/abs/path/c:/Users/sysadmin/Documents/Codex/2026-04-29/files-mentioned-by-the-user-home/project-details.html:176)

Do not animate:

- Large gallery sets with aggressive stagger if many images are visible together

Implementation checklist:

- Reveal hero in two columns
- Reveal showcase image as one strong media block
- Reveal story in editorial two-column timing
- Stagger highlight cards lightly
- Reveal gallery heading first, then the grid
- Reveal CTA as final section

## Rollout Recommendation

Use this order to reduce risk:

1. `project-details.html`
2. `contact.html`
3. `projects.html`
4. `services.html`
5. `about.html`
6. Remaining homepage gaps

Why this order:

- Project details and contact are structurally simple
- Projects has grid behavior but no slider conflict in the cards themselves
- Services and About contain more slider and interactive complexity
- Homepage already has mixed animation patterns, so it should be refined last

## Performance Notes

To keep the experience smooth:

- Prefer one reveal wrapper per meaningful content group
- Use small stagger delays only for cards and stats
- Avoid animating all visible children in very dense sections
- Let observer unobserve after first reveal
- Respect `prefers-reduced-motion` when implementation begins

## Final Recommendation

Do not introduce a new animation library unless there is a very specific reason. The current site already has a solid reveal system, and the safest path is to expand it consistently across all pages.
