const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const net = require("net");

const rootDir = path.resolve(__dirname, "..");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProfile = path.join(rootDir, ".chrome-validate-assets");
const debugPort = 9232;
const serverPort = 3123;
const pages = [
  "index.html",
  "about.html",
  "services.html",
  "projects.html",
  "project-details.html",
  "contact.html",
];

async function main() {
  fs.mkdirSync(chromeProfile, { recursive: true });
  const server = createStaticServer(rootDir);
  await new Promise((resolve) => server.listen(serverPort, "127.0.0.1", resolve));
  const browserProcess = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${chromeProfile}`,
      `--remote-debugging-port=${debugPort}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    await waitForPort(debugPort);
    const version = JSON.parse(await httpGet(`http://127.0.0.1:${debugPort}/json/version`));
    const browser = await createCdpClient(version.webSocketDebuggerUrl);
    const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
    const targets = JSON.parse(await httpGet(`http://127.0.0.1:${debugPort}/json/list`));
    const target = targets.find((entry) => entry.id === targetId);
    const page = await createCdpClient(target.webSocketDebuggerUrl);

    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const results = [];

    for (const file of pages) {
      await page.send("Page.navigate", { url: `http://127.0.0.1:${serverPort}/${file}` });
      await wait(1200);
      await page.send("Runtime.evaluate", {
        expression: "window.scrollTo(0, document.body.scrollHeight); true;",
        returnByValue: true,
      });
      await wait(600);
      await page.send("Runtime.evaluate", {
        expression: "window.scrollTo(0, 0); true;",
        returnByValue: true,
      });
      await wait(600);
      const evaluation = await page.send("Runtime.evaluate", {
        expression: `(() => ({
          title: document.title,
          localBroken: Array.from(document.images)
            .filter((img) => img.currentSrc.startsWith(window.location.origin) && (!img.complete || img.naturalWidth === 0))
            .map((img) => ({ src: img.getAttribute("src"), currentSrc: img.currentSrc, alt: img.alt })),
          externalBroken: Array.from(document.images)
            .filter((img) => !img.currentSrc.startsWith(window.location.origin) && (!img.complete || img.naturalWidth === 0))
            .map((img) => ({ src: img.getAttribute("src"), currentSrc: img.currentSrc, alt: img.alt })),
          withSrcset: Array.from(document.images).filter((img) => img.hasAttribute("srcset")).length,
          totalImages: document.images.length
        }))()`,
        returnByValue: true,
      });

      results.push({ file, ...evaluation.result.value });
    }

    console.log(JSON.stringify(results, null, 2));
    page.close();
    browser.close();
  } finally {
    browserProcess.kill();
    server.close();
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function createStaticServer(root) {
  return http.createServer((request, response) => {
    const urlPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relativePath = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = path.normalize(path.join(root, relativePath));

    if (!filePath.startsWith(root)) {
      response.statusCode = 403;
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.statusCode = error.code === "ENOENT" ? 404 : 500;
        response.end(error.code === "ENOENT" ? "Not found" : "Server error");
        return;
      }

      response.setHeader("Content-Type", mimeType(filePath));
      response.end(content);
    });
  });
}

function mimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".html": return "text/html; charset=utf-8";
    case ".css": return "text/css; charset=utf-8";
    case ".js": return "application/javascript; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".svg": return "image/svg+xml";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".png": return "image/png";
    case ".webp": return "image/webp";
    case ".avif": return "image/avif";
    default: return "application/octet-stream";
  }
}

function waitForPort(port, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect(port, "127.0.0.1", () => {
        socket.destroy();
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error("Chrome remote debugging port did not open"));
        } else {
          setTimeout(attempt, 200);
        }
      });
    };
    attempt();
  });
}

async function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });

  let id = 0;
  const pending = new Map();

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) {
      return;
    }

    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) {
      reject(new Error(JSON.stringify(message.error)));
      return;
    }
    resolve(message.result);
  };

  return {
    send(method, params = {}) {
      const requestId = ++id;
      socket.send(JSON.stringify({ id: requestId, method, params }));
      return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
