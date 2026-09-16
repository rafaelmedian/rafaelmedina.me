import { expect, test } from "@playwright/test"

for (const width of [2394, 1440, 390]) {
  test(`photo details stay open across navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : width === 1440 ? 900 : 1279 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await page.locator(".personal-photos-label").click()
    const dialog = page.getByRole("dialog", { name: "Personal photos" })
    const photo = dialog.locator('.personal-photos-slide[data-photo-id="office"]')
    await photo.focus()
    await page.keyboard.press("Enter")
    await expect.poll(async () => {
      const box = (await photo.boundingBox())!
      return Math.abs(box.x + box.width / 2 - width / 2)
    }).toBeLessThan(1)
    const before = (await photo.boundingBox())!
    const book = dialog.getByRole("button", { name: "Photo details", exact: true })
    await book.locator("[data-photo-caption-text]").click()
    await expect(book).toHaveAttribute("aria-expanded", "true")
    const details = dialog.getByRole("region", { name: "Photo details", exact: true })
    await expect(details.getByRole("heading")).toHaveText("Office days")
    const neighbour = dialog.locator('.personal-photos-slide[data-photo-id="night-portrait"]')
    await expect(neighbour).toHaveCSS("opacity", "0.12")
    await expect(neighbour).toHaveCSS("scale", "none")
    const after = (await photo.boundingBox())!
    const panel = (await details.boundingBox())!
    expect(Math.abs(after.x - before.x)).toBeLessThan(1)
    expect(Math.abs(after.width - before.width)).toBeLessThan(1)
    expect(Math.abs(panel.x - after.x)).toBeLessThan(1)
    expect(Math.abs(panel.y + panel.height - after.y - after.height)).toBeLessThan(1)
    expect(panel.y).toBeGreaterThanOrEqual(after.y - 1)
    const caption = (await dialog.locator("[data-photo-caption-text]").boundingBox())!
    const icon = (await book.boundingBox())!
    expect(caption.y).toBeGreaterThanOrEqual(width > 700 ? after.y + after.height : panel.y + panel.height)
    expect(Math.abs(caption.y + caption.height / 2 - icon.y - icon.height / 2)).toBeLessThan(1)
    await expect(dialog.getByRole("navigation", { name: "Browse photos" })).toHaveCount(0)
    await expect(details.locator(".personal-photo-description")).not.toBeEmpty()
    await page.keyboard.press("ArrowRight")
    await expect(details.getByRole("heading")).toHaveText("After dark")
    await page.keyboard.press("ArrowLeft")
    await expect(details.getByRole("heading")).toHaveText("Office days")
    await page.keyboard.press("Escape")
    await expect(details).toBeHidden()
    await expect(dialog).toBeVisible()
    await page.keyboard.press("ArrowRight")
    await expect(details).toBeVisible()
    await book.click()
    await expect(details).toBeHidden()
    await expect(book).toHaveAttribute("aria-expanded", "false")
    await expect(book).toBeFocused()
    await page.keyboard.press("Escape")
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
  })
}

test("details retarget during motion and clicking the photo still shrinks it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  const photo = dialog.locator('.personal-photos-slide[data-photo-id="office"]')
  await photo.focus()
  await page.keyboard.press("Enter")
  const book = dialog.getByRole("button", { name: "Photo details", exact: true })
  await expect(book).toBeVisible()
  await book.focus()
  await page.keyboard.press("Enter")
  await page.keyboard.press("Enter")
  await page.keyboard.press("Enter")
  await expect(book).toHaveAttribute("aria-expanded", "true")
  const details = dialog.getByRole("region", { name: "Photo details", exact: true })
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowRight")
  await expect(details.getByRole("heading")).toHaveText("Street painter")
  const held = dialog.locator('.personal-photos-slide[data-held]')
  await held.click()
  await expect(details).toBeHidden()
  await page.keyboard.press("ArrowRight")
  await expect(details).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(held).toHaveCount(0)

})

test("caption and metadata travel with the opening photo", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await dialog.locator('.personal-photos-slide[data-photo-id="office"]').focus()
  await page.keyboard.press("Enter")
  const book = dialog.getByRole("button", { name: "Photo details", exact: true })
  await book.click()
  const details = dialog.getByRole("region", { name: "Photo details", exact: true })
  await expect(details).toBeVisible()
  // Stretch the real transition so this checks the in-flight state reliably.
  await dialog.locator(".personal-photos-sheet").evaluate(element => {
    element.style.setProperty("--grid-focus-duration", "1200ms")
  })
  await page.keyboard.press("ArrowRight")
  await expect(details).toBeVisible()
  await expect(book).toBeVisible()
  const moving = await dialog.locator(".personal-photos-masonry").evaluate(element => element.getAnimations().some(animation => animation.playState === "running"))
  expect(moving).toBe(true)
  const alignment = await dialog.evaluate(async element => {
    const errors: number[] = []
    for (let frame = 0; frame < 12; frame++) {
      await new Promise(requestAnimationFrame)
      const photo = element.querySelector(".personal-photos-slide[data-held]")!.getBoundingClientRect()
      const panel = element.querySelector(".personal-photo-details")!.getBoundingClientRect()
      errors.push(Math.abs(panel.left - photo.left), Math.abs(panel.bottom - photo.bottom), Math.abs(panel.width - photo.width))
    }
    return Math.max(...errors)
  })
  expect(alignment).toBeLessThan(2)
  await page.keyboard.press("Escape")
  await expect(book).toBeHidden()
})

for (const motion of ["reduce", "no-preference"] as const) {
for (const dx of [-120, 120]) {
  test(`swiping a held photo follows horizontal wheel direction ${dx} with ${motion}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: motion })
    await page.goto("/")
    await page.locator(".personal-photos-label").click()
    const dialog = page.getByRole("dialog", { name: "Personal photos" })
    const photo = dialog.locator('[data-photo-id="office"]')
    await photo.focus()
    await page.keyboard.press("Enter")
    await dialog.locator(".personal-photos-sheet").evaluate(async element => {
      await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})))
    })
    const before = (await photo.boundingBox())!
    await dialog.locator(".personal-photos-sheet").dispatchEvent("wheel", { deltaX: dx, deltaY: 0 })
    await expect(photo).not.toHaveAttribute("data-held", "")
    if (motion === "no-preference") {
      const duration = await photo.evaluate(element => element.getAnimations()
        .filter(animation => animation instanceof CSSTransition && animation.transitionProperty === "transform")
        .map(animation => Number(animation.effect?.getTiming().duration))[0])
      expect(duration).toBe(200)
    }
    await photo.evaluate(async element => {
      await Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {})))
    })
    const after = (await photo.boundingBox())!
    expect(after.width).toBeLessThan(before.width)
    expect(after.x + after.width / 2 - before.x - before.width / 2).toBeCloseTo(-dx, 0)
  })
}
}
