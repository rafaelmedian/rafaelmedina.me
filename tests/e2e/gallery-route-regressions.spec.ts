import { expect, test } from "@playwright/test"

for (const [slug, title] of [
  ["matcha-on-mobile", "Matcha on mobile"],
  ["matcha-security-audit", "Matcha security audit"],
]) {
  test(`keeps ${slug} readable after hydration without a home tile`, async ({ page }) => {
    await page.goto(`/work/${slug}/`)
    // Let the entry gate finish: a prerendered heading alone would pass even
    // when hydration subsequently replaces the project with the homepage.
    await expect(page.locator("html")).not.toHaveAttribute("data-gallery-entry", /.+/)
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible()
    await expect(page.getByRole("link", { name: "All work", exact: true })).toHaveAttribute("href", "/#work")
  })
}

test("browser Back restores the tile hidden by the gallery entrance", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  const card = page.locator(".mosaic-row-card-preview-shot-9")
  const tile = card.locator(".mosaic-row-card-media-clip")
  await card.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(tile).toHaveCSS("opacity", "0")
  // The tile's empty fill stays as the slot the artwork left.
  await expect(card).toHaveCSS("opacity", "1")
  await page.goBack()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(tile).toHaveCSS("opacity", "1")
  await page.goForward()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(tile).toHaveCSS("opacity", "1")
})
