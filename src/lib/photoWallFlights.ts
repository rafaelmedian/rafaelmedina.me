/** Captured flight geometry. The GPU samples the existing Web Animations
 * clock, without measuring or repainting a moving DOM subtree each frame. */
export type PhotoFlightPose = {
  x: number; y: number; width: number; height: number
  padding: number; radius: number; angle: number
  positionX: number; positionY: number
}
export type PhotoWallFlight = {
  clone: HTMLElement
  image: HTMLImageElement
  placeholder: HTMLImageElement
  from: PhotoFlightPose
  to: PhotoFlightPose
  clock: Animation
  waitingForPaint: boolean
  depth: number
  level: boolean
}
export const activePhotoWallFlights = new WeakMap<HTMLElement, PhotoWallFlight[]>()

export function samplePhotoWallFlight(flight: PhotoWallFlight): PhotoFlightPose {
  const progress = Number(flight.clock.effect?.getComputedTiming().progress ?? 0)
  const mix = (key: keyof PhotoFlightPose) => flight.from[key] + (flight.to[key] - flight.from[key]) * progress
  return { x: mix("x"), y: mix("y"), width: mix("width"), height: mix("height"),
    padding: mix("padding"), radius: mix("radius"), angle: mix("angle"),
    positionX: mix("positionX"), positionY: mix("positionY") }
}

/** Materialize an interrupted GPU flight before the ordinary return takes it.
 * The clone remains unpainted during opening; its geometry is needed only if
 * a close or a lost context returns the work to the DOM. */
export function materializePhotoWallFlight(flight: PhotoWallFlight) {
  const pose = samplePhotoWallFlight(flight)
  const clone = flight.clone
  const width = parseFloat(clone.style.width)
  const scale = pose.width / width
  Object.assign(clone.style, {
    visibility: "",
    height: `${pose.height / scale}px`, padding: `${pose.padding / scale}px`,
    borderRadius: `${pose.radius / scale}px`,
    transform: `translate(calc(-50% + ${pose.x - parseFloat(clone.style.left)}px), calc(-50% + ${pose.y - parseFloat(clone.style.top)}px)) rotate(${pose.angle}deg) scale(${scale})`,
  })
  Object.assign(clone.querySelector("img")!.style, {
    height: `${(pose.height - pose.padding * 2) / scale}px`,
    borderRadius: `${Math.max(0, pose.radius - pose.padding) / scale}px`,
    objectPosition: `${pose.positionX * 100}% ${pose.positionY * 100}%`,
  })
}
