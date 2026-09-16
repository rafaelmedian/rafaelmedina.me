import { expect, test } from "@playwright/test"

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`zooming a held photo preserves the gesture anchor with ${reducedMotion}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion })
    await page.goto("/")
    await page.locator(".personal-photos-label").click()
    await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
    const wall = page.getByRole("region", { name: "Photo wall" })
    const photo = wall.locator('[data-photo-id="office"]')
    await photo.focus()
    await page.keyboard.press("Enter")
    await expect(photo).toHaveAttribute("data-held", "")
    await wall.evaluate(async element => {
      await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})))
    })
    const before = (await photo.boundingBox())!
    const x = before.x + before.width / 2
    const y = before.y + before.height / 2
    await wall.dispatchEvent("wheel", { deltaY: 1, ctrlKey: true, clientX: x, clientY: y })
    await expect(photo).not.toHaveAttribute("data-held", "")
    await wall.evaluate(async element => {
      await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})))
    })
    const after = (await photo.boundingBox())!
    expect(after.width).toBeLessThan(before.width)
    expect(Math.hypot(after.x + after.width / 2 - x, after.y + after.height / 2 - y)).toBeLessThan(2)
  })
}
