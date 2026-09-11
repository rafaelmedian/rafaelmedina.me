import { expect, type BrowserContext, type Page, test } from "@playwright/test"
import { createElasticEdgePalette } from "../../src/lib/elasticEdgeGradient"

// The site renders this from `siteLinks.email` and the résumé script repeats it;
// spelling it out here is what makes a change in one of those three fail loudly
// rather than let the PDF and the page drift apart. `src/data/portfolio` cannot
// be imported directly -- it pulls in a .webp the test loader will not parse.
const contactEmail = "hey@rafaelmedina.me"

const mobileViewport = { width: 390, height: 844 }
const openStreetMapTileUrl = /tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/
const transparentMapTile = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
)

// Work-history chips point at real company sites; the assertions only care that
// the browser went there, so serve a stub rather than depend on the network.
const stubCompanySite = (context: BrowserContext) =>
  context.route(/onit\.com/, (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Onit</title>" }),
  )

const getPreviousCompanyLink = (page: Page, name: string) =>
  page
    .getByRole("group", { name: "Previous companies" })
    .getByRole("link", { name, exact: true })

// Wait for finite tile interactions before measuring a preview origin.
// Safe from hanging: the gallery's View Timeline lives on the parent stage,
// outside this subtree, while every animation inside `.mosaic-rows` finishes.
const settleWorkCards = (page: Page) =>
  page
    .locator(".mosaic-rows")
    .evaluate((element) => Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))

// The reveal keyframes are held by `data-avatar-intro`, and they land on the
// hero's children rather than the hero itself -- so waiting on an ancestor's
// own `getAnimations()` resolves empty and measures a group still 12px low.
// Removing the attribute drops the rules, which is the settled state.
const settleAvatarIntro = (page: Page) =>
  expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")

const pausePageClock = async (page: Page) => {
  await page.clock.install({ time: new Date("2026-08-18T12:00:00Z") })
  await page.clock.pauseAt(new Date("2026-08-18T12:01:00Z"))
}

test("hydrates the prerendered portfolio without browser errors", async ({ page, request }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })

  const response = await request.get("/")
  expect(await response.text()).toContain('<div id="root"><')

  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeAttached()
  expect(errors).toEqual([])
})

test("compresses a luminous layered gradient into view with a fresh palette for each pull", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const edge = page.locator(".elastic-scroll-edge")
  const pulledState = await edge.evaluate(async (element) => {
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    const styles = getComputedStyle(element)
    const shade = element.querySelector<HTMLElement>(".elastic-scroll-edge-shade")
    return {
      pulling: element.getAttribute("data-pulling"),
      inlineOpacity: (element as HTMLElement).style.getPropertyValue("--elastic-edge-opacity"),
      pointerEvents: styles.pointerEvents,
      height: Number.parseFloat(styles.height),
      shadeCount: element.querySelectorAll(".elastic-scroll-edge-shade").length,
      shadeFilter: shade ? getComputedStyle(shade).filter : "missing",
      backgroundImage: shade ? getComputedStyle(shade).backgroundImage : "none",
      palette: [1, 2, 3, 4, 5, 6, 7].map((index) =>
        (element as HTMLElement).style.getPropertyValue(`--elastic-edge-color-${index}`),
      ),
      shadeOpacity: Number.parseFloat((element as HTMLElement).style.getPropertyValue("--elastic-edge-shade-opacity")),
      coreOpacity: Number.parseFloat((element as HTMLElement).style.getPropertyValue("--elastic-edge-core-opacity")),
      lightOpacity: Number.parseFloat((element as HTMLElement).style.getPropertyValue("--elastic-edge-light-opacity")),
    }
  })

  expect(pulledState.pulling).toBe("true")
  expect(Number(pulledState.inlineOpacity)).toBeGreaterThanOrEqual(0.9)
  expect(pulledState.pointerEvents).toBe("none")
  expect(pulledState.height).toBeGreaterThanOrEqual(40)
  expect(pulledState.height).toBeLessThanOrEqual(72)
  expect(pulledState.shadeCount).toBe(1)
  // The strip must stay filter-free: a blur pass re-rasters the full-width
  // surface at device scale on every palette change. Saturation is baked into
  // the generated palette instead.
  expect(pulledState.shadeFilter).toBe("none")
  expect(pulledState.backgroundImage.match(/radial-gradient/g)).toHaveLength(7)
  expect(pulledState.palette.every(Boolean)).toBe(true)
  expect(new Set(pulledState.palette).size).toBe(7)
  expect(pulledState.coreOpacity).toBeGreaterThan(pulledState.shadeOpacity)
  expect(pulledState.lightOpacity).toBeGreaterThan(0)
  expect(pulledState.lightOpacity).toBeLessThan(0.5)
  await expect(edge).toHaveAttribute("data-pulling", "false")
  await expect(edge).toHaveCSS("opacity", "0")
  // pullBy only repaints while the glow has finished releasing, and handleWheel
  // drops the event outright unless the page is still resting at the bottom. A
  // wheel that lands on a closed gate is swallowed silently and leaves the old
  // palette in place -- which is how this read used to flake on CI, where the
  // page settles later than it does locally. Retry the pull instead of assuming
  // one event takes; a palette that genuinely never refreshes still fails here,
  // on the timeout.
  await expect(edge).toHaveAttribute("data-glowing", "false")
  await expect
    .poll(() =>
      edge.evaluate((element) => {
        window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
        return [1, 2, 3, 4, 5, 6, 7].map((index) =>
          (element as HTMLElement).style.getPropertyValue(`--elastic-edge-color-${index}`),
        )
      }),
    )
    .not.toEqual(pulledState.palette)
})

test("randomizes elastic-edge palettes across the full color spectrum", () => {
  const centralHues = [0, 0.25, 0.5, 0.75, 0.999].map((random) =>
    Number(createElasticEdgePalette(() => random)[3].match(/^hsl\((\d+)/)?.[1]),
  )
  expect(centralHues).toEqual([0, 90, 180, 270, 359])
})

test("changes the elastic-edge palette when the random source repeats", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.5
  })
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const palettes = await page.locator(".elastic-scroll-edge").evaluate((element) => {
    const readPalette = () =>
      [1, 2, 3, 4, 5, 6, 7].map((index) =>
        (element as HTMLElement).style.getPropertyValue(`--elastic-edge-color-${index}`),
      )

    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
    const first = readPalette()
    window.dispatchEvent(new Event("elastic-edge:randomize"))

    return { first, second: readPalette() }
  })

  expect(palettes.second).not.toEqual(palettes.first)
})

test("coalesces a burst of elastic-edge input into one visual update per frame", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const progress = await page.locator(".elastic-scroll-edge").evaluate((element) => {
    const scheduledFrames: FrameRequestCallback[] = []
    const requestFrame = window.requestAnimationFrame

    window.requestAnimationFrame = (callback) => {
      scheduledFrames.push(callback)
      return scheduledFrames.length
    }

    try {
      for (let index = 0; index < 8; index += 1) {
        window.dispatchEvent(new WheelEvent("wheel", { deltaY: 24 }))
      }

      const beforeFrame = (element as HTMLElement).style.getPropertyValue("--elastic-edge-opacity")
      scheduledFrames.splice(0).forEach((callback) => callback(performance.now()))
      const afterFrame = (element as HTMLElement).style.getPropertyValue("--elastic-edge-opacity")

      return { beforeFrame, afterFrame }
    } finally {
      window.requestAnimationFrame = requestFrame
    }
  })

  expect(progress.beforeFrame).toBe("")
  expect(Number(progress.afterFrame)).toBeGreaterThan(0)
})

test("resets the elastic edge when release happens before its first paint", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const state = await page.locator(".elastic-scroll-edge").evaluate(async (element) => {
    const scheduledFrames: FrameRequestCallback[] = []
    const requestFrame = window.requestAnimationFrame

    window.requestAnimationFrame = (callback) => {
      scheduledFrames.push(callback)
      return scheduledFrames.length
    }

    try {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
      await new Promise((resolve) => window.setTimeout(resolve, 150))
      scheduledFrames.splice(0).forEach((callback) => callback(performance.now()))

      return {
        glowing: element.getAttribute("data-glowing"),
        opacity: (element as HTMLElement).style.getPropertyValue("--elastic-edge-opacity"),
        pulling: element.getAttribute("data-pulling"),
      }
    } finally {
      window.requestAnimationFrame = requestFrame
    }
  })

  expect(state).toEqual({ glowing: "false", opacity: "0", pulling: "false" })
})

test("previews the gradient while applying live height and shape settings", async ({ page }) => {
  await page.goto("/")

  const edge = page.locator(".elastic-scroll-edge")
  await edge.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent("elastic-edge:settings", {
        detail: {
          preview: true,
          height: 120,
          centerWidth: 58,
          colorSpread: 70,
          translucency: 0.38,
          coreOpacity: 0.9,
          lightOpacity: 0.26,
        },
      }),
    )
  })

  await expect(edge).toHaveAttribute("data-preview", "true")
  await expect(edge).toHaveCSS("height", "120px")
  await expect(edge).toHaveCSS("opacity", "0.92")
  expect(
    await edge.evaluate((element) => ({
      centerWidth: (element as HTMLElement).style.getPropertyValue("--elastic-edge-center-width"),
      colorSpread: (element as HTMLElement).style.getPropertyValue("--elastic-edge-color-spread"),
    })),
  ).toEqual({ centerWidth: "58%", colorSpread: "70%" })

  await edge.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent("elastic-edge:settings", {
        detail: {
          preview: false,
          height: 120,
          centerWidth: 58,
          colorSpread: 70,
          translucency: 0.38,
          coreOpacity: 0.9,
          lightOpacity: 0.26,
        },
      }),
    )
  })

  await expect(edge).toHaveAttribute("data-preview", "false")
  await expect(edge).toHaveCSS("opacity", "0")
})

test("staggers low aurora curtains and resets them after the shortened fade", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const edge = page.locator(".elastic-scroll-edge")
  const pullingState = await edge.evaluate((element) => {
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
    return {
      pulling: element.getAttribute("data-pulling"),
      transitionDuration: getComputedStyle(element).transitionDuration,
    }
  })

  expect(pullingState).toEqual({ pulling: "true", transitionDuration: "0.12s" })

  await expect(edge).toHaveAttribute("data-pulling", "false")
  // Hold the release fade as soon as it starts so the opacity below is sampled
  // at a known point in it. Sleeping 700ms instead measured from whenever the
  // assertions in between happened to finish, which on CI is late enough that
  // the fade has already dropped past the threshold.
  await edge.evaluate((element) => {
    const fade = element
      .getAnimations()
      .find((animation) => (animation as CSSTransition).transitionProperty === "opacity")
    if (!fade) throw new Error("The release fade did not start")
    fade.pause()
  })
  await expect(edge).toHaveCSS("transition-duration", "1.26s")
  await expect(edge).toHaveCSS("transition-timing-function", "ease-in-out")
  const curtains = edge.locator(".elastic-scroll-edge-curtain")
  await expect(curtains).toHaveCount(7)
  const sections = await curtains.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element)
    return { delay: parseFloat(style.animationDelay), height: parseFloat(style.height) }
  }))
  expect(sections.map((section) => section.delay)).toEqual([0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24])
  expect(sections.every((section) => section.height >= 40 && section.height <= 56)).toBe(true)
  const lingeringOpacity = await edge.evaluate((element) => {
    const fade = element
      .getAnimations()
      .find((animation) => (animation as CSSTransition).transitionProperty === "opacity")!
    fade.currentTime = 700
    return Number.parseFloat(getComputedStyle(element).opacity)
  })
  expect(lingeringOpacity).toBeGreaterThan(0.2)
  await edge.evaluate((element) => element.getAnimations().forEach((animation) => animation.play()))
  await expect(edge).toHaveCSS("opacity", "0")
  await expect(curtains.first()).toHaveCSS("animation-name", "none")
})

test("keeps the curtains rising when the release lands on the glow's first frame", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  // Hold the pull's paint so the release can run in the same task, before any
  // style flush has advanced the opacity transition that paint starts. A busy
  // CI frame reaches this order on its own, and the edge used to read the
  // still-zero opacity as a glow that had never painted and cut the curtains.
  const painted = await page.evaluate(() => {
    const edge = document.querySelector<HTMLElement>(".elastic-scroll-edge")!
    const scheduledFrames: FrameRequestCallback[] = []
    const requestFrame = window.requestAnimationFrame

    window.requestAnimationFrame = (callback) => {
      scheduledFrames.push(callback)
      return scheduledFrames.length
    }

    try {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
      const paint = scheduledFrames.shift()
      if (!paint) throw new Error("The pull queued no paint")

      paint(performance.now())
      const opacity = edge.style.getPropertyValue("--elastic-edge-opacity")
      document.dispatchEvent(new Event("touchend"))

      return { opacity: Number.parseFloat(opacity), glowing: edge.dataset.glowing }
    } finally {
      window.requestAnimationFrame = requestFrame
      scheduledFrames.splice(0).forEach((callback) => requestFrame.call(window, callback))
    }
  })

  expect(painted.opacity).toBeGreaterThan(0)
  expect(painted.glowing).toBe("true")
  const curtainDelays = page.locator(".elastic-scroll-edge-curtain")
  await expect(curtainDelays).toHaveCount(7)
  const delays = await curtainDelays.evaluateAll((elements) =>
    elements.map((element) => parseFloat(getComputedStyle(element).animationDelay)),
  )
  expect(delays).toEqual([0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24])
})

test("a thumb\u2019s worth of overscroll fills the elastic edge the way a fling does", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const edge = page.locator(".elastic-scroll-edge")
  // A wheel fling keeps arriving after the page has stopped and easily spends
  // thousands of pixels; a finger only spends what the rubber band gives it,
  // which on a phone runs out around 150px. Sharing the wheel's conversion left
  // that whole gesture painting four tenths of the glow.
  const reached = await edge.evaluate(async (element) => {
    const touch = (type: string, clientY: number) => document.dispatchEvent(new TouchEvent(type, {
      bubbles: true,
      touches: type === "touchend"
        ? []
        : [new Touch({ identifier: 1, target: document.body, clientX: 195, clientY })],
    }))
    let y = 600
    touch("touchstart", y)
    for (let travelled = 0; travelled < 140; travelled += 5) touch("touchmove", (y -= 5))
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const scale = Number.parseFloat(element.style.getPropertyValue("--elastic-edge-scale"))
    touch("touchend", y)
    return (scale - 0.35) / 0.65
  })

  expect(reached).toBeGreaterThan(0.8)
  expect(reached).toBeLessThanOrEqual(1)
})

test("continues the elastic scroll edge from its visible position when release is interrupted", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const edge = page.locator(".elastic-scroll-edge")
  const interruption = await edge.evaluate(async (element) => {
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
    await new Promise((resolve) => window.setTimeout(resolve, 210))

    const opacityBeforeInterruption = Number.parseFloat(getComputedStyle(element).opacity)
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 20 }))
    const opacityAfterInterruption = Number.parseFloat(getComputedStyle(element).opacity)

    return { opacityBeforeInterruption, opacityAfterInterruption }
  })

  expect(interruption.opacityBeforeInterruption).toBeGreaterThan(0.1)
  expect(interruption.opacityAfterInterruption).toBeGreaterThanOrEqual(interruption.opacityBeforeInterruption)
})

test("gives the page-end content a small upward nudge and settles without changing scroll position", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const content = page.locator(".mosaic-about-body")
  const nudge = await content.evaluate(async (element) => {
    const scrollBefore = window.scrollY
    const topBefore = element.getBoundingClientRect().top
    // Keep the gesture alive the way a trackpad does. A single wheel event
    // releases after 90ms, and a starved frame lets that release reset the pull
    // before it ever paints, leaving the nudge at zero on a loaded runner.
    for (let pulls = 0; pulls < 6; pulls += 1) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 }))
      await new Promise((resolve) => window.setTimeout(resolve, 40))
    }
    return {
      travel: topBefore - element.getBoundingClientRect().top,
      scrollBefore,
      scrollAfter: window.scrollY,
    }
  })

  expect(nudge.travel).toBeGreaterThan(1)
  expect(nudge.travel).toBeLessThanOrEqual(8)
  expect(nudge.scrollAfter).toBe(nudge.scrollBefore)
  await expect(content).toHaveCSS("translate", "0px")
  await expect(page.locator(".elastic-scroll-edge-emoji")).toHaveCount(0)
})

test("keeps the page-end content still above the bottom and inside nested scrollers", async ({ page }) => {
  await page.goto("/")
  const content = page.locator(".mosaic-about-body")
  await page.evaluate(() => window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600 })))
  await expect(content).not.toHaveAttribute("data-edge-pulling", "true")

  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
    const scroller = document.createElement("div")
    scroller.style.cssText = "position:fixed;inset:0;width:100px;height:100px;overflow-y:auto"
    const child = document.createElement("div")
    child.style.height = "200px"
    scroller.append(child)
    document.body.append(scroller)
    child.dispatchEvent(new WheelEvent("wheel", { deltaY: 600, bubbles: true }))
    scroller.remove()
  })
  await expect(content).not.toHaveAttribute("data-edge-pulling", "true")
  await expect(content).toHaveCSS("translate", "0px")
})

test("removes the elastic scroll edge when reduced motion is preferred", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const edge = page.locator(".elastic-scroll-edge")
  await edge.evaluate(() => window.dispatchEvent(new WheelEvent("wheel", { deltaY: 180 })))

  await expect(edge).toHaveCSS("display", "none")
  await expect(edge).toHaveAttribute("data-pulling", "false")
  await expect(page.locator(".mosaic-about-body")).toHaveCSS("translate", "none")
})

// The artwork runs to the card's top edge, so an overscroll that bounced peeled
// it off the top and showed a white sliver of the card behind it. `contain` and
// `none` both keep the scroll off the page behind the dialog; only `none` also
// takes away the bounce.
test("seals an open preview's artwork to the card's top edge", async ({ page }) => {
  await page.goto("/work/protector-booking/")

  const card = page.getByRole("dialog").locator(".preview-gallery-card")
  await expect(card).toHaveCSS("overscroll-behavior-y", "none")

  const artworkFromTop = await card.evaluate((element) => {
    const frame = element.querySelector(".preview-gallery-media-frame") as HTMLElement
    return Math.round(frame.getBoundingClientRect().top - element.getBoundingClientRect().top)
  })

  expect(artworkFromTop).toBe(0)
})

test("defines the overlapping About surface with a top border and shadow", async ({ page }) => {
  await page.goto("/")

  const about = page.locator(".mosaic-about")
  const treatment = await about.evaluate((element) => {
    const sheet = getComputedStyle(element)
    // The hairline anchors to the runway rather than the sheet: paint outside
    // the sheet's bounds would keep its composited layer non-opaque, and a
    // missed raster tile would composite as see-through grid instead of
    // solid canvas.
    const runway = document.querySelector(".mosaic-takeover-runway")
    const topEdge = runway ? getComputedStyle(runway, "::after") : null
    const runwayRect = runway?.getBoundingClientRect()
    const topEdgePaintBottom =
      runwayRect && topEdge ? Math.round(runwayRect.bottom - Number.parseFloat(topEdge.bottom)) : null

    return {
      sheetShadow: sheet.boxShadow,
      sheetClip: sheet.clipPath,
      sheetTopEdgeContent: getComputedStyle(element, "::before").content,
      topEdgeContent: topEdge?.content ?? "missing",
      topEdgeHeight: topEdge?.height ?? "missing",
      topEdgeBackground: topEdge?.backgroundColor ?? "missing",
      topEdgeShadow: topEdge?.boxShadow ?? "missing",
      topEdgePaintBottom,
      sheetTop: Math.round(element.getBoundingClientRect().top),
    }
  })

  expect(treatment.sheetShadow).toBe("none")
  expect(treatment.sheetClip).toBe("none")
  expect(treatment.sheetTopEdgeContent).toBe("none")
  expect(treatment.topEdgeContent).toBe('""')
  expect(treatment.topEdgePaintBottom).toBe(treatment.sheetTop)
  expect(treatment.topEdgeHeight).toBe("1px")
  expect(treatment.topEdgeBackground).toBe("rgba(0, 0, 0, 0.08)")
  expect(treatment.topEdgeShadow).not.toBe("none")
})

test("does not claim a sitemap modification date for every deployment", async ({ request }) => {
  const response = await request.get("/sitemap.xml")

  expect(response.ok()).toBe(true)
  expect(await response.text()).not.toContain("<lastmod>")
})

test("offers LinkedIn and X actions beside booking", async ({ page }) => {
  await page.goto("/")

  const actions = page.locator(".mosaic-profile-contact").getByRole("group", { name: "Profile contact actions" })
  const linkedInAction = actions.getByRole("link", { name: "Message on LinkedIn" })
  const xAction = actions.getByRole("link", { name: "Follow on X" })

  await expect(linkedInAction).toHaveAttribute("href", "https://www.linkedin.com/in/rafaelmedian")
  await expect(xAction).toHaveAttribute("href", "https://x.com/rafaelmedian")
})

test("leads the contact row with the booking pill", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const actions = page.getByRole("group", { name: "Profile contact actions" })
  const bookButton = actions.locator(".mosaic-booking-pill")

  await expect(bookButton).toHaveText("Book a call")
  await expect(bookButton).toHaveAccessibleName(/^Book a call — Available in /)

  const bookBox = await bookButton.boundingBox()
  const linkedInBox = await actions.getByRole("link", { name: "Message on LinkedIn" }).boundingBox()

  expect(bookBox).not.toBeNull()
  expect(linkedInBox).not.toBeNull()
  expect(bookBox!.x).toBeLessThan(linkedInBox!.x)
  // The pill carries its label alone: the status dot it used to hold was the
  // hero's only chromatic pixel, for a month the hover hint already names.
  await expect(actions.locator(".mosaic-availability-dot")).toHaveCount(0)
})

test("uses the same side padding for every contact action", async ({ page }) => {
  await page.setViewportSize({ width: 487, height: 1381 })
  await page.goto("/")
  await expect(page.getByRole("group", { name: "Profile contact actions" })).toBeVisible()

  const sidePadding = await page
    .getByRole("group", { name: "Profile contact actions" })
    .locator(".mosaic-contact-pill")
    .evaluateAll((actions) =>
      actions.map((action) => {
        const styles = getComputedStyle(action)
        return [Number.parseFloat(styles.paddingLeft), Number.parseFloat(styles.paddingRight)]
      }),
    )

  expect(sidePadding).toHaveLength(3)
  for (const [left, right] of sidePadding) {
    expect(left).toBeCloseTo(right, 5)
    expect(left).toBeCloseTo(sidePadding[0][0], 5)
    expect(left).toBeCloseTo(16, 5)
  }
})

test("matches the desktop contact-pill height at compact desktop widths", async ({ page }) => {
  await page.setViewportSize({ width: 572, height: 1381 })
  await page.goto("/")

  const message = page.getByRole("link", { name: "Message on LinkedIn" })
  await expect(message).toHaveCSS("height", "34px")
  await expect(message).toHaveCSS("min-height", "34px")
})

test("keeps comfortable contact targets on wide touch viewports", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 568, height: 320 },
  })
  const page = await context.newPage()
  await page.goto("/")

  const actions = page
    .getByRole("group", { name: "Profile contact actions" })
    .locator(".mosaic-contact-pill")
  for (const action of await actions.all()) {
    const box = await action.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  }

  await context.close()
})

test("optically centers the X mark in the Follow pill", async ({ page }) => {
  await page.goto("/")

  const followPill = page.getByRole("link", { name: "Follow on X" })
  const [pillBox, iconBox] = await followPill.evaluate((pill) => [
    pill.getBoundingClientRect().toJSON(),
    pill.querySelector(".mosaic-contact-pill-icon-x")?.getBoundingClientRect().toJSON(),
  ])

  expect(pillBox).not.toBeNull()
  expect(iconBox).not.toBeNull()
  expect(iconBox!.y + iconBox!.height / 2).toBeCloseTo(pillBox!.y + pillBox!.height / 2, 1)
})

test("wraps primary contact actions when their mobile container is too narrow", async ({ page }) => {
  await page.setViewportSize({ width: 473, height: 994 })
  await page.goto("/")

  const actions = page.getByRole("group", { name: "Profile contact actions" })
  await actions.evaluate((element) => {
    element.style.width = "220px"
  })

  const boxes = await actions.locator(".mosaic-contact-pill")
    .evaluateAll((actions) => actions.map((action) => action.getBoundingClientRect().toJSON()))

  expect(boxes).toHaveLength(3)
  expect(new Set(boxes.map(({ y }) => Math.round(y))).size).toBeGreaterThan(1)
  for (const box of boxes) expect(box.height).toBeCloseTo(44, 1)
})

test("centers a wrapped contact action on narrow mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 328, height: 844 })
  await page.goto("/")

  const actions = page.getByRole("group", { name: "Profile contact actions" })
  const [actionsBox, firstActionBox, followBox] = await Promise.all([
    actions.boundingBox(),
    actions.locator(".mosaic-contact-pill").first().boundingBox(),
    page.getByRole("link", { name: "Follow on X" }).boundingBox(),
  ])

  expect(actionsBox).not.toBeNull()
  expect(firstActionBox).not.toBeNull()
  expect(followBox).not.toBeNull()
  expect(followBox!.y).toBeGreaterThan(firstActionBox!.y)
  expect(followBox!.x + followBox!.width / 2).toBeCloseTo(actionsBox!.x + actionsBox!.width / 2, 0)
})

test("contains framed row videos inside their cards on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 473, height: 994 })
  await page.goto("/")

  const video = page.locator(".mosaic-row-card video.mosaic-row-media").first()
  const card = video.locator("xpath=..")
  const [cardBox, videoBox] = await Promise.all([card.boundingBox(), video.boundingBox()])

  await expect(video).toHaveCSS("object-fit", "contain")
  expect(cardBox).not.toBeNull()
  expect(videoBox).not.toBeNull()
  expect(videoBox!.x).toBeGreaterThanOrEqual(cardBox!.x)
  expect(videoBox!.y).toBeGreaterThanOrEqual(cardBox!.y)
  expect(videoBox!.x + videoBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width)
  expect(videoBox!.y + videoBox!.height).toBeLessThanOrEqual(cardBox!.y + cardBox!.height)
})

test("sets the whole About sheet on the reading step under one heading step", async ({ page }) => {
  await page.setViewportSize({ width: 473, height: 994 })
  await page.goto("/")

  const typeRoles = page.locator([
    "#about-section .mosaic-about-lede",
    "#about-section .mosaic-about-section-copy > p:not(.mosaic-about-lede)",
    "#about-section .mosaic-about-hobbies li",
    ".mosaic-about-section-heading",
    ".mosaic-about-resume-title",
    ".mosaic-about-resume-dates",
    ".mosaic-about-resume-location",
    ".mosaic-about-resume-description",
    ".mosaic-about-resume-heading",
    ".mosaic-about-service-shape",
  ].join(", "))
  const sizes = await typeRoles.evaluateAll((elements) =>
    [...new Set(elements.map((element) => getComputedStyle(element).fontSize))].sort(),
  )

  const sectionHeading = page.locator(".mosaic-about-section-heading")
  const lede = page.locator("#about-section .mosaic-about-lede")

  // Two steps across the whole sheet: the reading copy and the headings over
  // it -- the same pairing the notes reader uses.
  expect(sizes).toEqual(["14px", "16px"])

  // The lede, "Worked with", "How I work", "Services" and the questions that
  // close it are the sheet's section headings and are set identically, so none
  // reads as ranking above another.
  await expect(sectionHeading).toHaveCount(4)
  for (const heading of [...(await sectionHeading.all()), lede]) {
    await expect(heading).toHaveCSS("font-size", "16px")
    await expect(heading).toHaveCSS("font-weight", "600")
    await expect(heading).toHaveCSS("color", "rgb(45, 45, 45)")
  }

  const aboutSizes = await page
    .locator("#about-section .mosaic-about-section-copy")
    .locator("h2, p, li, a")
    // The local-time card sits in this column but is a floating surface, not
    // reading copy -- its map attribution is --text-xs like every other piece
    // of card chrome on the site, and the sheet's type scale does not own it.
    .evaluateAll((elements) =>
      [
        ...new Set(
          elements
            .filter((element) => !element.closest(".mosaic-local-time-card"))
            .map((element) => getComputedStyle(element).fontSize),
        ),
      ].sort(),
    )
  expect(aboutSizes).toEqual(["14px", "16px"])

  // The services block closes the sheet and is set on the same two steps --
  // including its booking trigger, which is a button inside a run of prose and
  // would otherwise fall back to the browser's control font.
  const servicesSizes = await page
    .locator("#about-panel-services")
    .locator("h2, h3, h4, p, li, a, button")
    .evaluateAll((elements) =>
      [...new Set(elements.map((element) => getComputedStyle(element).fontSize))].sort(),
    )
  expect(servicesSizes).toEqual(["14px", "16px"])
})

test("gives mobile contact actions generous horizontal padding", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await expect(page.getByRole("group", { name: "Profile contact actions" })).toBeVisible()

  const actions = page
    .getByRole("group", { name: "Profile contact actions" })
    .locator(".mosaic-contact-pill")
  const sidePadding = await actions.evaluateAll((elements) =>
    elements.map((element) => {
      const styles = getComputedStyle(element)
      return [Number.parseFloat(styles.paddingLeft), Number.parseFloat(styles.paddingRight)]
    }),
  )

  expect(sidePadding).toHaveLength(3)
  for (const [left, right] of sidePadding) {
    expect(left).toBeCloseTo(right, 5)
    expect(left).toBeGreaterThanOrEqual(19)
  }
})

test("keeps company chips compact with comfortable mobile targets", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const chips = page.locator(".mosaic-work-history-chip")
  expect(await chips.count()).toBeGreaterThan(0)
  for (const chip of await chips.all()) {
    const box = await chip.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeLessThan(32.01)
    await expect(chip).toHaveCSS("min-height", "32px")
    await expect(chip).toHaveCSS("position", "relative")
    expect(
      await chip.evaluate((element) => Number.parseFloat(getComputedStyle(element, "::after").height)),
    ).toBeGreaterThanOrEqual(40)
  }
})

test("adds breathing room below the previous-work label on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const gap = await page.locator(".mosaic-work-history").evaluate((workHistory) => {
    const label = workHistory.querySelector(".mosaic-work-history-line:first-child .mosaic-work-history-copy:last-child")
    const company = workHistory.querySelector(".mosaic-work-history-line:nth-child(2) .mosaic-work-history-chip:first-child")
    if (!label || !company) return Number.POSITIVE_INFINITY

    const labelBox = label.getBoundingClientRect()
    const companyBox = company.getBoundingClientRect()
    return companyBox.top - labelBox.bottom
  })

  expect(gap).toBeCloseTo(12, 0)
})

test("reserves balanced wrapping for headings", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  await expect(page.locator("#about-section .mosaic-about-section-copy > p").nth(1)).toHaveCSS("text-wrap", "pretty")
  await expect(page.locator(".mosaic-booking-pill")).not.toHaveCSS("text-wrap", "balance")
})

test("matches the mobile browser theme color to the page canvas", async ({ page, request }) => {
  await page.goto("/")

  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#ffffff")

  const manifest = await request.get("/site.webmanifest")
  expect(manifest.ok()).toBe(true)
  expect(await manifest.json()).toMatchObject({
    background_color: "#ffffff",
    theme_color: "#ffffff",
  })
})

test("copies the corner address on click and reacts to it in the tooltip", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-write", "clipboard-read"])
  // writeText rejects outright on an unfocused document, and the component's
  // answer to that is the mailto: fallback rather than a copy -- so the flag
  // this asserts on would simply never appear.
  await page.bringToFront()
  await page.goto("/")
  await pausePageClock(page)

  const email = page.locator(".mosaic-social-corner .mosaic-profile-email")
  const reaction = page.locator(".reaction-card-media img")

  await expect(email).toHaveText(contactEmail)
  await expect(email).toHaveAccessibleName(`Copy email address ${contactEmail}`)
  // The card is decorative, so the words a screen reader needs stay in the
  // description and in the live region rather than in the picture.
  await expect(email).toHaveAccessibleDescription("Click to copy")

  await email.hover()
  // The paused clock also holds the tooltip's 160ms intent delay.
  await page.clock.fastForward(200)
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-before.webp")

  await email.click()
  // The tooltip is the confirmation surface, so the press must not close it.
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-success.webp")
  // Scoped to the corner: the same announcement is made by each address on the
  // page, and the About sheet carries two of them.
  await expect(page.locator(".mosaic-social-corner").getByRole("status")).toHaveText(
    `${contactEmail} copied to clipboard`,
  )
  await expect(
    page.evaluate(() => navigator.clipboard.readText()),
  ).resolves.toBe(contactEmail)

  // And it goes back to the invitation, so the next hover reads as an offer.
  await page.clock.fastForward(1_600)
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-before.webp")
})

test("copies the About sheet's address from a press in the prose", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-write", "clipboard-read"])
  // writeText rejects outright on an unfocused document, and the component's
  // answer to that is the mailto: fallback rather than a copy -- so the flag
  // this asserts on would simply never appear.
  await page.bringToFront()
  await page.goto("/")
  await settleAvatarIntro(page)

  const address = page.locator("#about-section .mosaic-about-email")
  const reaction = page.locator(".reaction-card-media img")

  // It stays a link, so the crawler, the context menu, and a browser with no
  // clipboard all still get the address; the plain press is the only one this
  // component takes.
  await expect(address).toHaveAttribute("href", `mailto:${contactEmail}`)
  await expect(address).toHaveAccessibleName(contactEmail)
  await expect(address).toHaveAccessibleDescription("Click to copy")

  await address.scrollIntoViewIfNeeded()
  // A delayed observer can start the parent's 28px rise after hover has
  // positioned the pointer. Wait for that entrance before freezing time or
  // the link can move away and cancel the tooltip's intent timer.
  const intro = page.locator(".mosaic-about-section-copy")
  await expect(intro).toHaveAttribute("data-about-fade", "in")
  await intro.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  )
  await pausePageClock(page)
  await address.hover()
  // The paused clock also holds the tooltip's 160ms intent delay.
  await page.clock.fastForward(200)
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-before.webp")

  await address.click()
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-success.webp")
  await expect(address).toHaveAttribute("data-copied", "true")
  await expect(
    page.locator("#about-section").getByRole("status"),
  ).toHaveText(`${contactEmail} copied to clipboard`)
  await expect(
    page.evaluate(() => navigator.clipboard.readText()),
  ).resolves.toBe(contactEmail)

  // And it goes back to being an offer, underline and card together.
  await page.clock.fastForward(1_600)
  await expect(address).not.toHaveAttribute("data-copied", "true")
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-before.webp")
})

test("answers a tap on the About address with the card a pointer gets", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: mobileViewport })
  await context.grantPermissions(["clipboard-write", "clipboard-read"])
  const page = await context.newPage()
  await page.goto("/")
  await page.bringToFront()

  const address = page.locator("#about-section .mosaic-about-email")
  const card = page.locator(".reaction-card")
  // The address ships in the prerendered markup as a plain mailto: link, so a
  // tap that lands before hydration opens a mail draft rather than copying.
  await settleAvatarIntro(page)
  await address.scrollIntoViewIfNeeded()

  // A phone never hovers, so the hint is not on screen until the copy puts it
  // there -- and it is the only confirmation an inline word can carry.
  await expect(card).toHaveCount(0)
  await address.tap()
  await expect(page.locator(".reaction-card-media img")).toHaveAttribute(
    "src",
    "/reactions/copy-email-success.webp",
  )
  await expect(
    page.evaluate(() => navigator.clipboard.readText()),
  ).resolves.toBe(contactEmail)

  // And it leaves with the confirmation instead of sitting on the sentence.
  await expect(card).toHaveCount(0)
  await context.close()
})

test("copies the corner address again on every repeat click", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-write", "clipboard-read"])
  // writeText rejects outright on an unfocused document, and the component's
  // answer to that is the mailto: fallback rather than a copy -- so the flag
  // this asserts on would simply never appear.
  await page.bringToFront()
  await page.goto("/")
  await pausePageClock(page)

  const email = page.locator(".mosaic-social-corner .mosaic-profile-email")
  const reaction = page.locator(".reaction-card-media img")

  await email.click()
  await page.clock.fastForward(200)
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-success.webp")
  await page.clock.fastForward(1_600)
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-before.webp")

  // A second copy gets its own full confirmation window rather than inheriting
  // the tail of the first one.
  await page.evaluate(() => navigator.clipboard.writeText("cleared"))
  await email.click()
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-success.webp")
  await expect(
    page.evaluate(() => navigator.clipboard.readText()),
  ).resolves.toBe(contactEmail)

  await page.clock.fastForward(800)
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-success.webp")
  await page.clock.fastForward(800)
  await expect(reaction).toHaveAttribute("src", "/reactions/copy-email-before.webp")
})

// The clip that reads as an interaction is not the clip that reads as a still,
// so the card ships both and lets the media query pick.
test("swaps the address reaction for a still under reduced motion", async ({ page }) => {
  // These two assert on the copied state, not on the clipboard's contents, and a
  // real writeText rejects on a page that is not the frontmost one -- which most
  // of them are not, with the suite fully parallel. Stubbing the write keeps the
  // state deterministic; the two tests above still use the real clipboard,
  // because reading the address back out of it is their whole point.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    })
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await pausePageClock(page)

  const email = page.locator(".mosaic-social-corner .mosaic-profile-email")
  const reaction = page.locator(".reaction-card-media img")
  const currentFrame = () => reaction.evaluate((img) => (img as HTMLImageElement).currentSrc)

  await email.hover()
  await page.clock.fastForward(200)
  await expect(reaction).toBeVisible()
  await expect.poll(currentFrame).toContain("/reactions/copy-email-before-still.webp")

  await email.click()
  await expect.poll(currentFrame).toContain("/reactions/copy-email-success-still.webp")
})

test("reveals the address icon on hover without moving the line", async ({ page }) => {
  await page.goto("/")
  await settleAvatarIntro(page)

  const email = page.locator(".mosaic-social-corner .mosaic-profile-email")
  const label = email.locator(".mosaic-profile-email-label")
  const icon = email.locator(".mosaic-profile-email-icon")

  // Invisible at rest, but still occupying its slot: the icon fades in where it
  // already was, so the centred line never shifts under a pointer that is
  // already on its way to the click.
  await expect(icon).toHaveCSS("opacity", "0")
  const [restIcon, restLabel] = await Promise.all([icon.boundingBox(), label.boundingBox()])
  expect(restIcon).not.toBeNull()
  expect(restLabel).not.toBeNull()
  expect(restIcon!.width).toBeCloseTo(14, 0)

  await email.hover()
  await expect(icon).toHaveCSS("opacity", "1")
  const [hoverIcon, hoverLabel] = await Promise.all([icon.boundingBox(), label.boundingBox()])
  expect(hoverIcon!.x).toBeCloseTo(restIcon!.x, 0)
  expect(hoverLabel!.x).toBeCloseTo(restLabel!.x, 0)
  expect(hoverLabel!.y).toBeCloseTo(restLabel!.y, 0)
})

// The address wears the work-history chip's hover fill rather than an underline:
// both are a name in a sentence that turns out to be pressable, so they get one
// shape between them.
test("fills the address in as a chip card on hover and focus", async ({ page }) => {
  await page.goto("/")
  await settleAvatarIntro(page)

  const email = page.locator(".mosaic-social-corner .mosaic-profile-email")
  const chip = page.locator(".mosaic-work-history-chip").first()

  await email.hover()
  await expect(email).toHaveCSS("background-color", "rgb(233, 233, 233)")
  // The corner rail's hover ink, shared with the section links opposite.
  await expect(email).toHaveCSS("color", "rgb(45, 45, 45)")

  const [emailRadius, chipRadius] = await Promise.all([
    email.evaluate((element) => getComputedStyle(element).borderRadius),
    chip.evaluate((element) => getComputedStyle(element).borderRadius),
  ])
  expect(emailRadius).toBe(chipRadius)

  // The fill grows around the address instead of pushing it, so the rest of the
  // centred line stays exactly where it was.
  const place = page.locator(".mosaic-profile-location-place")
  const hoveredBox = await place.boundingBox()
  await page.mouse.move(1, 1)
  await expect(email).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  const restBox = await place.boundingBox()
  expect(hoveredBox!.x).toBeCloseTo(restBox!.x, 0)

  // Chromium grants :focus-visible to a programmatic focus only when the last
  // interaction was a keyboard one, so the Tab is what makes this the keyboard
  // path rather than a second hover.
  await page.keyboard.press("Tab")
  await email.focus()
  await expect(email).toHaveCSS("background-color", "rgb(233, 233, 233)")
})

test("marks a copy in the accent and lets go of it again", async ({ page }) => {
  // The copied state is the subject here, not the clipboard, so the write is
  // stubbed for the same reason as the reduced-motion test above.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    })
  })
  await page.goto("/")
  await pausePageClock(page)

  const email = page.locator(".mosaic-social-corner .mosaic-profile-email")
  const icon = email.locator(".mosaic-profile-email-icon")

  await email.click()
  await expect(email).toHaveAttribute("data-copied", "true")
  await expect(icon).toHaveCSS("color", "rgb(52, 162, 106)")
  // The card empties to white for the confirmation: --accent is 3.2:1 there and
  // only 2.7:1 on the grey hover fill, which is the one moment it has to read.
  await expect(email).toHaveCSS("background-color", "rgb(255, 255, 255)")
  // And the check outlasts the pointer -- it is lit by the copy, not the hover,
  // so a keyboard copy shows it too.
  await page.mouse.move(1, 1)
  await expect(icon).toHaveCSS("opacity", "1")
  await expect(email).toHaveCSS("background-color", "rgb(255, 255, 255)")

  await page.clock.fastForward(1_600)
  await expect(email).not.toHaveAttribute("data-copied", "true")
  await expect(email).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
})

test("previews the X profile while the Follow pill is hovered", async ({ page }) => {
  await page.goto("/")

  const xAction = page.getByRole("link", { name: "Follow on X" })
  const card = page.locator(".mosaic-x-card")

  await expect(card).toHaveAttribute("data-state", "closed")

  await xAction.hover()
  await expect(card).toHaveAttribute("data-state", "open")
  await expect(card).toContainText("@rafaelmedian")

  // The card sits below the pill and must clear the work grid, not hide behind it.
  const cardBox = await card.boundingBox()
  const pillBox = await xAction.boundingBox()
  expect(cardBox!.y).toBeGreaterThan(pillBox!.y + pillBox!.height)

  // Moving onto the card keeps it up; leaving the pair puts it away.
  await page.mouse.move(cardBox!.x + 40, cardBox!.y + 40, { steps: 8 })
  await expect(card).toHaveAttribute("data-state", "open")

  await page.mouse.move(8, cardBox!.y + 320, { steps: 12 })
  await expect(card).toHaveAttribute("data-state", "closed")
})

test("sends every X preview control to the right profile", async ({ page }) => {
  await page.goto("/")

  const xAction = page.getByRole("link", { name: "Follow on X" })
  const card = page.locator(".mosaic-x-card")

  // Closed, the card is inert: its links are out of the tab order.
  await expect(card).toHaveAttribute("inert", "")

  await xAction.focus()
  await expect(card).toHaveAttribute("data-state", "open")
  await expect(card).not.toHaveAttribute("inert", /.*/)
  await expect(card.locator(".mosaic-x-card-follow")).toHaveAttribute(
    "href",
    "https://x.com/intent/follow?screen_name=rafaelmedian",
  )
  await expect(card.locator(".mosaic-x-card-identity")).toHaveAttribute("href", "https://x.com/rafaelmedian")
  await expect(card.locator(".mosaic-x-card-avatar-link")).toHaveAttribute("href", "https://x.com/rafaelmedian")
  await expect(card.locator(".mosaic-x-card-badge")).toHaveAttribute("aria-label", "Verified account")
  await expect(card.locator(".mosaic-x-card-stats")).toContainText("713 Followers")

  // The bio is stored as plain text; its @mentions are linked out like X does.
  await expect(card.locator(".mosaic-x-card-bio")).toHaveText("Designer - Prev at @0xproject / @matchaxyz")
  const mentions = card.locator(".mosaic-x-card-mention")
  await expect(mentions).toHaveCount(2)
  await expect(mentions.nth(0)).toHaveAttribute("href", "https://x.com/0xproject")
  await expect(mentions.nth(1)).toHaveAttribute("href", "https://x.com/matchaxyz")

  // Focus reaches the card's own links, and leaving the pair puts it away.
  await page.keyboard.press("Tab")
  await expect(card.locator(".mosaic-x-card-avatar-link")).toBeFocused()
  await expect(card).toHaveAttribute("data-state", "open")

  await page.keyboard.press("Escape")
  await expect(card).toHaveAttribute("data-state", "closed")
  await expect(xAction).toBeFocused()
})

test("keeps the X preview card inside a narrow hover-capable viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("/")

  await page.getByRole("link", { name: "Follow on X" }).focus()
  const cardBox = await page.locator(".mosaic-x-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(375)
})

test("keeps the X preview card inside a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")

  await page.getByRole("link", { name: "Follow on X" }).focus()
  const cardBox = await page.locator(".mosaic-x-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(320)
})

test("keeps the LinkedIn preview card inside a narrow hover-capable viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("/")

  await page.getByRole("link", { name: "Message on LinkedIn" }).focus()
  const cardBox = await page.locator(".mosaic-linkedin-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(375)
})

test("keeps the reduced-motion X preview card inside a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await page.getByRole("link", { name: "Follow on X" }).focus()
  const cardBox = await page.locator(".mosaic-x-card").boundingBox()

  expect(cardBox).not.toBeNull()
  // Keep a small buffer for platform font metrics and fractional layout
  // rounding instead of balancing the card directly on the viewport edge.
  expect(cardBox!.x).toBeGreaterThanOrEqual(3)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(375)
})

test("plays a clip under the LinkedIn pill only while it is hovered", async ({ page }) => {
  await page.goto("/")

  const linkedinAction = page.getByRole("link", { name: "Message on LinkedIn" })
  const card = page.locator(".mosaic-linkedin-card")
  const media = card.locator("video")

  await expect(card).toHaveAttribute("data-state", "closed")
  // Nothing decodes until the card is actually asked for.
  await expect(media).toHaveJSProperty("paused", true)

  await linkedinAction.hover()
  await expect(card).toHaveAttribute("data-state", "open")

  const cardBox = await card.boundingBox()
  const mediaBox = await media.boundingBox()
  const pillBox = await linkedinAction.boundingBox()
  expect(cardBox!.y).toBeGreaterThan(pillBox!.y + pillBox!.height)
  expect(mediaBox!.width / mediaBox!.height).toBeCloseTo(500 / 280, 1)
  await expect(media).toHaveJSProperty("paused", false)

  await page.mouse.move(8, cardBox!.y + 320, { steps: 12 })
  await expect(card).toHaveAttribute("data-state", "closed")
  await expect(media).toHaveJSProperty("paused", true)
})

test("holds the LinkedIn clip still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await page.getByRole("link", { name: "Message on LinkedIn" }).hover()
  await expect(page.locator(".mosaic-linkedin-card")).toHaveAttribute("data-state", "open")
  await expect(page.locator(".mosaic-linkedin-card video")).toHaveJSProperty("paused", true)
})

test("shows an interactive OpenStreetMap view of Punta Cana while local time is hovered", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 })
  await page.route(openStreetMapTileUrl, (route) =>
    route.fulfill({
      contentType: "image/png",
      body: transparentMapTile,
    }),
  )
  await page.goto("/#about-panel")

  const localTime = page.locator(".mosaic-social-time")
  // Scoped: the hero's location line opens the same card from its own anchor.
  const card = page.locator(".mosaic-about-local-time .mosaic-local-time-card")

  await expect(card).toHaveAttribute("data-state", "closed")

  await localTime.hover()
  // `data-state="open"` flips when the open transition starts, not when it ends,
  // so the boxes measured below would otherwise be sampled mid-flight. (The
  // avatar intro needs no wait here: index.html only arms it when there is no
  // location hash, and this test loads /#about-panel.)
  await expect(card).toHaveAttribute("data-state", "open")
  await card.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  await expect(card.getByText("Punta Cana", { exact: true })).toBeVisible()
  await expect(card.getByText("Dominican Republic", { exact: true })).toBeVisible()
  // role="img": all map interaction is disabled, so it must not announce as an
  // interactive region, and its children are presentational.
  const map = card.getByRole("img", { name: "Map of Punta Cana, Dominican Republic" })
  await expect(map).toBeVisible()
  await expect(map.getByRole("button")).toHaveCount(0)
  await expect(map.getByRole("link")).toHaveCount(0)
  await expect(map.locator(".mosaic-punta-cana-map-marker")).toBeVisible()
  await expect(card.getByRole("link", { name: "OpenStreetMap contributors" })).toBeVisible()
  await expect(
    card.getByRole("img", { name: "OpenStreetMap screenshot of Punta Cana, Dominican Republic" }),
  ).toBeHidden()

  const cardBox = await card.boundingBox()
  const timeBox = await localTime.boundingBox()
  expect(cardBox).not.toBeNull()
  expect(timeBox).not.toBeNull()
  expect(cardBox!.width).toBeCloseTo(360, 0)
  expect(cardBox!.y).toBeGreaterThan(timeBox!.y + timeBox!.height)

  const workHistoryBox = await page.locator(".mosaic-work-history").boundingBox()
  expect(workHistoryBox).not.toBeNull()
  // The two boxes do not intersect at this viewport, so `Math.max` of their
  // origins landed on the card only by accident of layout -- a few pixels of
  // drift moved the sample off it and failed the assertion for the wrong
  // reason. Clamp into the card, nearest the work history, which is the corner
  // a stacking regression would surface at.
  const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)
  const overlapPoint = {
    x: clamp(workHistoryBox!.x + 8, cardBox!.x + 8, cardBox!.x + cardBox!.width - 8),
    y: clamp(workHistoryBox!.y + 8, cardBox!.y + 8, cardBox!.y + cardBox!.height - 8),
  }
  expect(
    await page.evaluate(
      ({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest(".mosaic-local-time-card")),
      overlapPoint,
    ),
  ).toBe(true)

  await page.mouse.move(cardBox!.x + cardBox!.width / 2, cardBox!.y + cardBox!.height / 2, { steps: 8 })
  await expect(card).toHaveAttribute("data-state", "open")

  await page.mouse.move(8, cardBox!.y + cardBox!.height + 80, { steps: 12 })
  await expect(card).toHaveAttribute("data-state", "closed")
})

test("opens the Punta Cana map from the hero's location line", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.route(openStreetMapTileUrl, (route) =>
    route.fulfill({
      contentType: "image/png",
      body: transparentMapTile,
    }),
  )
  await page.goto("/")

  const place = page.locator(".mosaic-profile-location-place")
  const card = page.locator(".mosaic-profile-location-card")
  await expect(card).toHaveAttribute("data-state", "closed")

  // A hover during the stagger's delay can open the card before its anchor
  // rises out from under the pointer and closes it again.
  await settleAvatarIntro(page)
  await place.hover()
  await expect(card).toHaveAttribute("data-state", "open")
  await expect(card.getByText("Dominican Republic", { exact: true })).toBeVisible()
  // Leaflet's chunk is fetched on the hover that opened this card, so the wait
  // is a download's worth rather than a render's -- and the whole suite is
  // competing for the same server.
  await expect(card.getByRole("img", { name: "Map of Punta Cana, Dominican Republic" })).toBeVisible({
    timeout: 15_000,
  })
  await card.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

  const [cardBox, placeBox, actionsBox] = await Promise.all([
    card.boundingBox(),
    place.boundingBox(),
    page.getByRole("group", { name: "Profile contact actions" }).boundingBox(),
  ])
  expect(cardBox).not.toBeNull()
  expect(placeBox).not.toBeNull()
  expect(actionsBox).not.toBeNull()
  // Upward, clear of the contact actions: the card is taller than the gap
  // between the location line and the only row in the hero worth pressing.
  expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(placeBox!.y)
  expect(cardBox!.y + cardBox!.height).toBeLessThan(actionsBox!.y)
  // Centred on the name it hangs off.
  expect(cardBox!.x + cardBox!.width / 2).toBeCloseTo(placeBox!.x + placeBox!.width / 2, 0)
})

test("keeps the hero location card on screen once its line wraps", async ({ page }) => {
  await page.setViewportSize({ width: 520, height: 900 })
  await page.goto("/")

  await page.locator(".mosaic-profile-location-place").focus()
  const cardBox = await page.locator(".mosaic-profile-location-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(520)
})

test("shows a Punta Cana map screenshot while OpenStreetMap tiles are unavailable", async ({ page }) => {
  await page.route(openStreetMapTileUrl, () => {})
  await page.goto("/#about-panel")

  await page.locator(".mosaic-social-time").hover()

  const screenshot = page.getByRole("img", {
    name: "OpenStreetMap screenshot of Punta Cana, Dominican Republic",
  })
  await expect(screenshot).toBeVisible()
  await expect.poll(() => screenshot.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0)
})

test("keeps the static Punta Cana map when the interactive map chunk fails", async ({ page }) => {
  await page.route("**/assets/PuntaCanaMap-*.js", (route) => route.abort("failed"))
  await page.goto("/#about-panel")

  const mapChunkFailure = page.waitForEvent(
    "requestfailed",
    (request) => request.url().includes("/assets/PuntaCanaMap-"),
  )
  await page.locator(".mosaic-social-time").hover()
  await mapChunkFailure
  // React retries the suspended tree before surfacing an unhandled lazy-import
  // rejection, so let that recovery cycle settle before inspecting the page.
  await page.waitForTimeout(500)

  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeVisible()
  await expect(
    page.getByRole("img", {
      name: "OpenStreetMap screenshot of Punta Cana, Dominican Republic",
    }),
  ).toBeVisible()
})

test("matches the local-time trigger corners to its card", async ({ page }) => {
  await page.goto("/#about-panel")

  await expect(page.locator(".mosaic-social-time")).toHaveCSS("border-radius", "16px")
  await expect(page.locator(".mosaic-about-local-time .mosaic-local-time-card")).toHaveCSS("border-radius", "16px")
})

test("keeps the local-time hover highlight compact without shrinking its hover target", async ({ page }) => {
  await page.goto("/#about-panel")

  const hoverTarget = page.locator(".mosaic-local-time-anchor")
  const highlight = page.locator(".mosaic-social-time")
  await highlight.hover()

  const hoverTargetBox = await hoverTarget.boundingBox()
  const highlightBox = await highlight.boundingBox()
  expect(hoverTargetBox).not.toBeNull()
  expect(highlightBox).not.toBeNull()
  expect(hoverTargetBox!.height).toBeGreaterThanOrEqual(40)
  expect(highlightBox!.height).toBeCloseTo(24, 0)
})

test("keeps the local-time card close to the visible trigger", async ({ page }) => {
  await page.goto("/#about-panel")

  const trigger = page.locator(".mosaic-social-time")
  const card = page.locator(".mosaic-about-local-time .mosaic-local-time-card")
  await trigger.hover()
  await expect(card).toHaveAttribute("data-state", "open")
  await card.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

  const [triggerBox, cardBox] = await Promise.all([trigger.boundingBox(), card.boundingBox()])
  expect(triggerBox).not.toBeNull()
  expect(cardBox).not.toBeNull()
  expect(cardBox!.y - (triggerBox!.y + triggerBox!.height)).toBeCloseTo(10, 0)
})

test("keeps the local-time card inside the narrowest viewport where it remains visible", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 568 })
  await page.goto("/#about-panel")

  await page.locator(".mosaic-social-time").focus()
  const cardBox = await page.locator(".mosaic-about-local-time .mosaic-local-time-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(700)
})

// The corner is gone below 700px, and the address it holds is the one thing on
// it a phone still needs -- so the address falls back into the hero's location
// line rather than disappearing with the corner.
test("moves the corner address into the hero line on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  await expect(page.locator(".mosaic-social-corner")).toBeHidden()
  const heroAddress = page.locator(".mosaic-profile-location .mosaic-profile-email")
  await expect(heroAddress).toBeVisible()
  await expect(heroAddress).toHaveText(contactEmail)
  // One control either way: the corner copy is the same element, hidden.
  await expect(page.locator(".mosaic-profile-email")).toHaveCount(2)
  await expect(page.locator(".mosaic-social-corner .mosaic-profile-email")).toBeHidden()
})

test("keeps the address in the corner and out of the hero line on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  await expect(page.locator(".mosaic-social-corner .mosaic-profile-email")).toBeVisible()
  await expect(page.locator(".mosaic-profile-location .mosaic-profile-email")).toBeHidden()
})

test("uses the body type step at the narrowest visible local-time width", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 1381 })
  await page.goto("/#about-panel")

  await expect(page.locator(".mosaic-social-time")).toHaveCSS("font-size", "14px")
})

for (const width of [390, 1440]) {
  test(`TOC appears after a short scroll and hides again at the top at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    const toc = page.locator(".mosaic-mobile-toc")
    const trigger = page.getByRole("button", { name: /^Table of contents:/ })
    await expect(toc).toBeHidden()
    await expect(toc).toHaveAttribute("inert", "")
    await expect(trigger).toHaveCount(0)
    await page.evaluate(() => window.scrollTo(0, 48))
    await expect(toc).toBeHidden()
    await page.evaluate(() => window.scrollTo(0, 160))
    await expect(trigger).toBeVisible()
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(toc).toBeHidden()
    await expect(toc).toHaveAttribute("data-open", "false")
    await expect(trigger).toHaveCount(0)
    await page.evaluate(() => window.scrollTo(0, 160))
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await page.goto("/#about-panel")
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveText("02 About")
  })
}

test("keeps the mobile table of contents centered with comfortable targets", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 160))
  await expect(page.locator(".mosaic-mobile-toc")).toHaveCSS("opacity", "1")
  const trigger = page.getByRole("button", { name: /^Table of contents:/ })
  const before = await trigger.boundingBox()
  expect(before!.y).toBeGreaterThan(mobileViewport.height - 110)
  expect(before!.x + before!.width / 2).toBeCloseTo(mobileViewport.width / 2, 0)
  expect(before!.width).toBeLessThan(220)
  await trigger.click()
  const contents = page.getByRole("navigation", { name: "Table of contents" })
  await expect(contents.getByRole("link")).toHaveCount(2)
  for (const link of await contents.getByRole("link").all()) {
    const box = await link.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  }
  await page.keyboard.press("Escape")
  await expect(contents.getByRole("link")).toHaveCount(0)
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await page.evaluate(() => window.scrollTo(0, 600))
  await expect.poll(async () => (await trigger.boundingBox())!.y).toBeCloseTo(before!.y, 0)
})

test("the TOC resizes one surface smoothly around its fixed bottom edge", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 160))
  await expect(page.locator(".mosaic-mobile-toc")).toHaveCSS("opacity", "1")
  const surface = page.locator(".mosaic-mobile-toc-surface")
  const trigger = page.getByRole("button", { name: /^Table of contents:/ })
  await expect.poll(() => page.locator(".mosaic-mobile-toc").evaluate((el) => el.style.getPropertyValue("--toc-compact-width"))).not.toBe("")
  const frames = await surface.evaluate(async (element) => {
    const samples: Array<{ width: number; height: number; bottom: number }> = []
    const capture = () => {
      const { width, height, bottom } = element.getBoundingClientRect()
      samples.push({ width, height, bottom })
    }
    capture()
    element.querySelector("button")!.click()
    const start = performance.now()
    while (performance.now() - start < 450) {
      await new Promise(requestAnimationFrame)
      capture()
    }
    return samples
  })
  const first = frames[0]
  const last = frames.at(-1)!
  expect(last.width).toBeGreaterThan(first.width + 50)
  expect(last.height).toBeGreaterThan(first.height + 100)
  expect(frames.some((frame) => frame.height > first.height + 10 && frame.height < last.height - 10)).toBe(true)
  for (const frame of frames) expect(frame.bottom).toBeCloseTo(first.bottom, 0)
  for (let tap = 0; tap < 3; tap += 1) await trigger.dispatchEvent("click")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect.poll(async () => (await surface.boundingBox())!.height).toBeCloseTo(first.height, 0)
  await expect(page.getByRole("navigation", { name: "Table of contents" }).getByRole("link")).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(surface).toHaveCSS("transition-property", "none")
})

test("mobile table of contents selects and tracks each section", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 160))
  await expect(page.locator(".mosaic-mobile-toc")).toHaveCSS("opacity", "1")
  const trigger = page.getByRole("button", { name: /^Table of contents:/ })
  const contents = page.getByRole("navigation", { name: "Table of contents" })
  await expect(trigger).toHaveText("01 Work")
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-current", "location")
  for (const [number, label, target] of [["02", "About", "about-panel"], ["03", "Services", "about-panel-services"]]) {
    await contents.getByRole("link", { name: label, exact: true }).click()
    await expect(contents.getByRole("link")).toHaveCount(0)
    await expect(page.locator(`#${target}`)).toBeFocused()
    await expect(page).toHaveURL(new RegExp(`#${target}$`))
    await expect(trigger).toHaveText(`${number} ${label}`)
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-current", "location")
    await expect(contents.locator(".mosaic-mobile-toc-row")).toHaveText(["01 Work", "02 About", "03 Services"])
  }
  await contents.getByRole("link", { name: "Work", exact: true }).click()
  await expect(page).toHaveURL(/#work$/)
  await expect(page.locator("#work")).toBeFocused()
  await expect(page.locator("#work")).toBeInViewport()
  await page.evaluate(() => document.getElementById("about-panel-services")!.scrollIntoView())
  await expect(trigger).toHaveText("03 Services")
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-current", "location")
})

test("lands on a section from the URL without drawing a ring around it", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const id of ["work", "about-panel", "about-panel-services"]) {
    await page.goto(`/#${id}`)
    const section = page.locator(`#${id}`)
    // The browser focuses the fragment target on load. Its default ring boxes
    // the whole section, which reads as a selection rather than a landing.
    await expect(section).toBeFocused()
    await expect(section).toHaveCSS("outline-style", "none")
  }
})

test("the TOC keeps its collapsed height while scrolling between sections", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 160))
  await expect(page.locator(".mosaic-mobile-toc")).toHaveCSS("opacity", "1")
  const trigger = page.getByRole("button", { name: /^Table of contents:/ })
  await expect(trigger).toHaveText("01 Work")
  for (const [target, label] of [["about-panel", "02 About"], ["about-panel-services", "03 Services"], ["work", "01 Work"]]) {
    const heights = await page.evaluate(async (id) => {
      const surface = document.querySelector(".mosaic-mobile-toc-surface")!
      const samples: number[] = []
      document.getElementById(id)!.scrollIntoView({ behavior: "instant" })
      const start = performance.now()
      while (performance.now() - start < 300) {
        await new Promise(requestAnimationFrame)
        samples.push(surface.getBoundingClientRect().height)
      }
      return samples
    }, target)
    await expect(trigger).toHaveText(label)
    for (const height of heights) expect(height).toBeCloseTo(48, 0)
    await trigger.click()
    await expect(page.locator(".mosaic-mobile-toc-row")).toHaveText(["01 Work", "02 About", "03 Services"])
    await expect.poll(async () => (await page.locator(".mosaic-mobile-toc-surface").boundingBox())!.height).toBeCloseTo(160, 0)
    await trigger.click()
    await expect.poll(async () => (await page.locator(".mosaic-mobile-toc-surface").boundingBox())!.height).toBeCloseTo(48, 0)
  }
})

test("the TOC label leaves in the direction the page is travelling", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 160))
  await expect(page.locator(".mosaic-mobile-toc")).toHaveCSS("opacity", "1")
  // The swap lives for one exit beat, so record it as it happens rather than
  // polling for a state that is meant to be gone by the time we look.
  const swap = (target: string) => page.evaluate(async (id) => {
    const root = document.querySelector<HTMLElement>(".mosaic-mobile-toc")!
    const seen: Array<{ direction?: string; leaving: string; travel: number }> = []
    const observer = new MutationObserver(() => {
      const ghost = document.querySelector(".mosaic-mobile-toc-ghost")
      if (!ghost) return
      seen.push({
        direction: root.dataset.swap,
        leaving: ghost.textContent!.replace(/\s+/g, " ").trim(),
        travel: Number(getComputedStyle(root).getPropertyValue("--toc-swap-direction")),
      })
    })
    observer.observe(root, { attributes: true, childList: true, subtree: true })
    document.getElementById(id)!.scrollIntoView({ behavior: "instant" })
    await new Promise((resolve) => setTimeout(resolve, 400))
    observer.disconnect()
    return seen[0]
  }, target)

  expect(await swap("about-panel")).toMatchObject({ direction: "up", leaving: "01 Work", travel: 1 })
  expect(await swap("work")).toMatchObject({ direction: "down", leaving: "02 About", travel: -1 })
  await expect(page.locator(".mosaic-mobile-toc-ghost")).toHaveCount(0)
  await expect(page.getByRole("button", { name: /^Table of contents:/ })).toHaveText("01 Work")

  // Reduced motion keeps the label change, drops the departure.
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator(".mosaic-mobile-toc-ghost")).toHaveCount(0)
})

test("the TOC contains all three rows in one inset card", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 160))
  const surface = page.locator(".mosaic-mobile-toc-surface")
  const trigger = page.getByRole("button", { name: /^Table of contents:/ })
  await trigger.click()
  await expect(surface).toHaveCSS("border-radius", "24px")
  await expect(surface).toHaveCSS("backdrop-filter", "blur(16px)")
  await expect(surface).not.toHaveCSS("box-shadow", "none")
  const card = (await surface.boundingBox())!
  const rows = await page.locator(".mosaic-mobile-toc-row").all()
  for (const [index, row] of rows.entries()) {
    const bounds = (await row.boundingBox())!
    expect(bounds.x).toBeCloseTo(card.x + 8, 0)
    expect(bounds.width).toBeCloseTo(card.width - 16, 0)
    expect(bounds.y).toBeCloseTo(card.y + 8 + index * 48, 0)
    expect(bounds.height).toBe(48)
    await expect(row).toHaveCSS("border-radius", "16px")
    await expect(row).toHaveCSS("box-shadow", "none")
  }
  await page.keyboard.press("Escape")
  await expect(surface).toHaveCSS("height", "48px")
})

test("table of contents dismisses outside and stays open when resizing to desktop", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 160))
  await expect(page.locator(".mosaic-mobile-toc")).toHaveCSS("opacity", "1")
  const trigger = page.getByRole("button", { name: /^Table of contents:/ })
  const contents = page.getByRole("navigation", { name: "Table of contents" })
  await trigger.focus()
  await page.keyboard.press("Enter")
  await page.keyboard.press("Tab")
  await expect(contents.getByRole("link", { name: "About", exact: true })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.mouse.click(4, 4)
  await expect(contents.getByRole("link")).toHaveCount(0)
  await trigger.click()
  await page.setViewportSize({ width: 900, height: 844 })
  await expect(contents.getByRole("link")).toHaveCount(2)
  await expect(trigger).toBeVisible()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(page.getByRole("navigation", { name: "Sections" })).toBeVisible()
})

for (const width of [768, 1440]) {
  test(`table of contents works beside the top navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await page.evaluate(() => window.scrollTo(0, 160))
    await expect(page.locator(".mosaic-mobile-toc")).toHaveCSS("opacity", "1")
    const trigger = page.getByRole("button", { name: /^Table of contents:/ })
    const topNav = page.getByRole("navigation", { name: "Sections", exact: true })
    const contents = page.getByRole("navigation", { name: "Table of contents" })
    await expect(topNav).toBeVisible()
    await expect(trigger).toHaveText("01 Work")
    const pill = await trigger.boundingBox()
    expect(pill!.x + pill!.width / 2).toBeCloseTo(width / 2, 0)
    expect(pill!.y).toBeGreaterThan(800)
    await trigger.click()
    await contents.getByRole("link", { name: "About", exact: true }).click()
    await expect(page.locator("#about-panel")).toBeFocused()
    await expect(trigger).toHaveText("02 About")
    await trigger.click()
    await contents.getByRole("link", { name: "Services", exact: true }).click()
    await expect(page.locator("#about-panel-services")).toBeFocused()
    await expect(trigger).toHaveText("03 Services")
    await trigger.click()
    await contents.getByRole("link", { name: "Work", exact: true }).click()
    await expect(trigger).toHaveText("01 Work")
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(topNav).toBeInViewport()
    await topNav.getByRole("link", { name: "About", exact: true }).click()
    await expect(trigger).toHaveText("02 About")
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await expect(trigger).toHaveText("03 Services")
    const about = await page.locator("#about-panel").boundingBox()
    expect(about!.y + about!.height).toBeLessThan((await trigger.boundingBox())!.y)
  })
}

test("keeps the mobile profile and final content clear of the table of contents", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")
  const avatar = await page.getByRole("button", { name: "Read about Rafael Medina" }).boundingBox()
  expect(avatar!.y).toBeLessThan(96)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page.getByRole("button", { name: /^Table of contents:/ })).toHaveText("03 Services")
  const trigger = await page.getByRole("button", { name: /^Table of contents:/ }).boundingBox()
  const about = await page.locator("#about-panel").boundingBox()
  expect(about!.y + about!.height).toBeLessThan(trigger!.y)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
})

test("gives the corner the address and the About sheet the clock", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-08-18T12:00:00Z"))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  // The corner holds one thing and it is not a link: a copy button, so the
  // section navigation opposite it stays the only navigation up there.
  const corner = page.locator(".mosaic-social-corner")
  await expect(corner.getByRole("link")).toHaveCount(0)
  await expect(corner).toContainText(contactEmail)
  await expect(corner).not.toContainText("Local time:")

  // The clock went down to About, where the rest of "who is this" already is.
  const clock = page.locator(".mosaic-about-local-time")
  await expect(clock).toContainText("Local time:")
  await expect(clock.locator(".mosaic-live-time")).toBeVisible()

  const location = page.locator(".mosaic-profile-location")
  await expect(location).toContainText("Punta Cana & NYC")
  await expect(location).toContainText("Last updated")
  await expect(location).not.toContainText("Local time:")
  await expect(location).not.toContainText("Available in")
  await expect(page.locator(".mosaic-profile-contact > .mosaic-profile-email")).toHaveCount(0)
})

// The clause is the site's own commit history, read out of git at build time,
// and its hint is the GitHub hovercard the trigger links to.
test("previews the GitHub profile behind the last-updated clause", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await settleAvatarIntro(page)

  const clause = page.locator(".mosaic-last-updated")
  await expect(clause).toContainText("Last updated")
  await expect(clause).toHaveAttribute("href", "https://github.com/rafaelmedian")
  // A machine-readable date beside the human one, so the clause is not just a
  // string that happens to look like a day.
  await expect(clause.locator("time")).toHaveAttribute("dateTime", /^\d{4}-\d{2}-\d{2}$/)

  await clause.hover()
  const card = page.locator(".activity-card")
  await expect(card).toBeVisible()
  await expect(card.locator(".activity-card-names")).toContainText("Rafael Medina")
  await expect(card.locator(".activity-card-names")).toContainText("@rafaelmedian")
  // Self-hosted: nothing on this card waits on githubusercontent.com.
  await expect(card.locator(".activity-card-avatar")).toHaveAttribute("src", "/people/github-rafaelmedian.jpg")

  // Whole weeks, every one of them seven cells, including the half-weeks the
  // six-month window cuts at either end.
  const weeks = card.locator(".activity-card-week")
  const weekCount = await weeks.count()
  expect(weekCount).toBeGreaterThanOrEqual(26)
  await expect(card.locator(".activity-card-day")).toHaveCount(weekCount * 7)

  // "Contributions", not "commits": the graph counts pull requests, reviews,
  // and issues across every repository, so calling them commits would undercount
  // and mislabel at the same time.
  const grid = card.getByRole("img", { name: /^[\d,]+ contributions in the last six months$/ })
  await expect(grid).toBeVisible()
  await expect(card.locator(".activity-card-footer")).toHaveText(
    /^[\d,]+ contributions in the last six months$/,
  )

  // The card is exactly as wide as the grid it is built around, padding and all.
  // Measured after the entrance settles: the card arrives at scale(0.98), and
  // boundingBox() reports the transformed box, so a read taken mid-transition
  // is a fraction short of the width being asserted.
  await card.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const [cardBox, gridBox] = await Promise.all([card.boundingBox(), card.locator(".activity-card-grid").boundingBox()])
  expect(gridBox!.width).toBeCloseTo(weekCount * 10 - 2, 0)
  expect(cardBox!.width).toBeCloseTo(gridBox!.width + 26, 0)
  expect(gridBox!.x + gridBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width)
})

// The pill's hint was a line of grey type; it is a clip now, the same card the
// address wears. The month rides underneath it because that is the fact the
// hint exists to carry and a picture cannot say "October".
test("hints at booking with a clip over the availability month", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-08-18T12:00:00Z"))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await settleAvatarIntro(page)

  const bookButton = page.locator(".mosaic-booking-pill")
  await bookButton.hover()

  const hint = page.locator(".reaction-card")
  await expect(hint).toBeVisible()
  await expect(hint.locator(".reaction-card-media img")).toHaveAttribute(
    "src",
    "/reactions/booking-reaction.webp",
  )
  // The card is a picture and nothing else -- no words at all in the hint.
  await expect(hint).toHaveText("")
  // Which is why the month has to survive somewhere a screen reader reaches:
  // once in the pill's own name, once in its description.
  await expect(bookButton).toHaveAccessibleDescription("Available in September · 30 minutes in my calendar")
  await expect(bookButton).toHaveAccessibleName("Book a call — Available in September")
})

// One recipe for both wearers: a card that is a clip is a card that is a clip,
// whether it is reporting a copy or offering a call.
test("gives the address and the booking pill the same reaction card", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await settleAvatarIntro(page)

  const readCard = async () => {
    const card = page.locator(".reaction-card")
    await expect(card).toBeVisible()
    return card.evaluate((element) => {
      const style = getComputedStyle(element)
      return { width: style.width, radius: style.borderRadius, padding: style.padding, shadow: style.boxShadow }
    })
  }

  await page.locator(".mosaic-social-corner .mosaic-profile-email").hover()
  const addressCard = await readCard()
  await page.mouse.move(1, 1)
  await expect(page.locator(".reaction-card")).toHaveCount(0)

  await page.locator(".mosaic-booking-pill").hover()
  const bookingCard = await readCard()

  expect(bookingCard).toEqual(addressCard)
  expect(addressCard.width).toBe("200px")
})

test("draws the contribution grid on GitHub's borrowed greens", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await settleAvatarIntro(page)

  await page.locator(".mosaic-last-updated").hover()
  const days = page.locator(".activity-card-day")
  await expect(days.first()).toBeVisible()

  const palette = await days.evaluateAll((cells) => {
    const byLevel: Record<string, string> = {}
    for (const cell of cells) {
      const level = cell.getAttribute("data-level") ?? "?"
      byLevel[level] ??= getComputedStyle(cell).backgroundColor
    }
    return byLevel
  })

  // Empty days are grey; every step above that is GitHub's own ramp, and the
  // days the calendar has not reached leave no mark at all.
  expect(palette["0"]).toBe("rgb(235, 237, 240)")
  expect(palette["1"]).toBe("rgb(155, 233, 168)")
  // The cells outside the six-month window keep the grid rectangular and draw
  // nothing, so a half-week never reads as a quiet week.
  expect(palette["outside"]).toBe("rgba(0, 0, 0, 0)")
  // The busier steps only appear when the history has them, so assert on
  // whichever of them this repository actually produced.
  for (const [level, expected] of [["2", "rgb(64, 196, 99)"], ["3", "rgb(48, 161, 78)"], ["4", "rgb(33, 110, 57)"]]) {
    if (palette[level]) expect(palette[level]).toBe(expected)
  }
})

test("keeps the location and address copy together at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")

  const place = page.locator(".mosaic-profile-location-place")
  const email = page.locator(".mosaic-profile-location .mosaic-profile-email")
  // Two of them at this width: the one before the "last updated" clause and the
  // one before the address that the corner hands back below 700px. The line
  // stacks here, so neither is drawn.
  const separators = page.locator(".mosaic-profile-location-separator")
  await expect(place).toHaveCSS("white-space", "nowrap")
  // The address never breaks mid-domain; it drops to its own line instead.
  await expect(email).toHaveCSS("white-space", "nowrap")
  await expect(separators).toHaveCount(2)
  for (const separator of await separators.all()) await expect(separator).toBeHidden()

  const [placeBox, emailBox] = await Promise.all([place.boundingBox(), email.boundingBox()])
  expect(placeBox).not.toBeNull()
  expect(emailBox).not.toBeNull()
  expect(emailBox!.y).toBeGreaterThan(placeBox!.y)
  expect(emailBox!.x).toBeGreaterThanOrEqual(0)
  expect(emailBox!.x + emailBox!.width).toBeLessThanOrEqual(320)
})

test("carries the availability month in the booking pill's hint and nowhere on the pill", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-08-18T12:00:00Z"))
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")
  await settleAvatarIntro(page)

  const bookButton = page.locator(".mosaic-booking-pill")
  await expect(bookButton).toHaveText("Book a call")

  // The month left the location line; the hint is where it lives now, and it is
  // also what retired the green status dot -- a glance-level signal for a fact
  // the hint spells out a beat later.
  await expect(bookButton.locator(".mosaic-availability-dot")).toHaveCount(0)
  await bookButton.hover()
  // The hint is a clip now, so the month it carries is spoken rather than drawn.
  await expect(page.locator(".reaction-card")).toBeVisible()
  await expect(bookButton).toHaveAccessibleDescription("Available in September · 30 minutes in my calendar")

  // With the dot gone the label is the pill's only content, so it has to sit on
  // the pill's own centre rather than off to one side of a vacated slot.
  const centring = await bookButton.evaluate((element) => {
    const label = element.querySelector(".mosaic-contact-pill-dark-label")
    if (!label) return null

    // Ranged over the glyphs rather than the label's own box: the label is a
    // flex item, so its box is the full line height and its centre would not
    // say where the text actually sits.
    const range = document.createRange()
    range.selectNodeContents(label)
    const textBox = range.getBoundingClientRect()
    const pillBox = element.getBoundingClientRect()

    return {
      textCenterX: textBox.x + textBox.width / 2,
      pillCenterX: pillBox.x + pillBox.width / 2,
    }
  })
  expect(centring).not.toBeNull()
  expect(Math.abs(centring!.textCenterX - centring!.pillCenterX)).toBeLessThanOrEqual(1)
})

// The dot was the site's one saturated pixel at rest, standing in for a month
// the pill's own hint names in full. Nothing on the page wears --accent now
// except the address's copy confirmation, which is gone again after 1.6s.
test("leaves no availability dot anywhere on the page", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator(".mosaic-profile-actions")).toBeVisible()

  await expect(page.locator(".mosaic-availability-dot")).toHaveCount(0)
})

test("hints at booking on hover and opens the calendar only on click", async ({ page }) => {
  let calendarRequests = 0
  await page.route("https://cal.com/**", (route) => {
    calendarRequests++
    return route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Cal</title>" })
  })
  await page.goto("/")
  // Same guard as the halo test: hover only after the reveal has settled.
  await settleAvatarIntro(page)
  const trigger = page.locator(".mosaic-booking-pill")
  await trigger.hover()
  const tooltip = page.locator(".reaction-card")
  await expect(tooltip).toBeVisible()
  await expect(trigger).toHaveAccessibleDescription(/^Available in \w+ · 30 minutes in my calendar$/)
  await expect(page.getByRole("dialog")).toHaveCount(0)
  expect(calendarRequests).toBe(0)
  await tooltip.hover()
  await expect(tooltip).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(tooltip).toBeHidden()
  await trigger.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(tooltip).toBeHidden()
  await expect(dialog.locator("iframe.booking-iframe")).toHaveAttribute("src", /embed=true/)
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

// Touch and keyboard have no hover to rest in, so the same line is a plain
// button for them. Focus alone must not open it: tabbing past the hero would
// otherwise trap the visitor in a calendar they never asked for.
// The dialog is the calendar and nothing else: no header, no close button, no
// second title over a page that already has one. What a header was carrying that
// still matters — the dialog's name, and the way out — had to go somewhere else.
test("frames the calendar without chrome and still says what it is", async ({ page }) => {
  await page.route("https://cal.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Cal</title>" }),
  )
  await page.goto("/")
  await settleAvatarIntro(page)
  await page.locator(".mosaic-booking-pill").click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(".booking-header")).toHaveCount(0)
  await expect(dialog.getByRole("button", { name: "Close booking calendar" })).toHaveCount(0)

  // Named and described for screen readers even with nothing drawn.
  await expect(dialog).toHaveAccessibleName("Book a call")
  await expect(dialog).toHaveAccessibleDescription(/^Available in \w+ · 30 minutes, on Cal\.com$/)
  // And neither is painted: sr-only text is in the accessibility tree and out of
  // the layout, so the title's box collapses to nothing over the calendar.
  const titleBox = await dialog.getByText("Book a call", { exact: true }).boundingBox()
  expect(titleBox!.width).toBeLessThanOrEqual(1)
  expect(titleBox!.height).toBeLessThanOrEqual(1)

  // Escape is not the only way out, which matters on a phone with no Escape key.
  await page.mouse.click(5, 5)
  await expect(dialog).toBeHidden()
})

// A blocked third-party frame never fires onError, so the only signal that the
// calendar is not coming is that it has not come. The link the header used to
// hold from the start now waits for that moment.
test("offers cal.com directly when the embedded calendar never loads", async ({ page }) => {
  // Never resolves: the frame stays blank exactly the way a blocked one does.
  await page.route("https://cal.com/**", () => {})
  await page.clock.install()
  await page.goto("/")
  await settleAvatarIntro(page)
  await page.locator(".mosaic-booking-pill").click()

  const status = page.getByRole("dialog").locator(".booking-loading")
  await expect(status).toHaveText("Loading calendar…")
  await expect(status.getByRole("link")).toHaveCount(0)

  await page.clock.fastForward(6_000)
  await expect(status).toContainText("The calendar didn\u2019t load.")
  const escape = status.getByRole("link", { name: "Open it on cal.com" })
  await expect(escape).toHaveAttribute("href", "https://cal.com/rafaelmedian/30min")
  await expect(escape).toHaveAttribute("target", "_blank")
})

test("opens the booking calendar from a press, and never from focus alone", async ({ page }) => {
  await page.route("https://cal.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Cal</title>" }),
  )
  await page.goto("/")

  // The hero is `visibility: hidden` until the avatar intro reveals it, and a
  // hidden button cannot take focus.
  const trigger = page.locator(".mosaic-booking-pill")
  await expect(trigger).toBeVisible()
  await trigger.focus()
  await expect(trigger).toBeFocused()
  await page.waitForTimeout(600)
  await expect(page.getByRole("dialog")).toHaveCount(0)

  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog")).toBeVisible()
})

test("keeps the whole location line gray at rest", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  // Both clauses read as one sentence until pointed at -- the repository link
  // included, which is why it inherits its colour rather than taking a link's.
  await expect(page.locator(".mosaic-profile-location-place")).toHaveCSS("color", "rgb(107, 107, 107)")
  await expect(page.locator(".mosaic-last-updated")).toHaveCSS("color", "rgb(107, 107, 107)")
  await expect(page.locator(".mosaic-last-updated")).toHaveCSS("text-decoration-line", "none")
})

test("keeps the corner address gray and uncarded at rest", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  // The address is a button, but it reads as plain corner text until it is
  // pointed at: no card behind it, the same ink the clock used to carry.
  const email = page.locator(".mosaic-social-corner .mosaic-profile-email")
  // The rail's type, not the hero sentence's: --text-sm on --muted-soft, the
  // same as the section links at the other end of the corner.
  await expect(email).toHaveCSS("color", "rgb(117, 117, 117)")
  await expect(email).toHaveCSS("font-size", "14px")
  await expect(email).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  const link = page.locator(".mosaic-section-corner .mosaic-social-link").first()
  await expect(link).toHaveCSS("font-size", await email.evaluate((el) => getComputedStyle(el).fontSize))
})

test("places the resume link beside about in the section navigation", async ({ page }) => {
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  const about = navigation.getByRole("link", { name: "About", exact: true })
  const resume = navigation.getByRole("link", { name: "Resume", exact: true })
  await expect(navigation.getByRole("link")).toHaveCount(2)
  await expect(about).toBeVisible()
  await expect(resume).toBeVisible()

  const aboutBox = await about.boundingBox()
  const resumeBox = await resume.boundingBox()
  expect(aboutBox).not.toBeNull()
  expect(resumeBox).not.toBeNull()
  expect(resumeBox!.x).toBeGreaterThanOrEqual(aboutBox!.x + aboutBox!.width)
})

test("keeps the section links compact with the hero tooltip-link corners", async ({ page }) => {
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  const links = navigation.getByRole("link")

  await expect(links).toHaveCount(2)
  for (const link of await links.all()) {
    await expect(link).toHaveCSS("min-height", "32px")
    await expect(link).toHaveCSS("border-radius", "8px")
  }
})

test("preserves the section links' vertical hit area", async ({ page }) => {
  await page.goto("/")

  const about = page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "About", exact: true })
  const hitAreaHeight = await about.evaluate((link) => getComputedStyle(link, "::before").height)

  expect(hitAreaHeight).toBe("40px")
})

test("places the external-link icon after the resume label", async ({ page }) => {
  await page.goto("/")

  const resume = page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })
  const iconBox = await resume.locator(".mosaic-social-link-external-icon").boundingBox()
  const labelBox = await resume.evaluate((link) => {
    const labelNode = Array.from(link.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
    if (!labelNode) return null

    const range = document.createRange()
    range.selectNode(labelNode)
    return range.getBoundingClientRect().toJSON()
  })

  expect(iconBox).not.toBeNull()
  expect(labelBox).not.toBeNull()
  expect(iconBox!.x).toBeGreaterThan(labelBox!.x + labelBox!.width)
})

test("reveals an external-link icon when the resume link is hovered", async ({ page }) => {
  await page.goto("/")

  const resume = page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })
  const externalIcon = resume.locator(".mosaic-social-link-external-icon")

  await expect(externalIcon).toHaveCSS("opacity", "0")
  await resume.hover()
  await expect(externalIcon).toHaveCSS("opacity", "1")
})

test("matches the resume preview to the local-time map and opens on the top of the page", async ({ page }) => {
  await page.goto("/")

  await page.locator(".mosaic-resume-anchor").hover()
  const frame = page.locator(".mosaic-resume-card-frame")
  await expect(frame).toBeVisible()

  // The two cards hang off the same corner rail and should read as one
  // component with two contents.
  await page.locator(".mosaic-social-time").hover()
  const mapHeight = await page.locator(".mosaic-about-local-time .mosaic-local-time-map").evaluate((map) => map.clientHeight)

  await page.locator(".mosaic-resume-anchor").hover()
  const geometry = await frame.evaluate((element) => ({
    height: element.clientHeight,
    scrollHeight: element.scrollHeight,
    scrollTop: element.scrollTop,
  }))
  expect(geometry.height).toBe(mapHeight)
  // A window onto the page, not the whole page — and it opens at the masthead.
  expect(geometry.scrollHeight).toBeGreaterThan(geometry.height)
  expect(geometry.scrollTop).toBe(0)
})

test("pans the resume preview slowly under the wheel and hands the page back at the end", async ({ page }) => {
  await page.goto("/")
  // This test reads window.scrollY, so the hover has to wait out the reveal:
  // hovering an element the intro is still moving makes Playwright scroll it
  // into view first, and the page lands 20-40px down before a wheel is sent.
  await settleAvatarIntro(page)
  await page.locator(".mosaic-resume-anchor").hover()

  const frame = page.locator(".mosaic-resume-card-frame")
  const box = await frame.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)

  const travel = await frame.evaluate((element) => element.scrollHeight - element.clientHeight)

  // Damped: one gesture moves the résumé a fraction of its own delta, so the
  // middle of the page is reachable rather than skipped over.
  await page.mouse.wheel(0, 300)
  await page.waitForTimeout(150)
  const afterOneGesture = await frame.evaluate((element) => element.scrollTop)
  expect(afterOneGesture).toBeGreaterThan(0)
  expect(afterOneGesture).toBeLessThan(300)
  // And the document stayed put while the résumé had somewhere to go.
  expect(await page.evaluate(() => window.scrollY)).toBe(0)

  // Run it to the bottom, then keep going: the page has to take over, or the
  // pointer would be parked on a card that swallows every gesture.
  for (let gesture = 0; gesture < 12; gesture += 1) await page.mouse.wheel(0, 300)
  await page.waitForTimeout(200)
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  expect(travel).toBeGreaterThan(0)
})

test("damps the resume preview from the first gesture, before its image arrives", async ({ page }) => {
  // The frame is a real scroller, so until the damping listener is attached a
  // wheel runs it to the bottom at full delta and chains the rest into the
  // page. Hold the image back to open that window on purpose: the listener has
  // to be waiting on the frame, not on the picture inside it.
  await page.route("**/rafael-medina-resume-preview.png", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 4000))
    await route.continue()
  })
  await page.goto("/")
  // Same guard as the pan test above, and for the same reason: this one also
  // ends on window.scrollY, which an unsettled hover moves before the wheel.
  await settleAvatarIntro(page)
  await page.locator(".mosaic-resume-anchor").hover()

  const frame = page.locator(".mosaic-resume-card-frame")
  const box = await frame.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)

  await page.mouse.wheel(0, 300)
  await page.waitForTimeout(150)
  const panned = await frame.evaluate((element) => element.scrollTop)
  const travel = await frame.evaluate((element) => element.scrollHeight - element.clientHeight)
  // A quarter of the gesture, not the whole scroller.
  expect(panned).toBeGreaterThan(0)
  expect(panned).toBeLessThan(travel)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test("opens the resume from the preview without moving focus into the hidden card", async ({ context, page }) => {
  await page.goto("/")
  await page.locator(".mosaic-resume-anchor").hover()

  const frame = page.locator(".mosaic-resume-card-frame")
  const resumeHref = await page
    .getByRole("navigation", { name: "Sections" })
    .getByRole("link", { name: "Resume", exact: true })
    .getAttribute("href")

  // Same destination as the link it hangs off, in a new tab.
  await expect(frame).toHaveAttribute("href", resumeHref!)
  await expect(frame).toHaveAttribute("target", "_blank")
  // Out of the tab order: the card is aria-hidden, so the keyboard path is the
  // Resume link, not this.
  await expect(frame).toHaveAttribute("tabindex", "-1")

  const [opened] = await Promise.all([context.waitForEvent("page"), frame.click()])
  expect(opened).toBeTruthy()
  // mousedown's default is cancelled, so the click cannot focus an element
  // inside an aria-hidden subtree.
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("BODY")
})

test("gives about links comfortable mobile targets", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const links = page.locator("#about-section .mosaic-about-link")
  expect(await links.count()).toBeGreaterThan(0)
  for (const link of await links.all()) {
    const box = await link.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(40)
  }
})

test("stacks about before services without tab controls", async ({ page }) => {
  await page.goto("/")

  const about = page.locator("#about-section")
  const services = page.locator("#about-panel-services")
  await expect(page.getByRole("tablist")).toHaveCount(0)
  await expect(about.locator(".mosaic-about-lede")).toBeVisible()
  await expect(services.getByRole("heading", { name: "Services" })).toBeVisible()

  const order = await page.locator("#about-section, #about-panel-services").evaluateAll(([aboutNode, servicesNode]) => {
    const aboutRect = aboutNode.getBoundingClientRect()
    const servicesRect = servicesNode.getBoundingClientRect()
    return {
      followsAbout: Boolean(aboutNode.compareDocumentPosition(servicesNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      startsBelowAbout: servicesRect.top >= aboutRect.bottom,
    }
  })

  expect(order).toEqual({ followsAbout: true, startsBelowAbout: true })
})

test("left aligns the about introduction with the services reading axis", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  const alignment = await page.locator(".mosaic-about-section-copy, .mosaic-about-services-copy").evaluateAll(
    ([aboutCopy, servicesCopy]) => {
      const aboutRect = aboutCopy.getBoundingClientRect()
      const servicesRect = servicesCopy.getBoundingClientRect()
      const hobbies = aboutCopy.querySelector(".mosaic-about-hobbies")

      return {
        sharedLeftEdge: Math.round(aboutRect.left) === Math.round(servicesRect.left),
        aboutTextAlign: getComputedStyle(aboutCopy).textAlign,
        hobbiesJustification: hobbies ? getComputedStyle(hobbies).justifyContent : null,
      }
    },
  )

  expect(alignment).toEqual({
    sharedLeftEdge: true,
    aboutTextAlign: "left",
    hobbiesJustification: "flex-start",
  })
})

test("scrolls to and focuses the about section from the avatar button", async ({ page }) => {
  // Reduced motion makes the scroll instant, so the assertion isn't racing a
  // smooth-scroll animation.
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const trigger = page.locator(".mosaic-avatar-button")

  await expect(trigger).toHaveAccessibleName("Read about Rafael Medina")
  await trigger.focus()
  await trigger.press("Enter")

  const about = page.locator("#about-panel")
  await expect(about).toBeInViewport()
  await expect(about).toBeFocused()
  // The section is a landing container, not a control: it takes focus so
  // reading continues from there, and draws no ring. The browser's default one
  // boxes the whole sheet, which reads as a selection.
  await expect(about).toHaveCSS("outline-style", "none")
})

test("keeps every project group together inside the takeover stage", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  const groups = stage.locator(".mosaic-group")

  await expect(groups).toHaveCount(5)

  const gaps = await groups.evaluateAll((elements) =>
    elements.slice(1).map((element, index) => {
      const previousRect = elements[index].getBoundingClientRect()
      return Math.round(element.getBoundingClientRect().top - previousRect.bottom)
    }),
  )

  expect(gaps).toEqual([16, 16, 16, 16])
})

test("leaves a generous white runway after the final project group before the about takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))

  const endSpacing = await stage.evaluate((element) => {
    const lastGroup = element.querySelector(".mosaic-group:last-child")
    if (!lastGroup) return null

    return Math.round(element.getBoundingClientRect().bottom - lastGroup.getBoundingClientRect().bottom)
  })

  expect(endSpacing).toBeGreaterThanOrEqual(250)
})

test("pins the complete project grid when its bottom reaches the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))

  const placement = await stage.evaluate((element) => {
    const aboutNode = document.querySelector("#about-panel")
    if (!aboutNode) return null
    const stageRect = element.getBoundingClientRect()
    return {
      stageBottom: Math.round(stageRect.bottom),
      stagePosition: getComputedStyle(element).position,
      aboutTop: Math.round(aboutNode.getBoundingClientRect().top),
    }
  })

  expect(placement).toEqual({
    stageBottom: 913,
    stagePosition: "sticky",
    aboutTop: 913,
  })
})

test("scrolls the about surface over the pinned project grid", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")
  // During the portrait intro the page is deliberately not hit-testable.
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight / 2)))

  const placement = await stage.evaluate((element) => {
    const aboutNode = document.querySelector("#about-panel")
    if (!aboutNode) return null
    const stageRect = element.getBoundingClientRect()
    const aboutRect = aboutNode.getBoundingClientRect()
    const topmostNode = document.elementFromPoint(aboutRect.left + aboutRect.width / 2, aboutRect.top + 24)
    return {
      stageBottom: Math.round(stageRect.bottom),
      aboutTop: Math.round(aboutRect.top),
      aboutOwnsCoveredArea: Boolean(topmostNode?.closest("#about-panel")),
    }
  })

  expect(placement).toEqual({ stageBottom: 913, aboutTop: 456, aboutOwnsCoveredArea: true })
})

test("reuses the hover-card shadow for the about takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const runway = page.locator(".mosaic-takeover-runway")
  const hoverCard = page.locator(".mosaic-linkedin-card")

  const [aboutShadow, hoverCardShadow] = await Promise.all([
    runway.evaluate((element) => getComputedStyle(element, "::after").boxShadow),
    hoverCard.evaluate((element) => getComputedStyle(element).boxShadow),
  ])

  expect(aboutShadow).toBe(hoverCardShadow)
})

/**
 * Parks the About sheet's top edge a given fraction of the way up the viewport,
 * which is also its progress through the takeover: the crossing is exactly one
 * viewport of scrolling, so 0 is the seam arriving at the bottom and 1 is the
 * seam leaving at the top.
 */
// Chrome quantises scroll offsets to 1/64px, so an exact delta can overshoot the
// seam by a hundredth of a pixel -- enough to flip the strict `bounds.top <
// innerHeight * 0.3` comparison the takeover close reads. Flooring stops the
// seam a fraction short of the requested fraction rather than a fraction past
// it, so `scrollSeamTo(0.7)` means "not yet 70%" no matter where the page's
// layout happens to leave the fractional part.
async function scrollSeamTo(page: Page, fraction: number) {
  await page.evaluate((target) => {
    const about = document.querySelector("#about-panel")
    if (!about) throw new Error("about panel missing")
    window.scrollBy(0, Math.floor(about.getBoundingClientRect().top - window.innerHeight * (1 - target)))
  }, fraction)
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )
}

function readArmAngle(page: Page, side: "left" | "right") {
  return page.locator(`.mosaic-takeover-cue-arm-${side}`).evaluate((element) => {
    const matrix = getComputedStyle(element).transform.match(/matrix\(([^,]+),\s*([^,]+)/)
    if (!matrix) return null
    return (
      Math.round(Math.atan2(Number.parseFloat(matrix[2]), Number.parseFloat(matrix[1])) * (180 / Math.PI) * 10) / 10
    )
  })
}

test("reveals the takeover close only after the sheet passes 70%", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const close = page.locator(".mosaic-takeover-close")
  await page.locator(".mosaic-takeover-stage").evaluate((element) => element.scrollIntoView({ block: "end" }))

  await scrollSeamTo(page, 0.7)
  await expect(close).toHaveCount(1)
  await expect(close).toHaveAttribute("data-visible", "false")

  await scrollSeamTo(page, 0.71)
  await expect(close).toHaveAttribute("data-visible", "true")

  await scrollSeamTo(page, 0.69)
  await expect(close).toHaveAttribute("data-visible", "false")
})

test("keeps the takeover close wrapper at the compact design-system size", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const size = await page.locator(".mosaic-takeover-close").evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      width: Number.parseFloat(styles.width),
      height: Number.parseFloat(styles.height),
    }
  })

  expect(size.width).toBeCloseTo(51.2, 0)
  expect(size.height).toBeCloseTo(51.2, 0)
})

test("returns to the top of the page from the takeover close", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await page.locator(".mosaic-takeover-stage").evaluate((element) => element.scrollIntoView({ block: "end" }))
  await scrollSeamTo(page, 0.71)
  await page.getByRole("button", { name: "Close about" }).click()

  await expect.poll(() => page.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    focusedId: document.activeElement?.id,
  }))).toEqual({
    scrollY: 0,
    focusedId: "portfolio-title",
  })
})

test("keeps preview playback paused until the close return settles", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const video = page.locator(".mosaic-row-card video.mosaic-row-media").first()
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true)

  await page.locator(".mosaic-takeover-stage").evaluate((element) => element.scrollIntoView({ block: "end" }))
  await scrollSeamTo(page, 0.71)
  await video.evaluate((element) => {
    const probeWindow = window as Window & { __previewPlayedBeforeCloseSettled?: boolean }
    probeWindow.__previewPlayedBeforeCloseSettled = false
    element.addEventListener(
      "play",
      () => {
        probeWindow.__previewPlayedBeforeCloseSettled = window.scrollY > 0
      },
      { once: true },
    )
  })
  await page.getByRole("button", { name: "Close about" }).click()

  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0)
  expect(
    await page.evaluate(
      () => (window as Window & { __previewPlayedBeforeCloseSettled?: boolean }).__previewPlayedBeforeCloseSettled,
    ),
  ).toBe(false)
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true)
})

test("squeezes the takeover cue flat as the about sheet climbs", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const cue = page.locator(".mosaic-takeover-cue")
  const chevron = page.locator(".mosaic-takeover-cue-chevron")
  await page.locator(".mosaic-takeover-stage").evaluate((element) => element.scrollIntoView({ block: "end" }))

  await scrollSeamTo(page, 0.05)
  const opening = {
    left: await readArmAngle(page, "left"),
    right: await readArmAngle(page, "right"),
    opacity: Number.parseFloat(await chevron.evaluate((element) => getComputedStyle(element).opacity)),
    // The cue rides above the seam, never over the sheet it is pointing at.
    aboveSeam: await cue.evaluate((element) => {
      const about = document.querySelector("#about-panel")
      return about ? element.getBoundingClientRect().bottom <= about.getBoundingClientRect().top : null
    }),
  }

  await scrollSeamTo(page, 0.45)
  const middle = {
    left: await readArmAngle(page, "left"),
    right: await readArmAngle(page, "right"),
    opacity: Number.parseFloat(await chevron.evaluate((element) => getComputedStyle(element).opacity)),
  }

  await scrollSeamTo(page, 0.95)
  const closing = {
    left: await readArmAngle(page, "left"),
    right: await readArmAngle(page, "right"),
    opacity: Number.parseFloat(await chevron.evaluate((element) => getComputedStyle(element).opacity)),
  }

  // A chevron on the way in, mirrored across the joint the two arms share.
  expect(opening.left).toBe(22)
  expect(opening.right).toBe(-22)
  expect(opening.opacity).toBeGreaterThan(0)
  expect(opening.aboveSeam).toBe(true)

  expect(middle.left).toBeLessThan(opening.left as number)
  expect(middle.right).toBeGreaterThan(opening.right as number)
  // On `difference` the opacity is the contrast dial, not a fade, so it tops
  // out at the cue's resting 0.32 rather than at 1.
  expect(middle.opacity).toBe(0.32)

  // Flat, and gone, before the seam reaches the top of the viewport.
  expect(closing.left).toBe(0)
  expect(closing.right).toBe(0)
  expect(closing.opacity).toBe(0)
})

test("runs every takeover seam layer edge to edge with the sheet", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const edges = await page.locator(".mosaic-takeover-runway").evaluate((element) => {
    const rect = element.getBoundingClientRect()
    // `left: 50%` resolves against the runway's padding box, so a pseudo-element's
    // own span is its centre plus its negative margin, plus its width.
    const span = (pseudo: string) => {
      const styles = getComputedStyle(element, pseudo)
      const left = rect.left + rect.width / 2 + Number.parseFloat(styles.marginLeft)
      return [Math.round(left), Math.round(left + Number.parseFloat(styles.width))]
    }
    const cue = document.querySelector(".mosaic-takeover-cue")?.getBoundingClientRect()
    const sheet = document.querySelector(".mosaic-about")?.getBoundingClientRect()

    return {
      viewport: window.innerWidth,
      overflows: document.documentElement.scrollWidth > window.innerWidth,
      runway: [Math.round(rect.left), Math.round(rect.right)],
      cast: span("::before"),
      hairline: span("::after"),
      cue: cue ? [Math.round(cue.left), Math.round(cue.right)] : null,
      sheet: sheet ? [Math.round(sheet.left), Math.round(sheet.right)] : null,
    }
  })

  const bleed = [0, edges.viewport]

  // The runway itself stops at the 1560px reading measure. The layers marking
  // the sheet's top edge have to break out of it, or they end short of the
  // edges the white surface reaches.
  expect(edges.runway[0]).toBeGreaterThan(0)
  expect(edges.cast).toEqual(bleed)
  expect(edges.hairline).toEqual(bleed)
  expect(edges.sheet).toEqual(bleed)
  expect(edges.overflows).toBe(false)

  // The cue is the exception: it is a mark on the seam, not a layer of it, and
  // its box is the group Chrome composites to blend. Centred on the viewport,
  // and no wider than the chevron needs.
  expect(edges.cue).not.toBeNull()
  const [cueLeft, cueRight] = edges.cue as number[]
  expect(cueRight - cueLeft).toBeLessThanOrEqual(48)
  expect(Math.round((cueLeft + cueRight) / 2)).toBe(Math.round(edges.viewport / 2))
})

test("deepens the seam's ambient cast across the takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const runway = page.locator(".mosaic-takeover-runway")
  const readCast = () =>
    runway.evaluate((element) => {
      const cast = getComputedStyle(element, "::before")
      return { opacity: Number.parseFloat(cast.opacity), height: cast.height, image: cast.backgroundImage }
    })

  await page.locator(".mosaic-takeover-stage").evaluate((element) => element.scrollIntoView({ block: "end" }))

  await scrollSeamTo(page, 0.05)
  const arriving = await readCast()
  await scrollSeamTo(page, 0.95)
  const seated = await readCast()

  // The hover-card shadow on ::after only spills ~20px past the hairline, so
  // the penumbra is a separate gradient layer that ramps as the sheet climbs.
  expect(arriving.height).toBe("120px")
  expect(arriving.image).toContain("linear-gradient")
  expect(arriving.opacity).toBeLessThan(0.5)
  expect(seated.opacity).toBeGreaterThan(0.9)
})

test("rests the takeover cue as a plain chevron under reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await page.locator(".mosaic-takeover-stage").evaluate((element) => element.scrollIntoView({ block: "end" }))
  await scrollSeamTo(page, 0.45)

  await expect(page.locator(".mosaic-takeover-cue-chevron")).toHaveCSS("opacity", "0.32")
  expect(await readArmAngle(page, "left")).toBe(22)
  expect(await readArmAngle(page, "right")).toBe(-22)
})

test("draws the takeover cue as the inverse of whatever it crosses", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const cue = page.locator(".mosaic-takeover-cue")
  const chevron = page.locator(".mosaic-takeover-cue-chevron")

  // White on `difference` is what makes the chevron read dark over the pale
  // cards and light over the dark ones. A fixed ink cannot do both.
  await expect(chevron).toHaveCSS("mix-blend-mode", "difference")
  await expect(chevron).toHaveCSS("color", "rgb(255, 255, 255)")
  await expect(cue.locator(".mosaic-takeover-cue-arm").first()).toHaveCSS("box-shadow", "none")

  // The button around it must stay out of the way of the blend: an `opacity`
  // or a `z-index` here would make it a stacking context, isolating the group
  // and leaving the chevron inverting transparency to plain white.
  await expect(cue).toHaveCSS("opacity", "1")
  await expect(cue).toHaveCSS("z-index", "auto")
  await expect(cue).toHaveCSS("mix-blend-mode", "normal")

  // And the blend needs a backdrop inside `main`'s stacking context. App's
  // wrapper paints the same white, but from outside it — drop the runway's own
  // background and the chevron inverts transparency to plain white over the
  // runway, which is where it spends most of the crossing.
  await expect(page.locator("main")).toHaveCSS("z-index", "10")
  await expect(page.locator(".mosaic-takeover-runway")).toHaveCSS("background-color", "rgb(255, 255, 255)")
})

test("finishes the takeover when the cue is tapped", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  // Reduced motion makes the scroll instant, so the assertion isn't racing a
  // smooth-scroll animation.
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const cue = page.getByRole("button", { name: "Continue to About" })
  await page.locator(".mosaic-takeover-stage").evaluate((element) => element.scrollIntoView({ block: "end" }))
  await scrollSeamTo(page, 0.3)

  // Mid-crossing: the sheet is well short of covering the viewport.
  const about = page.locator("#about-panel")
  expect(await about.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeGreaterThan(100)

  // A real tap on the rendered pixels, not a synthetic dispatch — the point is
  // that the 44px target is actually reachable where the chevron is drawn.
  await cue.click()

  // Within half a pixel of the top: the settle lands on a subpixel offset that
  // Math.round can report as -0, which Object.is separates from 0.
  expect(await about.evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
  await expect(about).toBeFocused()
})

test("gives the takeover cue a full tap target and its own name", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const cue = page.locator(".mosaic-takeover-cue")
  const box = await cue.boundingBox()

  expect(box).not.toBeNull()
  expect(box!.width).toBeGreaterThanOrEqual(44)
  expect(box!.height).toBeGreaterThanOrEqual(44)

  // It sits above the seam, clear of the sheet it points at.
  const seam = await page.locator("#about-panel").evaluate((element) => element.getBoundingClientRect().top)
  const cueBottom = await cue.evaluate((element) => element.getBoundingClientRect().bottom)
  expect(cueBottom).toBeLessThanOrEqual(seam)

  // Distinct from the avatar, which scrolls to the same place: two buttons
  // reading "Read about Rafael Medina" would be ambiguous in a rotor list.
  await expect(cue).toHaveAccessibleName("Continue to About")
  await expect(page.getByRole("button", { name: "Read about Rafael Medina" })).toHaveCount(1)
})

test("drops the takeover cue below the breakpoint that pins the gallery", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  await expect(page.locator(".mosaic-takeover-cue")).toHaveCSS("display", "none")
})

test("retreats the complete project grid as one surface during takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight / 2)))
  await page.evaluate(() => new Promise(requestAnimationFrame))

  const retreat = await stage.evaluate((element) => {
    const styles = getComputedStyle(element)
    return { opacity: Number.parseFloat(styles.opacity), transform: styles.transform }
  })
  const card = stage.locator(".mosaic-row-card").first()

  await expect(stage).not.toHaveCSS("filter", "none")
  expect(retreat.opacity).toBeLessThan(0.95)
  expect(retreat.transform).not.toBe("none")
  await expect(card).toHaveCSS("opacity", "1")
  await expect(card).toHaveCSS("transform", "none")
})

test("releases the project grid compositor layer after the takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, window.innerHeight + 80))
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )

  await expect(stage).toHaveCSS("opacity", "1")
  await expect(stage).toHaveCSS("transform", "none")
})

test("keeps the takeover cover but removes retreat motion for reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight / 2)))

  const stageBottom = await stage.evaluate((element) => Math.round(element.getBoundingClientRect().bottom))
  const aboutTop = await page.locator("#about-panel").evaluate((element) =>
    Math.round(element.getBoundingClientRect().top),
  )

  expect(stageBottom).toBe(913)
  expect(aboutTop).toBe(456)
  await expect(stage).toHaveCSS("opacity", "1")
  await expect(stage).toHaveCSS("transform", "none")
})

test("releases the about sheet into normal document scrolling after takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 700 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  const about = page.locator("#about-panel")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, window.innerHeight))

  const beforeTop = await about.evaluate((element) => element.getBoundingClientRect().top)
  await page.evaluate(() => window.scrollBy(0, 80))

  const placement = await about.evaluate(
    (element, initialTop) => ({
      position: getComputedStyle(element).position,
      distanceMoved: Math.round(initialTop - element.getBoundingClientRect().top),
    }),
    beforeTop,
  )

  expect(placement).toEqual({ position: "relative", distanceMoved: 80 })
})

test("raises each about copy block into view the first time it scrolls in", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  // Below the fold the copy holds transparent. The prerendered markup ships
  // the attribute empty, so nothing is hidden without JavaScript.
  const intro = page.locator(".mosaic-about-section-copy")
  const questions = page.locator(".mosaic-about-faq .mosaic-about-section-heading")
  await expect(intro).toHaveAttribute("data-about-fade", "pending")
  await expect(questions).toHaveAttribute("data-about-fade", "pending")

  await page.locator("#about-panel").evaluate((element) => element.scrollIntoView({ block: "start" }))
  await expect(intro).toHaveAttribute("data-about-fade", "in")
  await expect(intro).toHaveCSS("opacity", "1")
  // Deeper blocks wait for their own approach rather than following the intro.
  await expect(questions).toHaveAttribute("data-about-fade", "pending")

  await questions.scrollIntoViewIfNeeded()
  await expect(questions).toHaveAttribute("data-about-fade", "in")
  await expect(questions).toHaveCSS("opacity", "1")

  // Services closes the sheet below its questions, so run to the end of the
  // page before claiming nothing is left waiting.
  const closing = page.locator("#about-panel-services .mosaic-about-closing")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(closing).toHaveAttribute("data-about-fade", "in")

  // The jump skipped every block between the intro and the pricing line; none
  // of them may be left transparent above the viewport.
  await expect(page.locator('[data-about-fade="pending"]')).toHaveCount(0)

  // Within the batch, on-screen blocks cascade top-down but the first starts
  // immediately — a jump never lands on a blank page waiting its turn.
  const visibleDelays = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-about-fade="in"]')]
      .filter((block) => {
        const rect = block.getBoundingClientRect()
        return rect.bottom > 0 && rect.top < window.innerHeight
      })
      .map((block) => block.style.getPropertyValue("--about-fade-delay")),
  )
  expect(visibleDelays).toContain("0ms")
  expect(new Set(visibleDelays).size).toBeGreaterThan(1)
})

test("keeps the about copy visible without an entrance under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const intro = page.locator(".mosaic-about-section-copy")
  await expect(intro).toHaveAttribute("data-about-fade", "")
  await expect(intro).toHaveCSS("opacity", "1")
})

test("keeps viewed about copy visible when reduced motion is disabled", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const intro = page.locator(".mosaic-about-section-copy")
  await expect(intro).toHaveAttribute("data-about-fade", "pending")

  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(intro).toHaveCSS("opacity", "1")
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  }))

  await intro.scrollIntoViewIfNeeded()
  await expect(intro).toBeInViewport()
  await expect(intro).toHaveAttribute("data-about-fade", "pending")

  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect(intro).toHaveCSS("opacity", "1")
})

test("rests preview videos while the about sheet covers the grid", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const videos = page.locator(".mosaic-row-card video.mosaic-row-media")
  await expect.poll(() => videos.first().evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true)

  await page.locator("#about-panel").evaluate((element) => element.scrollIntoView({ block: "start" }))
  await page.evaluate(() => window.scrollBy(0, 80))

  await expect.poll(() =>
    videos.evaluateAll((elements) => elements.every((video) => (video as HTMLVideoElement).paused)),
  ).toBe(true)

  // Scrolling back reveals the grid again and the loops resume.
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(() => videos.first().evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true)
})

test("uses normal-flow project and about sections on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  const placement = await page.locator("#work, #about-panel").evaluateAll(([workNode, aboutNode]) => ({
    overlap: Math.round(workNode.getBoundingClientRect().bottom - aboutNode.getBoundingClientRect().top),
    hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))

  await expect(stage).toHaveCSS("display", "contents")
  expect(placement).toEqual({ overlap: 0, hasHorizontalOverflow: false })
})

test("uses a full-bleed white viewport surface for about on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const surface = await page.locator("#about-panel").evaluate((element) => {
    const panel = element.querySelector(".mosaic-about-panel")
    if (!panel) return null
    const rect = element.getBoundingClientRect()
    const panelStyles = getComputedStyle(panel)
    return {
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      minHeight: Math.round(Number.parseFloat(panelStyles.minHeight)),
      radius: panelStyles.borderRadius,
      borderWidth: panelStyles.borderTopWidth,
      background: panelStyles.backgroundColor,
    }
  })

  expect(surface).toEqual({
    left: 0,
    width: 1728,
    minHeight: 913,
    radius: "0px",
    borderWidth: "0px",
    background: "rgb(255, 255, 255)",
  })
})

test("matches the selected-work bottom padding to the card spacing on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const spacing = await page.locator("#selected-work-previews").evaluate((element) => {
    const styles = getComputedStyle(element)
    return { bottomPadding: styles.paddingBottom, cardGap: styles.rowGap }
  })

  expect(spacing).toEqual({ bottomPadding: "16px", cardGap: "16px" })
})

test("shows every project immediately on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const cards = page.locator("a.mosaic-row-card")
  // The résumé tile is a link among the twelve projects.
  await expect(cards).toHaveCount(13)
  await expect(cards.first()).toBeVisible()
  await expect(cards.last()).toBeVisible()
  await expect(page.getByRole("button", { name: /View \d+ more projects/ })).toHaveCount(0)
})

test("loads each preview video only when it reaches the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 })
  await page.goto("/")

  const videos = page.locator(".mosaic-row-card video.mosaic-row-media")
  const visibleVideo = videos.first()
  const secondVisibleVideo = videos.nth(1)
  const offscreenVideo = videos.nth(2)

  await expect(visibleVideo).toHaveAttribute("src", "/Projects/shot-small-9.webm")
  await expect(secondVisibleVideo).toHaveAttribute("src", "/Projects/shot-small-16.webm")
  expect(await offscreenVideo.evaluate((video) => video.getBoundingClientRect().top)).toBeGreaterThanOrEqual(780)
  await expect(offscreenVideo).not.toHaveAttribute("src", /\S+/)
  await expect(offscreenVideo).toHaveAttribute("preload", "none")

  await offscreenVideo.scrollIntoViewIfNeeded()
  await expect(offscreenVideo).toHaveAttribute("src", "/Projects/shot-small-20.webm")
  await expect(offscreenVideo).toHaveAttribute("preload", "metadata")
})

test("keeps the selected work label out of the visual layout", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const heading = page.getByRole("heading", { name: "Selected work" })
  await expect(heading).toHaveText("Selected work")
  await expect(heading).toHaveClass("sr-only")
})

test("uses eight pixel mobile gutters and opens with two columns", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await settleAvatarIntro(page)

  const [walletBox, homepageBox] = await Promise.all([
    page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).boundingBox(),
    page.getByRole("link", { name: /Open Matcha homepage/ }).boundingBox(),
  ])
  expect(walletBox).not.toBeNull()
  expect(homepageBox).not.toBeNull()
  expect(walletBox!.x).toBe(8)
  expect(homepageBox!.x + homepageBox!.width).toBe(mobileViewport.width - 8)
  expect(walletBox!.y).toBeCloseTo(homepageBox!.y, 0)
  expect(homepageBox!.x).toBeGreaterThan(walletBox!.x + walletBox!.width)
})

test("places the quote slider in the portrait group with Protector", async ({ page }) => {
  await page.goto("/")

  const protectorCard = page.getByRole("link", { name: /Open Protector/ })
  const group = page.locator(".mosaic-group").filter({ has: protectorCard })

  await expect(group.locator(".mosaic-quote")).toHaveCount(1)
  await expect(page.getByRole("link", { name: /Open Matcha dark mode/ })).toHaveCount(0)
})

test("opens the resume reader from the folded tile and returns focus on close", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")

  const protectorCard = page.getByRole("link", { name: /Open Protector/ })
  const row = page.locator(".mosaic-group").filter({ has: protectorCard })
  const resume = row.getByRole("link", { name: "Open résumé" })

  await expect(row.locator(".mosaic-row-item")).toHaveCount(6)
  await expect(row.getByRole("button", { name: "Personal life", exact: true })).toBeVisible()
  await expect(row.locator(".mosaic-tile-resume .resume-tile")).toHaveCount(1)
  // The reader has a page of its own, so the tile is the link to it rather than
  // a button: a modified click still opens the résumé in a new tab.
  await expect(resume).toHaveAttribute("href", "/resume/")
  await expect(resume.locator(".resume-tile-sheet")).toHaveCSS("background-color", "rgb(255, 255, 255)")
  await expect(resume.locator(".resume-tile-fold")).toHaveCount(1)
  await expect(resume.locator(".resume-tile-copy")).toContainText("Stealth fintech")
  await expect(resume.locator(".resume-tile-copy")).toContainText("2026 - Present")

  await resume.click()
  const dialog = page.getByRole("dialog", { name: "Work history" })
  await expect(dialog).toBeVisible()
  await expect(page).toHaveURL(/\/resume\/$/)
  await expect(page).toHaveTitle("Résumé — Rafael Medina")
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
  await expect(resume).toBeFocused()
})

// The CV sheet is a tile on the grid, so the reader it opens is a slide of the
// same gallery the projects open in: arrowing off the résumé lands on the tile
// beside it, and arrowing back returns to the résumé rather than to the grid.
test("pages between the resume reader and its neighbouring projects", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveAccessibleName("Work history")

  // Protector follows the résumé in the portraits group.
  await page.keyboard.press("ArrowRight")
  await expect(dialog).toHaveAccessibleName("Protector booking")
  await expect(page).toHaveURL(/\/work\/protector-booking\/$/)

  await page.keyboard.press("ArrowLeft")
  await expect(dialog).toHaveAccessibleName("Work history")
  await expect(page).toHaveURL(/\/resume\/$/)

  // And Popparazi sits above it on the other side.
  await page.keyboard.press("ArrowLeft")
  await expect(dialog).toHaveAccessibleName("Popparazi V1")
  await expect(page).toHaveURL(/\/work\/popparazi-v1\/$/)
})

test("opens a shared resume link straight into the gallery", async ({ page }) => {
  await page.goto("/resume/")

  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveAccessibleName("Work history")
  await expect(dialog.getByRole("list", { name: "Work history" })).toBeVisible()
})

// The reader used to be a modal of its own, narrower than the gallery card. As a
// slide it takes the card's width like every other slide, so paging on to a
// project does not resize the sheet under the reader. Measured with offsetWidth
// rather than the box, because the paging transition scales the card.
test("gives the resume slide the same width as a project slide", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/resume/")

  const dialog = page.getByRole("dialog")
  const card = dialog.locator(".preview-gallery-card")
  const resumeWidth = await card.evaluate((element: HTMLElement) => element.offsetWidth)

  await page.keyboard.press("ArrowRight")
  await expect(dialog).toHaveAccessibleName("Protector booking")
  await expect.poll(() => card.evaluate((element: HTMLElement) => element.offsetWidth)).toBe(resumeWidth)
})

// The résumé slide is a document, not a picture. It is taller than the card that
// holds it, so the vertical arrows have to scroll it rather than page off it,
// and the keys only reach it because opening focuses the surface that scrolls.
// Give every key a fresh scroller. Resetting scrollTop between native keyboard
// scrolls can race Chrome's unfinished glide; two frames at zero do not prove
// the previous animation has ended, and CI lost the End scroll after PageDown.
for (const key of ["ArrowDown", "PageDown", "End"]) {
  test(`scrolls the resume slide with ${key} and pages with the horizontal pair`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/resume/")

    const card = page.getByRole("dialog").locator(".preview-gallery-card")
    await expect(card).toBeFocused()
    expect(await card.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true)

    await expect.poll(() => card.evaluate((element) => element.scrollTop)).toBe(0)
    await page.keyboard.press(key)
    await expect.poll(() => card.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
    await expect(page).toHaveURL(/\/resume\/$/)

    // The rail advertises only the pair that still pages here.
    const rail = page.locator(".preview-gallery-rail")
    await expect(rail.locator(".preview-gallery-nav-prev")).toHaveAttribute("aria-keyshortcuts", "ArrowLeft")
    await expect(rail.locator(".preview-gallery-nav-next")).toHaveAttribute("aria-keyshortcuts", "ArrowRight")

    await page.keyboard.press("ArrowRight")
    await expect(page).toHaveURL(/\/work\/protector-booking\/$/)
    // A preview has nothing to scroll, so both pairs page there.
    await expect(rail.locator(".preview-gallery-nav-prev")).toHaveAttribute("aria-keyshortcuts", "ArrowUp ArrowLeft")
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("dialog")).not.toHaveAccessibleName("Protector booking")
  })
}

test("scrolls the compact resume from the stationary toolbar", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/resume/")

  const dialog = page.getByRole("dialog")
  const card = dialog.locator(".preview-gallery-card")
  const next = dialog.getByRole("button", { name: "Next preview", exact: true })
  await next.focus()

  for (const key of ["ArrowDown", "PageDown", "End", "ArrowUp", "PageUp", "Home"]) {
    const upwards = ["ArrowUp", "PageUp", "Home"].includes(key)
    const before = await card.evaluate((element, up) => {
      element.scrollTop = up ? element.scrollHeight : 0
      return element.scrollTop
    }, upwards)
    await page.keyboard.press(key)
    if (upwards) {
      await expect.poll(() => card.evaluate((element) => element.scrollTop)).toBeLessThan(before)
    } else {
      await expect.poll(() => card.evaluate((element) => element.scrollTop)).toBeGreaterThan(before)
    }
    await expect(next).toBeFocused()
    await expect(page).toHaveURL(/\/resume\/$/)
  }

  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/work\/protector-booking\/$/)
  await page.keyboard.press("ArrowLeft")
  await expect(page).toHaveURL(/\/resume\/$/)
})

test("presents complete work history, education, and the resume PDF in the reader", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const dialog = page.getByRole("dialog", { name: "Work history" })
  const workHistory = dialog.getByRole("list", { name: "Work history" })
  const education = dialog.getByRole("list", { name: "Education" })

  // An entry whose description is a pair of points nests its own list, so the
  // jobs are the list's own children rather than every listitem under it.
  const jobs = workHistory.locator(":scope > li")

  await expect(jobs).toHaveCount(6)
  await expect(workHistory.getByRole("heading", { name: "Co-founder at Stealth fintech" })).toBeVisible()
  await expect(jobs.first()).toContainText("2026 - Present")
  await expect(jobs.last()).toContainText("Incubeta (Google)")
  await expect(education.getByRole("listitem")).toHaveCount(2)
  await expect(education.getByRole("listitem").first()).toContainText("Computer Science")

  const pdf = dialog.getByRole("link", { name: "View resume PDF" })
  await expect(pdf).toHaveAttribute("href", "/rafael-medina-resume.pdf")
  await expect(pdf).toHaveAttribute("target", "_blank")
})

// On a phone the sheet fills the viewport, so there is no backdrop to aim at and
// no Escape key: the reader has to carry a close, and it has to be a real target
// rather than a decoration. As a gallery slide it inherits the compact layout's
// toolbar, which carries that close beside the paging controls.
test("gives the mobile resume reader its own close control", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const trigger = page.getByRole("link", { name: "Open résumé" })
  await trigger.click()

  const dialog = page.getByRole("dialog", { name: "Work history" })
  const close = dialog.getByRole("button", { name: "Close résumé" })
  await expect(close).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Next preview" })).toBeVisible()

  const [closeBox, titleBox] = await Promise.all([
    close.boundingBox(),
    dialog.getByRole("heading", { name: "Work history" }).boundingBox(),
  ])
  expect(closeBox!.width).toBeGreaterThanOrEqual(44)
  expect(closeBox!.height).toBeGreaterThanOrEqual(44)
  // It rides the toolbar above the heading rather than overlapping it.
  expect(closeBox!.y + closeBox!.height).toBeLessThanOrEqual(titleBox!.y)

  await close.click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

// The desktop sheet leaves a broad backdrop to press and an Escape key to
// press, so it carries no close of its own. `.preview-gallery-nav` sets
// `display: grid` from a stylesheet imported later, which won at equal
// specificity until the rule was qualified by the sheet -- a regression here
// puts a stray X on the desktop toolbar rather than breaking anything loudly.
test("keeps the desktop resume reader free of a close control", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const dialog = page.getByRole("dialog", { name: "Work history" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Close résumé" })).toBeHidden()
  await expect(dialog.locator(".preview-gallery-toolbar")).toHaveCSS("display", "none")
  // Paging is the side rail here, exactly as it is on a project slide.
  await expect(dialog.locator(".preview-gallery-rail")).toBeVisible()
})

// Protector owns the widest portrait slot. Its responsive source declaration
// must follow the rendered card rather than a generic equal-column baseline.
test("asks for a variant that matches Protector's wide slot", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")

  const media = page.locator(".mosaic-row-card-preview-protector img")
  const { itemWidth, declared, chosen } = await media.evaluate((element) => {
    const image = element as HTMLImageElement
    const declaredWide = /(\d+)px$/.exec(image.sizes)
    return {
      itemWidth: element.closest(".mosaic-row-item")!.getBoundingClientRect().width,
      declared: declaredWide ? Number(declaredWide[1]) : 0,
      chosen: image.currentSrc,
    }
  })

  expect(declared).toBeGreaterThanOrEqual(itemWidth * 0.9)
  expect(chosen).toMatch(/protector-800w\.webp$/)
})

test("keeps the staggered projects in the offset group", async ({ page }) => {
  await page.goto("/")

  const tokenCard = page.getByRole("link", { name: /Open Matcha token page/ })
  const group = page.locator(".mosaic-group").filter({ has: tokenCard })
  const cards = group.locator(".mosaic-row-card")

  await expect(cards).toHaveCount(4)
  await expect(cards.nth(0)).toHaveAttribute("aria-label", /Open Shared family stories/)
  await expect(cards.nth(1)).toHaveAttribute("aria-label", /Open Dealership lead hub/)
  await expect(cards.nth(2)).toHaveAttribute("aria-label", /Open Matcha token page/)
  await expect(cards.nth(3)).toHaveAttribute("aria-label", /Open Matcha Rewards/)
})

test("uses narrower left and wider right columns in the offset group", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1239 })
  await page.goto("/")

  const tokenCard = page.getByRole("link", { name: /Open Matcha token page/ })
  const familyCard = page.getByRole("link", { name: /Open Shared family stories/ })
  const rewardsCard = page.getByRole("link", { name: /Open Matcha Rewards/ })
  const dealershipCard = page.getByRole("link", { name: /Open Dealership lead hub/ })
  const group = page.locator(".mosaic-group").filter({ has: tokenCard })
  await expect(group.locator(".mosaic-row-item")).toHaveCount(4)

  const [familyBox, tokenBox, dealershipBox, rewardsBox] = await Promise.all([
    familyCard.boundingBox(),
    tokenCard.boundingBox(),
    dealershipCard.boundingBox(),
    rewardsCard.boundingBox(),
  ])
  expect(familyBox).not.toBeNull()
  expect(tokenBox).not.toBeNull()
  expect(dealershipBox).not.toBeNull()
  expect(rewardsBox).not.toBeNull()
  expect(familyBox!.width).toBeCloseTo(tokenBox!.width, 0)
  expect(dealershipBox!.width).toBeCloseTo(rewardsBox!.width, 0)
  expect(dealershipBox!.width).toBeGreaterThan(tokenBox!.width)
})

test("closes with the three Matcha projects and omits Mobile navigation", async ({ page }) => {
  await page.goto("/")

  const mobileCard = page.getByRole("link", { name: /Open Matcha on mobile/ })
  const cards = page.locator(".mosaic-group").filter({ has: mobileCard }).locator(".mosaic-row-card")

  await expect(cards).toHaveCount(3)
  await expect(cards.nth(0)).toHaveAttribute("aria-label", /Open Matcha on mobile/)
  await expect(cards.nth(1)).toHaveAttribute("aria-label", /Open Matcha trade page/)
  await expect(cards.nth(2)).toHaveAttribute("aria-label", /Open Matcha Pro/)
  await expect(page.getByRole("link", { name: /Open Matcha mobile navigation/ })).toHaveCount(0)
  await expect(cards.nth(0).locator("img")).toHaveAttribute("src", /shot-small-14\.jpg$/)
  await expect(cards.nth(1).locator("img")).toHaveAttribute("src", /shot-small-1\.jpg$/)
  await expect(cards.nth(2).locator("img")).toHaveAttribute("src", /shot-small-23\.jpg$/)
})

test("keeps the closing row's projects equal width", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1239 })
  await page.goto("/")

  const mobileCard = page.getByRole("link", { name: /Open Matcha on mobile/ })
  const cards = page.locator(".mosaic-group").filter({ has: mobileCard }).locator(".mosaic-row-card")
  await expect(cards).toHaveCount(3)
  const widths = await cards.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().width)),
  )

  expect(new Set(widths).size).toBe(1)
})

test("moves directly from selected work to about without a repeated contact card", async ({ page }) => {
  await page.goto("/")

  await expect(page.locator(".mosaic-work-contact")).toHaveCount(0)
  const placement = await page.locator("#work, #about-panel").evaluateAll(([work, about]) =>
    Boolean(work.compareDocumentPosition(about) & Node.DOCUMENT_POSITION_FOLLOWING),
  )
  expect(placement).toBe(true)
})

test("exposes the profile name as a heading rather than burying it in a control", async ({ page }) => {
  await page.goto("/")

  // `role="button"` on the wrapper would make its descendants presentational,
  // dropping this heading out of the accessibility tree entirely.
  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeVisible()
  await expect(page.locator(".mosaic-profile-meta")).not.toHaveAttribute("role", "button")

  // The pointer-only hit area must not become a second tab stop with the same
  // label as the avatar button.
  await expect(page.locator(".mosaic-profile-meta")).not.toHaveAttribute("tabindex", "0")
})

test("opens the preview gallery as one coordinated surface", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.goto("/")
  await settleWorkCards(page)
  // A shared-token change must retime both CSS fades and the JS flight.
  await page.addStyleTag({ content: ":root { --duration-base: .32s; }" })

  // Hold Web Animations at their first frame so the short opening motion is
  // still inspectable after React mounts the dialog portal.
  await page.evaluate(() => {
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      animation.pause()
      return animation
    }
  })

  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  const originWrap = page.locator(".preview-gallery-origin-wrap")
  const cardInner = page.locator(".preview-gallery-card-inner")
  expect(await originWrap.evaluate((element) => element.getAnimations().map((animation) => animation.effect?.getTiming().duration))).toEqual([320])
  await expect(page.locator(".preview-gallery-backdrop")).toHaveCSS("transition-duration", "0.32s")
  expect(await cardInner.evaluate((element) => element.getAnimations().length)).toBe(0)
})

// Hovering a tile fetches the gallery's chunk ahead of the press. Handed to
// `lazy` through a promise it still suspended, and once a boundary has shown its
// fallback React holds the content back for up to 300ms: the first preview of
// a visit appeared 315ms after the press, against 15ms for every one after it.
test("opens a prefetched gallery without passing through its loading state", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const tile = page.getByRole("link", { name: /Open Matcha multiwallet flow/ })
  const chunk = page.waitForResponse(/PreviewGalleryDialog-[\w-]+\.js/)
  await tile.hover()
  await chunk
  // The module evaluates once its own imports are in; give it that turn.
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 100)))

  const firstSurface = page.evaluate(() => new Promise<string>((resolve) => {
    new MutationObserver((_, observer) => {
      const surface = document.querySelector(".preview-gallery-pending, .preview-gallery-popup")
      if (!surface) return
      observer.disconnect()
      resolve(surface.className)
    }).observe(document.body, { childList: true, subtree: true })
  }))
  await tile.click()
  expect(await firstSurface).toContain("preview-gallery-popup")
})

test("keeps gallery controls inside the mobile viewport and exposes a close button", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await settleWorkCards(page)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  // All positional travel belongs to the wrapper, so the popup itself is never
  // transformed while origin motion is on.
  await expect(dialog).toHaveCSS("transform", "none")

  // The gallery flies in from the card it was opened from; measure it at rest.
  await page
    .locator(".preview-gallery-origin-wrap")
    .evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

  // The complete surface has to land exactly back on identity.
  await expect(page.locator(".preview-gallery-origin-wrap")).toHaveCSS("transform", "none")

  for (const name of ["Previous preview", "Next preview", "Close preview"]) {
    const control = dialog.getByRole("button", { name })
    await expect(control).toBeVisible()
    const box = await control.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(mobileViewport.width)
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)

  const mediaFrame = dialog.locator(".preview-gallery-media-frame")
  await mediaFrame.evaluate((element) => {
    const startTouch = new Touch({ identifier: 1, target: element, clientX: 300 })
    const endTouch = new Touch({ identifier: 1, target: element, clientX: 180 })
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        changedTouches: [startTouch],
      }),
    )
    element.dispatchEvent(
      new TouchEvent("touchend", {
        bubbles: true,
        changedTouches: [endTouch],
      }),
    )
  })
  // The position label follows the swipe after its outgoing number settles.
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("2 / 14")

  await dialog.getByRole("button", { name: "Close preview" }).click()
  await expect(dialog).toBeHidden()
})

// The toolbar is the card's sibling rather than its first child, so the
// between-previews switch -- 1.4rem of travel and a fade to nothing -- must not
// reach it. Nested back inside the card, every press slid the control that was
// pressed out from under the thumb and took the close with it.
test("holds the compact toolbar still while the gallery pages", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await settleWorkCards(page)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  const toolbar = dialog.locator(".preview-gallery-toolbar")
  await expect(toolbar).toBeVisible()

  // The gallery flies in from the tile it was opened from; measure it at rest.
  await page
    .locator(".preview-gallery-origin-wrap")
    .evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const resting = await toolbar.boundingBox()

  // Each phase is read as it lands rather than sampled from frames a busy
  // runner can skip: the switch is stepped by a JS timer, and a whole leg of it
  // can pass without a paint.
  const poses = await dialog.locator(".preview-gallery-card").evaluate(async (element) => {
    const bar = document.querySelector(".preview-gallery-toolbar")!
    const seen: Array<Record<string, unknown>> = []
    const record = () => {
      const style = getComputedStyle(bar)
      const box = bar.getBoundingClientRect()
      seen.push({
        phase: [...element.classList].find((name) => name.includes("switch-")) ?? "idle",
        transform: style.transform,
        opacity: style.opacity,
        x: box.x,
        y: box.y,
        animations: bar.getAnimations().length,
      })
    }
    const observer = new MutationObserver(record)
    observer.observe(element, { attributes: true, attributeFilter: ["class"] })
    record()
    document.querySelector<HTMLButtonElement>(".preview-gallery-toolbar .preview-gallery-nav-next")?.click()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    observer.disconnect()
    return seen
  })

  expect(poses.map((pose) => pose.phase)).toContain("preview-gallery-card-switch-out-next")
  expect(poses.at(-1)!.phase).toBe("idle")
  for (const pose of poses) {
    expect(pose).toMatchObject({
      transform: "none",
      opacity: "1",
      x: resting!.x,
      y: resting!.y,
      animations: 0,
    })
  }
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("2 / 14")

  // The visible counter fits between paging and close without moving either.
  const [prevBox, nextBox, closeBox] = await Promise.all(
    ["Previous preview", "Next preview", "Close preview"].map((name) =>
      dialog.getByRole("button", { name }).boundingBox(),
    ),
  )
  expect(prevBox!.x).toBeLessThan(nextBox!.x)
  expect(nextBox!.x + nextBox!.width).toBeLessThan(mobileViewport.width / 2)
  expect(closeBox!.x).toBeGreaterThan(mobileViewport.width / 2)
  const countBox = (await dialog.locator(".preview-gallery-count").boundingBox())!
  expect(countBox.width).toBeGreaterThan(32)
  expect(countBox.height).toBeGreaterThanOrEqual(32)
  expect(countBox.x).toBeGreaterThan(nextBox!.x + nextBox!.width)
  expect(countBox.x + countBox.width).toBeLessThan(closeBox!.x)
  // Both ends sit on the same inset, which is the card's own.
  expect(mobileViewport.width - (closeBox!.x + closeBox!.width)).toBeCloseTo(prevBox!.x, 0)
})

test("treats a mostly vertical touch gesture as scrolling rather than gallery paging", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
    viewport: mobileViewport,
  })
  const page = await context.newPage()
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).tap()

  const card = page.locator(".preview-gallery-card")
  await card.evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, clientX: 240, clientY: 180 })
    const end = new Touch({ identifier: 1, target: element, clientX: 170, clientY: 480 })
    element.dispatchEvent(
      new TouchEvent("touchstart", { bubbles: true, changedTouches: [start], touches: [start] }),
    )
    element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }))
  })

  await expect(page.locator(".preview-gallery-count")).toHaveText("1 / 14")
  await context.close()
})

test("clears a cancelled gallery gesture before accepting the next horizontal swipe", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
    viewport: mobileViewport,
  })
  const page = await context.newPage()
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).tap()

  const card = page.locator(".preview-gallery-card")
  await card.evaluate((element) => {
    const cancelledStart = new Touch({
      identifier: 1,
      target: element,
      clientX: 260,
      clientY: 180,
    })
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        changedTouches: [cancelledStart],
        touches: [cancelledStart],
      }),
    )
    element.dispatchEvent(
      new TouchEvent("touchcancel", { bubbles: true, changedTouches: [cancelledStart] }),
    )

    const staleEnd = new Touch({ identifier: 1, target: element, clientX: 160, clientY: 180 })
    element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [staleEnd] }))
  })
  await expect(page.locator(".preview-gallery-count")).toHaveText("1 / 14")

  await card.evaluate((element) => {
    const start = new Touch({ identifier: 2, target: element, clientX: 280, clientY: 180 })
    const end = new Touch({ identifier: 2, target: element, clientX: 180, clientY: 190 })
    element.dispatchEvent(
      new TouchEvent("touchstart", { bubbles: true, changedTouches: [start], touches: [start] }),
    )
    element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }))
  })
  await expect(page.locator(".preview-gallery-count")).toHaveText("2 / 14")
  await context.close()
})

test("returns focus to the originating project after closing the gallery", async ({ page }) => {
  await page.goto("/")
  await settleWorkCards(page)
  const trigger = page.getByRole("link", { name: /Open Matcha multiwallet flow/ })
  await trigger.focus()
  await trigger.press("Enter")
  // The gallery chunk is lazy: an Escape fired before it mounts closes
  // nothing, and the dialog then opens after the assertion.
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

test("opens the gallery after an intent prefetch fails", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))

  let releaseFailedPrefetch: (() => void) | undefined
  const failedPrefetch = new Promise<void>((resolve) => {
    releaseFailedPrefetch = resolve
  })
  const galleryChunk = "**/assets/PreviewGalleryDialog-*.js"

  await page.route(galleryChunk, async (route) => {
    await route.abort("failed")
    releaseFailedPrefetch?.()
  })
  await page.goto("/")
  await settleWorkCards(page)

  const trigger = page.getByRole("link", { name: /Open Matcha token page preview/ })
  await trigger.hover()
  await failedPrefetch
  await page.unroute(galleryChunk)
  await trigger.click()

  await expect(page.getByRole("dialog")).toBeVisible()
  expect(errors).toEqual([])
})

test("keeps the site usable when the gallery chunk fails at click time", async ({ page }) => {
  const galleryChunk = "**/assets/PreviewGalleryDialog-*.js"
  await page.route(galleryChunk, (route) => route.abort("failed"))
  await page.goto("/")
  await settleWorkCards(page)

  const trigger = page.getByRole("link", { name: /Open Matcha token page preview/ })
  await trigger.click()

  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeAttached()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page.locator(".preview-gallery-pending")).toHaveCount(0)

  await page.unroute(galleryChunk)
  await trigger.click()
  await expect(page.getByRole("dialog")).toBeVisible()
})

test("acknowledges the first gallery tap while its chunk loads", async ({ page }) => {
  let releaseChunk: (() => void) | undefined
  const chunkBlocked = new Promise<void>((resolve) => {
    releaseChunk = resolve
  })
  const galleryChunk = "**/assets/PreviewGalleryDialog-*.js"

  await page.route(galleryChunk, async (route) => {
    await chunkBlocked
    await route.continue()
  })
  await page.goto("/")
  await settleWorkCards(page)

  const trigger = page.getByRole("link", { name: /Open Matcha token page preview/ })
  await trigger.click()
  const pending = page.locator(".preview-gallery-pending")
  await expect(pending).toBeVisible()
  await expect(pending).toContainText("Loading project preview")
  await expect(pending).toHaveCSS("background-color", "rgba(18, 18, 18, 0.28)")

  releaseChunk?.()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(pending).toHaveCount(0)
})

test("keeps the gallery pending state visible without motion", async ({ page }) => {
  let releaseChunk: (() => void) | undefined
  const chunkBlocked = new Promise<void>((resolve) => {
    releaseChunk = resolve
  })

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.route("**/assets/PreviewGalleryDialog-*.js", async (route) => {
    await chunkBlocked
    await route.continue()
  })
  await page.goto("/")

  await page.getByRole("link", { name: /Open Matcha token page preview/ }).click()
  const pending = page.locator(".preview-gallery-pending")
  await expect(pending).toBeVisible()
  await expect(pending).toHaveCSS("animation-name", "none")

  releaseChunk?.()
  await expect(page.getByRole("dialog")).toBeVisible()
})

test("shows the about introduction without restating the résumé", async ({ page }) => {
  await page.goto("/")
  const panel = page.locator("#about-panel")

  await expect(panel.locator(".mosaic-about-lede")).toBeVisible()

  // Work history and Education belong to the résumé reader now, so the sheet
  // carries neither the entries nor a heading for them.
  await expect(panel.getByRole("heading", { name: "Work history" })).toHaveCount(0)
  await expect(panel.getByRole("list", { name: "Work history" })).toHaveCount(0)
  await expect(panel.locator(".mosaic-about-resume-education")).toHaveCount(0)
  await expect(panel).not.toContainText("Incubeta")
  await expect(panel).not.toContainText("NOVA Community College")
  // The résumé carries a phone number; the panel is public and does not.
  await expect(panel).not.toContainText("786 9580")
  // The address is spelled out twice on purpose: once closing the introduction
  // and once closing the Services block at the foot of the sheet. Both are
  // mailto: links; only the introduction's takes the press for a copy.
  const emailLinks = panel.getByRole("link", { name: contactEmail, exact: true })
  await expect(emailLinks).toHaveCount(2)
  for (const link of await emailLinks.all()) {
    await expect(link).toHaveAttribute("href", `mailto:${contactEmail}`)
  }
  await expect(panel.locator(".mosaic-about-email")).toHaveCount(1)
  await expect(
    page.locator("#about-panel-services .mosaic-about-closing .mosaic-about-link").first(),
  ).not.toHaveClass(/mosaic-about-email/)
  await expect(panel.getByRole("link", { name: "Download résumé PDF" })).toHaveCount(0)
  await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })).toHaveAttribute(
    "href",
    "/rafael-medina-resume.pdf",
  )
  await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })).toHaveAttribute(
    "target",
    "_blank",
  )

  // The photos are a work-grid tile now, not the closing block of About.
  await expect(panel.getByRole("button", { name: "Personal life", exact: true })).toHaveCount(0)
  await expect(page.locator("#work").getByRole("button", { name: "Personal life", exact: true })).toBeVisible()
  await expect(panel.getByRole("button", { name: /Briefcase sticker/ })).toHaveCount(0)
})

test("uses the visible about lede as the section heading", async ({ page }) => {
  await page.goto("/#about-panel")

  const intro = page.locator("#about-section .mosaic-about-section-copy")
  const heading = intro.getByRole("heading", { name: "About me" })

  await expect(heading).toHaveClass(/mosaic-about-lede/)
  await expect(heading).not.toHaveClass(/sr-only/)
  await expect(intro.locator(":scope > p")).toHaveCount(3)
  await expect(intro.locator(".mosaic-about-facts")).toHaveCount(0)
})

test("gives the About introduction more space from the top of its section", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/#about-panel")

  await expect(page.locator(".mosaic-about-panel")).toHaveCSS("padding-top", "140px")
})

test("adds breathing room above the about hobbies", async ({ page }) => {
  await page.goto("/#about-panel")

  await expect(page.locator(".mosaic-about-hobbies")).toHaveCSS("margin-top", "8px")
})

test("starts the education section without a top hairline", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const dialog = page.getByRole("dialog", { name: "Work history" })
  await expect(dialog.locator(".mosaic-about-resume-education")).toHaveCSS("border-top-width", "0px")
})

test("gives the Chainlink work a fuller description", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const chainlinkEntry = page
    .getByRole("dialog", { name: "Work history" })
    .locator(".resume-experience")
    .filter({ has: page.getByRole("heading", { name: "Product Designer & Frontend Developer at TM (Chainlink, Twilio, and Onit)" }) })

  // The two sentences are two bullets now, so the check is per point: joined
  // text would pass on a run-on paragraph that had lost the split.
  await expect(chainlinkEntry.locator(".mosaic-about-resume-description li")).toHaveText([
    "Collaborated with Chainlink on internal product tools and its brand system as the company scaled.",
    "The work made a complex oracle network read clearer and more consistent.",
  ])
})

test("keeps one compact gap between the About closing line, companies, process, and services", async ({ page }) => {
  // The closing line, the worked-with wall, How I work and Services are four
  // blocks in a row, and they are separated by the same break so none of them
  // reads as belonging to its neighbour.
  for (const { width, expectedGap } of [{ width: 1440, expectedGap: 80 }, { width: 390, expectedGap: 40 }]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/#about-panel")

    const gaps = await page.evaluate(() => {
      const blocks = [
        ".mosaic-about-closing",
        ".mosaic-about-companies",
        ".mosaic-about-process",
        "#about-panel-services",
      ].map((selector) => document.querySelector(selector))
      if (blocks.some((block) => !block)) return [Number.POSITIVE_INFINITY]
      return blocks
        .slice(1)
        .map((block, index) =>
          Math.round(block!.getBoundingClientRect().top - blocks[index]!.getBoundingClientRect().bottom),
        )
    })

    expect(gaps).toEqual([expectedGap, expectedGap, expectedGap])
  }
})

test("keeps work-history company links free of logo tooltips", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const dialog = page.getByRole("dialog", { name: "Work history" })
  const companyLink = dialog
    .locator("a.mosaic-company-inline-link")
    .filter({ hasText: "Moody's" })
  const tooltips = dialog.locator(".mosaic-company-inline-hover-logos")

  await expect(companyLink).toHaveCount(1)
  await expect(tooltips).toHaveCount(0)
  await companyLink.hover()
  await expect(tooltips).toHaveCount(0)
  await companyLink.focus()
  await expect(companyLink).toBeFocused()
  await expect(tooltips).toHaveCount(0)
})

test("links each work-history company name to its primary website", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()
  const workHistory = page.getByRole("dialog", { name: "Work history" })

  const projects = [
    { company: "0x Project", href: "https://0x.org/" },
    { company: "BoldVoice", href: "https://boldvoice.com/" },
    { company: "Moody's", href: "https://www.moodys.com/" },
    { company: "Chainlink", href: "https://chain.link/" },
    { company: "Twilio", href: "https://www.twilio.com/" },
    { company: "Onit", href: "https://www.onit.com/" },
    { company: "Incubeta (Google)", href: "https://www.google.com/" },
  ]

  for (const project of projects) {
    const companyLink = workHistory.getByRole("link", { name: project.company, exact: true })
    await expect(companyLink).toHaveAttribute("href", project.href)
    await expect(companyLink).toHaveAttribute("target", "_blank")
  }
})

test("opens a work-history company website from its name", async ({ page }) => {
  await page.context().route("https://0x.org/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><title>0x</title>" }),
  )
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const companyLink = page
    .getByRole("dialog", { name: "Work history" })
    .getByRole("link", { name: "0x Project", exact: true })

  const popupPromise = page.waitForEvent("popup")
  await companyLink.click()
  const popup = await popupPromise
  await expect.poll(() => popup.url()).toContain("0x.org")
  await popup.close()
})

test("keeps each role and employer as the accessible work-history heading", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Open résumé" }).click()

  const dialog = page.getByRole("dialog", { name: "Work history" })
  await expect(dialog.getByRole("heading", { name: "Senior Product Designer at 0x Project" })).toBeVisible()
  await expect(dialog.getByRole("link", { name: "0x Project", exact: true })).toBeVisible()
})

test("levels desktop gallery navigation with the middle of the artwork", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  const card = dialog.locator(".preview-gallery-card")
  const rail = dialog.locator(".preview-gallery-rail")
  const previous = rail.getByRole("button", { name: "Previous preview" })
  const next = rail.getByRole("button", { name: "Next preview" })

  await expect(rail).toBeVisible()
  await expect(previous).toHaveAttribute("aria-keyshortcuts", "ArrowUp ArrowLeft")
  await expect(next).toHaveAttribute("aria-keyshortcuts", "ArrowDown ArrowRight")
  // --radius-lg. The dialog's bottom corners used to be a 28px one-off; they
  // were folded into the four-step radius scale (see /design-system).
  await expect(card).toHaveCSS("border-bottom-left-radius", "24px")
  await expect(card).toHaveCSS("border-bottom-right-radius", "24px")

  // One control per side, level with each other and 16px clear of the card.
  const placement = async () => {
    const dialogBox = (await dialog.boundingBox())!
    // By class rather than name: reading a note renames the pair.
    const previousBox = (await rail.locator(".preview-gallery-nav-prev").boundingBox())!
    const nextBox = (await rail.locator(".preview-gallery-nav-next").boundingBox())!
    return {
      dialogTop: dialogBox.y,
      previousGap: dialogBox.x - (previousBox.x + previousBox.width),
      nextGap: nextBox.x - (dialogBox.x + dialogBox.width),
      previousCentre: previousBox.y + previousBox.height / 2 - dialogBox.y,
      nextCentre: nextBox.y + nextBox.height / 2 - dialogBox.y,
    }
  }

  const initial = await placement()
  expect(initial.dialogTop).toBeCloseTo(50, 0)
  expect(initial.previousGap).toBeCloseTo(16, 0)
  expect(initial.nextGap).toBeCloseTo(16, 0)

  // Level with the middle of the image rather than the middle of the dialog:
  // the card carries on into the title and details below the artwork, so its
  // own centre sits in the text. Read from the frame so the expectation follows
  // the popup width and the media's height cap instead of restating them.
  const dialogBox = (await dialog.boundingBox())!
  const frameBox = (await dialog.locator(".preview-gallery-media-frame").boundingBox())!
  const artworkCentre = frameBox.y + frameBox.height / 2 - dialogBox.y
  expect(Math.abs(initial.previousCentre - artworkCentre)).toBeLessThanOrEqual(2)
  expect(Math.abs(initial.nextCentre - artworkCentre)).toBeLessThanOrEqual(2)

  // The span between the two controls belongs to the card, not the group.
  await expect(rail).toHaveCSS("pointer-events", "none")

  // One hop, not two: the stop after the homepage is the notes folder, which
  // closes this preview and opens the folder's own sheet.
  await next.click()
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("2 / 14")

  // A taller or shorter preview must not move them.
  expect(await placement()).toEqual(initial)

  await previous.click()
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("1 / 14")

  // Nor may a slide with no artwork. The notes list is shorter than the
  // artwork, an open note grows the card to the viewport's foot, and the
  // résumé starts there: each used to take half its own card, so the pair
  // jumped on every step into or out of them.
  const railNext = rail.locator(".preview-gallery-nav-next")
  await railNext.click()
  await railNext.click()
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("3 / 14")
  await expect(dialog).toHaveAttribute("data-preview-kind", "writings")
  await expect(dialog.locator(".notes-gallery-card")).toHaveAttribute("style", /notes-list-height/)
  expect(await placement()).toEqual(initial)

  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await expect(dialog).toHaveAttribute("data-reading-note", "true")
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  expect(await placement()).toEqual(initial)

  await page.keyboard.press("Escape")
  await expect(dialog).not.toHaveAttribute("data-reading-note")
  await railNext.click()
  await railNext.click()
  await expect(dialog).toHaveAttribute("data-preview-kind", "resume")
  expect(await placement()).toEqual(initial)
})

// The rail's affordance is a left and a right chevron, and the card already
// takes horizontal swipes on touch. A vertical switch contradicted both.
test("pages previews along the axis its arrows point down", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await settleWorkCards(page)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  const card = dialog.locator(".preview-gallery-card")
  await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")

  // The switch is stepped by a JS timer, so on a busy runner a whole 200ms leg
  // can pass without a paint. Reading frames races that; the poses do not.
  // Each phase change is observed as it lands, and the transform it is heading
  // for is read off the CSS transition's own keyframes -- the same value a
  // frame would eventually show, available the moment the class flips.
  const poses = (navSelector: string) =>
    card.evaluate(async (element, selector) => {
      const seen: Array<{ phase: string; from: number; to: number; y: number }> = []
      const observer = new MutationObserver(() => {
        const phase = [...element.classList].find((name) => name.includes("switch-")) ?? "idle"
        // Reading computed style here flushes the class change into a transition.
        const resting = getComputedStyle(element).transform
        const transition = element
          .getAnimations()
          .filter((animation): animation is CSSTransition => animation instanceof CSSTransition && animation.transitionProperty === "transform")
          .at(-1)
        const frames = transition?.effect?.getKeyframes() ?? []
        const from = new DOMMatrixReadOnly(String(frames[0]?.transform ?? resting))
        const to = new DOMMatrixReadOnly(String(frames.at(-1)?.transform ?? resting))
        seen.push({ phase, from: from.e, to: to.e, y: Math.max(Math.abs(from.f), Math.abs(to.f)) })
      })
      observer.observe(element, { attributes: true, attributeFilter: ["class"] })
      document.querySelector<HTMLButtonElement>(selector)?.click()
      // Wait for the settle to land rather than for a fixed stretch of clock.
      // The switch is three React commits stepped by a timer, and a runner
      // slow enough to spread those past any sleep this test picks would fail
      // it on the sleep rather than on the poses. Resolving on the return to
      // rest keeps every assertion below exact -- a card that never settles
      // still ends the recording on its last real pose and fails.
      await new Promise<void>((resolve) => {
        const cap = setTimeout(resolve, 5000)
        const settled = new MutationObserver(() => {
          if ([...element.classList].some((name) => name.includes("switch-"))) return
          clearTimeout(cap)
          settled.disconnect()
          // One more turn so the idle pose reaches the recording observer.
          setTimeout(resolve, 0)
        })
        settled.observe(element, { attributes: true, attributeFilter: ["class"] })
      })
      observer.disconnect()
      return seen
    }, navSelector)

  // 1.4rem of travel each way; assert well inside it. The outgoing pose leaves
  // in the arrow's direction, the incoming one arrives from the opposite edge
  // and settles at zero, and nothing moves on Y.
  const forward = await poses(".preview-gallery-rail .preview-gallery-nav-next")
  expect(forward.find((pose) => pose.phase.endsWith("out-next"))?.to).toBeLessThan(-8)
  expect(forward.find((pose) => pose.phase.endsWith("in-next"))?.to).toBeGreaterThan(8)
  expect(forward.at(-1)).toMatchObject({ phase: "idle", to: 0 })
  expect(forward.at(-1)!.from).toBeGreaterThan(8)
  expect(Math.max(...forward.map((pose) => pose.y))).toBeLessThan(0.5)
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("2 / 14")

  const back = await poses(".preview-gallery-rail .preview-gallery-nav-prev")
  expect(back.find((pose) => pose.phase.endsWith("out-prev"))?.to).toBeGreaterThan(8)
  expect(back.find((pose) => pose.phase.endsWith("in-prev"))?.to).toBeLessThan(-8)
  expect(back.at(-1)).toMatchObject({ phase: "idle", to: 0 })
  expect(back.at(-1)!.from).toBeLessThan(-8)
  expect(Math.max(...back.map((pose) => pose.y))).toBeLessThan(0.5)
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("1 / 14")
})
test("does not use dots to navigate between projects in the main feed", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(".preview-gallery-picker")).toHaveCount(0)
  await expect(dialog.getByRole("button", { name: /previous .* image/i })).toHaveCount(0)
  await expect(dialog.getByRole("button", { name: /next .* image/i })).toHaveCount(0)
})

test("opens the gallery wide without clipping navigation at the large desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1320, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveAttribute("data-wide", "true")
  await expect(dialog.getByRole("button", { name: /Expand preview|Exit wide view/ })).toHaveCount(0)
  // The artwork bleeds to the card's sides, so the card is sized from it: 4:3 at
  // the media's height cap here, under the 981px the wide view allows at most.
  const wideDialogBox = await dialog.boundingBox()
  expect(wideDialogBox?.width).toBeCloseTo(912, 0)
  expect(wideDialogBox?.y).toBeCloseTo(50, 0)

  // Which is the point of deriving it: a landscape preview meets both edges
  // instead of sitting in a band of the frame's grey.
  const frameBox = await dialog.locator(".preview-gallery-media-frame").boundingBox()
  const mediaBox = await dialog.locator(".preview-gallery-media").boundingBox()
  expect(mediaBox!.width).toBeCloseTo(frameBox!.width, 0)

  // The controls flank the card, so both edges have to clear the viewport --
  // the shell hides horizontal overflow rather than scrolling to reach them.
  const nextPreviewBox = await dialog.getByRole("button", { name: "Next preview" }).boundingBox()
  expect(nextPreviewBox).not.toBeNull()
  expect(nextPreviewBox!.x + nextPreviewBox!.width).toBeLessThanOrEqual(1320)

  const previousPreviewBox = await dialog.getByRole("button", { name: "Previous preview" }).boundingBox()
  expect(previousPreviewBox).not.toBeNull()
  expect(previousPreviewBox!.x).toBeGreaterThanOrEqual(0)

  // 700px is the narrowest viewport that still shows the rail rather than the
  // in-card toolbar, so it is where the flanking controls are tightest.
  await page.setViewportSize({ width: 700, height: 1000 })
  const tightPreviousBox = await dialog.getByRole("button", { name: "Previous preview" }).boundingBox()
  const tightNextBox = await dialog.getByRole("button", { name: "Next preview" }).boundingBox()
  expect(tightPreviousBox!.x).toBeGreaterThanOrEqual(0)
  expect(tightNextBox!.x + tightNextBox!.width).toBeLessThanOrEqual(700)

  await page.setViewportSize({ width: 1280, height: 1000 })
  // A reload would reopen the gallery without a card to grow out of. Enter from
  // the feed to exercise the same anchored open at the second viewport.
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  await expect(dialog).not.toHaveAttribute("data-wide", "true")
  await expect(dialog.getByRole("button", { name: /Expand preview|Exit wide view/ })).toHaveCount(0)
  expect((await dialog.boundingBox())?.y).toBeCloseTo(80, 0)
})

test("fills the wide card width with cropped project artwork", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 545 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Protector booking preview/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveAttribute("data-wide", "true")

  const card = dialog.locator(".preview-gallery-card")
  await expect
    .poll(() =>
      card.evaluate((element) => {
        const mediaFrame = element.querySelector(".preview-gallery-media-frame")

        if (!(mediaFrame instanceof HTMLElement)) return Number.POSITIVE_INFINITY

        const cardBox = element.getBoundingClientRect()
        const mediaFrameBox = mediaFrame.getBoundingClientRect()
        const styles = getComputedStyle(element)
        // The artwork bleeds back out over the card's padding, so the hairline
        // border is the only thing left between it and the card's edge.
        const horizontalInset = [styles.borderLeftWidth, styles.borderRightWidth]
          .map(Number.parseFloat)
          .reduce((total, value) => total + value, 0)

        return Math.abs(mediaFrameBox.width - (cardBox.width - horizontalInset))
      }),
    )
    .toBeLessThan(1)
})

test("keeps the expanded gallery scrollable without visible scrollbars", async ({ playwright, baseURL }) => {
  const browser = await playwright.chromium.launch({ ignoreDefaultArgs: ["--hide-scrollbars"] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()

  try {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(baseURL ?? "/")
    await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toHaveAttribute("data-wide", "true")

    const card = dialog.locator(".preview-gallery-card")
    await expect.poll(() => card.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true)

    const scrollbarGutter = await card.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        horizontal: element.offsetHeight - element.clientHeight - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth),
        vertical: element.offsetWidth - element.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth),
      }
    })

    expect(scrollbarGutter).toEqual({ horizontal: 0, vertical: 0 })

    await card.hover()
    await page.mouse.wheel(0, 240)
    await expect.poll(() => card.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  } finally {
    await browser.close()
  }
})

test("travels one role-bearing work-history popover between company triggers without shifting the page", async ({ page }) => {
  await page.goto("/")
  const location = page.locator(".mosaic-profile-location")
  await settleAvatarIntro(page)
  const initialLocationBox = await location.boundingBox()
  const popover = page.locator(".mosaic-work-history-popover")
  const onit = getPreviousCompanyLink(page, "Onit")
  const initialOnitBox = await onit.boundingBox()

  const closedTransform = await popover.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform))
  expect(closedTransform.a).toBeCloseTo(1, 2)
  expect(closedTransform.d).toBeCloseTo(1, 2)
  expect(closedTransform.m42).toBeCloseTo(-6, 1)

  await onit.hover()
  await expect(popover).toBeVisible()
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const openTransform = await popover.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform))
  expect(openTransform.a).toBeCloseTo(1, 2)
  expect(openTransform.d).toBeCloseTo(1, 2)
  const openOnitBox = await onit.boundingBox()
  expect(initialOnitBox).not.toBeNull()
  expect(openOnitBox!.x).toBeCloseTo(initialOnitBox!.x, 1)
  expect(openOnitBox!.y).toBeCloseTo(initialOnitBox!.y, 1)
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Onit")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Frontend dev and designer")
  const visitLink = popover.getByRole("link", { name: "Visit onit.com" })
  await expect(visitLink).toBeVisible()
  await expect(popover).toHaveCSS("text-align", "left")
  await expect(visitLink).toHaveCSS("background-color", "rgb(242, 242, 242)")
  await expect(page.locator(".mosaic-work-history")).toHaveCSS("z-index", "40")
  await expect(popover).toHaveAttribute("data-side", "below")
  await expect(popover.locator(".mosaic-work-history-popover-arrow")).toHaveCount(0)
  await expect(popover).toHaveCSS("padding-top", "15px")
  await expect(popover).toHaveCSS("padding-right", "16px")
  await expect(popover).toHaveCSS("padding-bottom", "17px")
  await expect(popover).toHaveCSS("padding-left", "16px")
  const longestPopoverTransition = await popover.evaluate((element) =>
    Math.max(
      ...getComputedStyle(element)
        .transitionDuration.split(",")
        .map((duration) => Number.parseFloat(duration) * (duration.includes("ms") ? 0.001 : 1)),
    ),
  )
  expect(longestPopoverTransition).toBeCloseTo(0.2, 2)
  await expect(popover).toHaveCSS("transition-property", "transform, opacity, visibility")

  const onitPopoverBox = await popover.boundingBox()
  const onitTriggerBox = await onit.boundingBox()
  const onitLocationBox = await location.boundingBox()
  expect(initialLocationBox).not.toBeNull()
  expect(onitPopoverBox).not.toBeNull()
  expect(onitTriggerBox).not.toBeNull()
  expect(onitPopoverBox!.y).toBeGreaterThan(onitTriggerBox!.y + onitTriggerBox!.height)
  expect(onitLocationBox!.y).toBeCloseTo(initialLocationBox!.y, 0)

  await page
    .locator(".mosaic-work-history")
    .getByRole("link", { name: "Moody's", exact: true })
    .hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Moody's")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Frontend dev and designer")
  expect(
    await popover.evaluate(
      (element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState !== "finished").length,
    ),
  ).toBe(0)
  expect((await page.locator(".mosaic-work-history-popover").count())).toBe(1)
  expect((await popover.boundingBox())!.x).not.toBe(onitPopoverBox!.x)
  expect((await location.boundingBox())!.y).toBeCloseTo(initialLocationBox!.y, 0)

  await page
    .locator(".mosaic-work-history")
    .getByRole("link", { name: "0x.org and Matcha.xyz", exact: true })
    .hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("0x.org and Matcha.xyz")

  await getPreviousCompanyLink(page, "Google").hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Google")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Design collab")

  await getPreviousCompanyLink(page, "Protector and Patrol").hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Protector and Patrol")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Design collab")
})

test("keeps a work-history pill engaged while the pointer moves into its card", async ({ page }) => {
  await page.goto("/")

  const onit = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.hover()
  await expect(popover).toBeVisible()

  const popoverBox = await popover.boundingBox()
  expect(popoverBox).not.toBeNull()
  await page.mouse.move(popoverBox!.x + popoverBox!.width / 2, popoverBox!.y + 12, { steps: 8 })

  await expect(popover).toBeVisible()
  await expect(onit).toHaveClass(/\bis-active\b/)
  await expect(onit).toHaveCSS("background-color", "rgb(233, 233, 233)")
})

test("fades the work-history card out with the company still inside it", async ({ page }) => {
  await page.goto("/")

  const onit = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.hover()
  await expect(popover).toBeVisible()
  const openHeight = Math.round((await popover.boundingBox())!.height)

  await page.mouse.move(4, 4)
  await expect(popover).toBeHidden()

  // The card that fades out is the card you were reading: clearing the active
  // company used to unmount the content on the first frame of the exit, so the
  // card collapsed to an empty sliver and faded that out instead.
  const exited = await popover.evaluate((element) => ({
    height: Math.round(element.getBoundingClientRect().height),
    name: element.querySelector(".mosaic-work-history-popover-name")?.textContent,
  }))
  expect(exited.name).toBe("Onit")
  expect(exited.height).toBe(openHeight)

  // The 6px retreat and the fade run on one clock, so the movement is on
  // screen rather than finishing after the card has already gone.
  const exitMotion = await popover.evaluate((element) => {
    const style = getComputedStyle(element)
    return { duration: style.transitionDuration, ease: style.transitionTimingFunction }
  })
  expect(exitMotion.duration).toBe("0.16s, 0.16s, 0s")
  expect(exitMotion.ease).toBe("cubic-bezier(0.4, 0, 1, 1), cubic-bezier(0.4, 0, 1, 1), linear")
})

test("opens the work-history popover from the keyboard and links each chip to its company", async ({
  context,
  page,
}) => {
  await page.goto("/")
  const onit = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.focus()
  await expect(popover).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(popover).toBeHidden()
  await expect(onit).toBeFocused()

  await expect(onit).toHaveAttribute("href", "https://www.onit.com")
  await expect(onit).toHaveAttribute("target", "_blank")
  await expect(getPreviousCompanyLink(page, "Google")).toHaveAttribute("href", "https://www.google.com")

  // Pointer users already saw the panel on hover, so the click travels.
  await stubCompanySite(context)
  const opened = page.waitForEvent("popup")
  await onit.click()
  const companyTab = await opened
  await companyTab.waitForLoadState()
  expect(companyTab.url()).toContain("onit.com")
  await expect(companyTab).toHaveTitle("Onit")
  await companyTab.close()
})

test("reveals the work-history popover for a touch pointer on a hover-capable device", async ({ page }) => {
  await page.goto("/")
  const onit = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), { once: true })
    element.dispatchEvent(
      new PointerEvent("click", { bubbles: true, cancelable: true, pointerType: "touch" }),
    )
  })

  await expect(popover).toBeVisible()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Onit")
})

test("keeps the work-history popover stationary while the pointer moves within a link", async ({ page }) => {
  await page.goto("/")

  const trigger = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")
  const triggerBox = await trigger.boundingBox()
  expect(triggerBox).not.toBeNull()

  const movePointerTo = (relativeX: number) =>
    trigger.evaluate(async (element, x) => {
      const box = element.getBoundingClientRect()
      element.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: box.left + x,
          clientY: box.top + box.height / 2,
        }),
      )
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    }, relativeX)

  await trigger.focus()
  await expect(popover).toBeVisible()
  await movePointerTo(1)
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const leftX = (await popover.boundingBox())!.x

  await movePointerTo(triggerBox!.width - 1)
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const rightX = (await popover.boundingBox())!.x

  expect(rightX).toBeCloseTo(leftX, 1)
})

test("toggles the work-history popover on tap and navigates through its link", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: mobileViewport })
  await stubCompanySite(context)
  const page = await context.newPage()
  await page.goto("/")

  const onit = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.tap()
  await expect(popover).toBeVisible()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Onit")

  // A second tap on the chip dismisses the popover instead of navigating away.
  await onit.tap()
  await expect(popover).toBeHidden()

  await onit.tap()
  await expect(popover).toBeVisible()

  const opened = page.waitForEvent("popup")
  await popover.getByRole("link", { name: "Visit onit.com" }).tap()
  const companyTab = await opened
  await companyTab.waitForLoadState()
  expect(companyTab.url()).toContain("onit.com")

  await context.close()
})

test("keeps the work-history popover positioned with reduced motion", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const onit = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")
  await onit.focus()
  await expect(popover).toBeVisible()

  const triggerBox = await onit.boundingBox()
  const popoverBox = await popover.boundingBox()
  expect(triggerBox).not.toBeNull()
  expect(popoverBox).not.toBeNull()
  expect(popoverBox!.x).toBeGreaterThanOrEqual(0)
  expect(popoverBox!.x + popoverBox!.width).toBeLessThanOrEqual(mobileViewport.width)
  expect(popoverBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height)
})

test("keeps the work-history popover below its trigger while scrolling", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const onit = getPreviousCompanyLink(page, "Onit")
  const popover = page.locator(".mosaic-work-history-popover")
  await onit.focus()
  await expect(popover).toBeVisible()
  await expect(popover).toHaveAttribute("data-side", "below")

  await page.evaluate(() => window.scrollBy(0, 180))
  await expect(popover).toHaveAttribute("data-side", "below")
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

  const triggerBox = await onit.boundingBox()
  const popoverBox = await popover.boundingBox()
  expect(triggerBox).not.toBeNull()
  expect(popoverBox).not.toBeNull()
  expect(popoverBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height)
  expect(popoverBox!.y + popoverBox!.height).toBeLessThanOrEqual(mobileViewport.height)
})

// Without hover the caption would have to sit on every tile at once, over
// artwork that already carries each project's own wordmark. Both it and the
// band that made it legible are gone entirely, not merely faded — and the name
// still reaches assistive tech through the link itself.
test("hides project card names where there is no hover to reveal them", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const firstCard = page.locator(".mosaic-row-card").first()
  await expect(firstCard.locator(".mosaic-row-card-title")).toHaveCSS("display", "none")
  await expect(firstCard.locator(".mosaic-row-card-scrim")).toHaveCSS("display", "none")
  await expect(firstCard).toHaveAttribute("aria-label", /^Open .+ preview 1 of/)
})

test("ramps the blur radius behind desktop project captions", async ({ page }) => {
  await page.setViewportSize({ width: 2446, height: 1239 })
  await page.goto("/")

  const card = page.getByRole("link", { name: /Open Matcha homepage preview 2 of/ })
  const scrim = card.locator(".mosaic-row-card-scrim")
  await card.hover()

  await expect.poll(() => scrim.evaluate((element) => getComputedStyle(element.children[0]).opacity)).toBe("1")

  // The tint has to land ahead of the ramp. Fading both together meant the
  // caption could not go legible until four backdrop rasters were ready, which
  // is what made the whole effect feel like it arrived late.
  const [tintMs, rampMs] = await scrim.evaluate((element) =>
    [getComputedStyle(element, "::after"), getComputedStyle(element.children[0])].map((style) =>
      Number.parseFloat(style.transitionDuration) * 1000,
    ),
  )

  expect(tintMs).toBeGreaterThan(0)
  expect(rampMs).toBeGreaterThan(tintMs)

  // Four layers, each blurrier than the last. The ordering is the assertion
  // that matters: a single blurred layer fading its opacity in looks similar in
  // a screenshot but leaves the top of the band a blend of sharp and blurred
  // rather than a gentler blur, and it would pass a mere "is there a blur" check.
  const radii = await scrim.evaluate((element) =>
    Array.from(element.children, (layer) =>
      Number(getComputedStyle(layer).backdropFilter.match(/blur\(([\d.]+)px\)/)?.[1] ?? Number.NaN),
    ),
  )

  expect(radii).toHaveLength(4)
  expect(radii.every((radius) => Number.isFinite(radius) && radius > 0)).toBe(true)
  expect([...radii].sort((first, second) => first - second)).toEqual(radii)
  expect(radii.at(-1)).toBeCloseTo(40, 0)

  // Blur cannot carry contrast by itself -- a blurred white screenshot is still
  // white -- so a tint rides above the whole ramp.
  const tint = await scrim.evaluate((element) => getComputedStyle(element, "::after").backgroundImage)
  expect(tint).toContain("linear-gradient")
})

// The band is the caption's ground, and which way it has to move depends on the
// tile. Most tiles letterbox their artwork against the pale card surface, so the
// band washes toward that surface and the label is ink -- what it has to survive
// there is dark artwork under the label, because the pale tint is the thing
// doing the lifting. The four tiles whose artwork runs dark to the bottom edge
// keep the black band and the white label, where the worst case is the opposite.
// Both alphas are read off the eased stop list at the caption's own top edge
// rather than assumed to fall in a straight line.
test("keeps desktop project captions readable over the artwork underneath", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 1000 })
  await page.goto("/")

  const captionGround = async (name: RegExp) => {
    const card = page.getByRole("link", { name })
    const title = card.locator(".mosaic-row-card-title")
    await title.evaluate((element) => { (element as HTMLElement).style.maxWidth = "110px" })
    await card.hover()
    await title.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished))
    })
    await expect(title).toBeVisible()

    return card.evaluate((element) => {
      const scrim = element.querySelector(".mosaic-row-card-scrim")
      const label = element.querySelector(".mosaic-row-card-title")

      if (!(scrim instanceof HTMLElement) || !(label instanceof HTMLElement)) return null

      const stops = Array.from(
        getComputedStyle(scrim, "::after").backgroundImage.matchAll(
          /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\) ([\d.]+)%/g,
        ),
        (stop) => ({
          alpha: stop[4] === undefined ? 1 : Number(stop[4]),
          at: Number(stop[5]) / 100,
        }),
      )

      if (stops.length < 2) return null

      const scrimBox = scrim.getBoundingClientRect()
      const labelBox = label.getBoundingClientRect()
      const labelProgress = (scrimBox.bottom - labelBox.top) / scrimBox.height
      const upper = stops.find((stop) => stop.at >= labelProgress) ?? stops[stops.length - 1]
      const lower = [...stops].reverse().find((stop) => stop.at <= labelProgress) ?? stops[0]
      const span = upper.at - lower.at
      const tintChannels = getComputedStyle(element).getPropertyValue("--card-caption-tint")

      return {
        tint: tintChannels.split(/\s+/).map(Number),
        alpha:
          span === 0
            ? lower.alpha
            : lower.alpha + ((labelProgress - lower.at) / span) * (upper.alpha - lower.alpha),
        ink: getComputedStyle(label).color,
        lines: labelBox.height / Number.parseFloat(getComputedStyle(label).lineHeight),
      }
    })
  }

  const luminance = ([red, green, blue]: number[]) => {
    const [r, g, b] = [red, green, blue].map((channel) => {
      const ratio = channel / 255
      return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const contrast = (first: number[], second: number[]) => {
    const [lighter, darker] = [luminance(first), luminance(second)].sort((one, two) => two - one)
    return (lighter + 0.05) / (darker + 0.05)
  }

  // A short slot with a label long enough to wrap: the two-line case is the one
  // whose top edge reaches highest into the band, where the tint is thinnest.
  const pale = await captionGround(/Open Matcha multiwallet flow preview 1 of/)
  expect(pale).not.toBeNull()
  expect(pale!.lines).toBeGreaterThan(1.5)

  const paleGround = pale!.tint.map((channel) => channel * pale!.alpha)
  expect(contrast(paleGround, [20, 20, 20])).toBeGreaterThanOrEqual(4.5)

  const dark = await captionGround(/Open Matcha token page preview/)
  expect(dark).not.toBeNull()

  const darkGround = dark!.tint.map((channel) => channel * dark!.alpha + 255 * (1 - dark!.alpha))
  expect(contrast(darkGround, [255, 255, 255])).toBeGreaterThanOrEqual(4.5)
})

test("contains the featured Matcha previews inside their mobile cards", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  for (const title of ["Matcha multiwallet flow", "Matcha homepage"]) {
    const card = page.getByRole("link", { name: new RegExp(`Open ${title}`) })
    const media = card.locator(".mosaic-row-media")
    const [cardBox, mediaBox] = await Promise.all([card.boundingBox(), media.boundingBox()])

    await expect(media).toHaveCSS("object-fit", "contain")
    expect(cardBox).not.toBeNull()
    expect(mediaBox).not.toBeNull()
    expect(mediaBox!.x).toBeGreaterThanOrEqual(cardBox!.x)
    expect(mediaBox!.y).toBeGreaterThanOrEqual(cardBox!.y)
    expect(mediaBox!.x + mediaBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width)
    expect(mediaBox!.y + mediaBox!.height).toBeLessThanOrEqual(cardBox!.y + cardBox!.height)
  }
})

test("clips the Protector artwork to its full-width card on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const protectorMedia = page.locator(".mosaic-row-card-preview-protector .mosaic-row-media")
  const protectorCard = page.getByRole("link", { name: /Open Protector booking preview/ })
  const [cardBox, mediaBox] = await Promise.all([protectorCard.boundingBox(), protectorMedia.boundingBox()])

  await expect(protectorMedia).toHaveCSS("object-fit", "cover")
  await expect(protectorCard).toHaveCSS("overflow", "hidden")
  expect(cardBox).not.toBeNull()
  expect(mediaBox).not.toBeNull()
  expect(cardBox!.x).toBe(8)
  expect(cardBox!.x + cardBox!.width).toBe(mobileViewport.width - 8)
  expect(mediaBox!.x).toBeLessThanOrEqual(cardBox!.x)
  expect(mediaBox!.y).toBeLessThanOrEqual(cardBox!.y)
  expect(mediaBox!.x + mediaBox!.width).toBeGreaterThanOrEqual(cardBox!.x + cardBox!.width)
  expect(mediaBox!.y + mediaBox!.height).toBeGreaterThanOrEqual(cardBox!.y + cardBox!.height)
})

test("zooms the family stories preview past its empty corner", async ({ page }) => {
  await page.setViewportSize({ width: 1320, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Shared family stories/ }).click()

  const dialog = page.getByRole("dialog")
  const media = dialog.locator(".preview-gallery-media:not(.preview-gallery-media-placeholder)")
  const frame = dialog.locator(".preview-gallery-media-frame")
  const [frameBox, mediaBox] = await Promise.all([frame.boundingBox(), media.boundingBox()])

  await expect(media).toHaveCSS("object-fit", "cover")
  expect(frameBox).not.toBeNull()
  expect(mediaBox).not.toBeNull()

  // The export's two devices are tilted, so the artwork carries an empty wedge
  // above and to the left of the front phone. The frame has to run past it on
  // both axes or the card opens on a corner of the mat's grey.
  expect(mediaBox!.x).toBeLessThanOrEqual(frameBox!.x - frameBox!.width * 0.1)
  expect(mediaBox!.y).toBeLessThanOrEqual(frameBox!.y - frameBox!.height * 0.1)

  // What it must not do is take the composition off the bottom edge it is built
  // on: the zoom is pinned there, and only grazes the right.
  expect(mediaBox!.y + mediaBox!.height).toBeCloseTo(frameBox!.y + frameBox!.height, 0)
  expect(mediaBox!.x + mediaBox!.width).toBeGreaterThanOrEqual(frameBox!.x + frameBox!.width)
  expect(mediaBox!.x + mediaBox!.width).toBeLessThan(frameBox!.x + frameBox!.width * 1.03)
})

test("describes the stakes and choices in a Protector booking", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await page.getByRole("link", { name: /Open Protector booking preview/ }).click()

  await expect(page.getByRole("dialog")).toContainText(
    "Protector lets people book short-term personal security. As the sole product designer for the booking experience, I designed the steps for choosing a protector, selecting how they should be dressed, and adding escorted transportation.",
  )
})

test("renders intrinsic media dimensions and does not autoplay under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const image = page.locator(".mosaic-row-card img.mosaic-row-media").first()
  await expect(image).toHaveAttribute("width", /\d+/)
  await expect(image).toHaveAttribute("height", /\d+/)

  const video = page.locator(".mosaic-row-card video.mosaic-row-media").first()
  await expect(video).toHaveAttribute("poster", /\S+/)
  expect(await video.evaluate((element: HTMLVideoElement) => element.autoplay)).toBe(false)

  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  const previewVideo = page.getByRole("dialog").locator("video")
  expect(await previewVideo.evaluate((element: HTMLVideoElement) => element.autoplay)).toBe(false)
  expect(await previewVideo.evaluate((element: HTMLVideoElement) => element.controls)).toBe(false)
})

test("autoplays gallery clips without native playback controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const previewVideo = page.getByRole("dialog").locator("video")
  expect(await previewVideo.evaluate((element: HTMLVideoElement) => element.autoplay)).toBe(true)
  expect(await previewVideo.evaluate((element: HTMLVideoElement) => element.loop)).toBe(true)
  expect(await previewVideo.evaluate((element: HTMLVideoElement) => element.controls)).toBe(false)
})

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`keeps the primary layout inside a ${viewport.width}px viewport`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")

    const visibleLayoutSelectors = [".mosaic-work-history", ".mosaic-rows"]
    if (viewport.width >= 700) visibleLayoutSelectors.push(".mosaic-social-corner")

    for (const selector of visibleLayoutSelectors) {
      const box = await page.locator(selector).boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width)
    }

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    ).toBe(false)
  })
}

test("constrains the desktop mosaic at wide viewport sizes", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto("/")

  const shell = await page.locator(".mosaic-shell").boundingBox()
  const openingGroup = await page.locator(".mosaic-group").first().boundingBox()
  expect(shell).not.toBeNull()
  expect(shell!.width).toBeLessThanOrEqual(1560)
  expect(openingGroup).not.toBeNull()
  expect(openingGroup!.height).toBeLessThanOrEqual(420)
})

test("does not delay content behind an entrance under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  for (const selector of [".mosaic-row-item", ".mosaic-hero-profile"]) {
    const state = await page.locator(selector).first().evaluate((element) => {
      const style = getComputedStyle(element)
      return { animationName: style.animationName, opacity: style.opacity }
    })
    expect(state).toEqual({ animationName: "none", opacity: "1" })
  }
})

test("does not replay the work-card intro when reduced motion is disabled later", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  const states = await page.locator(".mosaic-row-item").evaluateAll((items) =>
    items.map((item) => {
      const style = getComputedStyle(item)
      return { animationName: style.animationName, opacity: style.opacity }
    }),
  )
  expect(states.every(({ animationName, opacity }) => animationName === "none" && opacity === "1")).toBe(true)
})

test("does not show a motion toggle beside the section links", async ({ page }) => {
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  await expect(navigation.getByRole("button", { name: /motion/i })).toHaveCount(0)

  const video = page.locator(".mosaic-row-card video.mosaic-row-media").first()
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true)
})

test("hides the motion toggle when reduced motion already pauses previews", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  await expect(navigation.getByRole("button", { name: /motion/i })).toHaveCount(0)
  await expect(page.locator(".mosaic-row-card video.mosaic-row-media").first()).toHaveJSProperty("paused", true)
})

test("puts teammates before Rafael in unlabelled credits below the description", async ({ page }) => {
  await page.goto("/")
  await settleWorkCards(page)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  const description = dialog.locator(".preview-gallery-description")
  const team = dialog.getByRole("list", { name: "Collaborators" })
  await expect(team.getByRole("link")).toHaveText(["Simon Rico", "Rafael Medina"])
  await expect(description).toContainText("I mapped and designed")
  await expect(description).toContainText("without losing their quote or inputs")
  await expect(dialog.locator("dl")).toHaveCount(0)
  const teamBox = await team.boundingBox()
  const descriptionBox = await description.boundingBox()
  expect(teamBox!.y).toBeGreaterThan(descriptionBox!.y + descriptionBox!.height)
  await expect(dialog.getByText("Team", { exact: true })).toHaveCount(0)
  await expect(dialog.getByRole("link", { name: "matcha.xyz", exact: true })).toHaveCount(0)
  await expect(dialog.locator(".preview-gallery-project-link")).toHaveCount(0)

  // Paging must update the prose and credits, including solo projects, which
  // carry my credit alone rather than none. The counter is the gate: it turns
  // over with the card's content, so waiting for it means these read the slide
  // that arrived rather than the one still leaving -- which this walk used to
  // do, and which is the only reason it ever passed over the résumé.
  const counter = dialog.locator(".preview-gallery-count")
  const [first, total] = (await counter.innerText()).split("/").map((part) => Number(part.trim()))
  for (let step = 0; step < total; step += 1) {
    await expect(counter).toHaveText(`${((first - 1 + step) % total) + 1} / ${total}`)
    if (page.url().endsWith("/resume/") || page.url().endsWith("/notes/")) {
      // The résumé and the list of notes ride in the same sequence as readers
      // rather than previews, so they carry no prose and no credits and the
      // claims below are not about them.
      await expect(description).toHaveCount(0)
    } else {
      await expect(description).not.toBeEmpty()
      await expect(description).toContainText(/I (?:mapped|led|redesigned|designed|defined)|sole product designer/)
      await expect(dialog.locator("dl")).toHaveCount(0)
      if (await dialog.locator(".preview-gallery-title").innerText() === "Shared family stories") {
        await expect(team.getByRole("link")).toHaveText(["Rafael Medina"])
      }
    }
    await dialog.getByRole("button", { name: "Next preview" }).filter({ visible: true }).click()
  }
})

test("reveals a new teammate from the left when paging from solo work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await settleWorkCards(page)
  await page.getByRole("link", { name: /Open Matcha token page/ }).click()

  const dialog = page.getByRole("dialog")
  const counter = dialog.locator(".preview-gallery-count")
  const team = dialog.getByRole("list", { name: "Collaborators" })
  const next = dialog.getByRole("button", { name: "Next preview" }).filter({ visible: true })
  const previous = dialog.getByRole("button", { name: "Previous preview" }).filter({ visible: true })

  await expect(counter).toHaveText("10 / 14")
  await previous.click()
  await expect(counter).toHaveText("9 / 14")
  await expect(team.getByRole("link")).toHaveText(["Rafael Medina"])

  await next.click()
  await expect(counter).toHaveText("10 / 14")
  await expect(team.getByRole("link")).toHaveText(["Jakub Antalik", "Rafael Medina"])
  const teammateMotion = await team.getByRole("link", { name: "Jakub Antalik" }).locator("..").evaluate((item) =>
    item.getAnimations().map((animation) => ({
      name: (animation as CSSAnimation).animationName,
      firstTransform: animation.effect?.getKeyframes()[0]?.transform,
    })),
  )
  expect(teammateMotion).toContainEqual({ name: "preview-gallery-person-in", firstTransform: "translate(-12px)" })
})

const expectPreviewContributionFits = async (page: Page, viewportHeight: number) => {
  const dialog = page.getByRole("dialog")
  const description = dialog.locator(".preview-gallery-description")
  await expect(description).toBeVisible()
  const overflow = await description.evaluate((element) => element.scrollWidth - element.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)

  // More readable prose must not push navigation out of reach.
  const nav = dialog.getByRole("button", { name: "Next preview" }).filter({ visible: true })
  const navBox = await nav.boundingBox()
  expect(navBox).not.toBeNull()
  expect(navBox!.y + navBox!.height).toBeLessThanOrEqual(viewportHeight)
}

test("keeps the preview description inside the card on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await settleWorkCards(page)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()

  await expectPreviewContributionFits(page, 900)
})

test("keeps the preview description inside the card on mobile", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
    viewport: mobileViewport,
  })
  const page = await context.newPage()
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).tap()

  await expectPreviewContributionFits(page, mobileViewport.height)
  await context.close()
})

test("serves a résumé PDF that matches the live profile", async ({ request }) => {
  const response = await request.get("/rafael-medina-resume.pdf")

  expect(response.status()).toBe(200)
  expect(response.headers()["content-type"]).toContain("application/pdf")

  const bytes = await response.body()
  expect(bytes.byteLength).toBeGreaterThan(1024)

  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs")
  const pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }).promise
  // A second page means the export drifted off the single-sheet layout.
  expect(pdf.numPages).toBe(1)

  const content = await (await pdf.getPage(1)).getTextContent()
  // Non-empty items also prove the text is real and selectable, not an image.
  // Line ends are kept: joined flat, the address ran into the line above it and
  // the address match found "Designerhey@..." instead.
  const text = content.items.map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : "")).join("")
  expect(text.length).toBeGreaterThan(500)

  expect(text).toContain("Stealth fintech")
  expect(text).toContain("Co-founder")
  // The sheet sets a range over two lines, the dash closing the first.
  expect(text).toMatch(/2026 –\s*Present/)
  expect(text).toMatch(/0x Project[\s\S]*March 2026/)
  // Each entry's copy precedes its dates in the text layer, and the bullets
  // stay with their entry rather than being painted in a later pass.
  expect(text).toMatch(/Stealth fintech[\s\S]*Building a mobile wallet[\s\S]*2026 –[\s\S]*0x Project/)
  // The old Figma export advertised an address the site had already moved off,
  // so the PDF must carry the site's current one and no other: naming the stale
  // address would only catch the drift that already happened.
  const addresses = [...new Set(text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/g) ?? [])]
  expect(addresses).toEqual([contactEmail])
})
