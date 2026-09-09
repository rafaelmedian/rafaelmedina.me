// CSS minification can turn 200ms into .2s. Timers and Web Animations both
// need milliseconds, including when a component aliases a shared token.
export function cssTimeToMilliseconds(value: string): number {
  const time = value.trim()
  const amount = Number.parseFloat(time)
  return Number.isFinite(amount) ? amount * (time.endsWith("ms") ? 1 : 1000) : 0
}
