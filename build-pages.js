const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const templatesDir = path.join(rootDir, "templates");
const partialsDir = path.join(templatesDir, "partials");
const layoutTemplate = readTemplate("layout.html");

const pages = [
  {
    file: "index.html",
    title: "Casa Elegance Interior Design",
    description:
      "Arsy interior design services, selected work, testimonials, FAQs, and contact CTA.",
    beforeHeader: readPartial("home-global-styles.html"),
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
    main: extractMain(sourceHtml),
    partners: page.includePartners ? `\n${shared.partners}` : "",
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

function extractMain(html) {
  const match = html.match(/^\s*<main[\s\S]*?<\/main>/m);

  if (!match) {
    throw new Error("Could not find <main> block in source HTML.");
  }

  return indentBlock(removeGeneratedIndent(match[0].trim()), 4);
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

function readTemplate(relativePath) {
  return fs.readFileSync(path.join(templatesDir, relativePath), "utf8").trimEnd();
}
