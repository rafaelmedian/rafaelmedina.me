// Makes the home page's hero independent of every other file, so on any
// connection it paints and animates as soon as the HTML arrives: its CSS and the
// portrait go inline, the full stylesheet stops blocking, and the tile media
// waits for that stylesheet instead of competing with it. The head script in
// index.html runs the other half at load time.
import fs from "node:fs/promises"
import path from "node:path"
import postcss from "postcss"

const keptKeyframes = new Set(["avatar-intro-face", "avatar-intro-content", "mosaic-availability-shimmer"])

// Everything before #work is the top of the page. Keep the rules that can only
// reach those elements, the element defaults, and the intro's own states. Reading
// them from the built stylesheet means there is no copy of the hero's CSS to drift.
function heroStylesheet(html, css) {
  const top = html.slice(html.indexOf('<div id="root">'), html.indexOf('id="work"'))
  const classes = new Set([...top.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)))
  const keepSelector = (selector) => {
    if (/data-(avatar-intro|page-styles)/.test(selector)) return true
    return [...selector.matchAll(/\.([\w-]+)/g)].every((match) => classes.has(match[1]))
  }

  const sheet = postcss.parse(css)
  sheet.walkRules((rule) => {
    if (/keyframes$/.test(rule.parent.name ?? "")) return
    const selectors = rule.selectors.filter(keepSelector)
    if (selectors.length) rule.selectors = selectors
    else rule.remove()
  })
  sheet.walkAtRules((rule) => {
    const unusedKeyframes = /keyframes$/.test(rule.name) && !keptKeyframes.has(rule.params)
    const extendedFont = rule.name === "font-face" && rule.toString().includes("-extended.")
    if (unusedKeyframes || extendedFont || (rule.nodes && !rule.nodes.length)) rule.remove()
  })
  return sheet.toString()
}

export async function inlineHeroFirst(html, dist) {
  const stylesheet = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/)
  if (!stylesheet) throw new Error("Missing site stylesheet")
  const css = await fs.readFile(path.join(dist, stylesheet[1]), "utf8")

  const portrait = html.match(/src="(\/assets\/profile-photo-[^"]+\.webp)"/)
  if (!portrait) throw new Error("Missing hero portrait")
  const portraitData = (await fs.readFile(path.join(dist, portrait[1]))).toString("base64")

  // With scripting disabled, restore the artwork through CSS without adding
  // extra media elements to React's tree or downloading it during the intro.
  const posterFallbacks = [...html.matchAll(/<video\b[^>]*? poster="([^"]+)"/g)]
    .map(([, poster]) => {
      const url = JSON.stringify(poster)
      return `video.mosaic-row-media[data-poster=${url}]{background:center / cover no-repeat url(${url})}`
    }).join("")
  const load = `<style>${heroStylesheet(html, css)}</style>` +
    `<script>loadPageStyles(${JSON.stringify(stylesheet[1])})</script>` +
    `<noscript>${stylesheet[0]}<style>${posterFallbacks}</style></noscript>`

  return html
    .replace(stylesheet[0], () => load)
    // The face that animates arrives with the page. The back of the coin only
    // shows after a flip, so it can wait for its own request.
    .replace(`src="${portrait[1]}"`, () => `src="data:image/webp;base64,${portraitData}"`)
    // Nothing may get ahead of the hero's turn: not preloads, whether written in
    // index.html or by React's renderer for these images, and not eager tiles.
    .replace(/<link rel="preload" as="(?:image|font)"[^>]*>/g, "")
    .replace(/ fetchPriority="high"/g, "")
    .replace(/ loading="eager"/g, ' loading="lazy"')
    // A poster downloads even from a hidden element. The head script restores
    // these when the stylesheet lands.
    .replace(/(<video[^>]*?) poster="/g, '$1 data-poster="')
}
