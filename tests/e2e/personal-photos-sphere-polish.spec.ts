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
      nearControl: pill.top > 820 && pill.bottom <= 880,
      largerPhoto: Math.max(...boxes.map((box) => box.width)) > 135,
    }
  })).toEqual({ nearControl: true, largerPhoto: true })
})

test("repeated photos stay clear of one another on the sphere face", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openSphere(page)

  const closestRepeat = await page.locator(".personal-photos-sphere").evaluate((sphere) => {
    const groups = new Map<string, DOMRect[]>()
    for (const slide of sphere.querySelectorAll<HTMLElement>(".personal-photos-slide:not([data-sphere-hidden])")) {
      const source = slide.querySelector("img")!.getAttribute("src")!
      groups.set(source, [...(groups.get(source) ?? []), slide.getBoundingClientRect()])
    }
    let closest = Number.POSITIVE_INFINITY
    for (const boxes of groups.values()) {
      for (let left = 0; left < boxes.length; left++) {
        for (let right = left + 1; right < boxes.length; right++) {
          const a = boxes[left], b = boxes[right]
          const distance = Math.hypot(a.x + a.width / 2 - (b.x + b.width / 2), a.y + a.height / 2 - (b.y + b.height / 2))
          closest = Math.min(closest, distance / ((a.width + b.width) / 2))
        }
      }
    }
    return closest
  })

  expect(closestRepeat).toBeGreaterThan(1.75)
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

  // Perspective tilt can shave a subpixel from the 1.07x screen-space box.
  expect(after.width / before.width).toBeGreaterThanOrEqual(1.069)
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
  await expect.poll(async () => {
    const held = (await target.boundingBox())!
    return Math.max(held.width / 1440, held.height / 900)
  }).toBeGreaterThan(0.68)
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

test("a held sphere photo thins its frame into the house radius", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openSphere(page)

  const target = page.locator(".personal-photos-sphere .personal-photos-slide[data-photo-id]:not([data-sphere-far])").first()
  const restingBox = (await target.boundingBox())!
  const restingPadding = await target.evaluate((slide) => {
    const style = getComputedStyle(slide)
    const scale = slide.getBoundingClientRect().width / slide.offsetWidth
    return parseFloat(style.paddingTop) * scale
  })
  await target.click()
  await expect(target).toHaveAttribute("data-sphere-held", "")
  await expect.poll(async () => (await target.boundingBox())!.width / restingBox.width).toBeGreaterThan(1.8)
  const heldSurface = await target.evaluate((slide) => {
    const frame = getComputedStyle(slide)
    const image = getComputedStyle(slide.querySelector("img")!)
    const root = getComputedStyle(document.documentElement)
    const scale = slide.getBoundingClientRect().width / slide.offsetWidth
    return {
      houseRadius: parseFloat(root.getPropertyValue("--radius-lg")),
      padding: parseFloat(frame.paddingTop) * scale,
      outerRadius: parseFloat(frame.borderTopLeftRadius) * scale,
      innerRadius: parseFloat(image.borderTopLeftRadius) * scale,
    }
  })

  expect(heldSurface.padding).toBeLessThan(restingPadding * 1.4)
  expect(heldSurface.outerRadius).toBeCloseTo(heldSurface.houseRadius, 0)
  expect(heldSurface.innerRadius).toBeLessThan(heldSurface.outerRadius)
  expect(heldSurface.outerRadius - heldSurface.innerRadius).toBeCloseTo(heldSurface.padding, 0)
})

test("a held sphere photo catches the same moving gloss as the grid", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openSphere(page)
  await page.mouse.move(5, 5)

  const target = page.locator(".personal-photos-sphere .personal-photos-slide[data-photo-id]:not([data-sphere-far])").first()
  const resting = (await target.boundingBox())!
  await page.mouse.click(resting.x + resting.width / 2, resting.y + resting.height / 2)
  await expect(target).toHaveAttribute("data-sphere-held", "")
  await expect.poll(() => target.evaluate((slide) => Number(getComputedStyle(slide).getPropertyValue("--sphere-zoom")))).toBeGreaterThan(0.95)
  const held = (await target.boundingBox())!
  await page.mouse.move(held.x + held.width * 0.2, held.y + held.height * 0.2)
  await expect.poll(() => target.evaluate((slide) => getComputedStyle(slide).rotate)).not.toBe("none")
  const first = await target.evaluate((slide) => ({
    glossX: getComputedStyle(slide).getPropertyValue("--sphere-gloss-x"),
    background: getComputedStyle(slide, "::after").backgroundImage,
    opacity: getComputedStyle(slide, "::after").opacity,
  }))
  await page.mouse.move(held.x + held.width * 0.8, held.y + held.height * 0.8)
  await expect.poll(() => target.evaluate((slide) => getComputedStyle(slide).getPropertyValue("--sphere-gloss-x"))).not.toBe(first.glossX)

  expect(first.background).toContain("radial-gradient")
  expect(Number(first.opacity)).toBeGreaterThan(0.4)
})

for (const width of [390, 768, 1440]) {
  test(`focused sphere photos fit the stage and clear the bottom toggle at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize({ width, height: 844 })
    await openSphere(page)
    for (const landscape of [false, true]) {
      const candidate = await page.locator(".personal-photos-sphere").evaluate((sphere, wide) => {
        const slides = [...sphere.querySelectorAll<HTMLElement>(".personal-photos-slide[data-photo-id]:not([data-sphere-hidden])")]
        return slides.find(slide => {
          const img = slide.querySelector("img")!
          return (Number(img.getAttribute("width")) > Number(img.getAttribute("height"))) === wide
        })?.dataset.photoId
      }, landscape)
      expect(candidate).toBeTruthy()
      const photo = page.locator(`.personal-photos-sphere [data-photo-id="${candidate}"]`)
      await photo.focus()
      await photo.press("Enter")
      await expect(photo).toHaveAttribute("data-sphere-held", "")
      await expect.poll(async () => {
        const box = (await photo.boundingBox())!
        return Math.max(box.width / width, box.height / 844)
      }).toBeGreaterThan(0.68)
      const box = (await photo.boundingBox())!
      expect(box.width).toBeLessThan(width * 0.73)
      expect(box.height).toBeLessThan(844 * 0.73)
      const caption = (await page.locator(".personal-photos-stage-caption").boundingBox())!
      const toggle = (await page.locator(".personal-photos-layout").boundingBox())!
      expect(caption.y + caption.height).toBeLessThan(toggle.y)
      expect(caption.y >= box.y + box.height || caption.y + caption.height <= box.y).toBe(true)
      await page.keyboard.press("Escape")
    }
  })
}

test("a visible rim photo receives the click and comes forward", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openSphere(page)
  const point = await page.locator(".personal-photos-sphere").evaluate(sphere => {
    for (const slide of sphere.querySelectorAll<HTMLElement>(".personal-photos-slide:not([data-sphere-hidden])")) {
      const fade = Number(slide.style.getPropertyValue("--sphere-fade"))
      if (fade <= 0 || fade >= 0.39) continue
      const box = slide.getBoundingClientRect()
      for (const fx of [0.1, 0.5, 0.9]) for (const fy of [0.1, 0.5, 0.9]) {
        const x = box.x + box.width * fx, y = box.y + box.height * fy
        // Temporarily inspect its painted hit region independent of the old
        // pointer policy; the actual click below must use the shipped policy.
        slide.style.pointerEvents = "auto"
        const exposed = document.elementFromPoint(x, y)?.closest(".personal-photos-slide") === slide
        slide.style.removeProperty("pointer-events")
        if (exposed) {
          slide.setAttribute("data-test-rim", "")
          return { x, y }
        }
      }
    }
    throw new Error("No exposed rim photo")
  })
  await page.mouse.click(point.x, point.y)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await expect(page.locator("[data-test-rim]")).toHaveAttribute("data-sphere-held", "")
})
