import { chromium } from "@playwright/test"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`) })
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`))
await page.goto("http://127.0.0.1:5199/design-system", { waitUntil: "networkidle" })
await page.waitForTimeout(600)
await page.screenshot({ path: "/tmp/ds-top.png" })

// baseline counts
const baseline = await page.evaluate(() => ({
  entries: document.querySelectorAll("[data-ds-terms]").length,
  hidden: document.querySelectorAll("[data-ds-terms][hidden]").length,
  sections: document.querySelectorAll(".ds-section").length,
  docWidth: document.documentElement.scrollWidth,
  inner: window.innerWidth,
}))
console.log("baseline", JSON.stringify(baseline))

await page.fill(".ds-filter-input", "radius")
await page.waitForTimeout(300)
const filtered = await page.evaluate(() => ({
  status: document.querySelector(".ds-filter-status")?.textContent,
  visibleEntries: [...document.querySelectorAll("[data-ds-terms]")].filter((e) => !e.hasAttribute("hidden")).length,
  hiddenSections: [...document.querySelectorAll(".ds-section")].filter((e) => e.hasAttribute("hidden")).map((e) => e.id),
  navEmpty: [...document.querySelectorAll(".ds-nav-link")].filter((a) => a.dataset.empty).map((a) => a.textContent),
}))
console.log("filtered", JSON.stringify(filtered))
await page.screenshot({ path: "/tmp/ds-filtered.png", fullPage: false })

// nonsense query
await page.fill(".ds-filter-input", "zzzznope")
await page.waitForTimeout(300)
const none = await page.evaluate(() => ({
  status: document.querySelector(".ds-filter-status")?.textContent,
  empty: document.querySelector(".ds-empty")?.textContent?.slice(0, 60),
  visibleSections: [...document.querySelectorAll(".ds-section")].filter((e) => !e.hasAttribute("hidden")).map((e) => e.id),
}))
console.log("none", JSON.stringify(none))
await page.screenshot({ path: "/tmp/ds-none.png" })

// clear
await page.fill(".ds-filter-input", "")
await page.waitForTimeout(300)
const cleared = await page.evaluate(() => ({
  hidden: document.querySelectorAll("[data-ds-terms][hidden]").length,
  hiddenSections: document.querySelectorAll(".ds-section[hidden]").length,
  active: document.querySelector('.ds-nav-link[data-active="true"]')?.textContent,
}))
console.log("cleared", JSON.stringify(cleared))
console.log("errors", JSON.stringify(errors))
await browser.close()
