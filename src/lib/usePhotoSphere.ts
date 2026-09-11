import { useLayoutEffect, useRef } from "react"

import { cssTimeToMilliseconds } from "./cssTime"

type Vector = [number, number, number]
/** A 3x3 rotation, row-major. */
type Matrix = number[]

const identity: Matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]

function multiply(a: Matrix, b: Matrix): Matrix {
  const out = new Array<number>(9)
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      out[row * 3 + column] = a[row * 3] * b[column] + a[row * 3 + 1] * b[3 + column] + a[row * 3 + 2] * b[6 + column]
    }
  }
  return out
}

function transform(m: Matrix, [x, y, z]: Vector): Vector {
  return [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z]
}

/** Rodrigues: a turn of `angle` radians about a unit `axis`. */
function rotation([x, y, z]: Vector, angle: number): Matrix {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const t = 1 - c
  return [
    t * x * x + c, t * x * y - s * z, t * x * z + s * y,
    t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c,
  ]
}

/** Squares a rotation back up. Thousands of frames of multiplied turns drift
    off true — the rows stop being unit length, points creep off the sphere,
    and a depth past 1 took the shade's power to NaN, which painted the photo
    at the front solid black. Gram-Schmidt on the rows, once a frame. */
function orthonormalize(m: Matrix): Matrix {
  const normalize = ([x, y, z]: Vector): Vector => {
    const length = Math.hypot(x, y, z)
    return [x / length, y / length, z / length]
  }
  const a = normalize([m[0], m[1], m[2]])
  const dot = a[0] * m[3] + a[1] * m[4] + a[2] * m[5]
  const b = normalize([m[3] - dot * a[0], m[4] - dot * a[1], m[5] - dot * a[2]])
  // The third row is the first two crossed, so the basis stays right-handed.
  return [...a, ...b, a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

/** Turns about the screen's own axes, so a drag moves the sphere the way the
    hand moves whichever way up it has ended — Euler angles would lock and
    reverse at the poles. y is up and z comes out of the screen. */
function screenTurn(pitch: number, yaw: number): Matrix {
  const angle = Math.hypot(pitch, yaw)
  return angle < 1e-6 ? identity : rotation([pitch / angle, yaw / angle, 0], angle)
}

/** Evenly spread points on a unit sphere: a golden-angle spiral from pole to
    pole, the arrangement sunflower seeds take. Random points clump and leave
    bald patches; with a few dozen prints a clump is two on top of each other. */
function fibonacciSphere(count: number): Vector[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - 2 * (index + 0.5) / count
    const ring = Math.sqrt(1 - y * y)
    return [Math.cos(golden * index) * ring, y, Math.sin(golden * index) * ring]
  })
}

/** Where each slide sits on the sphere. The first photos are the prints in
    the fan, so they take the points nearest the viewer, left to right in the
    order the fan deals them: each one flies out to a slot on the face of the
    sphere, and the hand spreads across it the way it lies in the tile. The
    rest follow the spiral in its own order, which puts neighbours a golden
    angle apart, so the copies of one photo never land beside each other. */
function spherePlacement(count: number, front: number): Vector[] {
  const spiral = fibonacciSphere(count)
  const face = [...spiral].sort((a, b) => b[2] - a[2]).slice(0, front)
  return [...[...face].sort((a, b) => a[0] - b[0]), ...spiral.filter((point) => !face.includes(point))]
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/** One step of a critically damped spring: `x` is the distance still to go
    and `v` its speed, `w` the spring's rate. Exact for any step, so a
    starved frame (dt is capped at 50ms) never overshoots or blows up. The
    spring starts from rest — an exponential approach starts at full speed,
    which is the jolt a click used to give — and carries its speed through a
    change of target, so a hold let go or handed over half-way turns round
    rather than stopping first. */
function springStep(x: number, v: number, w: number, dt: number): [number, number] {
  const e = Math.exp(-w * dt)
  const a = v + w * x
  const next: [number, number] = [(x + a * dt) * e, (v - a * w * dt) * e]
  return Math.abs(next[0]) < 0.001 && Math.abs(next[1]) < 0.01 ? [0, 0] : next
}
/** The rate at which a critically damped spring has settled to 95%, as a
    share of the duration it is asked to take: (1 + w t) e^{-w t} = 0.05
    at w t = 4.74. */
const springSettle = 4.74

/** Screen-space radians per pixel of drag. */
const dragGain = 0.006
/** Idle spin, in radians per second: a full turn in about 40s. */
const idleSpin = 0.16
/** Momentum keeps this share of its speed per 60th of a second. */
const momentumDecay = 0.94
/** Travel, in pixels, before a press on a photo stops being a click. */
const clickSlop = 6
/** One arrow-key step. */
const keyStep = Math.PI / 6
/** How long a photo brought to the front stays there before the spin takes it on. */
const frontDwell = 4000
/** How much a clicked photo grows, at the centre, over its size at the front.
    Exported so the responsive image hint advertises the same largest draw. */
export const photoSphereHoldGrowth = 2.7
/** How much a photo under the pointer grows, to say it can be clicked. */
const hoverGrowth = 1.08
/** A small lean at the card edge: enough to answer the pointer without
    breaking the globe's upright billboard illusion. */
const hoverTilt = 3
/** The hover is the first stretch of the same growth a hold makes, so a
    click carries on from it instead of dropping it while the hold begins. */
const hoverShare = (hoverGrowth - 1) / (photoSphereHoldGrowth - 1)
/** How much the rest of the globe shrinks back while one photo is held. */
const zoomRecede = 0.22
/** The caption's distance below the held photo, and how far it rises as it
    comes in. */
const captionGap = 12
const captionRise = 8

type Tween = { from: Matrix; axis: Vector; angle: number; start: number; duration: number }

export type PhotoSphereControls = {
  /** Lets a held photo go, back to its place on the globe. False if none was held. */
  release: () => boolean
  /** Keeps the globe still for this long: a flight is landing on its slots. */
  rest: (milliseconds: number) => void
  /** Holds the photo with this id at the centre, as a click on it would. Asked
      for while the open flight is still landing, it waits for the flight. */
  hold: (photoId: string) => void
}
type Press = { id: number; x: number; y: number; lastX: number; lastY: number; lastTime: number; moved: boolean; slide: HTMLElement | null; onStage: boolean }

/**
 * Lays the photo sheet's slides out on a sphere and turns it: a slow idle
 * spin, a drag that carries momentum, the wheel, and the arrow keys. A photo
 * reached with Tab turns to the front; a photo clicked turns to the front and
 * grows there while the rest of the globe recedes, until the globe is moved
 * again or another photo is clicked.
 *
 * The slides are billboards, not cards glued to the sphere: each stays square
 * to the screen except for a soft hover tilt, and only its position, size,
 * shade, and stacking follow its point. That keeps every resting slide's box
 * a plain rectangle, which is what the open and close flights measure and
 * land on.
 */
export function usePhotoSphere(stage: HTMLDivElement | null, {
  open,
  reducedMotion,
  onStageClick,
}: {
  open: boolean
  reducedMotion: boolean
  /** A press and release on the stage itself — the margin, not a photo — with no drag between. */
  onStageClick: () => void
}) {
  const onStageClickRef = useRef(onStageClick)
  useLayoutEffect(() => { onStageClickRef.current = onStageClick })
  const running = useRef(false)
  /** A hold asked for before the globe has mounted, taken up when it does. */
  const requestedHold = useRef<string | null>(null)
  const controls = useRef<PhotoSphereControls>({ release: () => false, rest: () => undefined, hold: (photoId) => { requestedHold.current = photoId } })

  // Stop turning the moment the dialog starts to close, before the close
  // flight measures where each slide is: a slide that kept moving under its
  // flight would have been measured somewhere it no longer is.
  useLayoutEffect(() => { running.current = open }, [open])

  useLayoutEffect(() => {
    const sphere = stage?.querySelector<HTMLElement>(".personal-photos-sphere")
    if (!stage || !sphere) return
    const slides = Array.from(sphere.querySelectorAll<HTMLElement>(".personal-photos-slide"))
    const captions = slides.map((slide) => slide.querySelector("figcaption")?.textContent ?? "")
    const caption = stage.querySelector<HTMLElement>(".personal-photos-stage-caption")
    const points = spherePlacement(slides.length, Number(sphere.dataset.front) || 0)
    const tokens = getComputedStyle(sphere)
    const openHold = cssTimeToMilliseconds(tokens.getPropertyValue("--photo-open-duration"))
    const focusDuration = cssTimeToMilliseconds(tokens.getPropertyValue("--sphere-focus-duration"))
    const hoverDuration = cssTimeToMilliseconds(tokens.getPropertyValue("--sphere-hover-duration"))
    /** Holds and turns settle to 95% in --sphere-focus-duration; the small
        hover growth and lean use the quicker --sphere-hover-duration. */
    const focusSpringRate = springSettle / (focusDuration / 1000)
    const hoverSpringRate = springSettle / (hoverDuration / 1000)

    // Every visit opens square to the viewer, so the prints fly out to the
    // face of the sphere however far it was turned last time.
    let orientation = identity
    let radius = 0
    let stageSize = { width: 0, height: 0 }
    let boxes: { width: number; height: number }[] = []
    let dirty = true
    let frame = 0
    let wakeTimer = 0
    let last = performance.now()
    const wake = () => {
      clearTimeout(wakeTimer)
      wakeTimer = 0
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const invalidate = () => { dirty = true; wake() }
    const measure = () => {
      radius = sphere.offsetWidth * Number(tokens.getPropertyValue("--sphere-radius"))
      stageSize = { width: stage.clientWidth, height: stage.clientHeight }
      // Every slide is the same width; a slide on the far side of the globe
      // is display: none and has no box of its own, so it takes the width of
      // one that is showing and its height from its own photo's ratio. Read
      // straight off the hidden slides, the first resize after the first
      // frame gave the far side 0x0 boxes — a NaN aspect the canvas could
      // never draw — and those photos went missing for good once the globe
      // turned them round to the front.
      const shown = slides.find((slide) => slide.offsetWidth)
      boxes = slides.map((slide, index) => {
        if (slide.offsetWidth) return { width: slide.offsetWidth, height: slide.offsetHeight }
        const width = shown?.offsetWidth ?? boxes[index]?.width ?? 0
        const image = images[index]
        return { width, height: width * Number(image.getAttribute("height")) / (Number(image.getAttribute("width")) || 1) }
      })
      dirty = true
    }

    const images = slides.map((slide) => slide.querySelector("img")!)
    measure()

    let velocity = { pitch: 0, yaw: 0 }
    let spin = 0
    let tween: Tween | null = null
    let press: Press | null = null
    let hovered: HTMLElement | null = null
    /** Pointer direction inside the hovered photo, read from the flat stage's
        events and used as the target for its soft 3D lean. */
    let hoverPoint = { x: 0, y: 0 }
    /** A photo holding keyboard focus. The spin waits while one does: left to
        turn, it would carry the focused photo round behind the globe, where it
        is hidden and the focus falls out of the dialog. */
    let keyboardFocus = false
    // The spin waits out the open flight, so the prints land on slots that
    // hold still, and again after a photo is brought to the front.
    let restUntil = performance.now() + openHold
    /** The photo held at the centre, if any. */
    let held: number | null = null
    /** A hold asked for before the open flight has landed; taken up once it has. */
    let pendingHold: string | null = null
    /** Each photo's share of the way to its held size, on a spring: the
        hover takes it the first --hoverShare-- of the way, a hold the rest.
        One value drives the growth, the restacking and the caption, so they
        land together. */
    const zooms = new Float32Array(slides.length)
    const zoomSpeeds = new Float32Array(slides.length)
    const tiltXs = new Float32Array(slides.length)
    const tiltXSpeeds = new Float32Array(slides.length)
    const tiltYs = new Float32Array(slides.length)
    const tiltYSpeeds = new Float32Array(slides.length)
    /** The globe's share of the way to its receded size: derived from the
        zooms past their hover share, so two photos handing the hold over —
        one growing as the other shrinks — leave the rest of the globe still. */
    let recede = 0
    /** The photo being turned to the front, and the turn's angular speed. */
    let turnTarget: number | null = null
    let turnSpeed = 0
    /** The photo the caption names: the held one, kept through its release
        until the caption has faded with it. */
    let captioned: number | null = null

    const render = () => {
      const m = orientation
      if (held !== null) captioned = held
      let captionBox = { x: 0, y: 0, halfHeight: 0 }
      slides.forEach((slide, index) => {
        const [x, y, rawZ] = transform(m, points[index])
        const z = Math.max(-1, Math.min(1, rawZ))
        // 0 at the back of the sphere, 1 at the front.
        const depth = (z + 1) / 2
        // How far a tile is from being gone round the rim: 1 on the face, 0
        // once it has passed behind the globe.
        const rim = Math.min(1, Math.max(0, (z + 0.45) / 0.4))
        // A camera four radii out: the front of the globe is drawn a third
        // larger than its middle and the back a fifth smaller. On top of that
        // each photo shrinks as it swings round towards the rim, which is how
        // a print seen edge-on would narrow if it were glued to the sphere
        // rather than facing the viewer. The slide's own size is the front's,
        // so the scale is taken down from there and never goes above 1.
        const perspective = 4 / (4 - z)
        // A held photo grows at the centre and the rest step back; a photo
        // half-way to either state is drawn half-way, so the two moves cross
        // smoothly when the hold changes hands.
        const zoom = zooms[index]
        const scale = perspective * (0.28 + 0.72 * depth ** 2.2) * 0.75 * (0.6 + 0.4 * rim) * (1 + zoom * (photoSphereHoldGrowth - 1)) * (1 - recede * zoomRecede * (1 - zoom))
        // Keep the growing print's paper edge near its resting visual weight,
        // and land its drawn corner on the house's 24px media radius. These
        // values compensate for the transform scale: without that, the frame
        // and radius are enlarged along with the photo.
        slide.style.setProperty("--sphere-frame-share", (0.035 - zoom * 0.022).toFixed(4))
        const cornerRadius = `calc(var(--radius-md) * ${(1 - zoom).toFixed(4)} + var(--radius-lg) * ${(zoom / scale).toFixed(4)})`
        slide.style.setProperty("--sphere-corner-radius", cornerRadius)
        slide.style.borderRadius = cornerRadius
        slide.style.setProperty("--sphere-zoom", zoom.toFixed(4))
        // Chrome otherwise keeps enlarging the compositor layer it made for
        // the small globe tile, leaving a held photo soft even when its
        // srcset candidate has enough pixels. Let the selected print repaint
        // at its full size; the rest keep their transform hint while turning.
        slide.toggleAttribute("data-sphere-held", held === index)
        slide.style.transform = `translate3d(${(x * radius * perspective).toFixed(2)}px, ${(-y * radius * perspective).toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(4)})`
        const tiltX = tiltXs[index]
        const tiltY = tiltYs[index]
        if (held === index) {
          slide.style.setProperty("--sphere-gloss-x", `${(32 - tiltX * 11).toFixed(1)}%`)
          slide.style.setProperty("--sphere-gloss-y", `${(24 - tiltY * 9).toFixed(1)}%`)
        } else {
          slide.style.removeProperty("--sphere-gloss-x")
          slide.style.removeProperty("--sphere-gloss-y")
        }
        const tiltLength = Math.hypot(tiltX, tiltY)
        slide.style.rotate = tiltLength < 0.001 ? "none" : `${(-tiltY).toFixed(3)} ${tiltX.toFixed(3)} 0 ${(tiltLength * hoverTilt).toFixed(2)}deg`
        if (index === captioned) captionBox = { x: stageSize.width / 2 + x * radius * perspective, y: stageSize.height / 2 - y * radius * perspective, halfHeight: boxes[index].height * scale / 2 }
        // A held photo stacks above everything, however far its slot has
        // turned from the front while it grew.
        // A hovered photo comes forward of its neighbours too, so the part
        // of it that grows is not cut off by the photo beside it: forward by
        // the time its hover growth is complete, and steadily, not in a step.
        slide.style.setProperty("--sphere-depth", String(Math.round(depth * 1000 + zoom * 1000 + Math.min(1, zoom / hoverShare) * 500)))
        slide.style.setProperty("--sphere-shade", ((1 - depth) ** 1.6 * 0.72).toFixed(3))
        // The globe is a dome: photos fade as they pass round the rim and are
        // gone behind it, the way the far side of a ball is. Shown, the far
        // side's photos crowd in between the near side's and the globe reads
        // as a cloud. A hidden slide takes no box, so no flight aims at it.
        // Squared, and the tile shrinks as it goes: a photo drawn at a
        // sixth of its strength still showed its white rim, and the globe
        // was ringed with ghost cards. Squared it is gone a beat sooner,
        // and smaller while it goes.
        const fade = rim * rim
        slide.style.setProperty("--sphere-fade", fade.toFixed(3))
        slide.toggleAttribute("data-sphere-hidden", fade === 0)
        // Only the face of the sphere answers the pointer; a click on a photo
        // on its way out round the rim would bring one back nobody can see.
        slide.toggleAttribute("data-sphere-far", z < -0.2)
      })
      // One caption, under the held photo. It is placed from the photo's
      // drawn box and shown by the photo's zoom — the last two fifths of
      // it — so it rises in as the hold lands and is gone the moment a
      // release starts the photo back, with no clock of its own.
      if (caption && captioned !== null) {
        const opacity = Math.max(0, Math.min(1, (zooms[captioned] - 0.6) / 0.4))
        if (opacity === 0 && held === null) {
          captioned = null
          caption.textContent = ""
          caption.style.removeProperty("--stage-caption-opacity")
        } else {
          const text = captions[captioned] ?? ""
          if (caption.textContent !== text) caption.textContent = text
          const rise = (1 - opacity) * captionRise
          let top = captionBox.y + captionBox.halfHeight + captionGap + rise
          // Above the photo instead when the screen ends below it, never on it.
          if (top + caption.offsetHeight > stageSize.height - captionGap) top = captionBox.y - captionBox.halfHeight - captionGap - caption.offsetHeight - rise
          caption.style.setProperty("--stage-caption-x", `${captionBox.x.toFixed(1)}px`)
          caption.style.setProperty("--stage-caption-y", `${top.toFixed(1)}px`)
          caption.style.setProperty("--stage-caption-opacity", opacity.toFixed(3))
        }
      }
    }

    const turnToFront = (slide: HTMLElement) => {
      const index = slides.indexOf(slide)
      if (index < 0) return
      const [x, y, z] = transform(orientation, points[index])
      // The turn that carries this point straight to the front: about the
      // axis square to both (the point crossed with the view), by the angle
      // between them.
      const axis: Vector = [y, -x, 0]
      const length = Math.hypot(axis[0], axis[1])
      const angle = Math.acos(Math.max(-1, Math.min(1, z)))
      if (angle < 1e-3) return
      const unit: Vector = length < 1e-6 ? [0, 1, 0] : [axis[0] / length, axis[1] / length, 0]
      velocity = { pitch: 0, yaw: 0 }
      spin = 0
      tween = null
      restUntil = performance.now() + focusDuration + frontDwell
      if (reducedMotion) {
        orientation = multiply(rotation(unit, angle), orientation)
        invalidate()
        return
      }
      // The turn is a spring on the angle still to go, re-aimed every frame
      // (see `advance`), so a hold handed over mid-turn keeps its speed and
      // simply bends towards the new photo.
      turnTarget = index
      wake()
    }

    /** Holds a photo at the centre, or lets the held one go if it is asked
        for again. Asked for another while one is held, it hands the hold
        over: the first shrinks back as the second turns in and grows. */
    const hold = (slide: HTMLElement) => {
      const index = slides.indexOf(slide)
      if (index < 0) return
      if (held === index) {
        release()
        return
      }
      held = index
      invalidate()
      turnToFront(slide)
    }
    const release = () => {
      if (held === null) return false
      held = null
      invalidate()
      return true
    }
    controls.current.release = release
    controls.current.rest = (milliseconds) => { restUntil = Math.max(restUntil, performance.now() + milliseconds); wake() }
    const holdById = (photoId: string) => {
      // The first copy of a photo is the one with the id; the rest are decoration.
      const slide = slides.find((candidate) => candidate.dataset.photoId === photoId)
      if (!slide) return
      if (held === null && performance.now() < restUntil) {
        // Turning the globe under the open flight would move the slots the
        // prints are flying to; the hold waits for them to land.
        pendingHold = photoId
        wake()
        return
      }
      pendingHold = null
      if (held !== slides.indexOf(slide)) hold(slide)
    }
    controls.current.hold = holdById

    const turnBy = (pitch: number, yaw: number) => {
      const angle = Math.hypot(pitch, yaw)
      velocity = { pitch: 0, yaw: 0 }
      turnTarget = null
      turnSpeed = 0
      if (reducedMotion) {
        orientation = multiply(screenTurn(pitch, yaw), orientation)
        invalidate()
        return
      }
      tween = { from: orientation, axis: [pitch / angle, yaw / angle, 0], angle, start: performance.now(), duration: focusDuration }
      wake()
    }

    const canSpin = () => !reducedMotion && !press && !hovered && !keyboardFocus && held === null
    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const moving = running.current && advance(now, dt)
      if (dirty) {
        dirty = false
        render()
      }
      if (moving) {
        if (!frame) frame = requestAnimationFrame(tick)
      } else if (!frame && running.current && restUntil > now && (pendingHold !== null || canSpin())) {
        // A dwell needs one wake-up, not a frame of polling for every beat.
        wakeTimer = window.setTimeout(wake, restUntil - now + 1)
      }
    }
    let springsMoving = false
    /** Moves `value` towards `target` on the spring, keeping its speed in
        `speeds[index]`; reduced motion takes it there in one step. */
    const spring = (value: number, target: number, speeds: Float32Array | number[], index: number, dt: number, rate = focusSpringRate) => {
      if (reducedMotion) {
        speeds[index] = 0
        return target
      }
      const [gap, speed] = springStep(value - target, speeds[index], rate, dt)
      speeds[index] = speed
      if (gap !== 0 || speed !== 0) springsMoving = true
      return target + gap
    }
    const advance = (now: number, dt: number) => {
      orientation = orthonormalize(orientation)
      const previousOrientation = orientation
      springsMoving = false
      if (pendingHold !== null && now >= restUntil) holdById(pendingHold)
      let zoomed = 0
      for (let index = 0; index < zooms.length; index++) {
        // The hover grows only a photo that can be clicked — not one out on
        // the rim — and a hold carries on from wherever the hover has got to.
        const target = held === index ? 1 : hovered === slides[index] && !slides[index].hasAttribute("data-sphere-far") ? hoverShare : 0
        const rate = zooms[index] > hoverShare || held === index ? focusSpringRate : hoverSpringRate
        const next = spring(zooms[index], target, zoomSpeeds, index, dt, rate)
        if (Math.fround(next) !== zooms[index]) {
          zooms[index] = next
          dirty = true
        }
        zoomed += Math.max(0, zooms[index] - hoverShare)
        const tiltTarget = !reducedMotion && hovered === slides[index] && !slides[index].hasAttribute("data-sphere-far") ? hoverPoint : { x: 0, y: 0 }
        const nextTiltX = spring(tiltXs[index], tiltTarget.x, tiltXSpeeds, index, dt, hoverSpringRate)
        const nextTiltY = spring(tiltYs[index], tiltTarget.y, tiltYSpeeds, index, dt, hoverSpringRate)
        if (Math.fround(nextTiltX) !== tiltXs[index] || Math.fround(nextTiltY) !== tiltYs[index]) {
          tiltXs[index] = nextTiltX
          tiltYs[index] = nextTiltY
          dirty = true
        }
      }
      const nextRecede = Math.min(1, zoomed / (1 - hoverShare))
      if (nextRecede !== recede) {
        recede = nextRecede
        dirty = true
      }
      if (turnTarget !== null) {
        // Re-aimed every frame from where the globe is now: the axis square
        // to the photo's point and the view, by the angle between them.
        const [x, y, z] = transform(orientation, points[turnTarget])
        const angle = Math.acos(Math.max(-1, Math.min(1, z)))
        const length = Math.hypot(y, x)
        if (angle < 1e-3 || length < 1e-6) {
          turnTarget = null
          turnSpeed = 0
        } else {
          const [left, speed] = springStep(angle, turnSpeed, focusSpringRate, dt)
          turnSpeed = speed
          orientation = multiply(rotation([y / length, -x / length, 0], angle - left), orientation)
          if (left === 0) {
            turnTarget = null
            turnSpeed = 0
          }
        }
      } else if (tween) {
        const t = Math.min(1, (now - tween.start) / tween.duration)
        orientation = multiply(rotation(tween.axis, tween.angle * easeOutCubic(t)), tween.from)
        if (t >= 1) tween = null
      } else if (!press) {
        const turn = screenTurn(velocity.pitch * dt, velocity.yaw * dt)
        const decay = momentumDecay ** (dt * 60)
        velocity = { pitch: velocity.pitch * decay, yaw: velocity.yaw * decay }
        if (Math.hypot(velocity.pitch, velocity.yaw) < 0.01) velocity = { pitch: 0, yaw: 0 }
        // The spin eases in and out rather than switching: it stops under a
        // pointer resting on a photo so the photo can be looked at, and picks
        // up again once any momentum has run down.
        const idle = canSpin() && now > restUntil && velocity.yaw === 0 && velocity.pitch === 0
        spin += ((idle ? idleSpin : 0) - spin) * (1 - Math.exp(-dt * 2.5))
        if (!idle && Math.abs(spin) < 1e-5) spin = 0
        if (turn !== identity || spin !== 0) orientation = multiply(screenTurn(0, spin * dt), multiply(turn, orientation))
      }
      if (orientation !== previousOrientation) dirty = true
      return springsMoving || turnTarget !== null || tween !== null || (!press && (spin !== 0 || velocity.pitch !== 0 || velocity.yaw !== 0 || (canSpin() && now >= restUntil)))
    }

    const slideFrom = (target: EventTarget | null) => (target as Element | null)?.closest<HTMLElement>(".personal-photos-slide") ?? null

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || press) return
      const slide = slideFrom(event.target)
      press = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, lastTime: event.timeStamp, moved: false, slide, onStage: event.target === stage }
      stage.setPointerCapture(event.pointerId)
      tween = null
      turnTarget = null
      turnSpeed = 0
      velocity = { pitch: 0, yaw: 0 }
      wake()
    }
    const onPointerMove = (event: PointerEvent) => {
      wake()
      if (event.pointerType === "mouse" && !press) {
        const next = slideFrom(event.target)
        if (next !== hovered) dirty = true
        hovered = next
        if (next) {
          const rect = next.getBoundingClientRect()
          hoverPoint = {
            x: Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2))),
            y: Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2))),
          }
        }
      }
      if (!press || event.pointerId !== press.id) return
      const dx = event.clientX - press.lastX
      const dy = event.clientY - press.lastY
      if (!press.moved && Math.hypot(event.clientX - press.x, event.clientY - press.y) > clickSlop) {
        press.moved = true
        stage.setAttribute("data-sphere-dragging", "")
        // Moving the globe lets a held photo go, and drops one still waiting.
        pendingHold = null
        release()
      }
      if (!press.moved) return
      const pitch = dy * dragGain
      const yaw = dx * dragGain
      orientation = multiply(screenTurn(pitch, yaw), orientation)
      dirty = true
      // Momentum is the speed of the last stretch of the drag, so a flick
      // spins on and a drag that comes to rest before release stays put.
      const elapsed = Math.max(1, event.timeStamp - press.lastTime) / 1000
      if (!reducedMotion) velocity = { pitch: pitch / elapsed, yaw: yaw / elapsed }
      press.lastX = event.clientX
      press.lastY = event.clientY
      press.lastTime = event.timeStamp
    }
    const onPointerUp = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.id) return
      const ended = press
      press = null
      wake()
      stage.removeAttribute("data-sphere-dragging")
      // A drag that stopped before release carries nothing on.
      if (event.timeStamp - ended.lastTime > 80) velocity = { pitch: 0, yaw: 0 }
      if (ended.moved || event.type === "pointercancel") return
      // While a photo is held, any click lets it go — on the photo itself,
      // on a neighbour, or on the stage — and the next click is free to hold
      // another. Clicking a neighbour used to hand the hold straight over,
      // which read as the big photo refusing to shrink. With nothing held, a
      // click on a photo holds it, and a click on the margin closes the globe.
      if (held !== null) release()
      else if (ended.slide && !ended.slide.hasAttribute("data-sphere-far")) hold(ended.slide)
      else if (ended.onStage && event.target === stage) onStageClickRef.current()
    }
    const onPointerLeave = () => {
      hovered = null
      invalidate()
    }
    const onWheel = (event: WheelEvent) => {
      // A trackpad scroll turns the sphere under the fingers; the wheel's
      // vertical notches tip it over. Pixels, lines, and pages all come out
      // near a pixel's worth each.
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1
      tween = null
      turnTarget = null
      turnSpeed = 0
      release()
      orientation = multiply(screenTurn(-event.deltaY * unit * dragGain * 0.5, -event.deltaX * unit * dragGain * 0.5), orientation)
      invalidate()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      // Enter or Space on a photo holds it, as a click does.
      if (event.key === "Enter" || event.key === " ") {
        const slide = slideFrom(event.target)
        if (!slide) return
        event.preventDefault()
        hold(slide)
        return
      }
      // An arrow brings round what lies that way, as it would scroll a page.
      const step = { ArrowLeft: [0, keyStep], ArrowRight: [0, -keyStep], ArrowUp: [keyStep, 0], ArrowDown: [-keyStep, 0] }[event.key]
      if (!step) return
      event.preventDefault()
      release()
      turnBy(step[0], step[1])
    }
    const onFocusIn = (event: FocusEvent) => {
      const slide = slideFrom(event.target)
      // A click focuses the photo too, but a click turns it on release, and
      // only if the press never became a drag.
      keyboardFocus = Boolean(slide?.matches(":focus-visible"))
      if (slide && keyboardFocus) turnToFront(slide)
      wake()
    }
    const onFocusOut = () => { keyboardFocus = false; wake() }

    // Flights own inline opacity. Observe only handoffs, ignoring the
    // transform/shade writes that this controller makes on the same nodes.
    const flightOpacity = new Map(slides.map((slide) => [slide, slide.style.opacity]))
    const flights = new MutationObserver((records) => {
      for (const slide of new Set(records.map((record) => record.target as HTMLElement))) {
        const opacity = slide.style.opacity
        if (opacity === flightOpacity.get(slide)) continue
        flightOpacity.set(slide, opacity)
        invalidate()
      }
    })
    slides.forEach((slide) => flights.observe(slide, { attributes: true, attributeFilter: ["style"] }))
    const resize = new ResizeObserver(() => { measure(); wake() })
    resize.observe(sphere)
    // The canvas spans the stage, not the globe.
    resize.observe(stage)
    // Synchronous placement is required before the open/layout flight measures.
    dirty = false
    render()
    if (requestedHold.current !== null) {
      holdById(requestedHold.current)
      requestedHold.current = null
    }
    wake()
    stage.addEventListener("pointerdown", onPointerDown)
    stage.addEventListener("pointermove", onPointerMove)
    stage.addEventListener("pointerup", onPointerUp)
    stage.addEventListener("pointercancel", onPointerUp)
    stage.addEventListener("pointerleave", onPointerLeave)
    stage.addEventListener("wheel", onWheel, { passive: true })
    stage.addEventListener("keydown", onKeyDown)
    stage.addEventListener("focusin", onFocusIn)
    stage.addEventListener("focusout", onFocusOut)
    return () => {
      controls.current = { release: () => false, rest: () => undefined, hold: (photoId) => { requestedHold.current = photoId } }
      cancelAnimationFrame(frame)
      clearTimeout(wakeTimer)
      flights.disconnect()
      resize.disconnect()
      stage.removeEventListener("pointerdown", onPointerDown)
      stage.removeEventListener("pointermove", onPointerMove)
      stage.removeEventListener("pointerup", onPointerUp)
      stage.removeEventListener("pointercancel", onPointerUp)
      stage.removeEventListener("pointerleave", onPointerLeave)
      stage.removeEventListener("wheel", onWheel)
      stage.removeEventListener("keydown", onKeyDown)
      stage.removeEventListener("focusin", onFocusIn)
      stage.removeEventListener("focusout", onFocusOut)
    }
  }, [stage, reducedMotion])
  return controls
}
