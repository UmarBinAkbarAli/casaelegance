const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const outputRoot = path.join(rootDir, "assets", "optimized");
const reportPath = path.join(rootDir, "phase-5-optimization-report.json");
const sharp = require(path.join(rootDir, ".asset-tools", "node_modules", "sharp"));

const imageJobs = [
  { path: "assets/casa-elegance-logo.png", kind: "logo", responsive: true, widths: [144, 288, 432] },
  { path: "assets/casa-elegance-icon.png", kind: "icon", responsive: true, widths: [96, 192, 288] },
  { path: "assets/bg/bg-dark.jpg", kind: "background", responsive: true, widths: [768, 1440] },
  { path: "assets/bg/video_bg.jpg", kind: "poster", responsive: true, widths: [480, 768, 1024, 1440], optional: true },
  { path: "assets/project-grand-vista.png", kind: "card", responsive: false },
  { path: "assets/project-elegant-retreat.png", kind: "card", responsive: false },
  { path: "assets/project-modern-marvel.png", kind: "card", responsive: false },
  { path: "assets/team/team-bg-01-634x763.jpg", kind: "team", responsive: true, widths: [320, 480, 634] },
  { path: "assets/team/team-bg-02-634x763.jpg", kind: "team", responsive: true, widths: [320, 480, 634] },
  { path: "assets/team/team-bg-03-634x763.jpg", kind: "team", responsive: true, widths: [320, 480, 634] },
  { path: "assets/website-used/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae232f4cf2e75b202122a_02.BK115.jpg", kind: "gallery", responsive: true, widths: [480, 768, 1024, 1200] },
  { path: "assets/website-used/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23ab7cefcc49aedc3fe_10.BK115.jpg", kind: "hero", responsive: true, widths: [480, 768, 1024, 1200] },
  { path: "assets/website-used/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69ce946be65481932970df49_69cae22c68939cf61015796d_01.BK115_Hero-p-1080.jpg", kind: "hero", responsive: true, widths: [480, 768, 1024, 1080] },
  { path: "assets/website-used/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/1.jpg", kind: "hero", responsive: true, widths: [480, 768, 1024, 1080] },
  { path: "assets/website-used/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/2.jpg", kind: "gallery", responsive: true, widths: [480, 768, 1024, 1080] },
  { path: "assets/website-used/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/8.jpg", kind: "card", responsive: true, widths: [480, 768, 1024, 1080] },
  { path: "assets/website-used/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8eeb18c917589f966d7_01. Khyber Restaurant_Hero.jpeg", kind: "card", responsive: true, widths: [480, 768, 1024, 1189] },
  { path: "assets/website-used/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f7e0b317dbdb8e3231_02. Khyber Restaurant.png", kind: "card", responsive: true, widths: [480, 768, 1024, 1200] },
  { path: "assets/website-used/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/1.jpg", kind: "card", responsive: true, widths: [480, 768, 1024, 1080] },
  { path: "assets/website-used/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/4077486C-8922-41F5-B621-1B6DB225E5DA.jpeg", kind: "hero", responsive: true, widths: [480, 768, 1024, 1080] },
];

async function main() {
  fs.mkdirSync(outputRoot, { recursive: true });
  const report = [];

  for (const job of imageJobs) {
    const inputPath = path.join(rootDir, job.path);

    if (!fs.existsSync(inputPath)) {
      report.push({
        path: job.path,
        status: job.optional ? "missing-source" : "missing-required-source",
        variants: [],
      });
      continue;
    }

    const source = sharp(inputPath, { animated: false });
    const metadata = await source.metadata();
    const ext = normalizedExt(job.path);
    const baseName = path.parse(job.path).name;
    const relativeDir = path.dirname(job.path).replace(/^assets[\\/]/, "");
    const outputDir = path.join(outputRoot, relativeDir);
    fs.mkdirSync(outputDir, { recursive: true });

    const widths = job.responsive
      ? uniqueWidths(job.widths.concat([metadata.width]), metadata.width)
      : [metadata.width];

    const variants = [];

    for (const width of widths) {
      const suffix = `-${width}w`;
      const fallbackExt = ext === ".jpeg" ? ".jpg" : ext;
      const fallbackPath = path.join(outputDir, `${baseName}${suffix}${fallbackExt}`);
      await writeVariant(inputPath, fallbackPath, width, fallbackCodec(fallbackExt, job.kind));
      variants.push(recordVariant(fallbackPath, width, fallbackExt.slice(1)));

      const webpPath = path.join(outputDir, `${baseName}${suffix}.webp`);
      await writeVariant(inputPath, webpPath, width, { type: "webp", options: webpOptions(job.kind) });
      variants.push(recordVariant(webpPath, width, "webp"));

      const avifPath = path.join(outputDir, `${baseName}${suffix}.avif`);
      await writeVariant(inputPath, avifPath, width, { type: "avif", options: avifOptions(job.kind) });
      const avifBytes = fs.statSync(avifPath).size;
      const webpBytes = fs.statSync(webpPath).size;

      if (avifBytes <= webpBytes * 0.92) {
        variants.push(recordVariant(avifPath, width, "avif"));
      } else {
        fs.unlinkSync(avifPath);
      }
    }

    report.push({
      path: job.path.replace(/\\/g, "/"),
      status: "optimized",
      source: {
        bytes: fs.statSync(inputPath).size,
        width: metadata.width,
        height: metadata.height,
      },
      variants,
    });
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
}

function normalizedExt(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".jpeg" ? ".jpg" : ext;
}

function uniqueWidths(widths, maxWidth) {
  return [...new Set(widths.filter((width) => width && width <= maxWidth))].sort((a, b) => a - b);
}

function fallbackCodec(extension, kind) {
  if (extension === ".png") {
    return {
      type: "png",
      options: {
        compressionLevel: kind === "logo" || kind === "icon" ? 9 : 8,
        palette: false,
      },
    };
  }

  return {
    type: "jpeg",
    options: jpegOptions(kind),
  };
}

function jpegOptions(kind) {
  return {
    quality: kind === "logo" || kind === "icon" ? 90 : 84,
    mozjpeg: true,
  };
}

function webpOptions(kind) {
  return {
    quality: kind === "logo" || kind === "icon" ? 92 : 82,
    effort: 5,
  };
}

function avifOptions(kind) {
  return {
    quality: kind === "logo" || kind === "icon" ? 74 : 62,
    effort: 6,
  };
}

async function writeVariant(inputPath, outputPath, width, codec) {
  let pipeline = sharp(inputPath, { animated: false }).rotate().resize({ width, withoutEnlargement: true });

  if (codec.type === "jpeg") {
    pipeline = pipeline.jpeg(codec.options);
  } else if (codec.type === "png") {
    pipeline = pipeline.png(codec.options);
  } else if (codec.type === "webp") {
    pipeline = pipeline.webp(codec.options);
  } else if (codec.type === "avif") {
    pipeline = pipeline.avif(codec.options);
  } else {
    throw new Error(`Unsupported codec: ${codec.type}`);
  }

  await pipeline.toFile(outputPath);
}

function recordVariant(outputPath, width, format) {
  return {
    outputPath: path.relative(rootDir, outputPath).replace(/\\/g, "/"),
    width,
    format,
    bytes: fs.statSync(outputPath).size,
  };
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
