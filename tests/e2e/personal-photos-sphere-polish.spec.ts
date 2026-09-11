import { expect, test, type Page } from "@playwright/test"

async function openSphere(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo globe" })).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
}

test("the desktop sphere reaches toward the layout control with larger photos", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openSphere(page)

  await expect.poll(() => page.evaluate(() => {
    const pill = document.querySelector(".personal-photos-layout")!.getBoundingClientRect()
    const slides = Array.from(document.querySelectorAll<HTMLElement>(".personal-photos-sphere .personal-photos-slide:not([data-sphere-hidden])"))
    const boxes = slides.map((slide) => slide.getBoundingClientRect())
    return {
      nearControl: Math.min(...boxes.map((box) => box.top)) - pill.bottom < 20,
      largerPhoto: Math.max(...boxes.map((box) => box.width)) > 135,
    }
  })).toEqual({ nearControl: true, largerPhoto: true })
})

test("sphere hover reacts quickly with a soft pointer tilt", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openSphere(page)
  await page.mouse.move(5, 5)

  const target = page.locator(".personal-photos-sphere .personal-photos-slide[data-photo-id]:not([data-sphere-far])").first()
  const before = (await target.boundingBox())!
  await page.mouse.move(before.x + before.width * 0.25, before.y + before.height * 0.25)
  await page.waitForTimeout(180)
  const after = (await target.boundingBox())!
  const rotation = await target.evaluate((slide) => getComputedStyle(slide).rotate)

  expect(after.width / before.width).toBeGreaterThan(1.07)
  expect(rotation).not.toBe("none")
  expect(Number(rotation.match(/([\d.]+)deg$/)?.[1])).toBeLessThanOrEqual(4)
})

test("a held sphere photo opens sharply at its full size", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await context.newPage()
  await openSphere(page)
  await page.mouse.move(5, 5)

  const target = page.locator(".personal-photos-sphere .personal-photos-slide[data-photo-id]:not([data-sphere-far])").first()
  const box = (await target.boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect.poll(async () => (await target.boundingBox())!.width / box.width).toBeGreaterThan(1.8)
  const sphere = (await page.locator(".personal-photos-sphere").boundingBox())!
  await expect.poll(async () => (await target.boundingBox())!.width / sphere.width).toBeGreaterThan(0.48)
  const pixels = await target.evaluate(async (slide) => {
    const image = slide.querySelector("img")!
    const probe = new Image()
    const loaded = new Promise<void>((resolve, reject) => {
      probe.onload = () => resolve()
      probe.onerror = () => reject(new Error(`Could not load ${image.currentSrc}`))
    })
    probe.src = image.currentSrc
    await loaded
    return {
      available: probe.naturalWidth,
      required: slide.getBoundingClientRect().width * devicePixelRatio,
      willChange: getComputedStyle(slide).willChange,
    }
  })

  expect(pixels.available).toBeGreaterThanOrEqual(pixels.required)
  expect(pixels.willChange).toBe("auto")
  const caption = page.locator(".personal-photos-stage-caption")
  await expect(caption).not.toHaveText("")
  expect(await caption.evaluate((element) => getComputedStyle(element).textShadow.match(/rgba?\(/g)?.length ?? 0)).toBeGreaterThanOrEqual(2)
  await context.close()
})
