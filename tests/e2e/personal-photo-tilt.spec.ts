import { expect, test } from "@playwright/test"

test("the homepage photo stack follows the pointer and rests before a gallery flight", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  const stack = page.locator(".personal-photos-stack")
  const tilt = page.locator(".personal-photos-stack-tilt")
  await trigger.scrollIntoViewIfNeeded()
  // The deal springs the prints out of a pile on `translate` and `rotate`,
  // which the print measured and the turn read below both depend on.
  await expect(stack).not.toHaveAttribute("data-deal")
  // Let the scroll event reset the previous pose before supplying a pointer.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const bounds = await stack.boundingBox()
  expect(bounds).not.toBeNull()
  const position = bounds!
  const readTilt = () => tilt.evaluate(element => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    return { x: matrix.m23, y: matrix.m13 }
  })
  // Over the label — below the stack, off every print — the whole hand
  // tilts toward the pointer, and leans the other way at the label's other
  // end.
  const label = (await trigger.locator(".personal-photos-label").boundingBox())!
  await page.mouse.move(label.x + 2, label.y + label.height / 2)
  await expect.poll(async () => (await readTilt()).y).toBeGreaterThan(0.01)
  await expect.poll(async () => (await readTilt()).x).toBeLessThan(-0.01)
  await page.mouse.move(label.x + label.width - 2, label.y + label.height / 2)
  await expect.poll(async () => (await readTilt()).y).toBeLessThan(-0.01)
  await expect.poll(async () => (await readTilt()).x).toBeLessThan(-0.01)
  const after = await stack.boundingBox()
  expect(after).toEqual(position)
  // Over a print the hand lies flat and that one print turns toward the
  // pointer instead; the rest stay square.
  const prints = trigger.locator(".personal-photos-print")
  const print = (await prints.nth(1).boundingBox())!
  await page.mouse.move(print.x + print.width * 0.25, print.y + print.height * 0.25)
  await expect.poll(async () => readTilt()).toEqual({ x: 0, y: 0 })
  await expect(prints.nth(1)).toHaveAttribute("data-print-tilt", "")
  await expect.poll(() => prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).rotate !== "none"))).toEqual([false, true, false, false, false])
  await page.mouse.move(label.x + 2, label.y + label.height / 2)
  await expect.poll(() => prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).rotate !== "none"))).toEqual([false, false, false, false, false])
  await expect.poll(async () => (await readTilt()).y).toBeGreaterThan(0.01)

  await trigger.click({ position: { x: 16, y: 16 } })
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await expect.poll(async () => readTilt()).toEqual({ x: 0, y: 0 })
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect.poll(async () => readTilt()).toEqual({ x: 0, y: 0 })
  await page.mouse.move(label.x + 2, label.y + label.height / 2)
  await expect.poll(async () => (await readTilt()).y).toBeGreaterThan(0.01)
  await page.mouse.move(0, 0)
  await expect.poll(async () => readTilt()).toEqual({ x: 0, y: 0 })
})

test("reduced motion and touch keep the photo stack still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.hover()
  const tilt = page.locator(".personal-photos-stack-tilt")
  await expect(tilt).toHaveCSS("transform", "none")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.mouse.move(0, 0)
  await trigger.dispatchEvent("pointermove", { pointerType: "touch", clientX: 100, clientY: 100 })
  await expect(tilt).toHaveCSS("transform", "none")
  await expect(trigger).toHaveCSS("touch-action", "manipulation")
})
