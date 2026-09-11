import { expect, test } from "@playwright/test"

/* A project, the résumé, the notes, and a note each own a prerendered page, and
   once React runs that address opens its dialog over the feed instead. Painted
   as-is, a shared link showed the article, swapped it for the bare feed, and
   only then opened the dialog. `index.html` holds the page back until the
   dialog presents, and the page fades in under the dialog's own entrance. */

type Frame = { entry: string | null; root: number; article: boolean; popup: boolean }

for (const path of ["/work/matcha-multiwallet-flow/", "/resume/", "/notes/", "/notes/designing-matcha/"]) {
  test(`${path} opens straight into its dialog`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.addInitScript(() => {
      const frames: Frame[] = []
      Object.assign(window, { __frames: frames })
      const sample = () => {
        const root = document.getElementById("root")
        if (root) frames.push({
          entry: document.documentElement.dataset.galleryEntry ?? null,
          root: Number(getComputedStyle(root).opacity),
          article: document.querySelector(".standalone-page") !== null,
          popup: document.querySelector(".preview-gallery-popup") !== null,
        })
        if (frames.length < 600) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })
    await page.goto(path)
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    await expect(page.locator("html")).not.toHaveAttribute("data-gallery-entry")
    await expect(page.locator("#root")).toHaveCSS("opacity", "1")

    const frames = await page.evaluate(() => (window as unknown as { __frames: Frame[] }).__frames)
    expect(frames[0].entry).toBe("pending")
    // Neither the prerendered article nor the feed without its dialog is ever
    // painted: the page only shows once the dialog is there.
    expect(frames.filter(frame => frame.root > 0 && (frame.article || !frame.popup))).toEqual([])
    // And it arrives as a fade rather than a cut.
    expect(frames.some(frame => frame.popup && frame.root > 0 && frame.root < 1)).toBe(true)
  })
}

test("a shared link without JavaScript reads its article as before", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  await page.goto("/notes/designing-matcha/")
  await expect(page.locator("html")).not.toHaveAttribute("data-gallery-entry")
  await expect(page.locator("#root")).toHaveCSS("opacity", "1")
  await expect(page.getByRole("heading", { level: 1, name: "Designing Matcha" })).toBeVisible()
  await context.close()
})

test("releases the article if the application bundle never arrives", async ({ page }) => {
  await page.route("**/assets/index-*.js", route => route.abort())
  await page.goto("/work/matcha-multiwallet-flow/")
  await expect(page.locator("#root")).toHaveCSS("opacity", "0")
  await expect(page.locator("#root")).toHaveCSS("opacity", "1", { timeout: 6000 })
  await expect(page.locator(".standalone-page")).toBeVisible()
})

test("shows the feed when the gallery's chunk fails, without waiting out the fallback", async ({ page }) => {
  await page.route("**/PreviewGalleryDialog-*.js*", route => route.abort())
  await page.goto("/work/matcha-multiwallet-flow/")
  // Well inside the head script's 4s: the feed reveals the page itself.
  await expect(page.locator("html")).not.toHaveAttribute("data-gallery-entry", "pending", { timeout: 2500 })
  await expect(page.locator(".writings-tile")).toBeVisible()
  await expect(page.locator(".preview-gallery-popup")).toHaveCount(0)
})
