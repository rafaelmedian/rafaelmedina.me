import { expect, test } from "@playwright/test"

test("the homepage photo stack only changes its print angles on hover", async ({ page }) => {
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
  const prints = page.locator(".personal-photos > .personal-photos-trigger .personal-photos-print")
  const readPose = () => prints.evaluateAll((elements) => elements.map((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    return {
      angle: Math.round(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI * 10) / 10,
      x: Math.round(matrix.e * 10) / 10,
      y: Math.round(matrix.f * 10) / 10,
      rotate: getComputedStyle(element).rotate,
      translate: getComputedStyle(element).translate,
    }
  }))
  const rest = await readPose()

  // Hovering anywhere on the card only nudges the prints' existing 2D
  // angles. It does not tip the stack toward the pointer or move one print
  // out of the hand.
  const label = (await trigger.locator(".personal-photos-label").boundingBox())!
  await page.mouse.move(label.x + 2, label.y + label.height / 2)
  await expect(trigger).toHaveAttribute("data-fan-open", "")
  const targetAngles = await prints.evaluateAll((elements) => elements.map((element) => {
    const angle = parseFloat(getComputedStyle(element).getPropertyValue("--print-hover-tilt"))
    return Math.round(angle * 10) / 10
  }))
  await expect.poll(async () => Math.max(...(await readPose()).map(({ angle }, index) => Math.abs(angle - targetAngles[index])))).toBeLessThanOrEqual(0.1)
  const hovered = await readPose()
  hovered.forEach((pose, index) => {
    expect(Math.abs(pose.angle - rest[index].angle)).toBeGreaterThanOrEqual(1)
    expect(Math.abs(pose.angle - rest[index].angle)).toBeLessThanOrEqual(3)
    expect(pose.x).toBe(rest[index].x)
    expect(pose.y).toBe(rest[index].y)
    expect(pose.rotate).toBe("none")
    expect(pose.translate).toBe("none")
  })
  await expect(tilt).toHaveCSS("transform", "none")
  const after = await stack.boundingBox()
  expect(after).toEqual(position)

  // Crossing onto an individual print keeps the same restrained card hover;
  // no print receives its own turn or lift.
  const print = (await prints.nth(1).boundingBox())!
  await page.mouse.move(print.x + print.width * 0.25, print.y + print.height * 0.25)
  await expect.poll(async () => Math.max(...(await readPose()).map(({ angle }, index) => Math.abs(angle - targetAngles[index])))).toBeLessThanOrEqual(0.1)
  await expect(prints.locator("[data-print-hover], [data-print-tilt], [data-print-drag]")).toHaveCount(0)

  await trigger.click({ position: { x: 16, y: 16 } })
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await expect.poll(async () => (await readPose()).map(({ angle }) => angle)).toEqual(rest.map(({ angle }) => angle))
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(tilt).toHaveCSS("transform", "none")
  await page.mouse.move(label.x + 2, label.y + label.height / 2)
  await expect(trigger).toHaveAttribute("data-fan-open", "")
  await page.mouse.move(0, 0)
  await expect(trigger).not.toHaveAttribute("data-fan-open")
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
