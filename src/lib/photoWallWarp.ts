// Negative displacement reverses the surface into the inward bowl.
// Rendering and pointer sampling must use the same signed scale.
export const PHOTO_WALL_WARP_SCALE = -0.18

/** Stages with a working curved renderer, including before its first paint. */
export const curvedPhotoWallStages = new WeakSet<HTMLElement>()

/** The last painted field, shared with pointer sampling. */
export const renderedPhotoWallCurves = new WeakMap<HTMLElement, { bend: number; rim: number }>()

/** One viewport-wide displacement field, shared by rendering and hit testing.
 * The S crosses the entire composition; the rim adds a shallow bowl curve.
 * Both meet zero at the viewport boundary, so no empty edge is pulled in. */
export function photoWallDisplacement(x: number, y: number, bend: number, rim: number) {
  const u = Math.max(0, Math.min(1, x))
  const v = Math.max(0, Math.min(1, y))
  const nx = u * 2 - 1
  const ny = v * 2 - 1
  return {
    x: bend * Math.sin(v * Math.PI * 2) * Math.sin(u * Math.PI) + rim * nx * ny * ny * (1 - nx * nx),
    y: rim * ny * nx * nx * (1 - ny * ny),
  }
}
