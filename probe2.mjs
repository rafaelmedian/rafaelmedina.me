import { chromium } from "@playwright/test"
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
page.on("pageerror", (e) => errs.push(String(e)))
await page.goto("http://127.0.0.1:5199/", { waitUntil: "networkidle" })
await page.waitForTimeout(1500)
await page.locator(".mosaic-takeover-stage").evaluate((el) => el.scrollIntoView({ block: "end" }))
async function seam(f) {
  await page.evaluate((t) => {
    const a = document.querySelector("#about-panel")
    window.scrollBy(0, a.getBoundingClientRect().top - window.innerHeight * (1 - t))
  }, f)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
  await page.waitForTimeout(150)
}
for (const f of [0.1, 0.45, 0.75, 0.95]) {
  await seam(f)
  await page.screenshot({ path: `/tmp/seam-${f}.png` })
}
// close button state + behaviour
await seam(0.8)
const info = await page.evaluate(() => {
  const b = document.querySelector(".mosaic-takeover-close")
  const r = b.getBoundingClientRect()
  return { visible: b.dataset.visible, rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width)], inert: b.hasAttribute("inert") }
})
console.log("close", JSON.stringify(info))
await page.locator(".mosaic-takeover-close").click()
await page.waitForTimeout(1600)
const after = await page.evaluate(() => ({ y: Math.round(window.scrollY), focus: document.activeElement?.id, hash: location.hash }))
console.log("after close", JSON.stringify(after))
// videos resumed?
await page.waitForTimeout(800)
const vids = await page.evaluate(() => [...document.querySelectorAll("video.mosaic-row-media")].map((v) => v.paused))
console.log("paused states", JSON.stringify(vids))
console.log("errs", JSON.stringify(errs))
await browser.close()
