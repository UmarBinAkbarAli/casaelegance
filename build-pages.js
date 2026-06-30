const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const templatesDir = path.join(rootDir, "templates");
const partialsDir = path.join(templatesDir, "partials");
const dataDir = path.join(templatesDir, "data");
const layoutTemplate = readTemplate("layout.html");
const services = readJson("services.json");
const site = readJson("site.json");
const testimonials = readJson("testimonials.json");
const projects = readJson("projects.json");
const fallbackOptimizedAssets = [
  {
    path: "assets/casa-elegance-icon.png",
    status: "optimized",
    variants: [
      {
        format: "png",
        width: 96,
        outputPath: "assets/optimized/assets/casa-elegance-icon-96w.png",
      },
      {
        format: "png",
        width: 192,
        outputPath: "assets/optimized/assets/casa-elegance-icon-192w.png",
      },
      {
        format: "png",
        width: 288,
        outputPath: "assets/optimized/assets/casa-elegance-icon-288w.png",
      },
      {
        format: "png",
        width: 537,
        outputPath: "assets/optimized/assets/casa-elegance-icon-537w.png",
      },
    ],
  },
];
const optimizedAssets = readOptionalRootJson("phase-5-optimization-report.json", fallbackOptimizedAssets);
const optimizedAssetMap = new Map(
  optimizedAssets
    .filter((entry) => entry.status === "optimized")
    .map((entry) => [normalizeAssetPath(entry.path), entry])
);
const contentImageDeliveryMap = new Map(
  Object.entries({
    "assets/website-used/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f7e0b317dbdb8e3231_02. Khyber Restaurant.png": {
      fallback: "./assets/delivery/khyber-restaurant-detail.png",
      webp: "./assets/delivery/khyber-restaurant-detail.webp",
    },
    "assets/website-used/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8eeb18c917589f966d7_01. Khyber Restaurant_Hero.jpeg": {
      fallback: "./assets/delivery/khyber-restaurant-hero.jpg",
      webp: "./assets/delivery/khyber-restaurant-hero.webp",
      avif: "./assets/delivery/khyber-restaurant-hero.avif",
    },
    "assets/website-used/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/1.jpg": {
      fallback: "./assets/delivery/genetec-office-hero.jpg",
      webp: "./assets/delivery/genetec-office-hero.webp",
      avif: "./assets/delivery/genetec-office-hero.avif",
    },
    "assets/website-used/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/2.jpg": {
      fallback: "./assets/delivery/genetec-office-meeting-room.jpg",
      webp: "./assets/delivery/genetec-office-meeting-room.webp",
      avif: "./assets/delivery/genetec-office-meeting-room.avif",
    },
    "assets/website-used/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/8.jpg": {
      fallback: "./assets/delivery/genetec-office-furniture.jpg",
      webp: "./assets/delivery/genetec-office-furniture.webp",
      avif: "./assets/delivery/genetec-office-furniture.avif",
    },
    "assets/website-used/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69ce946be65481932970df49_69cae22c68939cf61015796d_01.BK115_Hero-p-1080.jpg": {
      fallback: "./assets/delivery/burj115-hero.jpg",
      webp: "./assets/delivery/burj115-hero.webp",
      avif: "./assets/delivery/burj115-hero.avif",
    },
    "assets/website-used/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae232f4cf2e75b202122a_02.BK115.jpg": {
      fallback: "./assets/delivery/burj115-breakout-area.jpg",
      webp: "./assets/delivery/burj115-breakout-area.webp",
      avif: "./assets/delivery/burj115-breakout-area.avif",
    },
    "assets/website-used/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23ab7cefcc49aedc3fe_10.BK115.jpg": {
      fallback: "./assets/delivery/burj115-corridor.jpg",
      webp: "./assets/delivery/burj115-corridor.webp",
      avif: "./assets/delivery/burj115-corridor.avif",
    },
    "assets/website-used/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/1.jpg": {
      fallback: "./assets/delivery/bluewaters-apartment.jpg",
      webp: "./assets/delivery/bluewaters-apartment.webp",
      avif: "./assets/delivery/bluewaters-apartment.avif",
    },
    "assets/website-used/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/4077486C-8922-41F5-B621-1B6DB225E5DA.jpeg": {
      fallback: "./assets/delivery/dubai-creek-apartment.jpg",
      webp: "./assets/delivery/dubai-creek-apartment.webp",
      avif: "./assets/delivery/dubai-creek-apartment.avif",
    },
    "assets/project-grand-vista.png": {
      fallback: "./assets/delivery/project-grand-vista.png",
      webp: "./assets/delivery/project-grand-vista.webp",
    },
    "assets/project-elegant-retreat.png": {
      fallback: "./assets/delivery/project-elegant-retreat.png",
      webp: "./assets/delivery/project-elegant-retreat.webp",
    },
    "assets/project-modern-marvel.png": {
      fallback: "./assets/delivery/project-modern-marvel.png",
      webp: "./assets/delivery/project-modern-marvel.webp",
    },
    "assets/delivery/bluewaters-apartment.jpg": {
      fallback: "./assets/delivery/bluewaters-apartment.jpg",
      webp: "./assets/delivery/bluewaters-apartment.webp",
      avif: "./assets/delivery/bluewaters-apartment.avif",
    },
    "assets/delivery/dubai-creek-apartment.jpg": {
      fallback: "./assets/delivery/dubai-creek-apartment.jpg",
      webp: "./assets/delivery/dubai-creek-apartment.webp",
      avif: "./assets/delivery/dubai-creek-apartment.avif",
    },
    "assets/delivery/burj115-hero.jpg": {
      fallback: "./assets/delivery/burj115-hero.jpg",
      webp: "./assets/delivery/burj115-hero.webp",
      avif: "./assets/delivery/burj115-hero.avif",
    },
    "assets/delivery/burj115-breakout-area.jpg": {
      fallback: "./assets/delivery/burj115-breakout-area.jpg",
      webp: "./assets/delivery/burj115-breakout-area.webp",
      avif: "./assets/delivery/burj115-breakout-area.avif",
    },
  })
);

const pages = [
  {
    file: "index.html",
    title: "Casa Elegance Interior Design",
    description:
      "Arsy interior design services, selected work, testimonials, FAQs, and contact CTA.",
    beforeHeader: readPartial("home-global-styles.html"),
    includeCertifications: true,
    includePartners: true,
    needsSwiper: true,
  },
  {
    file: "about.html",
    title: "About Us | Casa Elegance",
    description:
      "Learn about Casa Elegance, our architectural philosophy, design process, and project achievements.",
    beforeHeader: "",
    includePartners: false,
    needsSwiper: true,
  },
  {
    file: "services.html",
    title: "Services | Casa Elegance",
    description:
      "Explore Casa Elegance interior design, renovation, furniture, and spatial planning services.",
    beforeHeader: "",
    includePartners: true,
    needsSwiper: true,
  },
  {
    file: "projects.html",
    title: "Projects | Casa Elegance",
    description:
      "Browse selected Casa Elegance interior and architectural projects across residential and hospitality spaces.",
    beforeHeader: "",
    includePartners: false,
    needsSwiper: false,
  },
  {
    file: "project-details.html",
    title: "Project Details | Casa Elegance",
    description:
      "Explore the full story behind a Casa Elegance project, from design brief to final execution.",
    beforeHeader: "",
    includePartners: false,
    needsSwiper: false,
  },
  {
    file: "contact.html",
    title: "Contact Us | Casa Elegance",
    description:
      "Contact Casa Elegance for interior design, architecture, and project consultation inquiries.",
    beforeHeader: "",
    includePartners: false,
    needsSwiper: false,
  },
  {
    file: "cost-calculator.html",
    title: "Cost Calculator | Casa Elegance",
    description:
      "Estimate your Casa Elegance project scope with our upcoming cost calculator.",
    beforeHeader: "",
    includePartners: false,
    needsSwiper: false,
  },
];

const shared = {
  header: readPartial("header.html"),
  mobileMenu: readPartial("mobile-menu.html"),
  searchModal: readPartial("search-modal.html"),
  partners: readPartial("partners.html"),
  footer: readPartial("footer.html"),
};

for (const page of pages) {
  const sourcePath = path.join(rootDir, page.file);
  const sourceHtml = fs.readFileSync(sourcePath, "utf8");
  const rendered = renderPage(page, sourceHtml);
  fs.writeFileSync(sourcePath, rendered, "utf8");
}

function renderPage(page, sourceHtml) {
  const main = renderPageComponents(page, extractMain(sourceHtml));
  const replacements = {
    title: page.title,
    description: page.description,
    beforeHeader: page.beforeHeader,
    swiperCss: page.needsSwiper
      ? '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css">'
      : "",
    header: shared.header,
    mobileMenu: shared.mobileMenu,
    searchModal: shared.searchModal,
    main: indentBlock(main, 4),
    partners: [
      page.includeCertifications ? renderCertificationStrip() : "",
      page.includePartners ? renderPartnerMarquee(shared.partners) : "",
    ].filter(Boolean).map((section) => `\n${section}`).join(""),
    footer: `\n${shared.footer}`,
    swiperJs: page.needsSwiper
      ? '  <script defer src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>'
      : "",
  };

  return layoutTemplate.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in replacements)) {
      throw new Error(`Missing template replacement: ${key}`);
    }

    return replacements[key];
  });
}

function renderPartnerMarquee(partnersHtml) {
  return partnersHtml;
}

function renderCertificationStrip() {
  const certifications = [
    { label: "ISO 9001 Certified", primary: "ISO 9001", secondary: "Certified" },
    { label: "ISO 14001 Certified", primary: "ISO 14001", secondary: "Certified" },
    { label: "ISO 45001 Certified", primary: "ISO 45001", secondary: "Certified" },
    { label: "SBID Award 2023", primary: "SBID", secondary: "Award 2023" },
    { label: "Luxury Lifestyle Award 2025", primary: "Luxury", secondary: "Lifestyle Award", tertiary: "2025" },
    { label: "Dubai Municipality", primary: "Dubai", secondary: "Municipality" },
    { label: "Trakhees", primary: "Trakhees", secondary: "Approved" },
  ];

  const icons = certifications.map((certification) => `        <div class="mrittik-partners__item">
          ${renderCertificationLogo(certification)}
        </div>`).join("\n");

  return duplicatePartnerItems(`<section class="mrittik-partners mrittik-partners--certifications" aria-label="Certification logos">
      <div class="mrittik-partners__header">
        <span>Certifications</span>
      </div>
      <div class="mrittik-partners__grid">
${icons}
      </div>
    </section>`);
}

function renderCertificationLogo({ label, primary, secondary, tertiary = "" }) {
  const primaryY = tertiary ? 35 : 40;
  const secondaryY = tertiary ? 53 : 58;
  const tertiaryMarkup = tertiary
    ? `\n            <text x="110" y="69" text-anchor="middle" class="mrittik-partners__logo-subtitle">${escapeHtml(tertiary)}</text>`
    : "";

  return `<svg class="mrittik-partners__logo mrittik-partners__logo--wordmark mrittik-partners__logo--certification" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 86" aria-label="${escapeAttr(label)}" role="img">
            <rect x="18" y="12" width="184" height="62" class="mrittik-partners__logo-border" />
            <path class="mrittik-partners__logo-frame" d="M36 24h148M36 62h148" />
            <text x="110" y="${primaryY}" text-anchor="middle" class="mrittik-partners__logo-title">${escapeHtml(primary)}</text>
            <text x="110" y="${secondaryY}" text-anchor="middle" class="mrittik-partners__logo-subtitle">${escapeHtml(secondary)}</text>${tertiaryMarkup}
          </svg>`;
}

function duplicatePartnerItems(sectionHtml) {
  return sectionHtml.replace(
    /(<div class="mrittik-partners__grid">\n)([\s\S]*?)(\n\s*<\/div>\s*<\/section>)/,
    (_, open, items, close) => `${open}${items}\n${items}${close}`
  );
}

function extractMain(html) {
  const match = html.match(/^\s*<main[\s\S]*?<\/main>/m);

  if (!match) {
    throw new Error("Could not find <main> block in source HTML.");
  }

  return removeGeneratedIndent(match[0].trim());
}

function renderPageComponents(page, main) {
  if (page.file === "index.html") {
    return replaceSection(
      replaceSection(
        replaceSection(main, "section-services", renderHomeServicesSection()),
        "section-work",
        renderHomeProjectsSection()
      ),
      "section-testimonial-mrittik",
      renderTestimonialSection({ wId: "home-testimonial-shell" })
    );
  }

  if (page.file === "about.html") {
    return replaceSection(
      replaceSection(
        main,
        "section-testimonial-mrittik",
        renderTestimonialSection({
          wId: "about-testimonial-shell",
          viewportAttrs: "data-about-testimonials",
          dotsAttrs: "data-about-testimonials-pagination",
        })
      ),
      "clone-contact",
      renderContactSection({
        introWId: "about-contact-intro",
        formWId: "about-contact-form",
        idPrefix: "ab",
        includePartners: true,
      })
    );
  }

  if (page.file === "services.html") {
    return replaceSection(
      replaceSection(
        main,
        "clone-services",
        renderCloneServicesSection({ includeHeader: true, wIdPrefix: "services-page-card" })
      ),
      "section-testimonial-mrittik",
      renderTestimonialSection({ wId: "services-testimonial-shell" })
    );
  }

  if (page.file === "projects.html") {
    return replaceSection(
      replaceSection(main, "projects-page-hero", renderProjectsPageHero()),
      "projects-section",
      renderProjectsSection()
    );
  }

  if (page.file === "project-details.html") {
    return replaceSection(
      replaceSection(main, "project-detail-hero", renderProjectDetailHero()),
      "project-detail-cta",
      renderProjectDetailCta()
    );
  }

  if (page.file === "contact.html") {
    return replaceSection(
      main,
      "clone-contact",
      renderContactSection({
        introWId: "contact-intro",
        formWId: "contact-form",
        idPrefix: "cf",
      })
    );
  }

  return main;
}

function renderHomeServicesSection() {
  return `<section class="section-services">
  <div class="padding-global">
    <div class="container-large">
      <div class="_2-col-content-top">
        <div data-w-id="91406df7-4871-4ba7-a32c-3a5d828d24ca" style="opacity:0;transform:translate3d(0, 0, 0) scale3d(0.95, 0.95, 1);">
          <span class="clone-kicker">Our Services</span>
          <div class="spacer-medium"></div>
          <h2 class="heading-style-h2 text-color-alternate">Spaces Defined by Design, Detail &amp; Craftsmanship</h2>
        </div>
        <div data-w-id="19557f39-0333-1a19-01a6-68b6a515d637" style="opacity:0;transform:translate3d(0, 0, 0) scale3d(0.95, 0.95, 1);">
          <p class="text-style-muted">Our team of skilled professionals is dedicated to turning your vision into reality, combining creativity, innovation and expertise to deliver exceptional results.</p>
          <div class="spacer-xxsmall"></div>
        </div>
      </div>

      <div class="spacer-xxlarge"></div>

      <div class="services-list" data-services-list>
${services.map(renderHomeServiceCard).join("\n\n")}
      </div>
    </div>
  </div>
</section>`;
}

function renderHomeServiceCard(service) {
  return indentBlock(`<a href="#" class="services-item w-inline-block" data-service-item>
  <div class="services-content">
    <div class="services-heading-wrap">
      <div class="services-count">${escapeHtml(service.homeCount)}</div>
      <h3 class="heading-style-h3 text-color-alternate">${escapeHtml(service.title)}</h3>
    </div>
    <div class="services-desc-wrap">
      <p class="services-desc">${escapeHtml(service.homeDescription)}</p>
    </div>
  </div>
  <div class="services-item-image-wrap" style="opacity:0;transform:translate3d(0, 0, 0) scale3d(0.5, 0.5, 1);" data-service-image>
    <img src="${escapeAttr(service.homeImage)}" alt="${escapeAttr(service.homeImageAlt)}" class="services-item-image" loading="lazy" decoding="async">
  </div>
  <img src="https://cdn.prod.website-files.com/663a544c6dc5267ca6e5fc10/663a65a75b1d340c013fbc28_arrow%20icon.svg" alt="Arrow" class="services-arrow-icon" loading="lazy" decoding="async">
</a>`, 8);
}

function renderCloneServicesSection({ includeHeader = false, wIdPrefix }) {
  const header = includeHeader
    ? `      <div class="_2-col-content-top" data-w-id="services-page-head" style="margin-bottom:4rem;opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
        <div>
          <span class="clone-kicker">Our Services</span>
          <div class="spacer-medium"></div>
          <h2 class="heading-style-h2 text-color-alternate">Spaces Defined by Design, Detail &amp; Craftsmanship</h2>
        </div>
        <div>
          <p class="text-style-muted">Our team of skilled professionals is dedicated to turning your vision into reality, combining creativity, innovation and expertise to deliver exceptional results.</p>
          <div class="spacer-xxsmall"></div>
        </div>
      </div>
`
    : "";

  return `<section class="clone-services">
  <div class="clone-shell">
${header}    <div class="clone-services__grid">
${services.map((service, index) => renderCloneServiceCard(service, `${wIdPrefix}-${index + 1}`)).join("\n")}
    </div>
  </div>
</section>`;
}

function renderCloneServiceCard(service, wId) {
  const iconResponsiveAttrs = renderResponsiveAttrs("./assets/casa-elegance-icon.png", "72px");
  return indentBlock(`<article class="clone-service" data-w-id="${escapeAttr(wId)}" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
  <span class="clone-service__count">${escapeHtml(service.cloneCount)}</span>
  <img src="./assets/casa-elegance-icon.png" alt="Casa Elegance icon" class="clone-service__icon" width="537" height="653"${iconResponsiveAttrs} loading="lazy" decoding="async">
  <h3>${escapeHtml(service.title)}</h3>
  <p>${escapeHtml(service.cloneDescription)}</p>
</article>`, 6);
}

function renderTestimonialSection({ wId, viewportAttrs = "", dotsAttrs = "" }) {
  const viewportAttributeText = viewportAttrs ? ` ${viewportAttrs}` : "";
  const dotsAttributeText = dotsAttrs ? ` ${dotsAttrs}` : "";

  return `<section class="section-testimonial-mrittik">
  <div class="padding-global">
    <div class="container-large">
      <div class="testimonial-mrittik testimonial-slider" data-slider data-w-id="${escapeAttr(wId)}" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
        <button type="button" class="testimonial-mrittik__arrow" data-slider-prev aria-label="Previous testimonial"></button>
        <button type="button" class="testimonial-mrittik__arrow" data-slider-next aria-label="Next testimonial"></button>

        <div class="testimonial-mrittik__viewport swiper"${viewportAttributeText}>
          <div class="testimonial-mask swiper-wrapper" data-slider-mask>
${testimonials.map(renderTestimonialSlide).join("\n\n")}
          </div>
        </div>

        <div class="testimonial-slider-nav testimonial-mrittik__dots" data-slider-nav${dotsAttributeText}></div>
      </div>
    </div>
  </div>
</section>`;
}

function renderTestimonialSlide(testimonial) {
  return indentBlock(`<article class="testimonial-slide swiper-slide">
  <div class="testimonial-mrittik__card">
    <div class="testimonial-mrittik__avatar-wrap" aria-hidden="true">
      <img src="${escapeAttr(testimonial.avatar)}" alt="${escapeAttr(testimonial.avatarAlt)}" class="testimonial-mrittik__avatar" loading="lazy" decoding="async">
    </div>
    <blockquote class="testimonial-mrittik__quote">
      " ${escapeHtml(testimonial.quote)} "
    </blockquote>
    <h6 class="testimonial-mrittik__author">${escapeHtml(testimonial.author)}</h6>
  </div>
</article>`, 12);
}

function renderHomeProjectsSection() {
  return `<section class="section-work" id="work">
  <div class="padding-global">
    <div class="container-large">
      <div class="_2-col-content-top">
        <div data-w-id="9316677b-5f04-5d8f-1abc-1b599d2fa8af" style="opacity:0;transform:translate3d(0, 0, 0) scale3d(0.95, 0.95, 1);">
          <span class="clone-kicker">Our Work</span>
          <div class="spacer-medium"></div>
          <h2 class="heading-style-h2 text-color-alternate">Spaces We&rsquo;ve Brought to Life</h2>
          <div class="spacer-small"></div>
          <div class="max-width-medium">
            <p class="text-style-muted">A curated selection of our recent work across residential and commercial spaces in Dubai.</p>
          </div>
        </div>
        <div id="w-node-_9316677b-5f04-5d8f-1abc-1b599d2fa8b7-a6e5fc78" data-w-id="9316677b-5f04-5d8f-1abc-1b599d2fa8b7" style="opacity:0;transform:translate3d(0, 0, 0) scale3d(0.95, 0.95, 1);">
          <div class="button-group">
            <a href="./contact.html" class="button is-secondary w-inline-block">
              <div>Start Your Project</div>
              <div class="button-icon-wrap">
                <img src="https://cdn.prod.website-files.com/663a544c6dc5267ca6e5fc10/663a78af9494684e9f0e93e1_arrow%20upright%20(3).svg" alt="Arrow" class="button-icon" loading="lazy" decoding="async">
                <img src="https://cdn.prod.website-files.com/663a544c6dc5267ca6e5fc10/663a78af9494684e9f0e93e1_arrow%20upright%20(3).svg" alt="Arrow" class="button-icon below" loading="lazy" decoding="async">
              </div>
            </a>
            <a href="./projects.html" class="button w-inline-block">
              <div>View All Projects</div>
            </a>
          </div>
          <div class="spacer-xxsmall"></div>
        </div>
      </div>

      <div class="spacer-xlarge"></div>

      <div>
        <div class="work-list projects-grid home-featured-projects">
${projects.home.map((project) => renderProjectCard(project, { indent: 10, wId: "d0339084-321d-c54a-cd66-167a365879f0", filter: project.filter })).join("\n\n")}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function renderProjectsPageHero() {
  return `<section class="projects-page-hero">
  <div class="projects-page-hero__inner clone-shell" data-w-id="projects-hero-shell" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
    <h1 class="projects-page-hero__title">Projects</h1>
    ${renderBreadcrumb({
      className: "projects-page-hero__breadcrumb",
      separator: "&rsaquo;",
      items: [
        { label: "Home", href: "./index.html" },
        { label: "Projects" },
      ],
    })}
  </div>
</section>`;
}

function renderProjectsSection() {
  return `<section class="projects-section">
  <div class="clone-shell">

    ${renderProjectFilter("Filter projects by category")}

    <div class="work-list projects-grid" id="projects-grid">
${projects.listing.map((project, index) => renderProjectCard(project, { indent: 6, wId: `projects-card-${index + 1}`, filter: project.filter })).join("\n\n")}
    </div>
  </div>
</section>`;
}

function renderProjectFilter(ariaLabel) {
  return `<div class="projects-filter-wrap" data-w-id="projects-filter-wrap" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
      <div class="projects-filter" role="group" aria-label="Filter projects by category">
        <button class="projects-filter__btn is-active" data-filter="all">All</button>
        <button class="projects-filter__btn" data-filter="apartment">Apartment</button>
        <button class="projects-filter__btn" data-filter="villa">Villa</button>
        <button class="projects-filter__btn" data-filter="commercial">Commercial</button>
        <button class="projects-filter__btn" data-filter="hospitality">Hospitality</button>
      </div>
    </div>`.replace('aria-label="Filter projects by category"', `aria-label="${escapeAttr(ariaLabel)}"`);
}

function renderProjectCard(project, { indent, wId, filter = "" }) {
  const filterAttribute = filter ? ` data-project-category="${escapeAttr(filter)}"` : "";
  const imageMarkup = renderContentImage(project.image, {
    alt: project.alt,
    className: "work-card-image",
    width: project.width,
    height: project.height,
    loading: project.priority ? "eager" : "lazy",
    fetchpriority: project.priority ? "high" : "",
  });

  const cardHref = project.detailUrl || "./project-details.html";
  return indentBlock(`<div class="work-item"${filterAttribute} data-w-id="${escapeAttr(wId)}" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
  <a href="${escapeAttr(cardHref)}" class="work-card w-inline-block">
    <div>
      <div class="work-card-image-wrapper">
${indentBlock(imageMarkup, 8)}
      </div>
      <div><h3 class="work-card-title">${escapeHtml(project.title)}</h3></div>
    </div>
    <div class="work-card-info">
      <div><div class="text-size-small text-style-muted">Location</div><div class="spacer-xxsmall"></div><div class="text-size-regular">${escapeHtml(project.location)}</div></div>
      <div><div class="text-size-small text-style-muted">Category</div><div class="spacer-xxsmall"></div><div class="text-size-regular">${escapeHtml(project.category)}</div></div>
    </div>
  </a>
</div>`, indent);
}

function renderProjectDetailHero() {
  const detail = projects.detail;
  return `<section class="project-detail-hero">
  <div class="clone-shell project-detail-hero__inner">
    <div class="project-detail-hero__content" data-w-id="project-detail-hero-content" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
      <span class="clone-kicker">${escapeHtml(detail.eyebrow)}</span>
      ${renderBreadcrumb({
        className: "project-detail-breadcrumb",
        separator: "/",
        items: [
          { label: "Home", href: "./index.html" },
          { label: "Projects", href: "./projects.html" },
          { label: detail.title },
        ],
      })}
      <h1 class="project-detail-hero__title">${escapeHtml(detail.title)}</h1>
      <p class="project-detail-hero__text">${escapeHtml(detail.text)}</p>
    </div>

    <div class="project-detail-hero__meta" data-w-id="project-detail-hero-meta" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
${detail.meta.map(([label, value]) => indentBlock(`<div class="project-detail-meta-card">
  <span>${escapeHtml(label)}</span>
  <strong>${escapeHtml(value)}</strong>
</div>`, 6)).join("\n")}
    </div>
  </div>
</section>`;
}

function renderProjectDetailCta() {
  const detail = projects.detail;
  return `<section class="project-detail-cta">
  <div class="clone-shell project-detail-cta__inner" data-w-id="project-detail-cta-shell" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
    <div>
      <span class="project-detail-section-kicker">${escapeHtml(detail.ctaKicker)}</span>
      <h2>${escapeHtml(detail.ctaTitle)}</h2>
    </div>
    <a href="./contact.html" class="about-mrittik__button">${escapeHtml(detail.ctaLinkText)}</a>
  </div>
</section>`;
}

function renderContactSection({ introWId, formWId, idPrefix = "cf", includePartners = false }) {
  const partnersContent = includePartners ? `\n  ${renderAboutPartnerContent()}` : "";
  return `<section class="clone-contact">
  <div class="clone-shell">
    <div class="clone-contact__grid">
      <div class="clone-contact__intro" data-w-id="${escapeAttr(introWId)}" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);">
        <span class="clone-kicker">Get In Touch</span>
        <h2>Tell us about your Project</h2>
        <p>We would be pleased to hear more about your vision. You can contact us by email, phone or by completing the project enquiry form. Whether you are at the early planning stage or ready to begin, our team is here to guide the conversation and support the next steps.</p>
      </div>
      ${renderContactForm(formWId, idPrefix)}
    </div>
  </div>${partnersContent}
</section>`;
}

function renderContactForm(wId, idPrefix = "cf") {
  const p = escapeAttr(idPrefix);
  return `<form class="clone-contact__form ce-form" data-about-form data-w-id="${escapeAttr(wId)}" style="opacity:0;transform:translate3d(0, 24px, 0) scale3d(0.95, 0.95, 1);" novalidate>
        <div class="ce-form__row">
          <div class="ce-form__field">
            <label class="ce-form__label" for="${p}-name">Full Name <span class="ce-form__required" aria-hidden="true">*</span></label>
            <input class="ce-form__input" id="${p}-name" type="text" name="name" placeholder="e.g. Sarah Al Mansouri" required>
          </div>
          <div class="ce-form__field">
            <label class="ce-form__label" for="${p}-phone">Phone Number</label>
            <input class="ce-form__input" id="${p}-phone" type="tel" name="phone" placeholder="e.g. +971 50 000 0000">
          </div>
        </div>
        <div class="ce-form__field">
          <label class="ce-form__label" for="${p}-email">Email Address <span class="ce-form__required" aria-hidden="true">*</span></label>
          <input class="ce-form__input" id="${p}-email" type="email" name="email" placeholder="e.g. hello@example.com" required>
        </div>
        <div class="ce-form__field">
          <label class="ce-form__label" for="${p}-service">Project Type</label>
          <div class="ce-form__select-wrap">
            <select class="ce-form__input ce-form__select" id="${p}-service" name="service">
              <option value="" disabled selected>Select a project type</option>
              <option value="interior-design">Interior Design</option>
              <option value="turnkey-fitout">Turnkey Fitout</option>
              <option value="renovation">Renovation</option>
              <option value="consultation">Initial Consultation</option>
              <option value="commercial">Commercial Project</option>
              <option value="residential">Residential Project</option>
              <option value="other">Other</option>
            </select>
            <svg class="ce-form__select-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 5.5 8 11l5-5.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
        <div class="ce-form__field">
          <label class="ce-form__label" for="${p}-message">Message</label>
          <textarea class="ce-form__input ce-form__textarea" id="${p}-message" name="message" rows="5" placeholder="Briefly describe your project, timeline, or any questions you have…"></textarea>
        </div>
        <button class="ce-form__submit" type="submit">
          <span>Send Message</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width="18" height="18"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </form>`;
}

function renderAboutPartnerStrip() {
  const partners = [
    { name: "Emaar", src: "./assets/partners/emaar-logo.svg" },
    { name: "Damac", src: "./assets/partners/DAMAC-logo.svg" },
    { name: "Binghatti", src: "./assets/partners/Binghatti-logo.svg" },
    { name: "Sobha", src: "./assets/partners/Sobha-logo.svg" },
    { name: "Select Group", src: "./assets/partners/Select-group-logo.svg" },
  ];

  return `<section class="mrittik-partners" aria-label="Client logos">
      <div class="mrittik-partners__grid">
${partners.map((partner) => indentBlock(`<div class="mrittik-partners__item">
  <img src="${escapeAttr(partner.src)}" alt="${escapeAttr(partner.name)}" class="mrittik-partners__logo" loading="lazy" decoding="async">
</div>`, 8)).join("\n")}
      </div>
    </section>`;
}

function renderAboutPartnerContent() {
  const partners = [
    { name: "Emaar", src: "./assets/partners/emaar-logo.svg" },
    { name: "Damac", src: "./assets/partners/DAMAC-logo.svg" },
    { name: "Binghatti", src: "./assets/partners/Binghatti-logo.svg" },
    { name: "Sobha", src: "./assets/partners/Sobha-logo.svg" },
    { name: "Select Group", src: "./assets/partners/Select-group-logo.svg" },
  ];

  return `<div class="mrittik-partners" aria-label="Client logos">
      <div class="mrittik-partners__grid">
${partners.map((partner) => indentBlock(`<div class="mrittik-partners__item">
  <img src="${escapeAttr(partner.src)}" alt="${escapeAttr(partner.name)}" class="mrittik-partners__logo" loading="lazy" decoding="async">
</div>`, 8)).join("\n")}
      </div>
    </div>`;
}

function renderBreadcrumb({ className, separator, items }) {
  return `<nav class="${escapeAttr(className)}" aria-label="Breadcrumb">
${items.map((item, index) => {
  const crumb = item.href
    ? `<a href="${escapeAttr(item.href)}">${escapeHtml(item.label)}</a>`
    : `<span>${escapeHtml(item.label)}</span>`;
  const separatorMarkup = index < items.length - 1
    ? `\n  <span aria-hidden="true">${separator}</span>`
    : "";
  return `  ${crumb}${separatorMarkup}`;
}).join("\n")}
</nav>`;
}

function replaceSection(html, className, replacement) {
  const pattern = new RegExp(`<section class="${escapeRegExp(className)}"[^>]*>[\\s\\S]*?<\\/section>`);

  if (!pattern.test(html)) {
    throw new Error(`Could not find section: ${className}`);
  }

  return html.replace(pattern, replacement);
}

function removeGeneratedIndent(content) {
  const lines = content.split("\n");
  const innerLines = lines.slice(1);
  const indents = innerLines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)[0].length);
  const commonIndent = indents.length ? Math.min(...indents) : 0;

  if (!commonIndent) {
    return content;
  }

  return [
    lines[0],
    ...innerLines.map((line) => line.startsWith(" ".repeat(commonIndent))
      ? line.slice(commonIndent)
      : line)
  ].join("\n");
}

function indentBlock(content, spaces) {
  const indent = " ".repeat(spaces);
  return content
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join("\n");
}

function readPartial(fileName) {
  return readTemplate(path.join("partials", fileName));
}

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, fileName), "utf8"));
}

function readRootJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, fileName), "utf8"));
}

function readOptionalRootJson(fileName, fallback) {
  const filePath = path.join(rootDir, fileName);

  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readTemplate(relativePath) {
  return fs.readFileSync(path.join(templatesDir, relativePath), "utf8").trimEnd();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderResponsiveAttrs(assetPath, sizes) {
  const normalizedPath = normalizeAssetPath(assetPath);
  const entry = optimizedAssetMap.get(normalizedPath);

  if (!entry) {
    return "";
  }

  const extension = normalizeExtension(path.extname(normalizedPath));
  const fallbackVariants = entry.variants
    .filter((variant) => `.${variant.format}` === extension)
    .sort((left, right) => left.width - right.width);

  if (!fallbackVariants.length) {
    return "";
  }

  const srcset = fallbackVariants
    .map((variant) => `${ensureDotSlash(variant.outputPath)} ${variant.width}w`)
    .join(", ");

  return ` srcset="${escapeAttr(srcset)}" sizes="${escapeAttr(sizes)}"`;
}

function renderContentImage(assetPath, options) {
  const delivery = contentImageDeliveryMap.get(normalizeAssetPath(assetPath));
  const attrs = [
    `src="${escapeAttr(delivery ? delivery.fallback : assetPath)}"`,
    `alt="${escapeAttr(options.alt)}"`,
  ];

  if (options.className) {
    attrs.push(`class="${escapeAttr(options.className)}"`);
  }

  if (options.width) {
    attrs.push(`width="${escapeAttr(options.width)}"`);
  }

  if (options.height) {
    attrs.push(`height="${escapeAttr(options.height)}"`);
  }

  if (options.loading) {
    attrs.push(`loading="${escapeAttr(options.loading)}"`);
  }

  if (options.fetchpriority) {
    attrs.push(`fetchpriority="${escapeAttr(options.fetchpriority)}"`);
  }

  attrs.push('decoding="async"');

  if (!delivery) {
    return `<img ${attrs.join(" ")}>`;
  }

  const sourceLines = [];

  if (delivery.avif) {
    sourceLines.push(`  <source srcset="${escapeAttr(delivery.avif)}" type="image/avif">`);
  }

  if (delivery.webp) {
    sourceLines.push(`  <source srcset="${escapeAttr(delivery.webp)}" type="image/webp">`);
  }

  return `<picture style="display:block;">
${sourceLines.join("\n")}
  <img ${attrs.join(" ")}>
</picture>`;
}

function normalizeAssetPath(assetPath) {
  return String(assetPath).replace(/^\.\//, "").replace(/\\/g, "/");
}

function normalizeExtension(extension) {
  return extension === ".jpeg" ? ".jpg" : extension;
}

function ensureDotSlash(assetPath) {
  return assetPath.startsWith("./") ? assetPath : `./${assetPath}`;
}
