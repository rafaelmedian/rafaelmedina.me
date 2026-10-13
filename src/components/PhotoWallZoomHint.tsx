import { useEffect, useState } from "react"

const storageKey = "photo-wall-zoom-hint"
/** Three gestures, then the hint leaves on its own. */
const visibleFor = 6200
const leaveFor = 360

function alreadySeen() {
  try {
    return localStorage.getItem(storageKey) === "seen"
  } catch {
    return true
  }
}

/* Streamline's "Zoom In Gesture" (Plump Color) and "Zoom Out Gesture" (Flex
   Color), https://streamlinehq.com, CC BY 4.0. Each is split into the hand
   and its separate arrows so the gesture can play out: the hand touches
   down, the arrows travel, the hand lifts. The Flex icon is recoloured to
   the Plump palette so the pair reads as one set. */
const fill = "#8fbffa"
const ink = "#2859c5"

function SpreadHand() {
  return <svg className="personal-photos-zoom-hint-hand" data-direction="out" viewBox="0 0 48 48" width="56" height="56" aria-hidden="true">
    <desc>Zoom In Gesture by Streamline (streamlinehq.com), CC BY 4.0</desc>
    <g fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <g className="personal-photos-zoom-hint-palm">
        <path fill={fill} stroke={ink} d="M18.123 8.42c-1.556 1.067-1.756 3.154-.922 4.848c1.428 2.901 3.868 7.703 6.675 12.565c0 0-1.544-.834-3.860-1.358c-2.14-.484-4.183 1.048-4.051 3.237c.033.549.115 1.12.27 1.685c.277 1.01 1.081 1.752 2.014 2.227c1.972 1.005 5.832 2.797 10.397 4.01c1.682.446 3.45.484 5.084-.112c1.198-.436 2.786-1.132 4.69-2.231a54 54 0 0 0 3.08-1.918c2.417-1.623 3.652-4.458 3.161-7.328a41.3 41.3 0 0 0-2.203-7.91c-1.054-2.718-3.807-4.29-6.661-3.702c-4.312.889-8.085 2.466-8.085 2.466c-.79-1.367-2.453-3.78-3.745-5.612c-1.07-1.517-2.95-2.353-4.63-1.563a9 9 0 0 0-1.213.695Z" />
      </g>
      <path className="personal-photos-zoom-hint-arrow" data-arrow="up" fill="#fff" stroke={ink} d="M3.21 9.133c-.593-.343-.672-1.165-.13-1.585c1.85-1.435 4.414-3.054 6.28-3.455c.604-.13 1.19.21 1.38.797c.586 1.817.466 4.847.148 7.166c-.093.68-.844 1.022-1.438.68z" />
      <path className="personal-photos-zoom-hint-arrow" data-arrow="down" fill="#fff" stroke={ink} d="M3.21 30.808c-.593.343-.672 1.165-.13 1.586c1.85 1.435 4.414 3.053 6.28 3.454c.604.13 1.19-.209 1.38-.796c.586-1.817.466-4.848.148-7.167c-.093-.679-.844-1.022-1.438-.68L3.21 30.81Z" />
      <path className="personal-photos-zoom-hint-arrow" data-arrow="shaft" stroke={ink} vectorEffect="non-scaling-stroke" d="M6.875 11.248A17.4 17.4 0 0 0 4.5 20.084c0 3.866 1.224 6.796 2.318 8.642" />
    </g>
  </svg>
}

function PinchHand() {
  return <svg className="personal-photos-zoom-hint-hand" data-direction="in" viewBox="0 0 14 14" width="56" height="56" aria-hidden="true">
    <desc>Zoom Out Gesture by Streamline (streamlinehq.com), CC BY 4.0</desc>
    <g fill="none" stroke={ink} strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round">
      <g className="personal-photos-zoom-hint-palm">
        <path fill={fill} stroke="none" d="m3.872 11.384l2.736 1.756c2.62.403 4.026.268 6.25-.957a4.1 4.1 0 0 0 .367-2.08c-.146-2.093-2.250-3.168-4.480-2.827l-.5-3.018a1.252 1.252 0 0 0-2.471.405l.799 4.942l-2.021-.191a1.072 1.072 0 0 0-.68 1.97" />
        <path d="m6.608 13.14l-2.736-1.756a1.07 1.07 0 0 1-.474-1.104v0a1.07 1.07 0 0 1 1.154-.866l2.020.19l-.798-4.941A1.25 1.25 0 0 1 6.820 3.225v0a1.25 1.25 0 0 1 1.425 1.033l.5 3.018c2.230-.341 4.334.734 4.480 2.827a4.1 4.1 0 0 1-.368 2.080" />
      </g>
      {/* The arrows travel toward each other: the upper one points down,
          the lower one up. */}
      <path className="personal-photos-zoom-hint-arrow" data-arrow="down" d="M2.66 3.1A7.7 7.7 0 0 1 3.517.805q.083-.144.17-.277M4.376 2.291c-.474.407-1.115.728-1.696.838c-.436-.399-.812-1.010-1.002-1.605" />
      <path className="personal-photos-zoom-hint-arrow" data-arrow="up" d="M2.456 5.58c-.273.531-.53 1.494-.42 2.666M3.636 7.12s-.73-1.454-1.147-1.535c-.416-.08-1.67.988-1.67.988" />
    </g>
  </svg>
}

/** The wall's one introduction to zooming: in the corner, one hand
    pinches in and the other spreads out. Shown on a browser's first open of
    the wall only, and gone as soon as the visitor zooms themselves. */
export function PhotoWallZoomHint({ stage }: { stage: HTMLElement | null }) {
  const [phase, setPhase] = useState<"hidden" | "shown" | "leaving">(() => alreadySeen() ? "hidden" : "shown")

  useEffect(() => {
    if (phase !== "shown") return
    try {
      localStorage.setItem(storageKey, "seen")
    } catch {
      // Private modes can refuse storage; the hint then shows once per open.
    }
    const timer = window.setTimeout(() => setPhase("leaving"), visibleFor)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "leaving") return
    const timer = window.setTimeout(() => setPhase("hidden"), leaveFor)
    return () => window.clearTimeout(timer)
  }, [phase])

  // Leave the moment the visitor zooms: a pinch, a trackpad pinch (which
  // arrives as a ctrl-wheel), or the plus and minus keys.
  useEffect(() => {
    if (phase !== "shown" || !stage) return
    const touches = new Set<number>()
    const leave = () => setPhase("leaving")
    const wheel = (event: WheelEvent) => { if (event.ctrlKey || event.metaKey) leave() }
    const down = (event: PointerEvent) => {
      touches.add(event.pointerId)
      if (touches.size >= 2) leave()
    }
    const up = (event: PointerEvent) => touches.delete(event.pointerId)
    const key = (event: KeyboardEvent) => { if (["+", "=", "-"].includes(event.key)) leave() }
    stage.addEventListener("wheel", wheel, { passive: true })
    stage.addEventListener("pointerdown", down)
    stage.addEventListener("pointerup", up)
    stage.addEventListener("pointercancel", up)
    stage.addEventListener("keydown", key)
    return () => {
      stage.removeEventListener("wheel", wheel)
      stage.removeEventListener("pointerdown", down)
      stage.removeEventListener("pointerup", up)
      stage.removeEventListener("pointercancel", up)
      stage.removeEventListener("keydown", key)
    }
  }, [phase, stage])

  if (phase === "hidden") return null
  // The dialog's description already says how to zoom, so the hint is a
  // picture of it rather than a second announcement.
  return <div className="personal-photos-zoom-hint" data-leaving={phase === "leaving" ? "" : undefined} aria-hidden="true">
    <div className="personal-photos-zoom-hint-hands">
      <PinchHand />
      <SpreadHand />
    </div>
    <p>Pinch to zoom</p>
  </div>
}
