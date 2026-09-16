import { expect, test } from "@playwright/test"

for (const { id, steps } of [
  { id: "hiking", steps: 8 },
  { id: "office", steps: 0 },
  { id: "hiking", steps: 0 },
  { id: "golden-gate-waves", steps: 0 },
  { id: "subway-door", steps: 0 },
]) {
test(`${id} shrinks in place at its drawn centre after ${steps} browsing steps`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const wall = page.locator('.personal-photos-sheet')
  await expect(page.locator('.personal-photos-flight')).toHaveCount(0)
  await wall.locator(`[data-photo-id="${id}"]`).click()
  await page.waitForTimeout(550)
  for (let index = 0; index < steps; index++) {
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(550)
  }
  const result = await wall.evaluate(async stage => {
    const selected = stage.querySelector<HTMLElement>('[data-held].personal-photos-slide')!
    const plane = stage.querySelector<HTMLElement>('.personal-photos-masonry')!
    const column = selected.parentElement!
    const panel = column.parentElement!
    const before = selected.getBoundingClientRect()
    const placement = [column.style.top, panel.style.left]
    const camera = plane.style.transform
    selected.click()
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    // Freeze the actual release at its start, after React has removed selection.
    for (const element of [plane, selected]) element.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 0 })
    const after = selected.getBoundingClientRect()
    const centre = (rect: DOMRect) => ({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 })
    const start = centre(before)
    const drift = [0, 0.25, 0.5, 0.75, 1].map(progress => {
      for (const element of [plane, selected]) element.getAnimations().forEach(animation => {
        animation.currentTime = Number(animation.effect!.getTiming().duration) * progress
      })
      const point = centre(selected.getBoundingClientRect())
      return Math.hypot(point.x - start.x, point.y - start.y)
    })
    return { drift, camera, afterCamera: plane.style.transform, placement, afterPlacement: [column.style.top, panel.style.left], jump: Math.hypot(after.x - before.x, after.y - before.y) }
  })
  expect(result.afterPlacement).toEqual(result.placement)
  expect(result.jump).toBeLessThan(2)
  expect(Math.max(...result.drift), "photo stays centred throughout shrinking").toBeLessThan(2)
  expect(result.afterCamera, "release keeps the latest browsing position").not.toBe(result.camera)
  await wall.evaluate(stage => stage.getAnimations({ subtree: true }).forEach(animation => animation.finish()))
  await expect(wall.locator('.personal-photos-slide[data-held]')).toHaveCount(0)
  await expect(wall).toBeVisible()
})

}
