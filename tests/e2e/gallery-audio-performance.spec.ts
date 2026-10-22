import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.addInitScript(() => {
    const builds: boolean[] = []
    Object.assign(window, { galleryAudioBuilds: builds })
    const Original = window.AudioContext
    window.AudioContext = class extends Original {
      constructor(options?: AudioContextOptions) {
        const flight = document.querySelector(".preview-gallery-origin-wrap")
        builds.push(Boolean(flight?.getAnimations().some(animation =>
          animation.playState === "running" || animation.playState === "paused")))
        super(options)
      }
    }
    // Hold only the first opening, leaving the real closing path untouched.
    const animate = Element.prototype.animate
    let held = false
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      if (!held && this.classList.contains("preview-gallery-origin-wrap")) {
        held = true
        animation.playbackRate = 0
      }
      return animation
    }
  })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Shared family stories preview/ }).click()
  await expect(page.locator(".preview-gallery-shell")).toHaveAttribute("data-origin-animating", "true")
})

const audioBuilds = () => (window as unknown as { galleryAudioBuilds: boolean[] }).galleryAudioBuilds

test("audio waits for the actual gallery flight and reuses its warmed context", async ({ page }) => {
  // Base UI's open callback can run while the separate WAAPI flight is held.
  await page.waitForTimeout(250)
  expect(await page.evaluate(audioBuilds)).toEqual([])
  await page.locator(".preview-gallery-origin-wrap").evaluate(element => {
    element.getAnimations().forEach(animation => { animation.playbackRate = 1; animation.finish() })
  })
  await expect.poll(() => page.evaluate(audioBuilds)).toEqual([false])
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  expect(await page.evaluate(audioBuilds)).toEqual([false])
})

test("closing a cold gallery cancels audio warmup without building a context", async ({ page }) => {
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.waitForTimeout(250)
  expect(await page.evaluate(audioBuilds)).toEqual([])
  await page.getByRole("link", { name: /Open Shared family stories preview/ }).click()
  await expect.poll(() => page.evaluate(audioBuilds)).toEqual([false])
})
