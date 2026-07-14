import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const indexPath = path.join(root, "dist", "index.html")
const serverEntry = path.join(root, ".ssr", "entry-server.js")
const { render } = await import(pathToFileURL(serverEntry).href)
const html = await fs.readFile(indexPath, "utf8")
const prerenderedAt = Date.now()
globalThis.__PRERENDERED_AT__ = prerenderedAt
const appHtml = render()

if (!html.includes('<div id="root"></div>')) {
  throw new Error("Could not find the empty root element in dist/index.html")
}

await fs.writeFile(
  indexPath,
  html.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div><script>globalThis.__PRERENDERED_AT__=${prerenderedAt}</script>`,
  ),
)
