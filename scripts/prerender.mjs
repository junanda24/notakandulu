// Build-time prerender: render <App/> to static HTML and inject it into
// dist/index.html so crawlers get real content (h1, copy, wizard UI) without JS.
// Client React (createRoot) takes over identically on load — no visual change.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

const TMP = "scripts/.ssr-bundle.cjs";

execFileSync(
  "npx",
  [
    "esbuild",
    "scripts/ssr-entry.jsx",
    "--bundle",
    "--platform=node",
    "--format=cjs",
    "--jsx=automatic",
    `--outfile=${TMP}`,
    "--log-level=error",
  ],
  { stdio: "inherit" }
);

try {
  const html = execFileSync("node", [TMP], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  }).trim();
  var ssrHtml = html;
} finally {
  unlinkSync(TMP);
}

const path = "dist/index.html";
let index = readFileSync(path, "utf8");
if (!index.includes('<div id="root"></div>')) {
  throw new Error("prerender: #root placeholder not found in dist/index.html");
}
index = index.replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`);
writeFileSync(path, index);
console.log(`prerender: injected ${ssrHtml.length} chars of static HTML into dist/index.html`);

// sitemap lastmod = tanggal build (otomatis, bukan hardcoded)
try {
  const sm = "dist/sitemap.xml";
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(sm, readFileSync(sm, "utf8").replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`));
} catch {}

