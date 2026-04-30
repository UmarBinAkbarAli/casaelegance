const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const templatesDir = path.join(rootDir, "templates");
const partialsDir = path.join(templatesDir, "partials");
const layoutTemplate = readTemplate("layout.html");

const pages = [
  {
    file: "index.html",
    title: "Arsy Interior Design",
    description:
      "Arsy interior design services, selected work, testimonials, FAQs, and contact CTA.",
    beforeHeader: readPartial("home-global-styles.html"),
    includePartners: true,
  },
  {
    file: "about.html",
    title: "About Us | Casa Elegance",
    description:
      "Learn about Casa Elegance, our architectural philosophy, design process, and project achievements.",
    beforeHeader: "",
    includePartners: false,
  },
  {
    file: "services.html",
    title: "Services | Casa Elegance",
    description:
      "Explore Casa Elegance interior design, renovation, furniture, and spatial planning services.",
    beforeHeader: "",
    includePartners: false,
  },
  {
    file: "projects.html",
    title: "Projects | Casa Elegance",
    description:
      "Browse selected Casa Elegance interior and architectural projects across residential and hospitality spaces.",
    beforeHeader: "",
    includePartners: false,
  },
  {
    file: "contact.html",
    title: "Contact Us | Casa Elegance",
    description:
      "Contact Casa Elegance for interior design, architecture, and project consultation inquiries.",
    beforeHeader: "",
    includePartners: false,
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
    header: shared.header,
    mobileMenu: shared.mobileMenu,
    searchModal: shared.searchModal,
    main: extractMain(sourceHtml),
    partners: page.includePartners ? `\n${shared.partners}` : "",
    footer: `\n${shared.footer}`,
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

  return indentBlock(match[0].trim(), 4);
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
