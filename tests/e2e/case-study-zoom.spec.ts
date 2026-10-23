import { expect, test } from "@playwright/test"

// A case-study screenshot grows out of the card to fill the screen. The zoom
// owns Escape: it shrinks back into the card, the gallery stays open where the
// reader left it, and focus returns to the picture they pressed.
test("a case-study image zooms and Escape puts it back without closing the gallery", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/work/moodys-design-sprints/")
  const gallery = page.getByRole("dialog").first()
  await expect(gallery).toBeVisible()

  const trigger = page.getByRole("button", { name: "Enlarge: ESG performance for asset managers" })
  await trigger.scrollIntoViewIfNeeded()
  const card = page.locator(".preview-gallery-card").first()
  await expect.poll(() => card.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  const scrolled = await card.evaluate(element => element.scrollTop)

  await trigger.click()
  const zoom = page.locator("dialog.image-zoom[open]")
  await expect(zoom).toBeVisible()
  await expect(zoom).toHaveAttribute("data-ready", "true")
  await expect(zoom.getByRole("button", { name: "Close" })).toBeFocused()
  // The enlarged picture is wider than the one in the column.
  const inline = await trigger.locator("img").boundingBox()
  await expect.poll(async () => (await zoom.locator("img").boundingBox())?.width ?? 0)
    .toBeGreaterThan(inline!.width * 1.4)
  // Opening the zoom must not move the card behind it.
  expect(await card.evaluate(element => element.scrollTop)).toBe(scrolled)

  await page.keyboard.press("Escape")
  await expect(page.locator("dialog.image-zoom")).toHaveCount(0)
  await expect(gallery).toBeVisible()
  await expect(trigger).toBeFocused()
  expect(await card.evaluate(element => element.scrollTop)).toBe(scrolled)
})

test("a press anywhere on the zoom closes it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/work/twilio-admiral/")
  const trigger = page.getByRole("button", { name: "Enlarge: Editing an access policy, before and after" })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const zoom = page.locator("dialog.image-zoom[open]")
  await expect(zoom).toHaveAttribute("data-ready", "true")
  await zoom.click({ position: { x: 24, y: 24 } })
  await expect(page.locator("dialog.image-zoom")).toHaveCount(0)
  await expect(page.getByRole("dialog").first()).toBeVisible()
})
