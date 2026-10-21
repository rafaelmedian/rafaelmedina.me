import { expect, test } from "@playwright/test"

test("wall photos stay still on hover and show hand cursors for interaction", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  // The photos open in place; let them finish growing in before measuring.
  await expect(page.locator(".personal-photos-sheet[data-entering]")).toHaveCount(0)
  await page.mouse.move(5, 5)
  const photo = page.locator('.personal-photos-sheet [data-photo-id="office"]')
  const before = (await photo.boundingBox())!
  await photo.hover()
  await expect(photo).toHaveCSS("cursor", "pointer")
  await expect(photo).toHaveCSS("scale", "none")
  expect((await photo.boundingBox())!.width).toBeCloseTo(before.width, 1)
  await page.mouse.down()
  await page.mouse.move(before.x + before.width / 2 + 40, before.y + before.height / 2, { steps: 4 })
  await expect(photo).toHaveCSS("cursor", "grabbing")
  await page.mouse.up()
  await expect(photo).toHaveCSS("cursor", "pointer")
  await page.mouse.move(5, 5)
  await expect.poll(async () => (await photo.boundingBox())!.width / before.width).toBeLessThan(1.01)
})

test("the wall opens in place over a white canvas that only fades in", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.evaluate(() => {
    Object.assign(window, { openingOpacity: [] as [number, number][] })
    const sample = () => {
      const dialog = document.querySelector(".personal-photos-dialog:not([data-ending-style])")
      const backdrop = document.querySelector(".personal-photos-backdrop:not([data-ending-style])")
      if (dialog && backdrop) (window as unknown as { openingOpacity: [number, number][] }).openingOpacity.push(
        [Number(getComputedStyle(dialog).opacity), Number(getComputedStyle(backdrop).opacity)],
      )
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo wall" })).toBeVisible()
  // No photo flies out of the fan on the way in.
  expect(await page.locator(".personal-photos-flight").count()).toBe(0)
  await expect(page.locator(".personal-photos-sheet[data-entering]")).toHaveCount(0)
  const samples = await page.evaluate(() => (window as unknown as { openingOpacity: [number, number][] }).openingOpacity)
  expect(samples.length).toBeGreaterThan(1)
  // The popup holding the photos stays opaque; its photos carry the entrance.
  expect(Math.min(...samples.map(([dialog]) => dialog))).toBe(1)
  // The white canvas only ever rises, and ends fully opaque.
  const backdrop = samples.map(([, opacity]) => opacity)
  expect(backdrop.every((opacity, index) => index === 0 || opacity >= backdrop[index - 1])).toBe(true)
  expect(backdrop.at(-1)).toBe(1)
})

test("the wall closes in place and leaves the fan's prints where they are", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo wall" })).toBeVisible()
  await expect(page.locator(".personal-photos-sheet[data-entering]")).toHaveCount(0)
  await page.evaluate(() => {
    Object.assign(window, { closeSamples: [] as { flights: number; away: number }[] })
    const sample = () => {
      (window as unknown as { closeSamples: { flights: number; away: number }[] }).closeSamples.push({
        flights: document.querySelectorAll(".personal-photos-flight").length,
        away: document.querySelectorAll(".personal-photos-print[data-photo-away]").length,
      })
      if (document.querySelector(".personal-photos-dialog")) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  await page.keyboard.press("Escape")
  await expect(page.locator(".personal-photos-sheet[data-leaving]")).toHaveCount(1)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
  const samples = await page.evaluate(() => (window as unknown as { closeSamples: { flights: number; away: number }[] }).closeSamples)
  expect(samples.length).toBeGreaterThan(1)
  // Nothing flies home, and no print on the fan ever gives up its photo.
  expect(samples.every(({ flights, away }) => flights === 0 && away === 0)).toBe(true)
})
