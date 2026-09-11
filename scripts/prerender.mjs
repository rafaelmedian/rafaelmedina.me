import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const serverEntry = path.join(root, ".ssr", "entry-server.js")
const { render, pages, ready } = await import(pathToFileURL(serverEntry).href)
// The note article is a chunk of its own; `render` cannot write a note page
// until it has arrived.
await ready
const template = await fs.readFile(path.join(dist, "index.html"), "utf8")
const prerenderedAt = Date.now()
globalThis.__PRERENDERED_AT__ = prerenderedAt

if (!template.includes('<div id="root"></div>')) {
  throw new Error("Could not find the empty root element in dist/index.html")
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char])

if (new Set(pages.map(page => page.pathname)).size !== pages.length) {
  throw new Error("Project paths must be unique")
}

for (const { pathname, metadata } of pages) {
  let html = template
    .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, () => `<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`)

  for (const [key, value] of Object.entries(metadata.meta)) {
    const attribute = key.startsWith("og:") ? "property" : "name"
    const pattern = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`)
    if (!pattern.test(html)) throw new Error(`Missing metadata slot: ${key}`)
    html = html.replace(pattern, () => `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`)
  }

  // The portfolio's first-row posters aren't critical resources on a project page.
  if (pathname !== "/") html = html.replace(/<link rel="preload" as="image"[^>]*>/g, "")
  html = html.replace('<div id="root"></div>', () =>
    `<div id="root">${render(pathname)}</div><script>globalThis.__PRERENDERED_AT__=${prerenderedAt}</script>`,
  )
  const directory = path.join(dist, pathname)
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, "index.html"), html)
}

// The public 404 loads the source stylesheet in development and the exact same
// compiled stylesheet as the rest of the site in production. No copied tokens.
const stylesheets = template.match(/<link rel="stylesheet"[^>]*>/g)
if (!stylesheets?.length) throw new Error("Missing site stylesheet for the 404 page")
const notFoundPath = path.join(dist, "404.html")
const notFound = await fs.readFile(notFoundPath, "utf8")
const styleSlot = '<link rel="stylesheet" href="/src/index.css" />'
if (!notFound.includes(styleSlot)) throw new Error("Missing 404 stylesheet slot")
await fs.writeFile(notFoundPath, notFound.replace(styleSlot, () => stylesheets.join("\n")))

// Derive the sitemap from the same pages we actually wrote, without invented dates.
await fs.writeFile(path.join(dist, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(({ metadata }) => `  <url><loc>${escapeHtml(metadata.canonical)}</loc></url>`).join("\n") +
  '\n</urlset>\n',
)
