import { expect, type Page, test } from "@playwright/test"

const carousel = (page: Page) => page.getByRole("group", { name: "Quotes" })

test("omits the hover-card avatar when an optional portrait is unavailable", async ({ page }) => {
  await page.goto("/design-system")
  const card = carousel(page)
  await card.getByRole("button", { name: "Show quote from Amy" }).click()
  await card.locator('.mosaic-quote-slide[data-active="true"]').getByRole("button", { name: "Amy on X" }).focus()
  const preview = page.locator(".mosaic-quote-profile-popup .mosaic-x-card")
  await expect(preview).toBeVisible()
  await expect(preview.locator("img.mosaic-x-card-avatar")).toHaveCount(0)
  await expect(preview.locator(".mosaic-x-card-avatar-fallback")).toHaveText("A")
  await expect(preview.getByRole("link", { name: "Follow" })).toBeVisible()
})

test("distant dot navigation moves only incoming and outgoing quotes by one card width", async ({ page }) => {
  await page.goto("/design-system")
  const slides = carousel(page).locator(".mosaic-quote-slide")
  await expect(slides).toHaveCount(6)
  const width = await carousel(page).locator(".mosaic-quote-slides").evaluate((node) => node.getBoundingClientRect().width)
  await carousel(page).locator(".mosaic-quote-dot").nth(4).click()
  const travel = await slides.evaluateAll((nodes) => nodes.map((node) => {
    const animations = node.getAnimations()
    const animation = animations[0]
    const duration = Number(animation?.effect?.getComputedTiming().duration ?? 0)
    animation?.pause()
    if (animation) animation.currentTime = 0
    const start = new DOMMatrixReadOnly(getComputedStyle(node).transform).m41
    if (animation) animation.currentTime = duration
    const end = new DOMMatrixReadOnly(getComputedStyle(node).transform).m41
    animation?.play()
    return {
      animations: animations.length,
      distance: Math.abs(end - start),
    }
  }))
  const moving = travel.filter((slide) => slide.animations > 0)
  expect(moving).toHaveLength(2)
  for (const slide of moving) {
    expect(slide.distance).toBeCloseTo(width, 0)
  }
  await slides.evaluateAll((nodes) => Promise.all(nodes.flatMap((node) => node.getAnimations().map((animation) => animation.finished))))
  await expect(slides.nth(4)).toHaveAttribute("data-active", "true")
  await expect(slides.nth(4)).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")
})
