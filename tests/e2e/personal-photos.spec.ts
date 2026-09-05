import { expect, test } from "@playwright/test"

test("photo gallery stops at both ends without empty trailing space", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const width of [2048, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto("/#about-panel")
    await page.getByRole("button", { name: "View personal photos" }).click()
    const strip = page.getByRole("region", { name: "Photo carousel" })
    const position = () => strip.evaluate((element) => element.scrollLeft)
    await expect.poll(position).toBe(0)
    await page.keyboard.press("ArrowLeft")
    await strip.hover()
    await page.mouse.wheel(-1500, 0)
    await expect.poll(position).toBe(0)
    await page.keyboard.press("End")
    const rightGap = () => strip.evaluate((element) => {
      const last = element.lastElementChild!.getBoundingClientRect()
      return Math.abs(element.getBoundingClientRect().right - last.right - parseFloat(getComputedStyle(element).paddingRight))
    })
    await expect.poll(rightGap).toBeLessThan(1)
    const endPosition = await position()
    await page.keyboard.press("ArrowRight")
    await page.mouse.wheel(1500, 0)
    await expect.poll(position).toBe(endPosition)
    await page.keyboard.press("ArrowLeft")
    await expect.poll(position).toBeLessThan(endPosition)
    await page.keyboard.press("Home")
    await expect.poll(position).toBe(0)
    await page.keyboard.press("Escape")
  }
})

test("personal photos open, slide, drag, and return focus to the photo", async ({ page }) => {
  await page.goto("/#about-panel")
  const trigger = page.getByRole("button", { name: "View personal photos" })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("img")).toHaveCount(11)
  const portraitPhotos = dialog.locator('figure:not([aria-hidden]) img[data-orientation="portrait"]')
  const landscapePhotos = dialog.locator('figure:not([aria-hidden]) img[data-orientation="landscape"]')
  const squarePhotos = dialog.locator('figure:not([aria-hidden]) img[data-orientation="square"]')
  await expect(portraitPhotos).toHaveCount(6)
  await expect(landscapePhotos).toHaveCount(4)
  await expect(squarePhotos).toHaveCount(1)
  await expect(portraitPhotos.first()).toHaveCSS("object-fit", "cover")
  await expect(portraitPhotos.first()).toHaveCSS("background-size", "cover")
  await expect(landscapePhotos.first()).toHaveCSS("object-fit", "cover")
  await expect(landscapePhotos.first()).toHaveCSS("background-size", "cover")
  await expect(squarePhotos.first()).toHaveCSS("object-fit", "contain")
  await expect(dialog.getByText("example")).toHaveCount(0)
  await expect(dialog.getByRole("button", { name: /Close photos|Previous photo|Next photo/ })).toHaveCount(0)
  const strip = dialog.getByRole("region", { name: "Photo carousel" })
  const activeSlide = () => strip.evaluate((element) => {
    const slides = Array.from(element.children) as HTMLElement[]
    return slides.reduce((nearest, slide, index) =>
      Math.abs(slide.offsetLeft - slides[0].offsetLeft - element.scrollLeft) <
      Math.abs(slides[nearest].offsetLeft - slides[0].offsetLeft - element.scrollLeft) ? index : nearest, 0)
  })
  await page.keyboard.press("ArrowRight")
  await expect.poll(activeSlide).toBe(1)
  await page.keyboard.press("End")
  await expect.poll(() => strip.evaluate((element) => element.scrollWidth - element.clientWidth - element.scrollLeft)).toBeLessThan(1)
  await page.keyboard.press("Home")
  await expect.poll(() => strip.evaluate((element) => {
    const first = element.children[0] as HTMLElement
    return Math.abs(first.getBoundingClientRect().left - parseFloat(getComputedStyle(element).scrollPaddingInlineStart))
  })).toBeLessThan(1)

  const [bounds, imageBounds] = await Promise.all([
    strip.boundingBox(),
    dialog.getByRole("img").first().boundingBox(),
  ])
  if (!bounds || !imageBounds) throw new Error("photo strip not visible")
  await expect(dialog.getByRole("img").first()).toHaveCSS("cursor", "grab")

  const gap = await strip.evaluate((element) => {
    const first = element.children[0].getBoundingClientRect()
    const second = element.children[1].getBoundingClientRect()
    return { x: (first.right + second.left) / 2, y: first.top + first.height / 2, step: second.left - first.left }
  })
  await page.mouse.move(gap.x, gap.y)
  await page.mouse.down()
  await page.mouse.move(gap.x - gap.step * 0.8, gap.y, { steps: 12 })
  await page.mouse.up()
  await expect.poll(activeSlide).toBe(1)

  await page.keyboard.press("Home")
  await expect.poll(() => strip.evaluate((element) => {
    const first = element.children[0] as HTMLElement
    return Math.abs(first.getBoundingClientRect().left - parseFloat(getComputedStyle(element).scrollPaddingInlineStart))
  })).toBeLessThan(1)

  await page.mouse.move(imageBounds.x + imageBounds.width * 0.9, imageBounds.y + imageBounds.height / 2)
  await page.mouse.down()
  await page.mouse.move(imageBounds.x + imageBounds.width * 0.1, imageBounds.y + imageBounds.height / 2, { steps: 12 })
  await page.mouse.up()
  await expect.poll(activeSlide).toBe(1)

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("mobile photo strip scrolls and supports reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#about-panel")
  const trigger = page.getByRole("button", { name: "View personal photos" })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await expect(dialog).toBeVisible()
  const strip = dialog.getByRole("region", { name: "Photo carousel" })
  await page.keyboard.press("End")
  await page.keyboard.press("ArrowRight")
  await expect.poll(() => strip.evaluate((element) => element.scrollWidth - element.clientWidth - element.scrollLeft)).toBeLessThan(1)
  expect(await dialog.evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThan(0.001)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.locator(".personal-photos-backdrop").click({ position: { x: 10, y: 10 } })
  await expect(dialog).toBeHidden()
  await trigger.click()
  await expect(dialog).toBeVisible()
  await expect.poll(() => strip.evaluate((element) => {
    const first = element.children[0] as HTMLElement
    return Math.abs(first.getBoundingClientRect().left - parseFloat(getComputedStyle(element).scrollPaddingInlineStart))
  })).toBeLessThan(1)
  await page.setViewportSize({ width: 844, height: 390 })
  const bounds = await dialog.boundingBox()
  expect(bounds?.y).toBeGreaterThanOrEqual(0)
  expect((bounds?.y ?? 0) + (bounds?.height ?? 0)).toBeLessThanOrEqual(390)
})

test("five photos stay in one overlapping row on desktop and mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#about-panel")
  await expect(page.locator(".mosaic-about-photo")).toHaveCount(0)
  const trigger = page.getByRole("button", { name: "View personal photos" })
  const prints = page.locator(".personal-photos-print")
  await expect(prints).toHaveCount(5)
  for (const width of [1440, 900, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await trigger.scrollIntoViewIfNeeded()
    const layout = await prints.evaluateAll((elements) => elements.map((element) => ({
      left: (element as HTMLElement).offsetLeft,
      top: (element as HTMLElement).offsetTop,
      width: (element as HTMLElement).offsetWidth,
    })))
    for (let index = 1; index < layout.length; index++) {
      expect(layout[index].top).toBe(layout[0].top)
      expect((layout[index].left - layout[index - 1].left) / layout[index - 1].width).toBeCloseTo(0.65, 1)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

test("photo preview scrolls in and fans to varied angles on hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 500 })
  await page.goto("/#about-panel")

  const preview = page.locator(".personal-photos")
  await expect(preview).toHaveAttribute("data-about-fade", "pending")
  await preview.scrollIntoViewIfNeeded()
  await expect(preview).toHaveAttribute("data-about-fade", "in")

  const prints = preview.locator(".personal-photos-print")
  await preview.getByRole("button", { name: "View personal photos" }).hover()
  await expect.poll(() => prints.evaluateAll((elements) => elements.map((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    return Math.round(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI)
  }))).toEqual([-10, 6, -4, -8, 8])
})

test("keeps the first gallery photo close to the left edge", async ({ page }) => {
  for (const { width, expectedLeft } of [{ width: 2048, expectedLeft: 80 }, { width: 390, expectedLeft: 20 }]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/#about-panel")
    await page.getByRole("button", { name: "View personal photos" }).click()

    const firstSlide = page.getByRole("group", { name: "1 of 11", exact: true })
    await expect.poll(() => firstSlide.evaluate((element) => Math.round(element.getBoundingClientRect().left))).toBe(expectedLeft)
    await page.keyboard.press("Escape")
  }
})

test("keeps carousel shadows clear of the strip edges", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1239 })
  await page.goto("/#about-panel")
  await page.getByRole("button", { name: "View personal photos" }).click()

  const clearance = await page.locator(".personal-photos-strip").evaluate((strip) => {
    const slide = strip.querySelector(".personal-photos-slide")
    if (!slide) return null
    const stripBounds = strip.getBoundingClientRect()
    const slideBounds = slide.getBoundingClientRect()
    return {
      top: Math.round(slideBounds.top - stripBounds.top),
      bottom: Math.round(stripBounds.bottom - slideBounds.bottom),
    }
  })

  expect(clearance).toEqual({ top: 96, bottom: 96 })
})
