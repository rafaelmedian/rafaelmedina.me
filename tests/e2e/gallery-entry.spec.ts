import { expect, test } from "@playwright/test"

/* A project, the résumé, the notes, and a note each own a prerendered page, and
   once React runs that address opens its dialog over the feed instead. Painted
   as-is, a shared link showed the article, swapped it for the bare feed, and
   only then opened the dialog. `index.html` holds the page back until the
   dialog presents, and the page fades in under the dialog's own entrance. */

for (const path of ["/work/matcha-multiwallet-flow/", "/resume/", "/notes/", "/notes/designing-matcha/"]) {
  test(`${path} opens straight into its dialog`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.goto(path)
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    await expect(page.locator(".standalone-page")).toHaveCount(0)
    await expect(page.locator("html")).not.toHaveAttribute("data-gallery-entry")
    await expect(page.locator("#root")).toHaveCSS("opacity", "1")

    // Verify the shipped reveal at its midpoint instead of hoping a busy
    // runner samples or receives an event during the live 200ms animation.
    const midpoint = await page.locator("#root").evaluate((root) => {
      document.documentElement.dataset.galleryEntry = "revealing"
      const animation = root.getAnimations().find((candidate) => (
        candidate instanceof CSSAnimation && candidate.animationName === "gallery-entry-reveal"
      ))
      animation?.pause()
      if (animation) animation.currentTime = 100
      const style = getComputedStyle(root)
      const result = {
        animationName: style.animationName,
        duration: style.animationDuration,
        opacity: Number(style.opacity),
      }
      delete document.documentElement.dataset.galleryEntry
      return result
    })
    expect(midpoint.animationName).toBe("gallery-entry-reveal")
    expect(midpoint.duration).toBe("0.2s")
    expect(midpoint.opacity).toBeGreaterThan(0)
    expect(midpoint.opacity).toBeLessThan(1)
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
