import { expect, test } from "@playwright/test"

for (const width of [1440, 390]) {
  test(`the wall supports both backdrops and returns a selected photo before closing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
    await page.locator(".personal-photos-label").click()
    const dialog = page.getByRole("dialog", { name: "Personal photos" })
    await dialog.getByRole("button", { name: "Wall", exact: true }).click()
    const wall = page.getByRole("region", { name: "Photo wall" })
    await expect(wall).toBeVisible()
    const background = dialog.getByRole("button", { name: "Background", exact: true })
    await expect(background).toHaveAttribute("aria-pressed", "true")
    await expect(page.locator(".personal-photos-backdrop")).toHaveCSS("background-color", "rgb(255, 255, 255)")
    await background.click()
    await expect(background).toHaveAttribute("aria-pressed", "false")
    await expect(page.locator(".personal-photos-backdrop")).toHaveCSS("background-color", "rgba(18, 18, 18, 0.6)")
    const photos = wall.locator(".personal-photos-slide")
    const first = photos.first()
    const before = (await first.boundingBox())!
    await first.focus()
    await page.keyboard.press("Enter")
    await expect(first).toHaveAttribute("data-held", "")
    await expect.poll(async () => (await first.boundingBox())!.width).toBeGreaterThan(before.width)
    await expect(photos.nth(1)).toHaveCSS("opacity", "0.25")
    const box = (await first.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(width)
    await page.keyboard.press("Escape")
    await expect(first).not.toHaveAttribute("data-held", "")
    await expect(dialog).toBeVisible()
    await expect(photos.nth(1)).toHaveCSS("opacity", "1")
    await dialog.getByRole("button", { name: "Grid", exact: true }).click()
    await expect(background).toBeHidden()
    await dialog.getByRole("button", { name: "Wall", exact: true }).click()
    await expect(background).toHaveAttribute("aria-pressed", "false")
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await page.reload()
    await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
    await page.locator(".personal-photos-label").click()
    await expect(wall).toBeVisible()
    await expect(background).toHaveAttribute("aria-pressed", "false")
  })
}

test("wall keyboard focus contrasts with the canvas and closing snaps a zoom before its return flight", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await dialog.getByRole("button", { name: "Wall", exact: true }).click()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  const first = dialog.locator(".personal-photos-slide").first()
  await first.focus()
  expect(await first.evaluate(el => getComputedStyle(el).outlineColor)).not.toBe("rgb(255, 255, 255)")
  await page.keyboard.press("Enter")
  await expect(first).toHaveAttribute("data-held", "")
  await dialog.getByRole("button", { name: "Close", exact: true }).click()
  await expect(dialog).toBeHidden()
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo wall" })).toBeVisible()
  await expect(first).not.toHaveAttribute("data-held", "")
  // This guard is also used while React releases a selected photo before
  // the close flights measure it. Wall must not override its transition reset.
  await first.evaluate(el => el.closest(".personal-photos-sheet")!.setAttribute("data-hold-snap", ""))
  expect(await first.evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s")
})

test("switching into Wall hides the destinations and preserves their frameless photos during flight", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await dialog.getByRole("button", { name: "Grid", exact: true }).click()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await page.evaluate(() => {
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      if (this.classList.contains("personal-photos-flight")) animation.pause()
      return animation
    }
  })
  await dialog.getByRole("button", { name: "Wall", exact: true }).click()
  const flight = page.locator(".personal-photos-flight").first()
  await expect(flight).toBeVisible()
  const id = await flight.getAttribute("data-photo-flight")
  const target = dialog.locator(`[data-photo-id="${id}"]`)
  expect(await target.evaluate(el => getComputedStyle(el).opacity)).toBe("0")
  await expect(flight).toHaveCSS("padding", "0px")
  expect(await flight.evaluate(el => getComputedStyle(el).boxShadow))
    .toBe(await target.evaluate(el => getComputedStyle(el).boxShadow))
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()))
  await expect(flight).toHaveCount(0)
  await expect(target).toHaveCSS("opacity", "1")
})

for (const width of [1440, 390]) {
  test(`Wall pans on both axes, zooms, and selects at the transformed position at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await page.locator(".personal-photos-label").click()
    const dialog = page.getByRole("dialog", { name: "Personal photos" })
    await dialog.getByRole("button", { name: "Wall", exact: true }).click()
    const wall = page.getByRole("region", { name: "Photo wall" })
    const first = wall.locator(".personal-photos-slide").first()
    const before = (await first.boundingBox())!
    await page.mouse.move(width / 2, 500)
    await page.mouse.wheel(120, 100)
    await expect.poll(async () => (await first.boundingBox())!.x).toBeLessThan(before.x - 80)
    await expect.poll(async () => (await first.boundingBox())!.y).toBeLessThan(before.y - 60)
    await dialog.getByRole("button", { name: "Reset view", exact: true }).click()
    await page.mouse.move(40, 550)
    await page.mouse.down()
    await page.mouse.move(140, 650, { steps: 8 })
    await page.mouse.up()
    expect((await first.boundingBox())!.x).toBeGreaterThan(before.x + 80)
    expect((await first.boundingBox())!.y).toBeGreaterThan(before.y + 80)
    await expect(dialog).toBeVisible()
    await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(0)
    await dialog.getByRole("button", { name: "Reset view", exact: true }).click()
    await dialog.getByRole("button", { name: "Zoom in", exact: true }).click()
    expect((await first.boundingBox())!.width).toBeGreaterThan(before.width * 1.1)
    await first.focus()
    await page.keyboard.press("Enter")
    await expect(first).toHaveAttribute("data-held", "")
    await expect.poll(async () => {
      const box = (await first.boundingBox())!
      return Math.abs(box.x + box.width / 2 - width / 2)
    }).toBeLessThan(2)
    await page.keyboard.press("Escape")
    await wall.focus()
    const left = (await first.boundingBox())!.x
    await page.keyboard.press("Shift+ArrowRight")
    expect((await first.boundingBox())!.x).toBeLessThan(left)
    await dialog.getByRole("button", { name: "Close", exact: true }).click()
    await expect(dialog).toBeHidden()
  })
}

test("touch can pinch then continue panning without selecting or closing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await dialog.getByRole("button", { name: "Wall", exact: true }).click()
  const first = dialog.locator(".personal-photos-slide").first()
  const before = (await first.boundingBox())!
  const session = await page.context().newCDPSession(page)
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 100, y: 400, id: 0 }, { x: 250, y: 400, id: 1 }] })
  for (let step = 1; step <= 5; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 100 - step * 8, y: 400, id: 0 }, { x: 250 + step * 8, y: 400, id: 1 }] })
  }
  await expect.poll(async () => (await first.boundingBox())!.width).toBeGreaterThan(before.width * 1.4)
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  const zoomed = (await first.boundingBox())!
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 80, y: 500, id: 2 }] })
  for (let step = 1; step <= 5; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 80 + step * 15, y: 500 + step * 10, id: 2 }] })
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(async () => (await first.boundingBox())!.x).toBeGreaterThan(zoomed.x + 50)
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(".personal-photos-slide[data-held]")).toHaveCount(0)
})

test("a photo partly outside the viewport can be selected on its visible edge", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await dialog.getByRole("button", { name: "Wall", exact: true }).click()
  const edge = dialog.locator(".personal-photos-column").nth(2).locator(".personal-photos-slide").first()
  const box = (await edge.boundingBox())!
  expect(box.x).toBeLessThan(390)
  expect(box.x + box.width).toBeGreaterThan(390)
  await page.mouse.click((box.x + 390) / 2, box.y + 20)
  await expect(edge).toHaveAttribute("data-held", "")
})

test("Wall repeats in every direction without growing its DOM, and each copy selects independently", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await dialog.getByRole("button", { name: "Wall", exact: true }).click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  const copies = wall.locator(".personal-photos-slide[data-photo-copy]")
  expect(await copies.count()).toBeGreaterThan(0)
  const total = await wall.locator(".personal-photos-slide").count()
  expect(await wall.getByRole("group").count()).toBe(await wall.locator(".personal-photos-slide[data-photo-id]").count())
  for (let i = 0; i < 5; i++) await dialog.getByRole("button", { name: "Zoom out", exact: true }).click()
  for (const [dx, dy] of [[8000, 8000], [-16000, 0], [0, -16000], [16000, 16000]]) {
    await page.mouse.move(700, 450)
    const plane = wall.locator(".personal-photos-masonry")
    const before = await plane.evaluate(el => getComputedStyle(el).transform)
    await page.mouse.wheel(dx, dy)
    await expect.poll(() => plane.evaluate(el => getComputedStyle(el).transform)).not.toBe(before)
    await expect.poll(() => wall.locator(".personal-photos-slide").evaluateAll(slides => slides.filter(slide => {
      const r = slide.getBoundingClientRect()
      return r.right > 0 && r.left < innerWidth && r.bottom > 144 && r.top < innerHeight
    }).length)).toBeGreaterThan(12)
  }
  expect(await wall.locator(".personal-photos-slide").count()).toBe(total)
  const target = await copies.evaluateAll(slides => {
    for (const slide of slides) {
      const r = slide.getBoundingClientRect()
      if (r.left > 10 && r.right < innerWidth - 10 && r.top > 160 && r.bottom < innerHeight - 10)
        return { instance: (slide as HTMLElement).dataset.photoInstance!, x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }
    throw new Error("No complete repeated photo in view")
  })
  await page.mouse.click(target.x, target.y)
  await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(1)
  await expect(wall.locator(`[data-photo-instance="${target.instance}"]`)).toHaveAttribute("data-held", "")
  await page.keyboard.press("Escape")
  await expect(dialog).toBeVisible()
  await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(0)
})

for (const width of [1440, 390]) {
  test(`Wall arrows shift the composition around the next centred photo at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    await page.locator(".personal-photos-label").click()
    const dialog = page.getByRole("dialog", { name: "Personal photos" })
    await dialog.getByRole("button", { name: "Wall", exact: true }).click()
    await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
    const wall = page.getByRole("region", { name: "Photo wall" })
    const first = wall.locator('[data-photo-id="office"]')
    const neighbour = wall.locator('[data-photo-id="night-portrait"]')
    const before = (await neighbour.boundingBox())!
    await first.click()
    await expect(first).toHaveAttribute("data-held", "")
    // The surrounding composition moves too, rather than leaving the wall
    // fixed underneath an enlarged overlay.
    await expect.poll(async () => Math.abs((await neighbour.boundingBox())!.x - before.x)).toBeGreaterThan(30)
    const next = dialog.getByRole("button", { name: "Next photo", exact: true })
    const previous = dialog.getByRole("button", { name: "Previous photo", exact: true })
    await next.click()
    const main = wall.locator(".personal-photos-slide[data-held]")
    await expect(main).toHaveCount(1)
    await expect(main).toHaveAttribute("data-photo-source", "night-portrait")
    await expect.poll(async () => {
      const box = (await main.boundingBox())!
      return Math.hypot(box.x + box.width / 2 - width / 2, box.y + box.height / 2 - 450)
    }).toBeLessThan(2)
    // Interrupt the return animation; selecting the earlier photo again
    // must still use its resting slot rather than its in-flight rectangle.
    await previous.click()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowLeft")
    await expect(main).toHaveAttribute("data-photo-source", "office")
    await expect.poll(async () => {
      const box = (await main.boundingBox())!
      return Math.hypot(box.x + box.width / 2 - width / 2, box.y + box.height / 2 - 450)
    }).toBeLessThan(2)
    await page.keyboard.press("Escape")
    await expect(dialog).toBeVisible()
    await expect(main).toHaveCount(0)
  })
}


test("Wall arrows start at the nearest photo and wrap the collection", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await dialog.getByRole("button", { name: "Wall", exact: true }).click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  const nearest = await wall.locator(".personal-photos-slide").evaluateAll(slides => slides.map(slide => {
    const r = slide.getBoundingClientRect()
    return { instance: (slide as HTMLElement).dataset.photoInstance, distance: Math.hypot(r.x + r.width / 2 - innerWidth / 2, r.y + r.height / 2 - innerHeight / 2) }
  }).sort((a, b) => a.distance - b.distance)[0].instance)
  await dialog.getByRole("button", { name: "Next photo", exact: true }).click()
  const main = wall.locator(".personal-photos-slide[data-held]")
  await expect(main).toHaveAttribute("data-photo-instance", nearest!)
  await page.keyboard.press("Escape")
  await wall.locator('[data-photo-id="office"]').click()
  await dialog.getByRole("button", { name: "Previous photo", exact: true }).click()
  await expect(main).toHaveAttribute("data-photo-source", "rainy-night")
  await expect(dialog.locator('[aria-live="polite"]')).toContainText(await main.locator("figcaption").innerText())
  for (let i = 0; i < 27; i++) {
    await dialog.getByRole("button", { name: "Next photo", exact: true }).click()
    await expect.poll(async () => {
      const box = (await main.boundingBox())!
      return Math.hypot(box.x + box.width / 2 - 195, box.y + box.height / 2 - 450)
    }).toBeLessThan(2)
  }
  await expect(main).toHaveAttribute("data-photo-source", "rainy-night")
})
